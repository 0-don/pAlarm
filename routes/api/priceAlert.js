const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth");

const axios = require("axios")


const createDom = require("../../utils/createDom")

const getProducts = require("../../services/getProducts")
const createProductLink = require("../../services/createProductLink")
const createHtmlTemplate = require("../../services/createHtmlTemplate")
const sendMail = require("../../services/sendMail")

const PriceAlert = require("../../models/PriceAlert");
const User = require("../../models/User")


router.get("/", auth, async (req, res) => {
    const priceAlerts = await PriceAlert.find({ user: req.user.id }).select("-link -attributes._id")
    if (!priceAlerts) return res.json()

    res.json(priceAlerts)
})

router.delete("/:id", auth, async (req, res) => {

    try {
        const priceAlert = await PriceAlert.findOne({ _id: req.params.id, user: req.user.id })
        await priceAlert.remove()
        res.json(req.params.id)
    } catch (error) {
        res.status(400).json({ msg: "User or Price Alert not Found" })
    }

})

router.put("/", auth, async (req, res) => {
    try {
        const { updateId, targetPrice, attributes } = req.body
        // console.log(attributes)
        const updatedPriceAlert = await PriceAlert.findOneAndUpdate({ _id: updateId }, { targetPrice, attributes })
        res.json(updatedPriceAlert)
    } catch (error) {

    }
})

router.post("/", auth, async (req, res) => {

    const { categoryChildDbId, categoryChildId, categoryChild, targetPrice, attributes } = req.body

    const attributeIdLink = attributes.map(e => e.id).join("-")
    const link = createProductLink(categoryChildId, attributeIdLink)

    const priceAlertFields = {}

    priceAlertFields.user = req.user.id
    priceAlertFields.categoryChildDbId = categoryChildDbId
    priceAlertFields.categoryChildId = categoryChildId
    priceAlertFields.categoryChild = categoryChild
    priceAlertFields.link = link
    priceAlertFields.targetPrice = targetPrice
    priceAlertFields.attributes = attributes

    try {
        let priceAlert = await PriceAlert.findOne({ user: req.user.id, link })
        if (priceAlert) return res.status(400).json({ msg: "Price Alert already exist" })

        priceAlert = new PriceAlert(priceAlertFields)
        await priceAlert.save()

        priceAlert = await PriceAlert.findOne({ user: req.user.id, link }).select("-link -attributes._id");
        res.json(priceAlert)
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})


router.get("/refresh", async (req, res) => {
    const priceAlerts = await PriceAlert.find().sort("updatedAt").lean()

    const productList = await Promise.all(priceAlerts.map(async (alert) => {
        const request = await axios.get(alert.link)

        const doc = createDom(request.data)
        const products = getProducts(doc)

        const latestPrice = parseInt(products[0].price)
        if (latestPrice <= alert.targetPrice) {
            const user = await User.findById(alert.user)
            const html = await createHtmlTemplate({ alert, products: products.filter(product => parseInt(product.price.replace(/[.\s]/g, '')) <= alert.targetPrice) })
            sendMail("andrius.ziobakas@googlemail.com", html)
        }
        await PriceAlert.findOneAndUpdate({ _id: alert._id }, { latestPrice });

        return products
    }))

    res.json({ priceAlerts: priceAlerts, productList: productList })
})


module.exports = router
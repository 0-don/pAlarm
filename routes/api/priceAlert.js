const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth");

const axios = require("axios")


const fs = require('fs');
const createDom = require("../../utils/createDom")

const getProducts = require("../../services/getProducts")
const getFilters = require("../../services/getFilters")
const getTitle = require("../../services/getTitle")
const createProductLink = require("../../services/createProductLink")
const createHtmlTemplate = require("../../services/createHtmlTemplate")
const sendMail = require("../../services/sendMail")
const httpRequest = require("../../services/httpRequest")

const Category = require("../../models/Category")
const PriceAlert = require("../../models/PriceAlert");
const User = require("../../models/User")


router.post("/alert-from-link", auth, async (req, res) => {

    const { link, targetPrice } = req.body

    const categoryChildId = link.match(/https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i)
    const categoryAttributes = link.match(/https:\/\/www.idealo.de\/preisvergleich\/ProductCategory\/[0-9]*F(.+).html/i)
    // https://www.idealo.de/preisvergleich/ProductCategory/16073F1147301-1263422-101483660.html?sortKey=minPrice

    const categoryChild = !categoryChildId ? "" : await Category.findOne({
        "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
    }, { "categoryChildren.$": 1 })

    if (targetPrice <= 0) return res.status(400).json({ msg: "Price cannot be smaller then 0" })
    if (!categoryChild) return res.status(400).json({ msg: "Category not Found, please check the Link" })
    if (!categoryAttributes) return res.status(400).json({ msg: "No attributes found, please check the Link" })

    const priceAlertFields = {}

    priceAlertFields.user = req.user.id
    priceAlertFields.categoryChildDbId = categoryChild.categoryChildren[0]._id
    priceAlertFields.categoryChildId = categoryChildId[1]
    priceAlertFields.link = createProductLink(categoryChildId[1], categoryAttributes[1])
    priceAlertFields.targetPrice = targetPrice
    priceAlertFields.attributes = categoryAttributes[1].split("-").map(a => { return { id: a, value: "" } })


    try {
        let priceAlert = await PriceAlert.findOne({ user: req.user.id, link: priceAlertFields.link })
        if (priceAlert) return res.status(400).json({ msg: "Price Alert already exist" })

        priceAlert = new PriceAlert(priceAlertFields)
        await priceAlert.save()

        priceAlert = await PriceAlert.findOne({ user: req.user.id, link: priceAlertFields.link }).select("-link -attributes._id");
        
        res.json(priceAlert)
    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})


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
        const request = await httpRequest.get(alert.link)
        // const request = fs.readFileSync("page.html", "utf8")

        const doc = createDom(request)

        const products = getProducts(doc)
        const filters = getFilters(doc)

        const latestPrice = + products[0].price.replace(/,.*/, '').replaceAll(".", "")
        if (latestPrice <= alert.targetPrice) {
            const user = await User.findById(alert.user)
            const html = await createHtmlTemplate({ alert, products: products.filter(p => p.price.replace(/,.*/, '').replaceAll(".", "") <= alert.targetPrice) })
            // sendMail("az@googlemail.com", html)
        }

        const attributesList = filters.map(f => f.tagValues)
        const attributes = [].concat(...attributesList)
        alert.attributes.forEach(a => {
            const findA = attributes.find(o => o.id === a.id)
            a.value = findA.value
        })

        alert.latestPrice = latestPrice
        alert.categoryChild = getTitle(doc)

        await PriceAlert.findOneAndUpdate({ _id: alert._id }, alert);

        return products
    }))

    res.json({ priceAlerts: priceAlerts, productList: productList })
})


module.exports = router
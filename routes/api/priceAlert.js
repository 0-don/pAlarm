const express = require("express")
const router = express.Router();
const auth = require("../../middleware/auth");

const createDom = require("../../utils/createDom")

const getProducts = require("../../services/html/getProducts")
const getFilters = require("../../services/html/getFilters")
const getTitle = require("../../services/html/getTitle")

const createProductLink = require("../../services/createProductLink")
const createHtmlTemplate = require("../../services/email/createHtmlTemplate")
const sendMail = require("../../services/email/sendMail")
const httpRequest = require("../../services/httpRequest")
const browser = require("../../services/browser")

const Category = require("../../models/Category")
const PriceAlert = require("../../models/PriceAlert");
const User = require("../../models/User")

//Price Alert from Link
router.post("/alert-from-link", auth, async (req, res) => {

    const { link, targetPrice } = req.body

    const categoryChildId = link.match(/https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i)
    const categoryAttributes = link.match(/https:\/\/www.idealo.de\/preisvergleich\/ProductCategory\/[0-9]*F(.+).html/i)
    // https://www.idealo.de/preisvergleich/ProductCategory/16073F1147301-1263422-101483660.html?sortKey=minPrice

    const categoryChild = !categoryChildId ? "" : await Category.findOne({
        "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
    }, { "categoryChildren.$": 1 })

    const user = await User.findById(req.user.id)
    const priceAlerts = await PriceAlert.find({ user: req.user.id })

    if (targetPrice <= 0) return res.status(400).json({ msg: "Price cannot be smaller then 0" })
    if (!categoryChild) return res.status(400).json({ msg: "Category not Found, please check the Link" })
    if (!categoryAttributes) return res.status(400).json({ msg: "No attributes found, please check the Link" })
    if (priceAlerts.length >= user.priceAlert) return res.status(400).json({ msg: "Price alert limit reached!" })

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

//Get all Price Alerts
router.get("/", auth, async (req, res) => {
    const priceAlerts = await PriceAlert.find({ user: req.user.id }).select("-link -attributes._id")
    if (!priceAlerts) return res.json()
    res.json(priceAlerts)
})

//Delete Price Alert
router.delete("/:id", auth, async (req, res) => {
    try {
        const priceAlert = await PriceAlert.findOne({ _id: req.params.id, user: req.user.id })
        await priceAlert.remove()
        res.json(req.params.id)
    } catch (error) {
        res.status(400).json({ msg: "User or Price Alert not Found" })
    }

})

//Update Price Alert
router.put("/", auth, async (req, res) => {
    try {
        const { updateId, targetPrice, attributes } = req.body
        const updatedPriceAlert = await PriceAlert.findOneAndUpdate({ _id: updateId }, { targetPrice, attributes })
        res.json(updatedPriceAlert)
    } catch (error) {

    }
})

//Create Price Alert
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




module.exports = router
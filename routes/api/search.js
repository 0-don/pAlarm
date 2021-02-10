const express = require("express")
const axios = require("axios")
const router = express.Router();
const auth = require("../../middleware/auth");
const { parse, stringify } = require('flatted');

const FormData = require('form-data');

const createDom = require("../../utils/createDom")
const config = require("config")
const searchBaseUrl = config.get('searchBaseUrl');
const searchPostBaseUrl = config.get("searchPostBaseUrl")


const Category = require("../../models/Category")

const getSearchResults = require("../../services/getSearchResults")

router.get("/:value", async (req, res) => {

    const { value } = req.params
    console.log(value)
    const formData = new FormData();
    formData.append("value", value)
    const request = await axios.post(searchPostBaseUrl, formData, { headers: formData.getHeaders() })

    const doc = createDom(request.data)
    const searchCategories = getSearchResults(doc)

    res.json(await searchCategories)
})

router.post("/", async (req, res) => {

    const { searchText } = req.body

    const request = await axios.get(searchBaseUrl, { params: { q: searchText || "laptop" } })

    const {responseUrl} = request.request.res
    const re = /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i
    const categoryChildId = responseUrl.match(re)

    // console.log(categoryChildId)

    if (categoryChildId) {

        const { categoryChildren } = await Category.findOne({
            "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
        }, { "categoryChildren.$": 1 })

        res.json({ "categoryChild": categoryChildren[0]._id })

    } else {

        const doc = createDom(request.data)
        const searchCategories = getSearchResults(doc)

        res.json(await searchCategories)

    }

})


router.get("/", async (req, res) => {

    const request = await axios.get(searchBaseUrl, { params: { q: "q" } })

    const {responseUrl} = request.request.res
    const re = /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i
    const categoryChildId = responseUrl.match(re)

    if (categoryChildId) {

        const { categoryChildren } = await Category.findOne({
            "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
        }, { "categoryChildren.$": 1 })

        res.json({ "categoryChild": categoryChildren[0]._id })

    } else {

        const doc = createDom(request.data)
        const searchCategories = getSearchResults(doc)
        res.json(await searchCategories)

    }

})

module.exports = router
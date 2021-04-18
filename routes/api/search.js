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
const browser = require("../../services/browser")

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }



// router.get("/:value", async (req, res) => {

//     const { value } = req.params

//     const formData = new FormData();
//     formData.append("value", value)
//     const request = await axios.post(searchPostBaseUrl, formData, { headers: formData.getHeaders() })

//     const {data} = request
//     const re = /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i
//     const categoryChildId = data.match(re)
//     console.log(value)
//     if (categoryChildId) {

//         const { categoryChildren } = await Category.findOne({
//             "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
//         }, { "categoryChildren.$": 1 })

//         res.json({ "categoryChild": categoryChildren[0]._id })

//     } else {

//         const doc = createDom(request.data)
//         const searchCategories = getSearchResults(doc)
    
//         res.json(await searchCategories)

//     }

// })

router.post("/", async (req, res) => {

    let { searchText, searchTitle, url } = req.body

    url = url || `${searchBaseUrl}?${encodeQueryData({ q: searchText })}`
    
    const {html, currentUrl} = await browser.searchHTML(url, searchTitle)
    url = currentUrl

    const re = /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i
    const categoryChildId = currentUrl.match(re)

    if (categoryChildId) {
        const { categoryChildren } = await Category.findOne({
            "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
        }, { "categoryChildren.$": 1 })

        res.json({ "categoryChild": categoryChildren[0]._id })

    } else {
        const doc = createDom(html)
        const searchCategories = await getSearchResults(doc)
        if(searchCategories.length === 0) console.log(html)
        res.json({searchCategories, url})

    }
})


// router.post("/", async (req, res) => {

//     const { searchText } = req.body

//     const url = `${searchBaseUrl}?${encodeQueryData({ q: searchText || "laptop" })}`
//     // console.log(url)
//     const request = await axios.get(url)

//     const {data} = request
//     const re = /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i
//     const categoryChildId = data.match(re)

//     // console.log( categoryChildId[1])
//     console.log(searchText)
//     if (categoryChildId) {

//         const { categoryChildren } = await Category.findOne({
//             "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
//         }, { "categoryChildren.$": 1 })

//         res.json({ "categoryChild": categoryChildren[0]._id })

//     } else {

//         const doc = createDom(request.data)
//         const searchCategories = getSearchResults(doc)

//         res.json(await searchCategories)

//     }

// })


















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
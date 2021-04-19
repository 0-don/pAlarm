const express = require("express")
const router = express.Router()
const axios = require("axios")
const createDom = require("../../utils/createDom")

const Category = require("../../models/Category")
const ObjectId = require('mongoose').Types.ObjectId;
const getProducts = require("../../services/getProducts")
const getFilters = require("../../services/getFilters")
const createProductLink = require("../../services/createProductLink")
const browser = require("../../services/browser")

// const fs = require('fs');
// var util = require('util')

router.post("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId
        
        const { categoryChildren } = await Category.findOne({
            "categoryChildren": { "$elemMatch": { "_id": ObjectId(categoryId) } }
        }, { "categoryChildren.$": 1 })
        
        const {categoryChildId, categoryChild} = categoryChildren[0]
        const attributeIdLink = req.body.map(e => e.id).join("-")


        const data = await browser.getHTML(createProductLink(categoryChildId, attributeIdLink))
        
        const doc = createDom(data)
        const products = getProducts(doc)
        const filters = getFilters(doc)

        res.json({ categoryChild, categoryChildId, products, filters });  
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error")
    }
});

router.get("/", async(req, res) => {
    try {
        const { data } = await axios.get("https://www.idealo.de/preisvergleich/ProductCategory/15197.html?sortKey=minPrice")
        const doc = createDom(data)

        const products = getProducts(doc)
        const filters = getFilters(doc)

        res.json({ products: products, filters: filters });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error")
    }
});

module.exports = router 
const express = require("express")
const router = express.Router()


const Category = require("../models/Category")
const getCategories = require("../services/html/getCategories")

//Get All Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({ });

        if (!categories) return res.status(400).json({ msg: "No Categories Found" })

        res.json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error")
    }
});


router.get("/reload", async (req, res) => {
    try {
        await getCategories()
        res.send("top")
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error")
    }
});

module.exports = router
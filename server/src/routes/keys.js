const express = require("express");
const { keys } = require("lodash");
const router = express.Router();

const Keys = require("../models/Keys")

router.get("/create/:key", async (req, res) => {

    const { key } = req.params

    try {

        let dbKey = await Keys.findOne({ key })

        if (dbKey) {
            res.json("key already there")
            return
        }

        dbKey = new Keys({ key })
        await dbKey.save()

        dbKey = await Keys.findOne({ key })
        res.json(dbKey)

    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})

module.exports = router
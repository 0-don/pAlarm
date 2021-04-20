const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check, validationResult} = require("express-validator")
const config = require("config");

const Keys = require("../../models/Keys")
const User = require("../../models/User")

router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("key", "Key is required").not().isEmpty(),
    check("password", "Please enter a password with 6 or more characters").isLength({min: 6})
], async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const  {name, email, key, password } = req.body

    try {
        let dbKey = await Keys.findOne({ key })

        if (!dbKey) return res.status(400).json({errors: [{msg: "Key is not valid"}]})
        if (dbKey.user) return res.status(400).json({errors: [{msg: "Key is not valid"}]})

        let user = await User.findOne({email})
        if (user) return res.status(400).json({errors: [{msg: "User already exists"}]})

        user = new User({name, email, password})
  
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        dbKey.user = user.id
        dbKey.email = user.email
        await dbKey.save()


        const payload = { user: { id: user.id}}

        jwt.sign(payload, config.get("jwtSecret"), {expiresIn: 360000 }, (err, token) => {
            if(err) throw err;
            res.json({token})
        })

    } catch (err) {
        console.log(err)
        res.status(500).send("Server error")
    }
})

module.exports = router
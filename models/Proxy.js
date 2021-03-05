const mongoose = require("mongoose");

const ProxySchema = new mongoose.Schema({
    proxy: {
        type: String,
        required: true,
        unique: true 
    },
    status: {
        type: String,
        required: true
    },
    valid: {
        type: Number,
        default: 0
    },
    captcha: {
        type: Number,
        default: 0
    },
    error: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = Proxy = mongoose.model("proxy", ProxySchema)
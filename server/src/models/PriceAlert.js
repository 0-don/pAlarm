const mongoose = require("mongoose");

const PriceAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    categoryChildDbId: {
        type: String,
        required: true
    },
    categoryChildId: {
        type: Number,
        required: true
    },
    categoryChild: {
        type: String,
    },
    link: {
        type: String,
        required: true
    },
    targetPrice: {
        type: Number,
        required: true
    },
    latestPrice: {
        type: Number,
    },
    marginPercent: {
        type: Number,
        default: 0
    },
    attributes: [
        {
            id: {
                type: String,
                required: true
            },
            value: {
                type: String,
            }
        }
    ],
    
}, { timestamps: true })

module.exports = PriceAlert = mongoose.model("pricealert", PriceAlertSchema)
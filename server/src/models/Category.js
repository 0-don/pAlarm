const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categoryId: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    categoryChildren: [
        {
            categoryChildId: {
                type: Number,
                required: true
            },
            categoryChild: {
                type: String,
                required: true
            },
        }
    ]
})

module.exports = Category = mongoose.model("category", CategorySchema)
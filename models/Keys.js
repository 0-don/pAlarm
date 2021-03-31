const mongoose = require("mongoose");

const KeysSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    email: {
        type: String
    },
    key: {
        type: String,
        required: true
    }

})

module.exports = Keys = mongoose.model("keys", KeysSchema)
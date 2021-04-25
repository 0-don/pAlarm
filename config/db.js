const mongoose = require('mongoose');
const config = require('config');
const dbUrl = config.get('mongoURI');

const connectDB = () => {

    try {
        mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        mongoose.set('useFindAndModify', false)
        console.log("MongoDB Connected...")
    } catch (err) {
        console.log(err)
        process.exit(1)
    }

    return mongoose
}

module.exports = connectDB;
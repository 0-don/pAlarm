const express = require('express')
const connectDB = require('./config/db');
const path = require("path");

const app = express()
connectDB();


app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/category', require('./routes/api/category'));
app.use('/api/product-category', require('./routes/api/productCategory'))
app.use('/api/price-alert', require('./routes/api/priceAlert'))
app.use('/api/search', require('./routes/api/search'))


if (process.env.NODE_ENV === "production") {
    // set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


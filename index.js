// const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');

const express = require('express')
const connectDB = require('./config/db');
const path = require("path");

const app = express()
connectDB();

// proxy-lists getProxies --output-file="./proxy/proxies.txt" proxy-lists getProxies --protocols="https"
// "aI75My8nmJj0JOHb" GeoIP

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/category', require('./routes/api/category'));
app.use('/api/product-category', require('./routes/api/productCategory'))
app.use('/api/price-alert', require('./routes/api/priceAlert'))
app.use('/api/search', require('./routes/api/search'))

// app.use("/", async (req, res) => {

//     try {
//         const axiosDefaultConfig = {
//             proxy: false,
//             httpsAgent: new HttpsProxyAgent('http://193.106.192.6:8080')
//         };

//         const axios = require ('axios').create(axiosDefaultConfig);

//         const response = await axios.get('https://www.idealo.de/preisvergleich/ProductCategory/3751F100733567.html?sortKey=minPrice', {timeout: 20000})

//         fs.writeFileSync("page.html", response.data);
//         res.send("ok")
//     } catch (error) {

//         if (error.code === "ERR_SOCKET_CLOSED" || error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
//             console.log(error.message)
//         } else {
//             console.log(error.code)
//             console.log(error.response.status)
//             fs.writeFileSync("page.html", error.response.data);    
//         }

//     }
// })

// app.use("/", (req, res) => {
    
//     res.send("ok")
// })

if (process.env.NODE_ENV === "production") {
    // set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


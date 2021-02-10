const HttpsProxyAgent = require('https-proxy-agent');
fs = require('fs');

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

// app.use("/", async (req, res) => {

//     try {
//         const axiosDefaultConfig = {
//             proxy: false,
//             httpsAgent: new HttpsProxyAgent('http://bhqerbnu-dest:co8lngewzekd@193.8.56.119:80')
//         };

//         const axios = require ('axios').create(axiosDefaultConfig);

//         const response = await axios.get('https://www.idealo.de/preisvergleich/ProductCategory/3751F100733567.html?sortKey=minPrice')
//         // const html = await response.data
//         // console.log(response)
//         fs.writeFileSync("page.html", response.data);
//         res.send("bot")
//     } catch (error) {
//         console.log(error)
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


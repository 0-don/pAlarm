require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
connectDB();

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/category', require('./routes/category'));
app.use('/api/product-category', require('./routes/productCategory'));
app.use('/api/price-alert', require('./routes/priceAlert'));
app.use('/api/search', require('./routes/search'));
app.use('/api/keys', require('./routes/keys'));

// if (process.env.NODE_ENV === 'production') {
//   // set static folder
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

if (fs.existsSync('./cookies.json')) fs.unlinkSync('./cookies.json');
if (fs.existsSync('./browser.txt')) fs.unlinkSync('./browser.txt');

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

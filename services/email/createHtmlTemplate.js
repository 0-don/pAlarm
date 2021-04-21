const fs = require('fs');
const ejs = require('ejs');
const mjml2html = require('mjml')
const path = require('path');

const createHtmlTemplate = async ({ alert, products }) => {

    for (let i = 0; i < products.length; i++) {
        products[i].img = "http:" + products[i].img
    }

    const templateString = fs.readFileSync(path.join('services', "email", "priceAlert.ejs"), 'utf8')
    const template = ejs.compile(templateString)
    const mjml = template({ alert, products })
    const {html} = mjml2html(mjml);

    return html;
}

module.exports = createHtmlTemplate
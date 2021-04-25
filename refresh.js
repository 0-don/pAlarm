const connectDB = require('./config/db');
const db = connectDB();

const createDom = require("./utils/createDom")

const getProducts = require("./services/html/getProducts")
const getFilters = require("./services/html/getFilters")
const getTitle = require("./services/html/getTitle")

const createHtmlTemplate = require("./services/email/createHtmlTemplate")
const sendMail = require("./services/email/sendMail")
const browser = require("./services/browser")

const PriceAlert = require("./models/PriceAlert");
const User = require("./models/User")

//Refresh Alerts & Send Mail
const refresh = async () => {
    let chrome = await browser.createBrowser()
    let page = await chrome.newPage();

    await browser.blockContent(page)
    await browser.setCookies(page)

    await page.goto("https://www.idealo.de/");
    await browser.solveCaptcha(page)


    const priceAlerts = await PriceAlert.find().sort("updatedAt").lean()

    for (const alert of priceAlerts) {
        await page.goto(alert.link);
        const html = await page.content()

        const doc = createDom(html)

        const products = getProducts(doc)
        const filters = getFilters(doc)

        products.forEach(p => p.price = p.price.replace(/,.*/, '').replace(".", "").replace(".", ""))
        const latestPrice = products[0].price

        if (latestPrice <= alert.targetPrice) {
            const user = await User.findById(alert.user)
            const html = await createHtmlTemplate({ alert, products: products.filter(p => p.price <= alert.targetPrice) })
            sendMail(user.email, html)
        }

        const attributesList = filters.map(f => f.tagValues)
        const attributes = [].concat(...attributesList)
        alert.attributes.forEach(a => {
            const findA = attributes.find(o => o.id === a.id)
            a.value = findA.value
        })

        alert.latestPrice = latestPrice
        alert.categoryChild = getTitle(doc)

        await PriceAlert.findOneAndUpdate({ _id: alert._id }, alert);
    }

    await browser.saveCookies(page)
    await chrome.close();
    db.disconnect()
}

refresh()


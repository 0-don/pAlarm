const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Captcha = require("2captcha")
const fs = require('fs');

puppeteer.use(StealthPlugin())

const cookiePath = './cookies.json'

const getHTML = async (url) => {

    let browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    let page = await browser.newPage();

    await page.setJavaScriptEnabled(false)
    await blockContent(page)

    await setCookies(page)

    await page.goto(url);

    await solveCaptcha(page)
    await saveCookies(page)

    const html = await page.content()
    console.log(`page Length ${html.length}`)

    browser.close()
    return html
}

const blockContent = async (page) => {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' ? req.abort() : req.continue()
    });
    console.log("content Blocked")
}

const setCookies = async (page) => {
    if (fs.existsSync(cookiePath)) {
        const cookiesString = await fs.readFileSync(cookiePath);
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        console.log("cookies Set")
    }
}

const saveCookies = async (page) => {
    const cookies = await page.cookies();
    fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2))
    console.log("cookies Saved")
}

const solveCaptcha = async (page) => {
    if (await page.$("#g-recaptcha-response")) {
        const solver = new Captcha.Solver("5804d7eb953d3b0fff021db43404f106")
        const dataSitekey = await page.evaluate('document.querySelector(".g-recaptcha").getAttribute("data-sitekey")')
        const solvedCaptcha = await solver.recaptcha(dataSitekey, page.url())
        await page.type('#g-recaptcha-response', solvedCaptcha.data)
        await page.click(`input[value="weiter"]`)
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] })
        console.log("captcha Solved")
    }
}

module.exports = getHTML
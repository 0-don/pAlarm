const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Captcha = require("2captcha")
const fs = require('fs');
puppeteer.use(StealthPlugin())
const cookiePath = './cookies.json'

const getHTML = async (url) => {

    let browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--disable-dev-shm-usage'] });
    let page = await browser.newPage();

    await blockContent(page)
    await setCookies(page)

    await page.goto(url);

    await solveCaptcha(page)
    await saveCookies(page)

    await page.waitForSelector('[class="pageFooter-climateCertificateLogoClimateSeal"]')
    const html = await page.content()

    console.log(`getHTML ${html.length}`)

    await page.close();
    await browser.close()

    return html
}

const searchHTML = async (url, searchTitle) => {
    let browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--disable-dev-shm-usage'] });
    let page = await browser.newPage();

    await blockContent(page)
    await setCookies(page)

    await page.goto(url);

    await solveCaptcha(page)
    await saveCookies(page)

    if (searchTitle) {
        await page.waitForSelector(`[title="${searchTitle}"][data-metric-click="cat-link-click"]`)
        await page.click(`[title="${searchTitle}"][data-metric-click="cat-link-click"]`)
    }

    await page.waitForSelector('[class="pageFooter-climateCertificateLogoClimateSeal"]')
    const currentUrl = await page.url()
    const html = await page.content()

    await page.close();
    await browser.close()

    console.log("searchHTML", html.length)
    return { currentUrl, html }

}


const blockContent = async (page) => {
    process.setMaxListeners(0);

    await page.setJavaScriptEnabled(false)
    await page.setDefaultNavigationTimeout(0);
    await page.setRequestInterception(true);
    await page.setViewport({ width: 1920, height: 1080 })

    page.on('request', (req) => {
        req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' ? req.abort() : req.continue()
    });
}

const setCookies = async (page) => {
    if (fs.existsSync(cookiePath)) {
        const cookiesString = await fs.readFileSync(cookiePath);
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
    }
}

const saveCookies = async (page) => {
    const cookies = await page.cookies();
    fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2))
}

const solveCaptcha = async (page) => {
    if (await page.$("#g-recaptcha-response")) {

        const solver = new Captcha.Solver("5804d7eb953d3b0fff021db43404f106")
        const dataSitekey = await page.evaluate('document.querySelector(".g-recaptcha").getAttribute("data-sitekey")')
        const solvedCaptcha = await solver.recaptcha(dataSitekey, page.url())

        await page.type('#g-recaptcha-response', solvedCaptcha.data)
        await page.click(`input[value="weiter"]`)

        console.log("captcha Solved")
    }
}

module.exports = { getHTML, searchHTML }
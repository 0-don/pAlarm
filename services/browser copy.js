const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Captcha = require("2captcha")
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin())

const cookiePath = path.join('./cookies.json');
const browserInstance = path.join('./browser.txt');

const getHTML = async (url) => {

    let browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'] });
    let page = await browser.newPage();

    await blockContent(page)
    await setCookies(page)

    await page.goto(url);

    await solveCaptcha(page)
    await saveCookies(page)

    const html = await page.content()

    console.log(`getHTML ${html.length}`)

    await page.close();
    await browser.close()

    return html
}

const searchHTML = async (url, searchTitle) => {
    let browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'] });
    let page = await browser.newPage();

    await blockContent(page)
    await setCookies(page)

    await page.goto(url);

    await solveCaptcha(page)
    await saveCookies(page)

    if (searchTitle) await Promise.all([page.waitForNavigation(), page.click(`[title="${searchTitle}"][data-metric-click="cat-link-click"]`)]);

    const currentUrl = await page.url()
    const html = await page.content()

    await page.close();
    await browser.close()

    console.log("searchHTML", html.length)
    return { currentUrl, html }

}

const createBrowser = async() => {
    let browser
    if (fs.existsSync(browserInstance)) {

    }

    let browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'] });
    await page.goto('https://www.idealo.de/');

    var browserWSEndpoint = browser.wsEndpoint();

    fs.writeFileSync("browser.txt", browserWSEndpoint, "utf-8")
    browser.disconnect();
}

const blockContent = async (page) => {
    process.setMaxListeners(0);

    await page.setJavaScriptEnabled(false)
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1920, height: 1080 })

    await page.setRequestInterception(true);
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

        await Promise.all([page.waitForNavigation(), page.click(`input[value="weiter"]`)]);

        console.log("captcha Solved")
    }
}

module.exports = { getHTML, searchHTML }
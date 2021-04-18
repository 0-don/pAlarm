const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Captcha = require("2captcha")
const fs = require('fs');
const config = require("config")
const searchBaseUrl = config.get("searchBaseUrl")
const sleep = require("atomic-sleep")
puppeteer.use(StealthPlugin())

const cookiePath = './cookies.json'


function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}


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

const searchHTML = async (url, searchTitle) => {
    let browser = await puppeteer.launch({ headless: false, defaultViewport: null, slowMo: 30 });
    let page = await browser.newPage();
    await page.setJavaScriptEnabled(false)

    await page.goto(url);

    const redirects = [];

    if (searchTitle) {
        const client = await page.target().createCDPSession();
        await client.send('Network.enable');
        await client.on('Network.requestWillBeSent', (e) => {
            if (e.type !== "Document") { return }
            redirects.push(e.documentURL);
        });
        // const string = `[title="${searchTitle}"]`
        // console.log(string)
        // await page.click(string) // og

        // const [button] = await page.$x(`//button/div[contains(., "${searchTitle}")]`);
        // console.log(button)
        // if (button) {
        //     await button.click();
        // }
        client.
        // console.log(await page.content())

        // await page.click(`[title="${searchTitle}"][data-gtm-event="filter.click"]`) // new
        client.
        page.waitForNavigation()
        console.log(redirects.length)
        if (redirects.length > 0) { console.log("x"); await page.goto(redirects[1]) }
    }

    const currentUrl = await page.url()
    const html = await page.content()
    console.log(currentUrl, html.length)
    // browser.close()
    return { currentUrl, html }

}
// await page.goto(url);


const blockContent = async (page) => {
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
        await page.click(`input[value="weiter"]`)
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] })
        console.log("captcha Solved")
    }
}

module.exports = { getHTML, searchHTML }
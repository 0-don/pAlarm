// 1.js
// open chromium, new tab, go to google.com, print browserWSEndpoint, disconnect
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // var browser = await puppeteer.launch({headless: false});
    // var page = await browser.newPage();
    // await page.goto('https://www.idealo.de/');

    // var browserWSEndpoint = browser.wsEndpoint();

    // fs.writeFileSync("browser.txt", browserWSEndpoint, "utf-8")
    // browser.disconnect();

    const browserInstance = fs.readFileSync("browser.txt", "utf-8")
    console.log(browserInstance)
    var browser = await puppeteer.connect({browserWSEndpoint: browserInstance});
    var page = await browser.newPage();
    await page.goto('https://www.google.com/');
    // somehow use the tab that is open from 1.js (google.com)

    await browser.disconnect();
})();
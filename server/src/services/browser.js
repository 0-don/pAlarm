// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const Captcha = require('2captcha');
const fs = require('fs');
const path = require('path');

const cookiePath = path.join('./cookies.json');
const browserInstance = path.join('./browser.txt');

const getHTML = async (url, searchTitle) => {
  let browser = await createBrowser();
  let page = await browser.newPage();

  await blockContent(page);
  await setCookies(page);

  await page.goto(url);

  await solveCaptcha(page);
  await saveCookies(page);

  if (searchTitle)
    await Promise.all([
      page.waitForNavigation(),
      page.click(
        `[title="${searchTitle}"][data-metric-click="cat-link-click"]`
      ),
    ]);

  const html = await page.content();
  const currentUrl = await page.url();

  console.log(
    searchTitle ? `searchHTML ${html.length}` : `getHTML ${html.length}`
  );

  await page.close();

  // browser.disconnect();
  // await browser.close();

  return { currentUrl, html, browser };
};

const createBrowser = async () => {
  let headless = true;
  // let headless = false;
  let defaultViewport = null;
  let args = [
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
  ];
  let browser;

  try {
    let browserWS = fs.readFileSync(browserInstance, 'utf-8');
    browser = await puppeteer.connect({
      headless,
      defaultViewport,
      args,
      browserWSEndpoint: browserWS,
    });
  } catch (err) {
    browser = await puppeteer.launch({ headless, defaultViewport, args });
  }

  const browserWSEndpoint = await browser.wsEndpoint();
  fs.writeFileSync(browserInstance, browserWSEndpoint, 'utf-8');
  return browser;
};

const blockContent = async (page) => {
  process.setMaxListeners(0);

  await page.setJavaScriptEnabled(false);
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1920, height: 1080 });

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    req.resourceType() == 'stylesheet' ||
    req.resourceType() == 'font' ||
    req.resourceType() == 'image'
      ? req.abort()
      : req.continue();
  });
};

const setCookies = async (page) => {
  if (fs.existsSync(cookiePath)) {
    const cookiesString = await fs.readFileSync(cookiePath);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  }
};

const saveCookies = async (page) => {
  const cookies = await page.cookies();
  fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2));
};

const solveCaptcha = async (page) => {
  if (await page.$('#g-recaptcha-response')) {
    console.log('captcha found');
    const solver = new Captcha.Solver(process.env.CAPTCHA);
    const dataSitekey = await page.evaluate(
      'document.querySelector(".g-recaptcha").getAttribute("data-sitekey")'
    );
    const solvedCaptcha = await solver.recaptcha(dataSitekey, page.url());

    await page.type('#g-recaptcha-response', solvedCaptcha.data);

    await Promise.all([
      page.waitForNavigation(),
      page.click(`input[value="weiter"]`),
    ]);

    console.log('captcha Solved');
  }
};

module.exports = {
  getHTML,
  createBrowser,
  blockContent,
  setCookies,
  saveCookies,
  solveCaptcha,
};

// request Classic
const https = require('https')
const querystring = require('querystring');
const fs = require('fs');

const urlParams = querystring.stringify({
    'api_key': 'ZYIFIJI4LZYEFN29BRC6WQKNZCOINLA8ZHEAOC0JR619O90OEIW30JN7FSUAHSG3CJJTX24K9ZPLAW2L',
    'url': 'https://www.idealo.de/preisvergleich/ProductCategory/3751',
    'render_js': 'false',
    'premium_proxy': 'true',
    "country_code": "de"
})

console.log(urlParams)

const options = {
    hostname: 'app.scrapingbee.com',
    port: '443',
    path: '/api/v1?' + urlParams,
    method: 'GET',

}

const req = https.request(options, async res => {
    console.log(`statusCode: ${res.statusCode}`)
    
    await fs.writeFileSync("page.html", await res.data.toString());
})

req.on('error', error => {
    console.error(error)
})

req.end()
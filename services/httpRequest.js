

const Promise = require("bluebird")
const connectDB = require('../config/db');
const randomUseragent = require('random-useragent');
const _ = require("lodash")
const url = require('url');
const https = require('https')
const HttpsProxyAgent = require('../https-proxy-agent');

const Proxy = require("../models/Proxy");

Promise.config({ cancellation: true });

const get = async (link) => {
    let html = "error"
    let i = 0

    while (html === "error") {
        var proxys = await Proxy.find({ status: ['valid'] }).limit(50)
        console.log(proxys.length)

        const promises = proxys.map((p, index) => {

            const pURL = p.proxy
            const proxy = `http://${pURL}`;
            const timeout = 60000

            const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout }))

            return new Promise((resolve, reject, onCancel) => {
                let timer = setTimeout(reject, timeout, 'error');
                https.get(link, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
                    let data = '';
                    if (res.statusCode === 200) {
                        res.on('data', stream => data += stream);
                        res.on('end', () => { resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, data: data.length }) });
                        // resolve(data)
                        // resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, data: data.length })
                    } else if (res.statusCode === 429) {
                        // reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
                    } else {
                        // reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode }) 
                    }
                }).on("error", err => {
                    // reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err })
                });

                onCancel(() => { clearTimeout(agent.timer), agent.socket.destroy(); agent.req.destroy(); });
            }).catch(err => err);
        })

        html = await Promise.race(promises)
        console.log(html)
        promises.forEach(p => p.cancel())

        i += 1
        console.log(i)
    }
    return html
}


module.exports = {
    get
}

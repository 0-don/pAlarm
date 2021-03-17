

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
    var proxys = await Proxy.find({ status: ['valid'] }).limit(10)
    console.log(proxys.length)

    const promises = proxys.map((p, index) => {

        const pURL = p.proxy
        const proxy = `http://${pURL}`;
        const endpoint = link;

        const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout: 60000 }))

        return new Promise((resolve, reject, onCancel) => {
            https.get(endpoint, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
                let data = '';
                if (res.statusCode === 200) {
                    res.on('data', stream => data += stream);
                    res.on('end', () => { resolve(data) });
                } else if (res.statusCode === 429) {
                    reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
                } else { 
                    reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode }) 
                }
            }).on("error", err => {
                reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err })
            });

            onCancel(() => { clearTimeout(agent.timer), agent.socket.destroy(); agent.req.destroy(); });
        }).catch(err => err);

    })

    // const result = function firstTrue(promises) {
    //     const newPromises = promises.map(p => new Promise(
    //         (resolve, reject) => p.then(v => v && resolve(true), reject)
    //     ));
    //     newPromises.push(Promise.all(promises).then(() => false));
    //     return Promise.race(newPromises);
    // }
    // console.log(result)
    const result = await Promise.race(promises)
    console.log(result)
    promises.forEach(p => p.cancel())
    return result
}


module.exports = {
    get
}

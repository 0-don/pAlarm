

const Promise = require("bluebird")
const randomUseragent = require('random-useragent');
const _ = require("lodash")
const url = require('url');
const https = require('https')
const HttpsProxyAgent = require('../https-proxy-agent');
const Proxy = require("../models/Proxy");

const get = async (link) => {
    let html = null

    while (html === null) {
        var proxys = await Proxy.find({ status: { $in: ['valid'] } }, null, { sort: { updatedAt: 1 } }).limit(20)
        console.log(proxys.length)

        const promises = proxys.map((p, index) => {

            const pURL = p.proxy
            const proxy = `http://${pURL}`;
            const timeout = 60000

            const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout }))

            return new Promise((resolve, reject) => {
                const request = https.get(link, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
                    let data = '';
                    if (res.statusCode === 200) {
                        res.on('data', stream => data += stream);
                        res.on('end', () => { resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, dataLength: data.length, data: data }) });
                    } else if (res.statusCode === 429) {
                        reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
                    } else {
                        reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode })
                    }

                }).on("error", err => reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err }));

            }).catch(err => err);
        })
        const results = await Promise.map(promises, p => {
            const { index, status, proxy, statusMessage, dataLength } = p
            console.log({ index, status, proxy, statusMessage, dataLength });
            if (p.status === "valid") html = p.data
            return p
        })

        const dbPromises = proxys.map(p => {
            const result = results.find(result => result.proxy === p.proxy)

            if (result.status === "error") { p.error += 1 }
            if (result.status === "captcha" && p.status === "valid") { p.captcha += 1 }
            if (result.status === "valid") { p.status = "valid"; p.valid += 1 }

            return p.save()
        })
        await Promise.map(dbPromises, (p) => { return p })
        
    }
    return html
}

module.exports = {
    get
}












// const Promise = require("bluebird")
// const randomUseragent = require('random-useragent');
// const _ = require("lodash")
// const url = require('url');
// const https = require('https')
// const HttpsProxyAgent = require('../https-proxy-agent');
// const util = require("util")
// const Proxy = require("../models/Proxy");

// Promise.config({ cancellation: true });

// const get = async (link) => {
//     // let html = "error"
//     // let i = 0

//     // while (html === "error") {
//         var proxys = await Proxy.find({ status: ['valid'] }).limit(1000)
//         console.log(proxys.length)

//         const promises = proxys.map((p, index) => {

//             const pURL = p.proxy
//             const proxy = `http://${pURL}`;
//             const timeout = 60000

//             const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout }))

//             return new Promise((resolve, reject, onCancel) => {
//                 const request = https.get(link, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
//                     let data = '';
//                     if (res.statusCode === 200) {
//                         res.on('data', stream => data += stream);
//                         res.on('end', () => { resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, dataLength: data.length, data: data }) });
//                     } else if (res.statusCode === 429) {
//                         reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
//                     } else {
//                         reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode }) 
//                     }

//                 }).on("error", err => reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err }));
//                 onCancel(() => {
//                     console.log("close")
//                     clearTimeout(agent.timer);
                    
//                     agent.socket.destroy(); 
//                     agent.req.destroy();

//                     request.destroy()
//                     reject("reject") 
//                 });
               
//             }).catch(err => err);
//         })
//         // promises.forEach(p => p.cancel())
//         const html = await Promise.map(promises, p => { 
//             const { index, status, proxy, statusMessage, dataLength } = p
//             console.log({ index, status, proxy, statusMessage, dataLength });
//             if (status === "valid") {
//                 promises.forEach(p => {
//                     p.cancel()
//             })}
//             return p
//         })
//         console.log("htmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtml")
        
//         // const html = await Promise.race(promises)
//         // promises.forEach(p => p.cancel())
//         // console.log(html)
//     //     i += 1
//     //     console.log(i)
//     // // }
//     return "html"
// }


// module.exports = {
//     get
// }

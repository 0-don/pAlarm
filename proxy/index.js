

const Promise = require("bluebird")
const connectDB = require('../config/db');
const randomUseragent = require('random-useragent');
const _ = require("lodash")
const url = require('url');
const https = require('https')
const HttpsProxyAgent = require('../https-proxy-agent');

const fs = require('fs');
const path = require("path");

const Proxy = require("../models/Proxy");

Promise.config({ cancellation: true });

const runAll = async () => {
  for (let i = 0; i < 1; i++) {
    await refresh()
  }
}



const refresh = async () => {
  var db = await connectDB();
  var proxys = await Proxy.find({ status: { $in: ['error'] } }, null, { sort: { updatedAt: 1 } }).limit(100)
  console.log(proxys.length)

  const promises = proxys.map((p, index) => {

    const pURL = p.proxy
    const proxy = `http://${pURL}`;
    const endpoint = "https://www.idealo.de/";

    const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout: 20000 }))

    return new Promise((resolve, reject, onCancel) => {
      https.get(endpoint, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
        let data = '';
        if (res.statusCode === 200) {
          res.on('data', stream => data += stream);
          res.on('end', () => { resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, data: data.length }) });
        } else if (res.statusCode === 429) {
          reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
        } else { reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode }) }
      }).on("error", err => { reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err }) });

      onCancel(() => { clearTimeout(agent.timer), agent.socket.destroy(); agent.req.destroy() });
    }).catch(err => err);

  })

  let x = 0
  const results = await Promise.map(promises, (p) => { console.log(x, p); x += 1; return p })

  const dbPromises = proxys.map(p => {
    const result = results.find(result => result.proxy === p.proxy)

    if (!result) { console.log("Proxy request not Found Cant update DB"); process.exit() }

    if (result.status === "error") { p.error += 1 }
    if (result.status === "captcha" && p.status !== "valid") { p.status = "captcha"; p.captcha += 1 }
    if (result.status === "valid") { p.status = "valid"; p.valid += 1 }

    return p.save()
  })

  await Promise.map(dbPromises, (p) => { return p })

  db.connection.close(() => console.log('Mongoose connection disconnected'))

}



runAll()




// const createNewProxyDb = async () => {
//   const db = await connectDB();

//   const proxyDB = await Proxy.find({}).distinct("proxy")
//   const proxyTxt = fs.readFileSync("./proxy/proxies.txt", { encoding: 'utf8' }).split("\n")
//   const uniqP = _.uniqBy(proxyTxt, (e) => e.trim())
//   const proxys = uniqP.filter(p => !proxyDB.includes(p))

//   console.log(proxys.length)

//   const promises = proxys.map((p, index) => {

//     const pURL = p
//     const proxy = `http://${pURL}`;
//     const endpoint = "https://www.idealo.de/";

//     const agent = new HttpsProxyAgent(Object.assign(url.parse(proxy), { timeout: 60000 }))

//     return new Promise((resolve, reject, onCancel) => {
//       https.get(endpoint, { agent, headers: { 'User-Agent': randomUseragent.getRandom() } }, (res) => {
//         let data = '';
//         if (res.statusCode === 200) {
//           res.on('data', stream => data += stream);
//           res.on('end', () => { resolve({ index, status: "valid", proxy: pURL, statusMessage: res.statusCode, data: data.length }) });
//         } else if (res.statusCode === 429) {
//           reject({ index, status: "captcha", proxy: pURL, statusMessage: res.statusCode })
//         } else { reject({ index, status: "error", proxy: pURL, statusMessage: res.statusCode }) }
//       }).on("error", err => { reject({ index, status: "error", proxy: pURL, statusMessage: err?.code || err?.message || err }) });

//       onCancel(() => { clearTimeout(agent.timer), agent.socket.destroy(); agent.req.destroy(); });
//     }).catch(err => err);

//   })

//   const result = await Promise.map(promises, (p) => { console.log(p); return p })
//   const dbResults = result.map(r => { return { proxy: r.proxy, status: r.status } })
//   const dbRes = await Proxy.insertMany(dbResults)

//   db.connection.close(() => console.log('Mongoose connection disconnected'))
// }
// createNewProxyDb()



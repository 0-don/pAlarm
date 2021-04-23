// //Refresh Alerts & Send Mail
// router.get("/refresh", async (req, res) => {
//     const priceAlerts = await PriceAlert.find().sort("updatedAt").lean()

//     const productList = await Promise.all(priceAlerts.map(async (alert) => {

//         const request = await browser.getHTML(alert.link)
//         const doc = createDom(request)

//         const products = getProducts(doc)
//         const filters = getFilters(doc)

//         products.forEach(p => p.price = p.price.replace(/,.*/, '').replace(".", "").replace(".", ""))
//         const latestPrice = products[0].price

//         if (latestPrice <= alert.targetPrice) {
//             const user = await User.findById(alert.user)
//             const html = await createHtmlTemplate({ alert, products: products.filter(p => p.price <= alert.targetPrice) })
//             sendMail("don.cryptus@gmail.com", html)
//         }

//         const attributesList = filters.map(f => f.tagValues)
//         const attributes = [].concat(...attributesList)
//         alert.attributes.forEach(a => {
//             const findA = attributes.find(o => o.id === a.id)
//             a.value = findA.value
//         })

//         alert.latestPrice = latestPrice
//         alert.categoryChild = getTitle(doc)

//         await PriceAlert.findOneAndUpdate({ _id: alert._id }, alert);

//         return PriceAlert
//     }))

//     res.json({ priceAlerts: priceAlerts, productList: productList })
// })
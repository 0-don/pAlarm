const xpath = require('xpath')
const { decode } = require("html-entities")
const sleep = require('atomic-sleep')
const { PRODUCT_CATEGORY_TITLE } = require("../utils/xpathTypes")

const getTitle = (doc) => {

    const TitleNode = xpath.select1(PRODUCT_CATEGORY_TITLE, doc)
    let title = ""
    for(let i = 0; TitleNode.childNodes.length > i ; i++) {
        title += TitleNode.childNodes[i].data || ""
    }
    return title.trim()
}

module.exports = getTitle
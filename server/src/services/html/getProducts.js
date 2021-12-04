const xpath = require('xpath')
const { decode } = require("html-entities")
const { PRODUCT_NODES, PRODUCT_TITLE, PRODUCT_TITLE_ALT, PRODUCT_IMAGE, PRODUCT_IMAGE_ALT, DESCRIPTION_PART_1, DESCRIPTION_PART_2, PRICE, PRICE_ALT } = require("../../utils/xpathTypes")

const getProducts = (doc) => {

    const productNodes = xpath.select(PRODUCT_NODES, doc)
    
    let products = productNodes.map((node, index) => {
        const productTitle = xpath.select1(PRODUCT_TITLE, node)
        
        const productTitleAlt = xpath.select1(PRODUCT_TITLE_ALT, node)
        const img = xpath.select1(PRODUCT_IMAGE_ALT, node) || xpath.select1(PRODUCT_IMAGE, node)
        const descriptionPart1 = xpath.select1(DESCRIPTION_PART_1, node)
        const descriptionPart2 = xpath.select1(DESCRIPTION_PART_2, node)
        const price = xpath.select1(PRICE, node)
        const priceAlt = xpath.select1(PRICE_ALT, node)
        
        return {
            index,
            productTitle: decode(productTitle.firstChild.data.trim()) || JSON.parse(productTitleAlt.value).productName,
            img: img.value,
            description: `${descriptionPart1?.firstChild?.data || ""}${descriptionPart2?.firstChild?.data || ""}`,
            price: decode(price?.lastChild?.data.trim() || priceAlt.lastChild.data.trim())
        };
    });

    return products
}

module.exports = getProducts
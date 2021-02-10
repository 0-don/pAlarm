const config = require('config');
const productCategoryBaseUrl = config.get('productCategoryBaseUrl');
const productCategoryMinPrice = config.get('productCategoryMinPrice');

const createProductLink = (categoryChildId, attributeIdLink) => {
    var link = ""
    if (attributeIdLink.length > 0) {
        link = `${productCategoryBaseUrl}${categoryChildId}F${attributeIdLink}.html${productCategoryMinPrice}`
    } else {
        link = `${productCategoryBaseUrl}${categoryChildId}.html${productCategoryMinPrice}`
    }
    return link
}

module.exports = createProductLink
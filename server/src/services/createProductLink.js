const {
  PRODUCT_CATEGORY_BASE_URL,
  PRODUCT_CATEGORY_MIN_PRICE,
} = require('../contstants');

const productCategoryBaseUrl = PRODUCT_CATEGORY_BASE_URL;
const productCategoryMinPrice = PRODUCT_CATEGORY_MIN_PRICE;

const createProductLink = (categoryChildId, attributeIdLink) => {
  var link = '';
  if (attributeIdLink.length > 0) {
    link = `${productCategoryBaseUrl}${categoryChildId}F${attributeIdLink}.html${productCategoryMinPrice}`;
  } else {
    link = `${productCategoryBaseUrl}${categoryChildId}.html${productCategoryMinPrice}`;
  }
  return link;
};

module.exports = createProductLink;

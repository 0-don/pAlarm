module.exports = {
    PRODUCT_NODES: '//*[@class="offerList-item"]',
    PRODUCT_TITLE: './/*[@class="offerList-item-description-title"]',
    PRODUCT_TITLE_ALT: './/@data-gtm-payload',
    PRODUCT_IMAGE: './/*[contains(@class, "offerList-item-image")]/@src',
    PRODUCT_IMAGE_ALT: './/*[contains(@class, "offerList-item-image")]/@data-src',
    DESCRIPTION_PART_1: './/*[@class="description-part-one"]',
    DESCRIPTION_PART_2: './/*[@class="description-part-two"]', 
    PRICE: './/*[@class="offerList-item-priceMin"]',
    PRICE_ALT: './/*[@class="offerList-item-priceWrapper"]/*[@class="price"]',
    
    FILTER_NODES: '//*[contains(@class, "filter-tab") and @data-load]',
    FILTER_TITLE: './/*[@class="filter-titleText"]',
    FILTER_VALUES_NODES: './/*[@class="filter-tagItem"]',
    ID: './/*[contains(@class, "filter-tagItemLink")]/@data-filter-id',
    VALUE: './/*[@class="filter-tagItemValue"]',
    AMOUNT: './/*[@class="filter-tagItemCount"]',
    AVAILABLE_NODE: './/*[contains(@class, "filter-tabAvailableFilter")]',
    AVAILABLE_TITLE: './/*[@title="Verfügbarkeit"]',
    AVAILABLE_VALUE: './/*[@class="filter-tagItemValue-delivery"]',
    AVAILABLE_AMOUNT: './/*[@class="filter-tagItemCount"]',

    SEARCH_NODES: '//*[contains(@class, "category-slider-item")]',
    SEARCH_TITLE: './/*[@class="category-slider-title"]',
    SEARCH_IMAGE: './/*[@class="category-slider-image"]/@src',
    SEARCH_AMOUNT: './/*[@class="category-slider-count"]',
    SEARCH_INPUT_VALUE: './/*[@name="value"]/@value',
    SEARCH_LINK: './/*[@class="category-slider-link"]/@href',

    PRODUCT_CATEGORY_TITLE: './/*[@class="offerList-title"]'

}

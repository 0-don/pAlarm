const xpath = require('xpath')
const { decode } = require("html-entities")
const sleep = require('atomic-sleep')
const { SEARCH_NODES, SEARCH_TITLE, SEARCH_IMAGE, SEARCH_AMOUNT, SEARCH_INPUT_VALUE, SEARCH_LINK } = require("../utils/xpathTypes")

const Category = require("../models/Category")

const getSearchResults = async (doc) => {

    const searchNodes = xpath.select(SEARCH_NODES, doc)

    let searchCategories = await Promise.all(
        searchNodes.map(async node => {
            const searchTitle = xpath.select1(SEARCH_TITLE, node)
            const searchImg = xpath.select1(SEARCH_IMAGE, node)
            const searchAmount = xpath.select1(SEARCH_AMOUNT, node)
            const searchInputValue = xpath.select1(SEARCH_INPUT_VALUE, node)
            const searchLink = xpath.select1(SEARCH_LINK, node)

            const categoryChildId = searchLink?.value?.match(/https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i)

            const categoryChild = !categoryChildId ? "" : await Category.findOne({
                "categoryChildren": { "$elemMatch": { "categoryChildId": categoryChildId[1] } }
            }, { "categoryChildren.$": 1 })

            // console.log(categoryChild.categoryChildren ? categoryChild.categoryChildren[0]._id : "")

            return {
                searchTitle: decode(searchTitle.firstChild.data.trim()),
                searchImg: searchImg.value,
                searchAmount: searchAmount.firstChild.data.trim(),
                searchInputValue: searchInputValue?.value || "",
                searchLink: categoryChild.categoryChildren ? categoryChild.categoryChildren[0]._id : ""
            };
        })
    );

    // console.log(searchCategories)
    return searchCategories
}

module.exports = getSearchResults
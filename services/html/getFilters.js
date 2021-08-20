
const _ = require("lodash")
const { decode } = require("html-entities")
const xpath = require('xpath')
const {
    FILTER_NODES,
    FILTER_TITLE,
    FILTER_VALUES_NODES,
    ID,
    VALUE,
    AMOUNT,
    AVAILABLE_NODE,
    AVAILABLE_TITLE,
    AVAILABLE_VALUE,
    AVAILABLE_AMOUNT } = require("../../utils/xpathTypes")

const getFilters = (doc) => {
    const filterNodes = xpath.select(FILTER_NODES, doc)

    let filters = filterNodes.map((filter, index) => {
        const filterTitle = xpath.select1(FILTER_TITLE, filter)

        const filterValuesNodes = xpath.select(FILTER_VALUES_NODES, filter)
        let filterValues = filterValuesNodes.map(filterValue => {

            let id = xpath.select1(ID, filterValue)
            let value = xpath.select1(VALUE, filterValue)
            let amount = xpath.select1(AMOUNT, filterValue) || ""

            return {
                id: id.value,
                value: value.firstChild.data.trim(),
                amount: amount?.firstChild?.data.trim(),
            }
        })

        return {
            index,
            filterTitle: filterTitle.firstChild.data.trim(),
            tagValues: _.uniqBy(filterValues, "id")
        }
    })

    try {
        const availableNode = xpath.select1(AVAILABLE_NODE, doc)
        const availableTitle = xpath.select1(AVAILABLE_TITLE, availableNode)
        const availableValue = xpath.select1(AVAILABLE_VALUE, availableNode)
        const availableAmount = xpath.select1(AVAILABLE_AMOUNT, availableNode)
    
        const available = {
            index: availableTitle.firstChild.data.trim(), filterTitle: availableTitle.firstChild.data.trim(),
            tagValues: [{ index: "oE2oJ1", id: "oE2oJ1", value: decode(availableValue.firstChild.data.trim()), amount: availableAmount.firstChild.data.trim() }]
        }

        return [available, ...filters]
    } catch (error) {
        return filters
    }

}

module.exports = getFilters
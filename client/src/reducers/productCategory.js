import _ from "lodash"
import {
    GET_PRODUCTS,
    GET_PRODUCTS_LOAD,
    DELETE_ATTRIBUTE,
    ADD_ATTRIBUTE,
    EDIT_PRICE_ALERT,
    EMPTY_PRODUCT_STATE
} from "../actions/types"

const intialState = {
    updateId: null,
    updatePrice: null,
    categoryChildId: null,
    categoryChild: null,
    products: [],
    filters: [],
    attributes: [],
    loading: true
}

const productCategory = (state = intialState, action) => {
    const { type, payload } = action

    switch (type) {
        case EDIT_PRICE_ALERT:
            return {
                ...state,
                updateId: payload._id,
                updatePrice: payload.targetPrice,
                attributes: [...payload.attributes]
            }
        case GET_PRODUCTS:
            return {
                ...state,
                categoryChildId: payload.categoryChildId,
                categoryChild: payload.categoryChild,
                products: payload.products,
                filters: payload.filters,
                loading: false
            }
        case DELETE_ATTRIBUTE:
            return {
                ...state,
                attributes: state.attributes.filter(attribute => attribute.id !== payload),
                loading: false
            }
        case ADD_ATTRIBUTE:
            return {
                ...state,
                attributes: _.sortBy([...state.attributes, payload], ["id"]),
                loading: false
            }
        case EMPTY_PRODUCT_STATE:
            return {
                ...state,
                updateId: null,
                categoryChildId: null,
                categoryChild: null,
                products: [],
                filters: [],
                attributes: [],
                loading: false
            }
        case GET_PRODUCTS_LOAD: 
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}



export default productCategory
import axios from "axios";
import {
    GET_PRODUCTS,
    DELETE_ATTRIBUTE,
    ADD_ATTRIBUTE,
    EMPTY_PRODUCT_STATE
} from "./types"

export const getProducts = (categoryId, attributes = []) => async dispatch => {
    try {
        const res = await axios.post(`/api/product-category/${categoryId}`, attributes)

        dispatch({ type: GET_PRODUCTS, payload: res.data })
    } catch (error) {
        console.log(error)
    }
}

export const changeAttributes = (attributes, currentAttribute) => async dispatch => {

    if (attributes.some(attribute => attribute.id === currentAttribute.id)) {
        dispatch({ type: DELETE_ATTRIBUTE, payload: currentAttribute.id })
    } else {
        dispatch({ type: ADD_ATTRIBUTE, payload: currentAttribute })
    }
}

export const emptyProductState = () => async dispatch => {
    try {
        dispatch({ type: EMPTY_PRODUCT_STATE })
    } catch (error) {

    }
}
import axios from "axios";
import {
    GET_PRODUCTS,
    GET_PRODUCTS_LOAD,
    DELETE_ATTRIBUTE,
    ADD_ATTRIBUTE,
    EMPTY_PRODUCT_STATE
} from "./types"
import { setAlert } from "./alert"

export const getProducts = (categoryId, attributes = []) => async dispatch => {

    dispatch({ type: GET_PRODUCTS_LOAD })
    try {
        const res = await axios.post(`/api/product-category/${categoryId}`, attributes)
        dispatch({ type: GET_PRODUCTS, payload: res.data })
    } catch (err) {
        const error = err.response.data
        if(error) dispatch(setAlert(error.msg, "error"))
        console.log(err)
    }
}

export const changeAttributes = (attributes, currentAttribute) => async dispatch => {
    dispatch({ type: GET_PRODUCTS_LOAD })
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
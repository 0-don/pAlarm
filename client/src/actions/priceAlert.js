import axios from "axios";
import { setAlert } from "./alert"
import {
    CREATE_PRICE_ALERT,
    DELETE_PRICE_ALERT,
    GET_PRICE_ALERTS,
    EDIT_PRICE_ALERT,
} from "./types"

export const createAlertFromLink = (link, targetPrice) => async dispatch => {
    try {
        const res = await axios.post(`/api/price-alert/alert-from-link`, {link, targetPrice})
        dispatch({ type: CREATE_PRICE_ALERT, payload: res.data })
        dispatch(setAlert("Price alert created from Link", "success"))
    } catch (err) {
        const error = err.response.data
        if(error) dispatch(setAlert(error.msg, "error"))
    }
}


export const getPriceAlerts = () => async dispatch => {
    try {
        const res = await axios.get(`/api/price-alert`)
        
        dispatch({type: GET_PRICE_ALERTS, payload: res.data})
    } catch (error) {
        
    }
}

export const editPriceAlert = (_id, categoryChildDbId, targetPrice, attributes, history) => async dispatch => {
    try {
        dispatch({type: EDIT_PRICE_ALERT, payload: {_id, targetPrice, attributes}})
        history.push(`/product-category/${categoryChildDbId}`)
    } catch (err) {

    }
}

export const updatePriceAlert = (updateId, targetPrice, attributes, history) => async dispatch => {
    try {
        await axios.put(`/api/price-alert`, {updateId, targetPrice, attributes})
        dispatch(setAlert("Price Alert Updated", "alert"))
        history.push(`/price-alert`)
    } catch (err) {

    }
}

export const deletePriceAlert = (_id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/price-alert/${_id}`)
        dispatch(setAlert("Price alert Deleted", "success"))
        dispatch({type: DELETE_PRICE_ALERT, payload: res.data})  
    } catch (err) {
        const error = err.response.data
        if(error) dispatch(setAlert(error.msg, "error"))
    }
}

export const createPriceAlert = (priceAlert) => async dispatch => {
    try {
        if (priceAlert.targetPrice < 0 || !priceAlert.targetPrice) return dispatch(setAlert("Wrong Target Price", "error"))
        
        const res = await axios.post(`/api/price-alert`, priceAlert)

        dispatch({ type: CREATE_PRICE_ALERT, payload: res.data })
    } catch (err) {
        const error = err.response.data
        if(error) dispatch(setAlert(error.msg, "error"))
    }
}

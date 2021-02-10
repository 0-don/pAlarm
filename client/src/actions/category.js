import axios from "axios";
import {
    GET_CATEGORIES
} from "./types"

export const getCategories = () => async dispatch => {
    try {
        const res = await axios.get("/api/category")
        dispatch({ type: GET_CATEGORIES, payload: res.data })
    } catch (error) {
        console.log(error)
    }
}
import axios from "axios"
import { SEARCH, SEARCH_UPDATE } from "./types"


export const search = (searchText, history) => async dispatch => {
    try {
        const res = await axios.post("/api/search", { searchText })
        if (res.data.categoryChild) {
            history.push(`/product-category/${res.data.categoryChild}`);
        } else {
            dispatch({ type: SEARCH, payload: res.data })
            history.push("/search");
        }
    } catch (error) {

    }

}

export const searchUpdate = (searchTitle, url, history) => async dispatch => {
    try {
        const res = await axios.post(`/api/search/`, { searchTitle, url })
        if (res.data.categoryChild) {
            history.push(`/product-category/${res.data.categoryChild}`);
        } else {
            // dispatch({ type: SEARCH, payload: res.data })
            // history.push("/search");
            dispatch({ type: SEARCH_UPDATE, payload: res.data })
        }
    } catch (error) {

    }
}
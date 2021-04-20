import axios from "axios"
import { setAlert } from "./alert"
import { SEARCH, SEARCH_UPDATE, SEARCH_LOAD, SEARCH_LOAD_FALSE } from "./types"


export const search = (searchText, history) => async dispatch => {
    history.push("/search");
    dispatch({ type: SEARCH_LOAD })
    try {
        const res = await axios.post("/api/search", { searchText })
        if (res.data.categoryChild) {
            history.push(`/product-category/${res.data.categoryChild}`);
        } else {
            dispatch({ type: SEARCH, payload: res.data })
        }
    } catch (err) {
        dispatch({ type: SEARCH_LOAD_FALSE })
        const error = err.response.data
        if(error) dispatch(setAlert(error.msg, "error"))
    }

}

export const searchUpdate = (searchTitle, url, history) => async dispatch => {
    history.push("/search");
    dispatch({ type: SEARCH_LOAD })
    try {
        const res = await axios.post(`/api/search/`, { searchTitle, url })
        if (res.data.categoryChild) {
            history.push(`/product-category/${res.data.categoryChild}`);
        } else {
            dispatch({ type: SEARCH_UPDATE, payload: res.data })
        }
    } catch (err) {

    }
}
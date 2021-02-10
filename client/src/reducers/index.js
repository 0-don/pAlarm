import { combineReducers } from "redux";
import alert from "./alert"
import auth from "./auth"
import category from "./category"
import productCategory from "./productCategory"
import priceAlert from "./priceAlert"
import search from "./search"

export default combineReducers({
    auth,
    alert,
    category,
    productCategory,
    priceAlert,
    search
})
import { SEARCH, SEARCH_UPDATE, SEARCH_LOAD, SEARCH_LOAD_FALSE} from "../actions/types"

const initialState = {
    searchCategories: null,
    url: null,
    loading: true
}

export const search = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case SEARCH:
        case SEARCH_UPDATE:
            return {
                ...state,
                searchCategories: payload.searchCategories,
                url: payload.url,
                loading: false
            }
        case SEARCH_LOAD:
            return {
                searchCategories: null,
                url: null,
                loading: true
            }
        case SEARCH_LOAD_FALSE:
            return {
                searchCategories: null,
                url: null,
                loading: false
            }
        default:
            return state
    }
}

export default search
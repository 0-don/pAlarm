import { SEARCH, SEARCH_UPDATE } from "../actions/types"

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
        default:
            return state
    }
}

export default search
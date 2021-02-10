import { SEARCH, SEARCH_UPDATE } from "../actions/types"

const initialState = []

export const search = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH:
        case SEARCH_UPDATE:
            return [...action.payload]
        default:
            return state
    }
}

export default search
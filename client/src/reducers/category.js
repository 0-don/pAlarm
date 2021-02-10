import {
    GET_CATEGORIES
} from "../actions/types"

const intialState = {
    category: {},
    loading: true
}

const category = (state = intialState, action) => {
    const { type, payload } = action

    switch (type) {
        case GET_CATEGORIES:
            return {
                ...state,
                category: payload,
                loading: false
            }
        default:
            return state
    }
}

export default category
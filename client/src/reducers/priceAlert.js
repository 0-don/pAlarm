import {
    CREATE_PRICE_ALERT,
    GET_PRICE_ALERTS,
    DELETE_PRICE_ALERT
} from "../actions/types"

const intialState = {
    priceAlert: [],
    loading: true
}

const priceAlert = (state = intialState, action) => {
    const { type, payload } = action

    switch (type) {
        case GET_PRICE_ALERTS:
            return{
                ...state,
                priceAlert: payload,
                loading: false
            }
        case CREATE_PRICE_ALERT:
            return{
                ...state,
                priceAlert: [...state.priceAlert, payload],
                loading: false
            }
            case DELETE_PRICE_ALERT:
                return{
                    ...state,
                    priceAlert: state.priceAlert.filter(alert => alert._id !== payload),
                    loading: false
                }
        default:
            return state
    }
}

export default priceAlert
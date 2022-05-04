import { actionTypes } from './action';



function reducer(state = {}, action) {
    switch (action.type) {
        case actionTypes.GET_ORDERS_LIST_SUCCESS:
            return {
                ...state,
                orderList: [...action.data].map((order) => {return {...order}})
            };
        case actionTypes.GET_ORDERS_LIST_ERROR:
            return {
                ...state,
                ...{ error: action.error },
            };
        case actionTypes.GET_MY_ORDERS_LIST_SUCCESS:
            return {
                ...state,
                orderList: [...action.data].map((order) => {return {...order}})
            };
        case actionTypes.GET_MY_ORDERS_LIST_ERROR:
            return {
                ...state,
                ...{ error: action.error },
            };
        case actionTypes.SET_ORDER_ADDRESS_SUCCESS:
        return {
                ...state,
                orderAddress: {...action.data}
            };
        case actionTypes.GET_ORDER_DETAILS_SUCCESS:
        return {
                ...state,
                orderDetails: {...action.data}
            };
        default:
            return state;
    }
}

export default reducer;

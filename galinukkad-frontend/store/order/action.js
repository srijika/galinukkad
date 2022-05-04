export const actionTypes = {
    GET_ORDERS_LIST: 'GET_ORDERS_LIST',
    GET_ORDERS_LIST_SUCCESS: 'GET_ORDERS_LIST_SUCCESS',
    GET_ORDERS_LIST_ERROR: 'GET_ORDERS_LIST_ERROR',

    GET_MY_ORDERS_LIST: 'GET_MY_ORDERS_LIST',
    GET_MY_ORDERS_LIST_SUCCESS: 'GET_MY_ORDERS_LIST_SUCCESS',
    GET_MY_ORDERS_LIST_ERROR: 'GET_MY_ORDERS_LIST_ERROR',

    GET_ORDER_DETAILS:'GET_ORDER_DETAILS',
    GET_ORDER_DETAILS_SUCCESS:'GET_ORDER_DETAILS_SUCCESS',
    GET_ORDER_DETAILS_ERROR:'GET_ORDER_DETAILS_ERROR',
    SET_ORDER_ADDRESS:'SET_ORDER_ADDRESS',
    CREATE_ORDER_ADDRESS:'CREATE_ORDER_ADDRESS',
    SET_ORDER_ADDRESS_SUCCESS:'SET_ORDER_ADDRESS_SUCCESS'

};

export function getOrderDetails(data) {
    return { type: actionTypes.GET_ORDER_DETAILS, data};
}

export function getOrderDetailsSuccess(data) {
    return { type: actionTypes.GET_ORDER_DETAILS_SUCCESS, data};
}
export function getOrderDetailsError(data) {
    return { type: actionTypes.GET_ORDER_DETAILS_ERROR, data};
}

export function getMyOrderList(data) {
    return { type: actionTypes.GET_MY_ORDERS_LIST, data};
}

export function getMyOrderListSuccess(data) {
    return { type: actionTypes.GET_MY_ORDERS_LIST_SUCCESS, data};
}
export function getMYOrderListError(data) {
    return { type: actionTypes.GET_MY_ORDERS_LIST_ERROR, data};
}

export function getOrdersList() {
    return { type: actionTypes.GET_ORDERS_LIST};
}

export function getOrderListSuccess(data) {
    return { type: actionTypes.GET_ORDERS_LIST_SUCCESS, data};

}

    export function getOrderListError(error) {
        return { type: actionTypes.GET_ORDERS_LIST_ERROR, error};
    }


    export function setOrderAddress(data) {
     
        return { type: actionTypes.SET_ORDER_ADDRESS, data}
    }

    export function createOrderAddress(data) {
     
        return { type: actionTypes.CREATE_ORDER_ADDRESS, data}
    }

    export function setOrderAddressSuccess(data) {
       
        return { type: actionTypes.SET_ORDER_ADDRESS_SUCCESS, data}
    }

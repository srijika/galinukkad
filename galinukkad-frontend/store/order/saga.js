import { all, call, put, takeEvery } from 'redux-saga/effects';
import { notification } from 'antd';
import {
    actionTypes,
    getOrderListSuccess,
    getOrderListError,
    getMyOrderListSuccess,
    getMYOrderListError,
    setOrderAddressSuccess,
    getOrderDetailsSuccess,
    getOrderDetailsError
} from './action';
import OrdersRepository from '../../repositories/OrdersRepository';


function* getOrderListSaga() {
    try {
        const response = yield call(OrdersRepository.getOrders);
        yield put(getOrderListSuccess([...response]));
    } catch (err) {
        yield put(getOrderListError(err));
    }
}

function* getMyOrderListSaga() {
    try {
        const response = yield call(OrdersRepository.getMyOrders);
        yield put(getMyOrderListSuccess([...response]));
    } catch (err) {
        yield put(getMYOrderListError(err));
    }
}

function* getOrderDetail({data}) {
    try {
        const response = yield call(OrdersRepository.getOrderDetail,data);
        yield put(getOrderDetailsSuccess( response ));
    } catch (err) {
        yield put(getOrderDetailsError(err));
    }
}

function* createOrderAddress({data}){
    try {
        const response = yield call(OrdersRepository.createOrderAddress,data);
        yield put(setOrderAddressSuccess( response ));
    } catch (err) {
        yield put(getOrderDetailsError(err));
    }
}

function* setOrderAddressSaga({data}) {
        yield put(setOrderAddressSuccess({...data}));
}


export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_ORDERS_LIST , getOrderListSaga)]);
    yield all([takeEvery(actionTypes.GET_MY_ORDERS_LIST , getMyOrderListSaga)]);
    yield all([takeEvery(actionTypes.SET_ORDER_ADDRESS , setOrderAddressSaga)]);
    yield all([takeEvery(actionTypes.GET_ORDER_DETAILS , getOrderDetail)]);
    yield all([takeEvery(actionTypes.CREATE_ORDER_ADDRESS , createOrderAddress)]);
}

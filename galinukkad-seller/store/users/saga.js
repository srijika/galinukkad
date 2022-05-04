import { all, put, takeEvery, call} from 'redux-saga/effects';
import {notification } from 'antd';
import UsersRepository from '../../repositories/UsersRepository';
import { actionTypes, getUserDetailSuccess, updateInfoSuccess, addressDetailSuccess, updateAddressSuccess, createAddressSuccess, addressDeleteSuccess } from './action';

function* getlist() {
    try {
		const data = yield call(UsersRepository.userAcInfo);
		//console.log('user saga', data)
		if(data.status){
			//notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(getUserDetailSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}

function* update({ payload }) {
    try {
		const data = yield call(UsersRepository.updateAcInfo, payload);
		if(data.status){
			notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(updateInfoSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}


function* address() {
    try {
		const data = yield call(UsersRepository.addressDetail);
		//console.log('user saga', data)
		if(data.status){
			//notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(addressDetailSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}

function* creatreAddressFun({ payload }) {
    try {
		const data = yield call(UsersRepository.createAcAddress, payload);
		if(data.status){
			notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(createAddressSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}

function* updateAddress({ payload }) {
    try {
		const data = yield call(UsersRepository.updateAcAddress, payload);
		if(data.status){
			notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(updateAddressSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}

function* delAddress({ payload }) {
    try {
		const data = yield call(UsersRepository.delAddress, payload);
		if(data.status){
			notification['success']({message: 'Success', description: data.err || data.msg,})
			yield put(addressDeleteSuccess(data));
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
		
    } catch (err) {
        console.error(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.USERDETAIL, getlist)]);
    yield all([takeEvery(actionTypes.UPDATEINFO, update)]);
    yield all([takeEvery(actionTypes.ADDRESS, address)]);
    yield all([takeEvery(actionTypes.CREATEADDRESS, creatreAddressFun)]);
    yield all([takeEvery(actionTypes.UPDATEADDRESS, updateAddress)]);
    yield all([takeEvery(actionTypes.DELETEADDRESS, delAddress)]);
}

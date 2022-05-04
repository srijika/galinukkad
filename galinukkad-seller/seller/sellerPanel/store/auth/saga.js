import { all, put, takeEvery, call} from 'redux-saga/effects';
import {notification } from 'antd';
import AuthRepository from '../../repositories/AuthRepository';
import { actionTypes, loginSuccess, logOutSuccess, registerSuccess } from './action';

const modalSuccess = type => {
    notification[type]({
        message: 'Wellcome back',
        description: 'You are login successful!',
    });
};

const modalWarning = type => {
    notification[type]({
        message: 'Good bye!',
        description: 'Your account has been logged out!',
    });
};


function* loginSaga({ payload }) {
    try {
		const data = yield call(AuthRepository.LoginUser, payload);
		if(data.status){
			modalSuccess('success');
			yield put(loginSuccess(data));
			localStorage.setItem('accessToken', data.accessToken)
		}else notification['warning']({message: 'Error', description: data.err || data.msg,})
        
        //modalSuccess('success');
    } catch (err) {
        console.log(err);
    }
}
function* registerSaga({ payload }) {
    try {
		const data = yield call(AuthRepository.RegisterUser, payload);
        {data.status ? notification['success']({message: 'Success', description: "Success New Account Created",}) :notification['warning']({message: 'Error', description: data.err,})}
		yield put(registerSuccess(data));		
    } catch (err) {
        console.log(err);
    }
}

function* logOutSaga() {
    try {
        yield put(logOutSuccess());
		localStorage.setItem('accessToken', '')
        modalWarning('warning');
		window.location.href = window.location.origin;
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.LOGIN_REQUEST, loginSaga)]);
    yield all([takeEvery(actionTypes.REGISTER_REQUEST, registerSaga)]);
    yield all([takeEvery(actionTypes.LOGOUT, logOutSaga)]);
}

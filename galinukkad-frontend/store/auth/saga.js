import { all, put, takeEvery, call, delay} from 'redux-saga/effects';
import {notification } from 'antd';
import AuthRepository from '../../repositories/AuthRepository';
import { actionTypes, loginSuccess, logOutSuccess, registerSuccess , socialLogin ,varifyAccountSuccess } from './action';
import { syncWishlist } from '../wishlist/action';
import Router from 'next/router';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';



const modalSuccess = type => {
    // notification[type]({
    //     message: 'Welcome back',
    //     description: 'You are login successful!',
    //     duration : 1
    // });
     toast.success('You are login successful!');

    window.scrollTo(0, 0)
    

};

const modalWarning = type => {
    // notification[type]({
    //     message: 'Good bye!',
    //     description: 'Your account has been logged out!',
    // });

    toast.warn('Your account has been logged out!');

    
};


function* loginSaga({ payload }) {
    try {
		const data = yield call(AuthRepository.LoginUser, payload);

		if(data.status){

			yield put(loginSuccess(data));
            yield delay(100);
            modalSuccess('success');
            
            localStorage.setItem('accessToken', data.accessToken)
            yield delay(1000);
            yield put(syncWishlist());
		}else {
            if(data && data.status == false && (data.msg == "Your account is not verified" || data.message == "Your account is not verified")) {
                localStorage.setItem('user_email', payload.username);
                Router.push('/account/varify');
            } else {
                //notification['warning']({message: 'Error', description: data.err || data.msg || data.message})
                toast.error(data.err || data.msg || data.message);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

    function* socialLoginSaga({ payload }) {
        try {
            const data = yield call(AuthRepository.SocialLogin, payload);
            if(data.status){
                modalSuccess('success');
                yield put(loginSuccess(data));
                localStorage.setItem('accessToken', data.accessToken)
                yield delay(1000);
                yield put(syncWishlist());
            }
            //else notification['warning']({message: 'Error', description: data.err || data.msg || data.message})
            toast.error(data.err || data.msg || data.message)
        } catch (err) {
            console.log(err);
        }
    }



function* registerSaga({ payload }) {
    try {
        const data = yield call(AuthRepository.RegisterUser, payload);
            if(data.status){
                notification['success']({message: 'Success', description: "Success New Account Created! Verification  email sent please check your email and login to verify."});
                yield put(registerSuccess(data));		
            }else {
               // notification['warning']({message: 'Error', description: data.msg || data.message})
               toast.warn(data.msg || data.message);
            }
        } catch (err) {
            console.log(err);
        }
}

function* logOutSaga() {
    try {
        yield put(logOutSuccess());
        localStorage.removeItem('accessToken')
        localStorage.removeItem('LoginId')
        localStorage.removeItem('LoginCred')
        localStorage.removeItem('pincodeApply')
        localStorage.removeItem('pincode')

        modalWarning('warning');
		window.location.href = window.location.origin;
    } catch (err) {
        console.log(err);
    }
}

function* sendOtpSaga({ payload }) {
    try {
        const data = yield call(AuthRepository.LoginUser, payload);
		if(data.status){
            if(data.message) {
                notification.success({ message:data.message,  description: 'Otp send to your mobile/email', });
            }
		}
        //else notification['warning']({message: 'Error', description: data.err || data.msg || data.message})
        toast.warn( data.err || data.msg || data.message);
    } catch (err) {
        console.log(err);
    }
}

function* varifyOtpSaga({ payload }) {
    try {
		const data = yield call(AuthRepository.VarifyUser, payload);
		if(data.status){
            modalSuccess('success');
			yield put(loginSuccess(data));
            localStorage.setItem('accessToken', data.accessToken)
            yield delay(1000);
            yield put(syncWishlist());
		}
        //else notification['warning']({message: 'Error', description: data.err || data.msg || data.message})
        else toast.warn( data.err || data.msg || data.message);
    } catch (err) {
        console.log(err);
    }
}

function* userActivesaga({ payload }) {
    try {
		const data = yield call(AuthRepository.ActiveUser, payload);
        console.log("datauser" , data)
		// if(data.status){
        //     modalSuccess('success');
		// 	yield put(loginSuccess(data));
        //     localStorage.setItem('accessToken', data.accessToken)
        //     yield delay(1000);
        //     yield put(syncWishlist());
		// }else {
        //     if(data && data.status == false && (data.msg == "Your account is not verified" || data.message == "Your account is not verified")) {
        //         localStorage.setItem('user_email', payload.username);
        //         Router.push('/account/varify');
        //     } else {
        //         //notification['warning']({message: 'Error', description: data.err || data.msg || data.message})
        //         toast.error(data.err || data.msg || data.message);
        //     }
        // }
    } catch (err) {
        console.log(err);
    }
}

function* accountVarifySaga({payload}) {
    try {
		const data = yield call(AuthRepository.VarifyAccount, payload);
		if(data.status){
			yield put(varifyAccountSuccess(data));
		}
        //else notification['warning']({message: 'Error', description: data.err || data.msg || data.message,})
        toast.warn(data.err || data.msg || data.message);
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.LOGIN_REQUEST, loginSaga)]);
    yield all([takeEvery(actionTypes.REGISTER_REQUEST, registerSaga)]);
    yield all([takeEvery(actionTypes.LOGOUT, logOutSaga)]);
    yield all([takeEvery(actionTypes.SEND_OTP, sendOtpSaga)]);
    yield all([takeEvery(actionTypes.VARIFY_OTP, varifyOtpSaga)]);
    yield all([takeEvery(actionTypes.SOCIAL_LOGIN, socialLoginSaga)]);
    yield all([takeEvery(actionTypes.ACCOUNT_VARIFY, accountVarifySaga)]);
    yield all([takeEvery(actionTypes.CHECK_USER_ACTIVE, userActivesaga)]);

}

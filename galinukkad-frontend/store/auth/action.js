export const actionTypes = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
    SEND_OTP:'SEND_OTP',
    VARIFY_OTP:'VARIFY_OTP',
    SOCIAL_LOGIN: 'SOCIAL_LOGIN',
    ACCOUNT_VARIFY: 'ACCOUNT_VARIFY',
    ACCOUNT_VARIFY_SUCCESS: 'ACCOUNT_VARIFY_SUCCESS' ,
    CHECK_USER_ACTIVE: 'CHECK_USER_ACTIVE'

};

export function varifyOtp(payload) {
    return { type: actionTypes.VARIFY_OTP, payload };
}

export function varifyAccount(payload) {
    return { type: actionTypes.ACCOUNT_VARIFY, payload };
}

export function varifyAccountSuccess(payload) {
    return { type: actionTypes.ACCOUNT_VARIFY_SUCCESS, payload };
}

export function sendOtp(payload) {
    return { type: actionTypes.SEND_OTP, payload };
}

export function socialLogin(payload) {
    return { type: actionTypes.SOCIAL_LOGIN, payload };
}

export function login(payload) {
    return { type: actionTypes.LOGIN_REQUEST, payload };
}
export function register(payload) {	
	return { type: actionTypes.REGISTER_REQUEST, payload };
}
export function registerSuccess(data) {
    return { type: actionTypes.REGISTER_SUCCESS, data };
}

export function clearRegister(data) {
    return { type: actionTypes.REGISTER_SUCCESS, data };
}

export function loginSuccess(data) {
    return { type: actionTypes.LOGIN_SUCCESS, data };
}

export function logOut() {
    return { type: actionTypes.LOGOUT };
}

export function logOutSuccess() {
    return { type: actionTypes.LOGOUT_SUCCESS };
}


export function checkUserActive(data) {
  
    return { type: actionTypes.CHECK_USER_ACTIVE, data};
}

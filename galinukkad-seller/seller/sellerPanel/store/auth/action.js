export const actionTypes = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
};

export function login(payload) {
    return { type: actionTypes.LOGIN_REQUEST, payload };
}
export function register(payload) {	
    //console.log('register action', payload)
	return { type: actionTypes.REGISTER_REQUEST, payload };
}
export function registerSuccess(data) {
	//console.log('REGISTER_SUCCESS', data)
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

export const actionTypes = {
    USERDETAIL: 'USERDETAIL',
    USERDETAIL_SUCCESS: 'USERDETAIL_SUCCESS',
    UPDATEINFO: 'UPDATEINFO',
    UPDATEINFO_SUCCESS: 'UPDATEINFO_SUCCESS',
    ADDRESS: 'ADDRESS',
    ADDRESS_SUCCESS: 'ADDRESS_SUCCESS',
    CREATEADDRESS: 'CREATEADDRESS',
    CREATEADDRESS_SUCCESS: 'CREATEADDRESS_SUCCESS',
    DELETEADDRESS: 'DELETEADDRESS',
    DELETEADDRESS_SUCCESS: 'DELETEADDRESS_SUCCESS',
    UPDATEADDRESS: 'UPDATEADDRESS',
    UPDATEADDRESS_SUCCESS: 'UPDATEADDRESS_SUCCESS',
    CLEAR: 'CLEAR',
};

export function getUserList(payload) {
    return { type: actionTypes.USERDETAIL , payload};
}

export function getUserDetailSuccess(data) {
    return { type: actionTypes.USERDETAIL_SUCCESS, data };
}

export function updateInfo(payload) {
	return { type: actionTypes.UPDATEINFO, payload };
}
export function updateInfoSuccess(data) {
    return { type: actionTypes.UPDATEINFO_SUCCESS, data };
}


export function addressDetail() {
	return { type: actionTypes.ADDRESS };
}
export function addressDetailSuccess(data) {
    return { type: actionTypes.ADDRESS_SUCCESS, data };
}

export function createAddress(payload) {
    
	return { type: actionTypes.CREATEADDRESS, payload };
}
export function createAddressSuccess(data) {
    return { type: actionTypes.CREATEADDRESS_SUCCESS, data };
}

export function updateAddress(payload) {
	return { type: actionTypes.UPDATEADDRESS, payload };
}
export function updateAddressSuccess(data) {
    return { type: actionTypes.UPDATEADDRESS_SUCCESS, data };
}
export function addressDelete(payload) {
	return { type: actionTypes.DELETEADDRESS, payload };
}
export function addressDeleteSuccess(data) {
    return { type: actionTypes.DELETEADDRESS_SUCCESS, data };
}


export function clearAction() {
    return { type: actionTypes.CLEAR };
}

import  Router  from 'next/router';
import { actionTypes } from './action';

export const initState = {
    isLoggedIn: false,
    isUserActive: false,
	login:{count:0},
    register : {count:0},
    accountVarified:true,
    accountVarifiedData:{}	
};

function reducer(state = initState, action) {
    switch (action.type) {
        
        case actionTypes.LOGIN_SUCCESS:
			action.data.count = parseInt(state.login.count) +1;
			return {
                ...state,
                ...{login:action.data, accountVarified: false, isLoggedIn: true },
            };
        case actionTypes.REGISTER_SUCCESS:
            action.data.count = 1 + parseInt(state.register.count);
            return {
                ...state,
                ...{ register: action.data, RegisterLoading: false, isLoggedIn:false },
            };
        case actionTypes.LOGOUT_SUCCESS:
			return {
                ...state,
                ...{login:{},register:{}, isLoggedIn: false },
            };
        case actionTypes.ACCOUNT_VARIFY_SUCCESS:
            return {
                ...state,
                ...{login:{},register:{}, accountVarified: true , accountVarifiedData:action.payload , isLoggedIn: false },
            };
        default:
            return state;
    }
}

export default reducer;

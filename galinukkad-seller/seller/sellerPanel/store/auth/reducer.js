import { actionTypes } from './action';

export const initState = {
    isLoggedIn: false,
	login:{count:0},
	register : {count:0},	
};

function reducer(state = initState, action) {
	//console.log(action, state)
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
			action.data.count = parseInt(state.login.count) +1;
			return {
                ...state,
                ...{login:action.data, isLoggedIn: true },
            };
        case actionTypes.REGISTER_SUCCESS:
			//console.log('register reducer',action, state.register.count)
			action.data.count = 1 + parseInt(state.register.count);
            return {
                ...state,
                ...{ register: action.data, RegisterLoading: false },
            };
        case actionTypes.LOGOUT_SUCCESS:
			return {
                ...state,
                ...{login:{},register:{}, isLoggedIn: false },
            };
        default:
            return state;
    }
}

export default reducer;

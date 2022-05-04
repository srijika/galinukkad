import { actionTypes } from './action';

export const initialState = {
	info:{count:0},
	update:{count:0},
	address:{count:0},
	create:{count:0},
	addressDel:{count:0},
	addressUpdate:{count:0},
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.USERDETAIL_SUCCESS:
		action.data.count = state.info.count +1;	
            return {
                ...state,
                ...{ info: action.data },
            };
        case actionTypes.UPDATEINFO_SUCCESS:
			action.data.count = state.update.count +1;	
            return {
                ...state,
                ...{ update: action.data },
            };
        case actionTypes.ADDRESS_SUCCESS:		
            action.data.count = state.address.count +1;	
			return {
                ...state,
                ...{ address: action.data },
            };
        case actionTypes.CREATEADDRESS_SUCCESS:
			action.data.count = state.create.count +1;	
            return {
                ...state,
                ...{ create: action.data },
            };
			
        case actionTypes.UPDATEADDRESS_SUCCESS:
			action.data.count = state.addressUpdate.count +1;	
            return {
                ...state,
                ...{ addressUpdate: action.data },
            };
        case actionTypes.DELETEADDRESS_SUCCESS:
			action.data.count = state.addressDel.count +1;	
            return {
                ...state,
                ...{ addressDel: action.data },
            };
		case actionTypes.CLEAR:
            return {
                ...state,
                ...{update:{count:0}, addressUpdate:{count:0}, create:{count:0}, addressDel:{count:0}},
            };
        default:
            return state;
    }
}

export default reducer;

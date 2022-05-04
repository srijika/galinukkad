import { actionTypes } from './action';

export const initialState = {
    currency: {
		symbol: `₹`,
        text: 'RUP',
    },
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_CURRENCY_SUCCESS:
            return {
                ...state,
                ...{ currency: action.currency },
            };
        default:
            return state;
    }
}

export default reducer;

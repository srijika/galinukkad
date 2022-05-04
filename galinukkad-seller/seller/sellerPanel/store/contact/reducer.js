import { actionTypes } from './action';

export const initState = {
};

function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.CONATCT_DETAIL_SAVE_SUCCESS:
            return {
                ...initState,
            };
        default:
            return state;
    }
}

export default reducer;

export const actionTypes = {
    ADD_FORM_DETAIL: 'ADD_FORM_DETAIL',
    CONATCT_DETAIL_SAVE_SUCCESS: 'CONATCT_DETAIL_SAVE_SUCCESS',
};

export function submitFormDetails(values) {
    return { type: actionTypes.ADD_FORM_DETAIL, payload: values };
}

export function submitFormDetailsSuccess(data) {
    return { type: actionTypes.CONATCT_DETAIL_SAVE_SUCCESS };
}
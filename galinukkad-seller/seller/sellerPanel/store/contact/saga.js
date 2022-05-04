import { all, put, takeEvery, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
    actionTypes,
    submitFormDetailsSuccess,
} from './action';
import ContactRepository from '../../repositories/contactRepository';

const modalSuccess = type => {
    notification[type]({
        message: 'Success',
        description: 'Contact Details Received',
    });
};

const modalWarning = type => {
    notification[type]({
        message: 'Error',
        description: 'Detail Not Submited Please Try Again',
    });
};

function* addContactForm({ payload }) {
    try {
		const data = yield call(ContactRepository.submitForm, payload);
		if(data.status){
			modalSuccess('success');
			yield put(submitFormDetailsSuccess(data));
		}else modalWarning('warning')
            } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.ADD_FORM_DETAIL, addContactForm)]);
}

import { all, put, takeEvery, call } from 'redux-saga/effects';
import { notification } from 'antd';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
    getNotifications,
    getNotificationsSuccess,
    getNotificationsError,
    actionTypes,
    markAsReadNotificationSuccess,
    markAsReadNotificationError,
    deleteNotificationSuccess,
    deleteNotificationError,
    markAsUnreadNotificationSuccess,
    markAsUnreadNotificationError
} from './action';
import NotificationRepository from '../../repositories/NotificationRepository';

const modalSuccess = type => {
    if(localStorage.getItem('accessToken'))
    {
    // notification[type]({
    //     message: 'Added to wishlisht!',
    //     description: 'This product has been added to wishlist!',
    // });
    toast.success('This product has been added to wishlist!' , 'Added to wishlisht!');

    
}else{
    notification.error({ message: 'Please Login in your account!' });
    Router.push('/account/login');
}
};


const modalWarning = type => {
    console.log("11");
    // notification[type]({
    //     message: 'Removed from wishlist',
    //     description: 'This product has been removed from wishlist!',
    // });
    toast.error('This product has been removed from wishlist!');

};

function* getNotificationSaga() {
    try {
        
          if(typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
                 const response = yield call(NotificationRepository.getNotifications);
                 if(response['error']) throw response;
                 yield put(getNotificationsSuccess([...response]));
          } else {
            throw new Error('Not logged in');
          } 
    } catch (err) {
        console.log(err);
        yield put(getNotificationsError({...err}));
    }
}

function* markAsReadNotificationSaga({ payload }) {
    try {
            const response = yield call(NotificationRepository.markAsRead,payload);
            if(response['error']) throw response;
            yield put(markAsReadNotificationSuccess(payload));
    } catch (err) {
        console.log(err);
        yield put(markAsReadNotificationError(err));
    }
}

function* markAsUnreadNotificationSaga({ payload }) {
    try {
            const response = yield call(NotificationRepository.markAsUnread,payload);
            if(response['error']) throw response;
            yield put(markAsUnreadNotificationSuccess(payload));
    } catch (err) {
        console.log(err);
        yield put(markAsUnreadNotificationSuccess(err));
    }
}

function* deleteNotificationSaga({ payload }) {
    try {
            const response = yield call(NotificationRepository.deleteNotification,payload);
            if(response['error']) throw response;
            yield put(deleteNotificationSuccess(payload));
    } catch (err) {
        console.log(err);
        yield put(deleteNotificationError(err));
    }
}




export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_NOTIFICATION, getNotificationSaga)]);
    yield all([takeEvery(actionTypes.MARK_AS_READ, markAsReadNotificationSaga)]);
    yield all([takeEvery(actionTypes.DELETE_NOTIFICATION, deleteNotificationSaga)]);
    yield all([takeEvery(actionTypes.MARK_AS_UNREAD, markAsUnreadNotificationSaga)]);
}

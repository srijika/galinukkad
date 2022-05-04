import { all, put, takeEvery } from 'redux-saga/effects';
import { notification } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
    actionTypes,
    getCompareListSuccess,
    updateCompareListSuccess,
    addItemSuccess,
} from './action';

const modalSuccess = type => {
    // notification[type]({
    //     message: 'Added to compare list!',
    //     description: 'This product has been added to compare list!',
    //     duration: 0.5,
    //     className: "notification-type-info"
    // });
    
    toast.success("This product has been added to compare list!");
};

const modalWarning = type => {
    // notification[type]({
    //     message: 'Removed to compare list',
    //     description: 'This product has been removed from compare list!',
    // });
    
    toast.error("Removed to compare list");
};

function* getCompareListSaga() {
    try {
        const localCompareList = JSON.parse(
            localStorage.getItem('persist:eStore')
        ).cart;
        yield put(getCompareListSuccess(localCompareList));
        modalSuccess('success')
    } catch (err) {
        console.log(err);
    }
}

function* addItemSaga(payload) {
    try {
        const { product } = payload;
        let localCompare = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).compare
        );

        console.log("localCompare" , localCompare.compareTotal)



        let existItem = localCompare.compareItems.find(
            item => item._id === product._id
        );

        if (!existItem) {
            if(localCompare.compareTotal > 9){
                toast.error("you can't add more 10 in compare list!");
                return;
                          }
            product.quantity = 1;
            localCompare.compareItems.push(product);
            localCompare.compareTotal++;
            yield put(updateCompareListSuccess(localCompare));
            modalSuccess('success');
        }
    } catch (err) {
        console.log(err);
    }
}

function* removeItemSaga(payload) {
    try {
        const { product } = payload;
        let localCompare = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).compare
        );
        // let index = localCompare.compareItems.indexOf(product);
        let index = localCompare.compareItems.findIndex(
            (item) => item._id === product._id
        );
        localCompare.compareTotal = localCompare.compareTotal - 1;
        localCompare.compareItems.splice(index, 1);
        yield put(updateCompareListSuccess(localCompare));
        modalWarning('warning');
    } catch (err) {
        console.log(err);
    }
}

function* clearCompareListSaga() {
    try {
        const emptyCart = {
            compareItems: [],
            compareTotal: 0,
        };
        yield put(updateCompareListSuccess(emptyCart));
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_COMPARE_LIST, getCompareListSaga)]);
    yield all([takeEvery(actionTypes.ADD_ITEM_COMPARE, addItemSaga)]);
    yield all([takeEvery(actionTypes.REMOVE_ITEM_COMPARE, removeItemSaga)]);
}

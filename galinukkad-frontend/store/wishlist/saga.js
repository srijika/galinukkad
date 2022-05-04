import { all, put, takeEvery, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
    actionTypes,
    getWishlistListSuccess,
    updateWishlistListSuccess,
} from './action';
import Router from 'next/router';
import WhishlistRepository from '../../repositories/WishlistRepository';

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
    // notification[type]({
    //         message: 'Removed from wishlist',
    //         description: 'This product has been removed from wishlist!',
    //     });
    // toast.error('This product has been removed from wishlist!');

};

function* getWishlistListSaga() {
    try {
        
          if(typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
                 const response = yield call(WhishlistRepository.getWishlist);
                 
                 if(response['error']) throw response;
                 const localWishlist = {
                    wishlistItems:[...response],
                    wishlistTotal:response.length
                 };
                 yield put(updateWishlistListSuccess({...localWishlist}));
            }
         else {
            const localWishlistList = JSON.parse(
                localStorage.getItem('persist:eStore')
            ).wishlist;
            yield put(getWishlistListSuccess(localWishlistList));
        }
    } catch (err) {
        console.log(err);
    }
}

function* addItemToWishlistSaga(payload) {
    try {
         
        const { product } = payload;

        console.log("id", product)

        let localWishlist = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).wishlist
        );
      
        let existItem = localWishlist.wishlistItems.find(
            item => item._id === product._id
        );

        if (!existItem) {
            if(typeof window !== 'undefined') {
                if(localStorage.getItem('accessToken')) {

                    console.log("fdsbsfdgbjhfdb dsasdadssadsda" , localWishlist.wishlistTotal)
                    if(localWishlist.wishlistTotal > 9){
                        toast.error("you can't add more 10 in wishlist!");
                        return;
                                  }

                    const response = yield call(WhishlistRepository.addToWishlist,[product._id]);
                }
            }
            localWishlist.wishlistItems.push(product);
            localWishlist.wishlistTotal++;
            yield put(updateWishlistListSuccess(localWishlist));
            modalSuccess('success');
        }
    } catch (err) {
        console.log(err);
    }
}

function* removeItemWishlistSaga(payload) {
    try {
        const { product } = payload;
        // console.log('wishlis_product' , product)
        let localWishlist = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).wishlist
        );
        // let index = localWishlist.wishlistItems.indexOf(product);
        let index = localWishlist.wishlistItems.findIndex(
            (item) => item._id == product._id
        );

        console.log('localWishlist' , localWishlist)
        console.log('index' , index)



        localWishlist.wishlistTotal = localWishlist.wishlistTotal - 1;
        localWishlist.wishlistItems.splice(index , 1);
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('accessToken')) {
                const response = yield call(WhishlistRepository.removeFromWishlist,[product._id]);
            }
        }
        yield put(updateWishlistListSuccess(localWishlist));
        modalWarning('warning');
    } catch (err) {
        console.log(err);
    }
}


function* syncWishlist() {
    try {
        let localWishlist = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).wishlist
        );
        const response = yield call(WhishlistRepository.getWishlist);
        if(response['error']) throw response;
        const ids = [];
        localWishlist.wishlistItems.forEach((data) => {
             const itemExists = response.find((product) => data._id === product._id);
             if(!itemExists) {
                ids.push(data._id);
             }
        });
        if(ids.length > 0) {
            const response = yield call(WhishlistRepository.addToWishlist,[...ids]);
        }
        yield put(updateWishlistListSuccess(localWishlist));
        modalWarning('wishlist synced');
    } catch (err) {
        console.log(err);
    }
}



function* clearWishlistListSaga() {
    try {
        const emptyCart = {
            wishlistItems: [],
            wishlistTotal: 0,
        };
        yield put(updateWishlistListSuccess(emptyCart));
    } catch (err) {
        console.log(err);
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_WISHLIST_LIST, getWishlistListSaga)]);
    yield all([
        takeEvery(actionTypes.ADD_ITEM_WISHLISH, addItemToWishlistSaga),
    ]);
    yield all([
        takeEvery(actionTypes.REMOVE_ITEM_WISHLISH, removeItemWishlistSaga),
    ]);
    yield all([
        takeEvery(actionTypes.SYNC_WISHLIST, syncWishlist),
    ]);
}

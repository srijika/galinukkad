import { all, call, put, takeEvery } from 'redux-saga/effects';
import { notification } from 'antd';
import CartRepository from '../../repositories/CartRepository';
import { isUserLoggedIn } from '../../utilities/functions-helper'
import Router from 'next/router';
import {
    actionTypes,
    getCartError,
    getCartSuccess,
    updateCartSuccess,
    updateCartError,
} from './action';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const modalSuccess = (type) => {
    // notification[type]({
    //     message: 'Success',
    //     description: 'This product has been added to your cart!',
    //     duration: 1,
    // });

    toast.success('This product has been added to your cart!' ,);



};
const modalWarning = (type) => {
    // notification[type]({
    //     message: 'Remove A Item',
    //     description: 'This product has been removed from your cart!',
    //     duration: 1,
    // });
    toast.error('This product has been removed from your cart!');

};

export const calculateAmount = (obj) =>
    Object.values(obj)
        .reduce((acc, { quantity, price }) => acc + quantity * price, 0)
        .toFixed(2);

function* getCartSaga() {
    try {
        yield put(getCartSuccess());
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* addItemSaga(payload) {
    try {
        const { product } = payload;
        const localCart = JSON.parse(localStorage.getItem('persist:eStore'))
            .cart;
        let currentCart = JSON.parse(localCart);
        const isLoggedin = isUserLoggedIn();
        if (isLoggedin) {
            const response = yield call(CartRepository.addToCart, product);
            console.log("response_data_______" .  response)
            if (response.status) {
                let productIds = response.data.productIds;
                let existItem = currentCart.cartItems.find((item) => 
                    item._id == product._id
                );
                if (existItem) {
                    existItem.quantity += product.quantity;
                    existItem.price = product.price;
                    existItem.sale_price = product.sale_price;
                } else {
                    if (!product.quantity) {
                        product.quantity = 1;
                    }
                    product.cart_id = productIds[productIds.length - 1]._id;
                    product.shipping_rates = productIds[productIds.length - 1].shipping_rates;
                    currentCart.cartItems.push(product);
                }
               
                currentCart.amount = calculateAmount(currentCart.cartItems);
                currentCart.cartTotal++;
                
                yield put(updateCartSuccess(currentCart));
                modalSuccess('success');
            } else {
                // notification.error({ message: response.message ? response.message : 'unable to add item in cart', duration: 1 });
    toast.error('unable to add item in cart');
                
                yield put(getCartError({ "error": 'unable to add item in cart' }));
            }
        } else {
            let existItem = currentCart.cartItems.find(
                (item) =>  item._id == product._id
            );
            if (existItem) {
                existItem.quantity += product.quantity;
            } else {
                if (!product.quantity) {
                    product.quantity = 1;
                }
                currentCart.cartItems.push(product);
            }
            currentCart.amount = calculateAmount(currentCart.cartItems);
            currentCart.cartTotal++;
            yield put(updateCartSuccess(currentCart));
            modalSuccess('success');
        }
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* buyItemSaga(payload) {
    try {
        const { product } = payload;
        
        const localCart = JSON.parse(localStorage.getItem('persist:eStore'))
            .cart;
        let currentCart = JSON.parse(localCart);
        const isLoggedin = isUserLoggedIn();
        if (isLoggedin) {
            const response = yield call(CartRepository.addToCart, product);
            if (response) {
                let productIds = response.data.productIds;
                let existItem = currentCart.cartItems.find((item) => 
                    item._id == product._id
                );
                if (existItem) {
                    existItem.quantity += product.quantity;
                    existItem.price = product.price;
                    existItem.sale_price = product.sale_price;
                } else {
                    if (!product.quantity) {
                        product.quantity = 1;
                    }
                    
                    product.cart_id = productIds[productIds.length - 1]._id;
                    product.shipping_rates = productIds[productIds.length - 1].shipping_rates;
                    currentCart.cartItems.push(product);
                }
                currentCart.amount = calculateAmount(currentCart.cartItems);
                currentCart.cartTotal++;
                yield put(updateCartSuccess(currentCart));
                
                modalSuccess('success');
                Router.push('/account/shopping-cart');
            } else {
                notification.error({ message: response.message ? response.message : 'unable to add item in cart', duration: 1 });
                yield put(getCartError({ "error": 'unable to add item in cart' }));
            }
        } else {
            let existItem = currentCart.cartItems.find(
                (item) =>  item._id == product._id
            );
            if (existItem) {
                existItem.quantity += product.quantity;
            } else {
                if (!product.quantity) {
                    product.quantity = 1;
                }
                currentCart.cartItems.push(product);
            }
            currentCart.amount = calculateAmount(currentCart.cartItems);
            currentCart.cartTotal++;
            yield put(updateCartSuccess(currentCart));
            modalSuccess('success');
            Router.push('/account/shopping-cart');
        }
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* removeItemSaga(payload) {
    try {
        const { product } = payload;
        let localCart = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).cart
        );
        let index = localCart.cartItems.findIndex(
            (item) => item._id === product._id
        );
 
        const isLoggedin = isUserLoggedIn();
        if (isLoggedin) {
            const response = yield call(CartRepository.removeFromCart, product.cart_id);
            if (response) {
                localCart.cartTotal = localCart.cartTotal - product.quantity;
                localCart.cartItems.splice(index, 1);
                localCart.amount = calculateAmount(localCart.cartItems);
                if (localCart.cartItems.length === 0) {
                    localCart.cartItems = [];
                    localCart.amount = 0;
                    localCart.cartTotal = 0;
                }
                yield put(updateCartSuccess(localCart));
                modalWarning('warning');
            } else {
                yield put(getCartError({ "error": "unable to delete item" }));
            }

        } else {
            localCart.cartTotal = localCart.cartTotal - product.quantity;
            localCart.cartItems.splice(index, 1);
            localCart.amount = calculateAmount(localCart.cartItems);
            if (localCart.cartItems.length === 0) {
                localCart.cartItems = [];
                localCart.amount = 0;
                localCart.cartTotal = 0;
            }
            yield put(updateCartSuccess(localCart));
            modalWarning('warning');
        }
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* increaseQtySaga(payload) {
    try {
        const { product } = payload;
        let localCart = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).cart
        );
        let selectedItem = localCart.cartItems.find(
            (item) => item._id === product._id
        );
        if (selectedItem) {
            selectedItem.quantity++;
            localCart.cartTotal++;
            localCart.amount = calculateAmount(localCart.cartItems);
        }
        yield put(updateCartSuccess(localCart));
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* decreaseItemQtySaga(payload) {
    try {
        const { product } = payload;
        const localCart = JSON.parse(
            JSON.parse(localStorage.getItem('persist:eStore')).cart
        );
        let selectedItem = localCart.cartItems.find(
            (item) => item._id === product._id
        );

        if (selectedItem) {
            if (selectedItem.quantity > 1) {
                selectedItem.quantity--;
                localCart.cartTotal--;
            }
            localCart.amount = calculateAmount(localCart.cartItems);
        }
        yield put(updateCartSuccess(localCart));
    } catch (err) {
        yield put(getCartError(err));
    }
}

function* clearCartSaga() {
    try {
        const emptyCart = {
            cartItems: [],
            amount: 0,
            cartTotal: 0,
        };
        yield put(updateCartSuccess(emptyCart));
    } catch (err) {
        yield put(updateCartError(err));
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_CART, getCartSaga)]);
    yield all([takeEvery(actionTypes.ADD_ITEM, addItemSaga)]);
    yield all([takeEvery(actionTypes.REMOVE_ITEM, removeItemSaga)]);
    yield all([takeEvery(actionTypes.INCREASE_QTY, increaseQtySaga)]);
    yield all([takeEvery(actionTypes.DECREASE_QTY, decreaseItemQtySaga)]);
    yield all([takeEvery(actionTypes.CLEAR_CART, clearCartSaga)]);
    yield all([takeEvery(actionTypes.BUY_ITEM, buyItemSaga)]);

}

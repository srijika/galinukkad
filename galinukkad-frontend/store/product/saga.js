import { all, put, takeEvery, call } from 'redux-saga/effects';
import { polyfill } from 'es6-promise';
import ProductRepository from '../../repositories/ProductRepository';
import StaticProductRepository from '../../repositories/static/StaticProductRepository';
import { ToastContainer, toast , Flip } from 'react-toastify';

import {
    actionTypes,
    getProductsError,
    getProductsSuccess,
    getSingleProductsSuccess,
    getTotalProductsSuccess,
    getProductCategoriesSuccess,
    getBrandsSuccess,
    getProductByKeywordsSuccess,
    getProductNameBySearchKeywordSuccess,
    getRelatedProductsSuccess,
    postProductReview,
    postProductReviewSuccess,
    postProductReviewError,
    getProductFilteredSuccess,
    getProductFilteredError,
    getProductByCategories,
    getProductByCategorySuccess,
    getProductBySubCategory,
    getProductBySubCategorySuccess,
    getSearchProductByKeyword,
    searchProductByKeyword,
    searchProductByKeywordSuccess,
    getSearchProductFilter,
    getSingleProductByIdError,
    getSingleProductByIdSuccess,
    getProductsByCategoryCallSuccess,
    getOneCategoryByIdSuccess,
    getProductByCategoryFilterSuccess,
    getSearchKeywordsVendorSuccess
    
    // getSearchKeywordsVendor,
} from './action';
import { isStaticData } from '../../utilities/app-settings';
polyfill();

function* getProducts({ payload }) {
    try {
        if (isStaticData === false) {
            const data = yield call(ProductRepository.getRecords, payload);
            yield put(getProductsSuccess(data));
        } else {
            const data = yield call(StaticProductRepository.getRecords);
            yield put(getProductsSuccess(data));
        }
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getTotalOfProducts() {
    try {
        if (isStaticData === false) {
            const result = yield call(ProductRepository.getTotalRecords);
            yield put(getTotalProductsSuccess(result));
        } else {
            const result = yield call(StaticProductRepository.getTotalRecords);
            yield put(getTotalProductsSuccess(result));
        }
    } catch (err) {
        console.log(err);
    }
}

function* getBrands() {
    try {
        if (isStaticData === false) {
            const result = yield call(ProductRepository.getBrands);
            yield put(getBrandsSuccess(result));
        } else {
            const result = yield call(StaticProductRepository.getBrands);
            yield put(getBrandsSuccess(result));
        }
    } catch (err) {
        console.log(err);
    }
}

function* getSearchKeywordsVendor({payload}) {
    try {
        const result = yield call(ProductRepository.getSearchKeywords, payload);
        yield put(getSearchKeywordsVendorSuccess(result));
    } catch (err) {
        console.log(err);
    }
}

function* getProductCategories() {
    try {
        if (isStaticData === false) {
            const result = yield call(ProductRepository.getProductCategories);
            yield put(getProductCategoriesSuccess(result));
        } else {
            const result = yield call(
                StaticProductRepository.getProductCategories
            );
            yield put(getProductCategoriesSuccess(result));
        }
    } catch (err) {
        console.log(err);
    }
}

function* getProductById({ id }) {
    try {
        if (isStaticData === false) {
            const product = yield call(ProductRepository.getProductsById, id);
            if (product.error !== 'error') {
                yield put(getSingleProductsSuccess({ ...product }));
            } else {
                throw product;
            }
        } else {
            const product = yield call(
                StaticProductRepository.getProductsById,
                id
            );
            yield put(getSingleProductsSuccess(product));
        }
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getProductByCategory({ category }) {
    try {
        if (isStaticData === false) {
            const result = yield call(
                ProductRepository.getProductsByCategory,
                category
            );
            yield put(getProductsSuccess(result));
            yield put(getTotalProductsSuccess(result.length));
        } else {
            const result = yield call(
                StaticProductRepository.getProductsByCategory,
                category
            );
            yield put(getProductsSuccess(result));
            yield put(getTotalProductsSuccess(result.length));
        }
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getFilteredProducts({ payload }) {
    try {
        const result = yield call(
            ProductRepository.getFilteredProducts,
            payload
        );
        yield put(getProductFilteredSuccess(result));
    } catch (err) {
        yield put(getProductFilteredSuccess(err));
    }
}

function* getProductByCategoryCall({ payload }) {
    try {
        const result = yield call(
            ProductRepository.getProductsByCategoryCall,
            payload
        );
        yield put(getProductByCategorySuccess(result));
    } catch (err) {
        yield put(getProductByCategorySuccess(err));
    }
}

function* getProductByCategoryFilterCall({ payload }) {
    try {
        const result = yield call(
            ProductRepository.getProductsByCategoryFilterCall,
            payload
        );
        yield put(getProductByCategoryFilterSuccess(result));
    } catch (err) {
        yield put(getProductByCategoryFilterSuccess(err));
    }
}

function* getProductBySubCategoryCall({ payload }) {
    try {
        const result = yield call(
            ProductRepository.getProductsBySubCategoryCall,
            payload
        );
        yield put(getProductBySubCategorySuccess(result));
    } catch (err) {
        yield put(getProductBySubCategorySuccess(err));
    }
}
function* getOneCategoryCall({ _id }) {
    try {
        const result = yield call(
            ProductRepository.getOneCategory,
            _id
        );
        yield put(getOneCategoryByIdSuccess(result));
    } catch (err) {
        yield put(getOneCategoryByIdSuccess(err));
    }
}

function* getSearchProductByKeywordCall({ payload }) {
    try {
        const result = yield call(
            ProductRepository.getSearchProductByKeyword,
            payload
        );
        yield put(searchProductByKeywordSuccess(result));
    } catch (err) {
        yield put(searchProductByKeywordSuccess(err));
    }
}

function* getProductByPriceRange({ payload }) {
    try {
        if (isStaticData === false) {
            const products = yield call(
                ProductRepository.getProductsByPriceRange,
                payload
            );
            yield put(getProductsSuccess(products));
            yield put(getTotalProductsSuccess(products.length));
        } else {
            const products = yield call(
                StaticProductRepository.getProductsByPriceRange,
                payload
            );
            yield put(getProductsSuccess(products));
            yield put(getTotalProductsSuccess(products.length));
        }
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getProductByBrand({ payload }) {
    try {
        if (isStaticData === false) {
            const brands = yield call(
                ProductRepository.getProductsByBrands,
                payload
            );
            const products = [];
            brands.forEach(brand => {
                brand.products.forEach(product => {
                    products.push(product);
                });
            });
            yield put(getProductsSuccess(products));
            yield put(getTotalProductsSuccess(products.length));
        } else {
            const brands = yield call(
                StaticProductRepository.getProductsByBrands,
                payload
            );
            const products = [];
            brands.forEach(brand => {
                brand.products.forEach(product => {
                    products.push(product);
                });
            });
            yield put(getProductsSuccess(products));
            yield put(getTotalProductsSuccess(products.length));
        }
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getProductByKeyword({ keyword }) {
    try {
        const searchParams = { filter: keyword };
        const result = yield call(ProductRepository.getSearchKeywords, searchParams);
        yield put(getProductByKeywordsSuccess(result));
      } catch (err) {
        yield put(getProductsError(err));
    }
}
function* getProductNameBySearchKeyword({ keyword }) {
    try {
        const searchParams = { filter: keyword };
        const result = yield call(ProductRepository.getProductNameBySearchKeywordSuccess, searchParams);
        yield put(getProductNameBySearchKeywordSuccess(result));
    } catch (err) {
        yield put(getProductsError(err));
    }
}

function* getSearchProductFiltercall({ keyword }) {
    try {
        const searchParams = { filter: keyword };
        const result = yield call(ProductRepository.getSearchKeywords, searchParams);
        yield put(getSearchProductFilterSuccess(result));
    } catch (err) {
        yield put(getProductFilteredError(err));
    }
}

function* getSingleProductByIdSuccesscall({ _id }) {
    try {
        const searchParams = {_id };
        const result = yield call(ProductRepository.getSingleProductById, searchParams);
        yield put(getSingleProductByIdSuccess(result));
    } catch (err) {
        yield put(getSingleProductByIdError(err));
    }
}

function* getRelatedProducts({ payload }) {
    try {
        const relatedProduct = yield call(ProductRepository.getRelatedProducts, payload);
        yield put(getRelatedProductsSuccess([...relatedProduct]));;
    }
    catch (err) {

        yield put(getProductsError(err));
    }

}

function* postProductReviewForm({ payload }) {
    try {
        const response = yield call(ProductRepository.postProductReview, payload);
        console.log("sssresponse" , response);
        if(response.status){
            toast.success(response.message);

        }else{
            toast.error(response.message);

        }

        yield put(postProductReviewSuccess(response));
    }
    catch (err) {
        yield put(postProductReviewError(err));
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actionTypes.GET_PRODUCTS, getProducts)]);
    yield all([
        takeEvery(actionTypes.GET_TOTAL_OF_PRODUCTS, getTotalOfProducts),
    ]);
    yield all([takeEvery(actionTypes.GET_BRANDS, getBrands)]);
    yield all([
        takeEvery(actionTypes.GET_PRODUCT_CATEGORIES, getProductCategories),
    ]);
    yield all([
        takeEvery(actionTypes.GET_PRODUCTS_BY_CATEGORY, getProductByCategory),
    ]);
    yield all([
        takeEvery(
            actionTypes.GET_SEARCH_PRODUCT_FILTER,getSearchProductFiltercall),
    ]);
    yield all([
        takeEvery(
            actionTypes.GET_PRODUCTS_BY_PRICE_RANGE,
            getProductByPriceRange
        ),
    ]);
    yield all([
        takeEvery(actionTypes.GET_PRODUCTS_BY_BRAND, getProductByBrand),
    ]);
    yield all([takeEvery(actionTypes.GET_PRODUCTS_BY_KEYWORD, getProductByKeyword)]);
    yield all([takeEvery(actionTypes.GET_PRODUCT_NAME_BY_SEARCH_KEYWORD, getProductNameBySearchKeyword)]);
    yield all([takeEvery(actionTypes.GET_PRODUCT_BY_ID, getProductById)]);
    yield all([takeEvery(actionTypes.GET_RELATED_PRODUCTS, getRelatedProducts)]);
    yield all([takeEvery(actionTypes.POST_PRODUCT_REVIEW, postProductReviewForm)]);
    yield all([takeEvery(actionTypes.GET_PRODUCTS_BY_FILTER, getFilteredProducts)]);
    yield all([takeEvery(actionTypes.GETPRODUCT_BY_CATEGORY, getProductByCategoryCall)]);
    yield all([takeEvery(actionTypes.GETPRODUCT_BY_CATEGORY_FILTER, getProductByCategoryFilterCall)]);
    yield all([takeEvery(actionTypes.GET_PRODUCT_BY_SUBCATEGORY, getProductBySubCategoryCall)]);
    yield all([takeEvery(actionTypes.GET_SEARCH_KEYWORDS, getSearchKeywordsVendor)]);
    yield all([takeEvery(actionTypes.SEARCH_PRODUCTS_BY_KEYWORD, getSearchProductByKeywordCall)]);
    yield all([takeEvery(actionTypes.GET_SINGLE_PRODUCT_BY_ID,  getSingleProductByIdSuccesscall)]);
    yield all([takeEvery(actionTypes.GET_ONE_CATEGORY_BY_ID,  getOneCategoryCall)]);


}

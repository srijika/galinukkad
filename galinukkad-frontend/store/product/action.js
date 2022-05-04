export const actionTypes = {
    GET_PRODUCTS: 'GET_PRODUCTS',
    GET_PRODUCTS_SUCCESS: 'GET_PRODUCTS_SUCCESS',
    GET_PRODUCTS_ERROR: 'GET_PRODUCTS_ERROR',

    GET_PRODUCTS_BY_CATEGORY: 'GET_PRODUCTS_BY_CATEGORY',
    GET_PRODUCTS_BY_PRICE_RANGE: 'GET_PRODUCTS_BY_PRICE_RANGE',
    GET_PRODUCTS_BY_BRAND: 'GET_PRODUCTS_BY_BRAND',
    GET_PRODUCTS_BY_KEYWORD: 'GET_PRODUCTS_BY_KEYWORD',
    GET_PRODUCTS_BY_KEYWORD_SUCCESS: 'GET_PRODUCTS_BY_KEYWORD_SUCCESS',

    GET_PRODUCT_NAME_BY_SEARCH_KEYWORD: 'GET_PRODUCT_NAME_BY_SEARCH_KEYWORD',
    GET_PRODUCT_NAME_BY_SEARCH_KEYWORD_SUCCESS: 'GET_PRODUCT_NAME_BY_SEARCH_KEYWORD_SUCCESS',

    SEARCH_PRODUCTS_BY_KEYWORD: 'SEARCH_PRODUCTS_BY_KEYWORD',
    SEARCH_PRODUCTS_BY_KEYWORD_SUCCESS: 'SEARCH_PRODUCTS_BY_KEYWORD_SUCCESS',

    GETPRODUCT_BY_CATEGORY: 'GETPRODUCT_BY_CATEGORY',
    GETPRODUCT_BY_CATEGORY_SUCCESS: 'GETPRODUCT_BY_CATEGORY_SUCCESS',

    GETPRODUCT_BY_CATEGORY_FILTER: 'GETPRODUCT_BY_CATEGORY_FILTER',
    GETPRODUCT_BY_CATEGORY_FILTER_SUCCESS: 'GETPRODUCT_BY_CATEGORY_FILTER_SUCCESS',

    GET_PRODUCT_BY_SUBCATEGORY: 'GET_PRODUCT_BY_SUBCATEGORY',
    GET_PRODUCT_BY_SUBCATEGORY_SUCCESS: 'GET_PRODUCT_BY_SUBCATEGORY_SUCCESS',
    
    GET_ONE_CATEGORY_BY_ID: 'GET_ONE_CATEGORY_BY_ID',
    GET_ONE_CATEGORY_BY_ID_SUCCESS: 'GET_ONE_CATEGORY_BY_ID_SUCCESS',

    GET_PRODUCT_BY_ID: 'GET_PRODUCT_BY_ID',
    GET_PRODUCT_BY_ID_SUCCESS: 'GET_PRODUCT_BY_ID_SUCCESS',


    GET_TOTAL_OF_PRODUCTS: 'GET_TOTAL_OF_PRODUCTS',
    GET_TOTAL_OF_PRODUCTS_SUCCESS: 'GET_TOTAL_OF_PRODUCTS_SUCCESS',

    GET_BRANDS: 'GET_BRANDS',
    GET_BRANDS_SUCCESS: 'GET_BRANDS_SUCCESS',

    GET_PRODUCT_CATEGORIES: 'GET_PRODUCT_CATEGORIES',
    GET_PRODUCT_CATEGORIES_SUCCESS: 'GET_PRODUCT_CATEGORIES_SUCCESS',

    GET_SEARCH_KEYWORDS: 'GET_SEARCH_KEYWORDS',
    GET_SEARCH_KEYWORDS_SUCCESS: 'GET_SEARCH_KEYWORDS_SUCCESS',

    GET_SEARCH_PRODUCT_FILTER: 'GET_SEARCH_PRODUCT_FILTER',
    GET_SEARCH_PRODUCT_FILTER_SUCCESS: 'GET_SEARCH_PRODUCT_FILTER_SUCCESS',
    
    GET_SINGLE_PRODUCT_BY_ID: 'GET_SINGLE_PRODUCT_BY_ID',
    GET_SINGLE_PRODUCT_BY_ID_SUCCESS: 'GET_SINGLE_PRODUCT_BY_ID_SUCCESS',
    GET_SINGLE_PRODUCT_BY_ID_ERROR: 'GET_SINGLE_PRODUCT_BY_ID_ERROR',

    GET_RELATED_PRODUCTS: 'GET_RELATED_PRODUCTS',
    GET_RELATED_PRODUCTS_SUCCESS: 'GET_RELATED_PRODUCTS_SUCCESS',

    POST_PRODUCT_REVIEW: 'POST_PRODUCT_REVIEW',
    POST_PRODUCT_REVIEW_SUCCESS: 'POST_PRODUCT_SUCCESS',
    POST_PRODUCT_REVIEW_ERROR: 'POST_PRODUCT_ERROR',

    GET_PRODUCTS_BY_FILTER: 'GET_PRODUCTS_BY_FILTER',
    GET_PRODUCTS_BY_FILTER_SUCCESS: 'GET_PRODUCTS_BY_FILTER_SUCCESS',
    GET_PRODUCTS_BY_FILTER_ERROR: 'GET_PRODUCTS_BY_FILTER_ERROR'
};

export function getProductByCategories(payload){
    return { type: actionTypes.GETPRODUCT_BY_CATEGORY , payload };
}

export function getProductByCategorySuccess(data){
    return { type: actionTypes.GETPRODUCT_BY_CATEGORY_SUCCESS , data };
}

export function getProductByCategoriesFilter(payload){
    return { type: actionTypes.GETPRODUCT_BY_CATEGORY_FILTER , payload };
}

export function getProductByCategoryFilterSuccess(data){
    return { type: actionTypes.GETPRODUCT_BY_CATEGORY_FILTER_SUCCESS , data };
}

export function getProductBySubCategory(payload){
    return { type: actionTypes.GET_PRODUCT_BY_SUBCATEGORY , payload };
}

export function getProductBySubCategorySuccess(data){
    return { type: actionTypes.GET_PRODUCT_BY_SUBCATEGORY_SUCCESS , data };
}

export function searchProductByKeyword(payload){
    return { type: actionTypes.SEARCH_PRODUCTS_BY_KEYWORD, payload}
}

export function searchProductByKeywordSuccess(data){
    return { type: actionTypes.SEARCH_PRODUCTS_BY_KEYWORD_SUCCESS, data}
}

    export function getProductFiltered(payload) {
        return { type: actionTypes.GET_PRODUCTS_BY_FILTER , payload };
    }

    export function getProductFilteredSuccess(data) {
        return { type: actionTypes.GET_PRODUCTS_BY_FILTER_SUCCESS , data };
    }

    export function getProductFilteredError(error) {
        return { type: actionTypes.GET_PRODUCTS_BY_FILTER_ERROR , error };
    }

export function postProductReview(payload) {
    return { type: actionTypes.POST_PRODUCT_REVIEW, payload };
}

export function postProductReviewSuccess(data) {
    return { type: actionTypes.POST_PRODUCT_REVIEW_SUCCESS,  data };
}

export function postProductReviewError(error) {
    return { type: actionTypes.POST_PRODUCT_REVIEW_ERROR,  error };
}



export function getProducts(payload) {
    return { type: actionTypes.GET_PRODUCTS, payload };
}

export function getTotalProducts() {
    return { type: actionTypes.GET_TOTAL_OF_PRODUCTS };
}

export function getBrands() {
    return { type: actionTypes.GET_BRANDS };
}

export function getBrandsSuccess(payload) {
    return { type: actionTypes.GET_BRANDS_SUCCESS, payload };
}

export function getProductCategories() {
    return { type: actionTypes.GET_PRODUCT_CATEGORIES };
}

export function getProductCategoriesSuccess(payload) {
    return { type: actionTypes.GET_PRODUCT_CATEGORIES_SUCCESS, payload };
}

export function getSearchProductFilter() {
    return { type: actionTypes.GET_SEARCH_PRODUCT_FILTER };
}

export function getSearchProductFilterSuccess(payload) {
    return { type: actionTypes.GET_SEARCH_PRODUCT_FILTER_SUCCESS, payload };
}

export function getSingleProductById(_id) {
    return { type: actionTypes.GET_SINGLE_PRODUCT_BY_ID, _id };
}

export function getSingleProductByIdSuccess(payload) {
    return { type: actionTypes.GET_SINGLE_PRODUCT_BY_ID_SUCCESS, payload };
}

export function getSingleProductByIdError(payload) {
    return { type: actionTypes.GET_SINGLE_PRODUCT_BY_ID_ERROR, payload };
}

export function getOneCategory(_id) {
    return { type: actionTypes.GET_ONE_CATEGORY_BY_ID, _id };
}

export function getOneCategoryByIdSuccess(payload) {
    return { type: actionTypes.GET_ONE_CATEGORY_BY_ID_SUCCESS, payload };
}

export function getSearchKeywordsVendor(payload) {
    return { type: actionTypes.GET_SEARCH_KEYWORDS, payload };
}

export function getSearchKeywordsVendorSuccess(data) {
    return { type: actionTypes.GET_SEARCH_KEYWORDS_SUCCESS, data };
}

export function getTotalProductsSuccess(payload) {
    return {
        type: actionTypes.GET_TOTAL_OF_PRODUCTS_SUCCESS,
        payload,
    };
}

export function getProductsSuccess(data) {
    return {
        type: actionTypes.GET_PRODUCTS_SUCCESS,
        data,
    };
}
export function getProductByKeywordsSuccess(payload) {
    return {
        type: actionTypes.GET_PRODUCTS_BY_KEYWORD_SUCCESS,
        payload,
    };
}
export function getProductNameBySearchKeywordSuccess(payload) {
    return {
        type: actionTypes.GET_PRODUCT_NAME_BY_SEARCH_KEYWORD_SUCCESS,
        payload,
    };
}
export function getSingleProductsSuccess(data) {
    return {
        type: actionTypes.GET_PRODUCT_BY_ID_SUCCESS,
        data,
    };
}

export function getRelatedProductsSuccess(data) {
    return {
        type: actionTypes.GET_RELATED_PRODUCTS_SUCCESS,
        data,
    };
}

export function getProductsError(error) {
    return {
        type: actionTypes.GET_PRODUCTS_ERROR,
        error,
    };
}

export function getProductsByCategory(category) {
    return {
        type: actionTypes.GET_PRODUCTS_BY_CATEGORY,
        category,
    };
}

export function getProductsByBrand(payload) {
    return {
        type: actionTypes.GET_PRODUCTS_BY_BRAND,
        payload,
    };
}

export function getProductsByKeyword(keyword) {
    return {
        type: actionTypes.GET_PRODUCTS_BY_KEYWORD,
        keyword,
    };
}

export function getProductNameBySearchKeyword(keyword) {
    return {
        type: actionTypes.GET_PRODUCT_NAME_BY_SEARCH_KEYWORD,
        keyword,
    };
}

export function getProductsById(id) {
    return {
        type: actionTypes.GET_PRODUCT_BY_ID,
        id,
    };
}

export function getProductsByPrice(payload) {
    return {
        type: actionTypes.GET_PRODUCTS_BY_PRICE_RANGE,
        payload,
    };
}

export function getRelatedProducts(payload) {
    return {
        type: actionTypes.GET_RELATED_PRODUCTS,
        payload,
    };
}


import { actionTypes } from './action';
import { notification } from 'antd'
export const initialState = {
    allProducts: null,
    singleProduct: null,
    error: false,
    totalProducts: 0,
    categories: null,
    brands: [],
    productsLoading: true,
    productLoading: true,
    searchResults: null,
    vendors: null
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                ...{ allProducts: action.data, productsLoading: false },
            };
        case actionTypes.GET_TOTAL_OF_PRODUCTS_SUCCESS:
            return {
                ...state,
                ...{ totalProducts: action.payload },
            };
        case actionTypes.GET_BRANDS_SUCCESS:
            return {
                ...state,
                ...{ brands: action.payload },
            };
        case actionTypes.GET_PRODUCT_CATEGORIES_SUCCESS:
            return {
                ...state,
                ...{ categories: action.payload },
            };
        case actionTypes. GET_SEARCH_KEYWORDS_SUCCESS:
            return {
                ...state,
                // searchResults: [...action.payload.products ] ,
                productsDatas: action.data.status?[...action.data.products].map((data) => {return {...data}}):[],
            };    
        case actionTypes.GET_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                singleProduct: {...action.data} ,
                ...{ reviewSubmitResult: {} },
                ...{ reviewSubmitResultError :{ } },
                productLoading: false
            };
        case actionTypes.GET_PRODUCTS_BY_KEYWORD_SUCCESS:
        return {
                ...state,
                productsDatas: action.payload.products?[...action.payload.products].map((data) => {return {...data}}):[],
                productsDataFilter: action.payload.status?[...action.payload.filter].map((data) => {return {...data}}):[],
                productsDataCount: action.payload.count
                // searchResults: [...action.payload.products ] ,
                // productsDataFilter: action.payload.status?[...action.payload.filter].map((data) => {return {...data}}):[],
            };
        case actionTypes.GET_PRODUCT_NAME_BY_SEARCH_KEYWORD_SUCCESS:
        return {
                ...state,
                searchResults: [...action.payload.products ] ,
            };
        case actionTypes.POST_PRODUCT_REVIEW_SUCCESS:
            return {
                ...state,
                ...{ reviewSubmitResult: {...action.data} },
            };
        case actionTypes.POST_PRODUCT_REVIEW_ERROR:
            return {
                ...state,
                ...{ reviewSubmitResultError :{ ...action.error} },
            };
        case actionTypes.GET_PRODUCTS_ERROR:
            return {
                ...state,
                ...{ error: {...action.error} },
            };
        case  actionTypes.GET_RELATED_PRODUCTS_SUCCESS:
            return {
                ...state,
                relatedProducts: [...action.data].map((data) => {return {...data}}) 
            };
        case actionTypes.GET_PRODUCTS_BY_FILTER_SUCCESS:
        return {
                ...state,
                filteredProducts: action.data.status?[...action.data.data].map((data) => {return {...data}}):[],
                filteredProductsCount: action.data.totalcount
            };
        case actionTypes.GETPRODUCT_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                productsDatas: action.data.status?[...action.data.data].map((data) => {return {...data}}):[],
                productsDataCount: action.data.count
            };
        case actionTypes.GETPRODUCT_BY_CATEGORY_FILTER_SUCCESS:
            return {
                ...state,
                productsDatas: action.data.status?[...action.data.data].map((data) => {return {...data}}):[],
                productsDataFilter: action.data.status?[...action.data.Filter].map((data) => {return {...data}}):[],
                productsDataCount: action.data.count
            };
        case actionTypes.GET_PRODUCT_BY_SUBCATEGORY_SUCCESS:
            return {
                ...state,
                productsDatas: action.data.status?[...action.data.data].map((data) => {return {...data}}):[],
                productsDataFilter: action.data.status?[...action.data.Filter].map((data) => {return {...data}}):[],
                productsDataCount: action.data.count
            };    
        case actionTypes.SEARCH_PRODUCTS_BY_KEYWORD_SUCCESS:
            return {
                ...state,
                searchFilterResults: action.data.status?[...action.data.products].map((data) => {return {...data}}):[],
                productsDataFilter: action.data.status?[...action.data.filter].map((data) => {return {...data}}):[],
                searchFilterResultsCount: action.data.totalcount
            };
        case actionTypes.GET_SEARCH_PRODUCT_FILTER_SUCCESS:
            return {
                ...state,
                searchProductFilterResults: action.data.status?[...action.data.products].map((data) => {return {...data}}):[],
                searchProductFilterResultsCount: action.data.totalcount
            };
        case actionTypes.GET_SINGLE_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                getSingleProductByIdResults: action.data.status?[...action.data.products].map((data) => {return {...data}}):[],
                getSingleProductByIdResultsCount: action.data.totalcount
            };
        case actionTypes.GET_SINGLE_PRODUCT_BY_ID_ERROR:
            notification.error({message:'Something goes wrong'});
            return {
                ...state
            };
        case actionTypes.GET_PRODUCTS_BY_FILTER_ERROR:
            notification.error({message:'Something goes wrong'});
            return {
                ...state
            };
        default:
            return state;
    }
}

export default reducer;

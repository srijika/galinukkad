import Repository, { baseUrl, serializeQuery } from './Repository';
import axios from 'axios';
class ProductRepository {
    constructor(callback) {
        this.callback = callback;
    }


    async postProductReview(data) {
        const reponse = await Repository.post(`${baseUrl}/review/product`, data)
            .then((response) => {
                return response.data;
            })
            .catch(error => ({ error: error }));
        return reponse;
    }

    async getSearchKeywords(data) {
        const reponse = await Repository.post(`${baseUrl}/getSearchKeywords`, data)
            .then((response) => {
                return response.data;
            })
            .catch(error => ({ error: error }));
        return reponse;
    }
    async getProductNameBySearchKeywordSuccess(data) {
        const reponse = await Repository.post(`${baseUrl}/product-name-by-search-keyword`, data)
// console.log("data" ,data)
            .then((response) => {
        console.log("response" ,response)

                return response.data;
            })
            .catch(error => ({ error: error }));
        return reponse;
    }
    async getRecords(params) {
        const reponse = await Repository.get(
            `${baseUrl}/products?${serializeQuery(params)}`
        )
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getBrands() {
        const reponse = await Repository.get(`${baseUrl}/brands`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    getFilteredProducts = async (payload) => {
        const paramsKeys = Object.keys(payload);
        const paramsResult = paramsKeys.reduce((prevPram,currentParamKey,index) => {
            const saprator = index  !== paramsKeys.length - 1 ? '&':'';
            return prevPram+currentParamKey+"="+payload[currentParamKey]+saprator;
        },'');
        const resultString =  paramsResult.length == 0?'':'?'+paramsResult;
        const reponse = await Repository.get(`${baseUrl}/products-filters${resultString}`)
        .then(response => {
            return response.data;
        })
        .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    getProductsByCategoryCall = async (payload) => {

        const reponse = await Repository.post(`${baseUrl}/product-by-category`, { category_slug: payload })

            .then(response => {

                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    getProductsByCategoryFilterCall = async (payload) => {
        const reponse = await Repository.post(`${baseUrl}/product-by-category`, { category_slug: payload })
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    getProductsBySubCategoryCall = async (payload) => {

let {query , id} = payload;

        const reponse = await Repository.post(`${baseUrl}/product-by-subcategory`, { subcategory_slug: query ,id  })
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    getSearchProductByKeyword = async (payload) => {
        const reponse = await Repository.post(`${baseUrl}/search-product`, { filter: payload })
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getProductCategories() {
        const reponse = await Repository.get(`${baseUrl}/product-categories`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getOneCategory(payload) {
        const reponse = await Repository.post(`${baseUrl}/getcat`, {_id: payload})
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getTotalRecords() {
        const reponse = await Repository.get(`${baseUrl}/products/count`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getProductsById(payload) {
        let user_id = localStorage.getItem('LoginId')
        
        const reponse = await Repository.post(`${baseUrl}/product-detail`, { id: payload , user_id  })
            .then((response) => {
                const productDetails = 'status' in response.data && response.data.status == false ? null : response.data.check;
                if (!productDetails) {
                    throw "error";
                }
                return productDetails;
            })
            .catch(error => ({ error: error }));

        return reponse;
    }

    async getSingleProductById(payload) {
        const reponse = await Repository.post(`${baseUrl}/get-products`, { _id: payload })
            .then((response) => {
                const getPrduct = 'status' in response.data && response.data.status == false ? null : response.data.check;
                if (!getPrduct) {
                    throw "error";
                }
                return getPrduct;
            })
            .catch(error => ({ error: error }));

        return reponse;
    }

    async getRelatedProducts(payload) {
        let config = {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhYWEiLCJpYXQiOjE2MDczMzgwMTV9.i4DAfymZ_YQtHDOJsAeGwHxHT6IxzHzQtfkidDHNp6I'
            }
        };
        const reponse = await Repository.post(`${baseUrl}/related-products`, { id: payload }, config)
            .then(response => {
                return response.data.result;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getProductsByCategory(payload) {
        const reponse = await Repository.get(
            `${baseUrl}/product-categories?slug=${payload}`
        )
            .then(response => {
                return response.data[0].products;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getProductsByBrands(payload) {
        let query = '';
        payload.forEach(item => {
            if (query === '') {
                query = `id_in=${item}`;
            } else {
                query = query + `&id_in=${item}`;
            }
        });
        const reponse = await Repository.get(`${baseUrl}/brands?${query}`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async getProductsByPriceRange(payload) {
        const reponse = await Repository.get(
            `${baseUrl}/products?${serializeQuery(payload)}`
        )
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
}

export default new ProductRepository();

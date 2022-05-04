import Repository, { baseUrl, serializeQuery } from './Repository';
// import axios from 'axios';
import Router from 'next/router';
class WhishlistRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async addToWishlist(productIds) {
            const data = {productIds};
            
            const reponse = await Repository.post(`${baseUrl}/add-to-wishlist`,data)
            .then((response) => {
                return response.data.status;
                })
                .catch(res => {
                    return {error: res }
                });
            return reponse;
    }

    async getWishlist() {
        const reponse = await Repository.get(`${baseUrl}/wish/list`)
        .then((response) => {
            return response.data.arr[0].product;
            })
            .catch(res => {
                return {error: res }
            });
        return reponse;
    }
    
    async removeFromWishlist(productIds) {
        const data = {productIds};
        const reponse = await Repository.post(`${baseUrl}/remove-from-wishlist`,data)
        .then((response) => {
            return response.data.state;
            })
            .catch(res => {
                return {error: res }
            });
        return reponse;
    }

}

export default new WhishlistRepository();

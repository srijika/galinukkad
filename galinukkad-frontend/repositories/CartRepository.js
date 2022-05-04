import Repository, { baseUrl, serializeQuery } from './Repository';
import axios from 'axios';
class CartRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async addToCart(product) {
        const cartData = {
            "productIds":[ {
                "product_id": product.id ?product.id:product._id,
                "quantity": product.quantity?product.quantity:1,
                "variants": product.variants?product.variants:[]
            }
            ],
            "quantity":product.quantity ? product.quantity:1
        };

        console.log('djkfghdfkjgdkfhjgh');
        const reponse = await Repository.post(`${baseUrl}/add-to-cart`,cartData)
        .then((response) => {
            
             return response.data
        }).catch(error => ({error: error }));
    
        return reponse;
    }
   
    async removeFromCart(id) {
        const cartData = {
            "_id": id
        };
        const reponse = await Repository.post(`${baseUrl}/remove-from-cart`,cartData)
      .then((response) => {
             return response.data.status
            })
            .catch(error => ({error: error }));
        return reponse;
    }

}

export default new CartRepository();

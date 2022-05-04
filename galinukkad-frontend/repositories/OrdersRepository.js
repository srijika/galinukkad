import Repository, { baseUrl, serializeQuery } from './Repository';
import axios from 'axios';
class OrderRepository {
    constructor(callback) {
        this.callback = callback;
    }

    

     async getOrders() {
        const reponse = await Repository.post(`${baseUrl}/list/order`,{})
        .then((response) => {
                const orders =  'status' in response.data && response.data.status == false?null:response.data.result;
                if(!orders) {
                    throw  "error";
                }
                return orders;
            })
            .catch(error => ({error: error }));
       
        return reponse;
    }

    async getMyOrders() {
        const reponse = await Repository.post(`${baseUrl}/get/customer/order`,{})
        .then((response) => {
                const orders =  'status' in response.data && response.data.status == false?[]:response.data.data;
                console.log("orders" ,response.data.data,response)
                if(!orders) {
                    throw  "error"; 
                }
                return orders;
            })
            .catch(error => ({error: error }));
       
        return reponse;
    }

     async getOrderDetail(data) {
        const reponse = await Repository.post(`${baseUrl}/order/detail`,data)
        .then((response) => {
                const orders =  'status' in response.data && response.data.status == false?null:response.data.data;
                if(!orders) {
                    throw  "error";
                }
                return orders;
            })
            .catch(error => ({error: error }));
       
        return reponse;
    }

    async createOrderAddress(data){
        console.log("add" , data)
        const reponse = await Repository.post(`${baseUrl}/address`,data)
        .then((response) => {
                const orders =  'status' in response.data && response.data.status == false?null:response.data.result;
                if(!orders) {
                    throw  "error";
                }
                return orders;
            })
            .catch(error => ({error: error }));
       
        return reponse;
    }


}

export default new OrderRepository();

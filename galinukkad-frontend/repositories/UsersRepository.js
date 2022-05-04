import Repository, { baseUrl, serializeQuery, auth_prefix } from './Repository';
import Router from 'next/router';


class UsersRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async userAcInfo(id) {
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
		const reponse = await Repository.post(`${baseUrl}/getprofile`,{profile_id:id})
            .then(response => {
           

                return response.data;

            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async updateAcInfo(params) {
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/updateprofile`, params)
            .then(response => {
          
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async addressDetail() {
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/getaddresses`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async createAcAddress(params) {

      
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/createaddress`, params)
            .then(response => {
                window.scrollTo(0, 0)
                Router.push('/account/addresses');
                console.log("status")
   
                return response.data;
                
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    async updateAcAddress(params) {
        console.log(params)
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/updateaddress`, params)
            .then(response => {
                window.scrollTo(0, 0)
                Router.push('/account/addresses');
                console.log("status")
   
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    async delAddress(params) {
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/deleteaddress`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

}

export default new UsersRepository();
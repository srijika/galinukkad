import Repository, { baseUrl, serializeQuery } from './Repository';

class AuthRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async LoginUser(params) {
		console.log('authregister',params)
        const reponse = await Repository.post(`${baseUrl}/login`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async RegisterUser(params) {
		console.log('authregister',params)
        const reponse = await Repository.post(`${baseUrl}/signup`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

}

export default new AuthRepository();

import Repository, { baseUrl, serializeQuery, auth_prefix } from './Repository';

class UsersRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async userAcInfo() {
		//console.log('getprofile')
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
		const reponse = await Repository.post(`${baseUrl}/getprofile`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async updateAcInfo(params) {
		//console.log('authregister',params)
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/updateprofile`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async addressDetail() {
		console.log('addressDetail')
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/getaddresses`)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async createAcAddress(params) {
		//console.log('authregister',params)
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/createaddress`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    async updateAcAddress(params) {
		//console.log('authregister',params)
		Repository.defaults.headers.common['Authorization'] = auth_prefix + window.localStorage.accessToken;
        const reponse = await Repository.post(`${baseUrl}/updateaddress`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    async delAddress(params) {
		//console.log('authregister',params)
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
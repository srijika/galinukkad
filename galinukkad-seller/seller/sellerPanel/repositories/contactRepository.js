import Repository, { baseUrl, serializeQuery } from './Repository';

class CotactRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async submitForm(params) {
        const reponse = await Repository.post(`${baseUrl}/contact`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
}

export default new CotactRepository();

import axios from 'axios';
 
let baseDomain = 'https://apis.galinukkad.com';
if (typeof window !== 'undefined') {
    if(window.location.hostname === "localhost") {
         baseDomain = 'http://localhost:8080';
    }
}

export const auth_prefix = 'BO '; 

const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken')?('Bearer '+localStorage.getItem('accessToken')):'';
    } else {
       return ''
    }
}


export const customHeaders = {
	'Content-Type': 'application/json',
};

export const baseUrl = `${baseDomain}`;
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const appAxios = axios.create({
    baseUrl,
    headers: customHeaders,
});

appAxios.interceptors.request.use(
    (config) => {
        const token = getAccessToken();     
        if(token) {
            config.headers.Authorization =  token;
        }
        return config;
    },
    (err) => {
      return Promise.reject(err);
    }
);

export default appAxios;


export const serializeQuery = query => {
	
    return Object.keys(query)
        .map(
            key =>
                `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        )
        .join('&');
};

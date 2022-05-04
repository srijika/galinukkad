//import fetch from 'dva/fetch';
// import {message} from 'antd';
function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  const newOptions = {  ...options }; //...defaultOptions,
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=utf-8',        
        'authorization': window.localStorage.getItem('token'),
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        //'Accept': 'application/json, text/plain, */*',
        //'Content-Type': 'application/json',
        'authorization': window.localStorage.getItem('token'),
		    "type": "formData",
        ...newOptions.headers,
      };
      newOptions.body = newOptions.body;
    }
  }
  else{
    newOptions.headers = {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
		'authorization': window.localStorage.getItem('token'),
      ...newOptions.headers,
    };
  }

  return fetch('https://16e48ab71777.ngrok.io'+url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if (newOptions.method === 'DELETE' || data.status === 204) {
        return data.text();
      }
	  if(data.code === 401)
	  {
		  localStorage.removeItem('token');
		  window.location = window.location.origin;
		  this.props.history.push('/login');
	  }
      return data;
    }
  )
    .catch(err => {
		  return {status:0,message:"Unauthorised User."};
	});
}
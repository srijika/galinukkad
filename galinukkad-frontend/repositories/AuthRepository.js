import Repository, { baseUrl, serializeQuery } from './Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
class AuthRepository {
    constructor(callback) {
        this.callback = callback;
    }

    async LoginUser(params) {
        const reponse = await Repository.post(`${baseUrl}/login`, params)
            .then(response => {

            if(response.data.status === false || response.data.status === 'false'){
                // toast.error(response.data.message);
                return response.data;
            }

                let userId = response.data?.user?._id;
                localStorage.setItem("LoginId", userId);

                let logData = {
                 email : response.data?.user?.email,
                 mobile_number :  response.data?.user?.mobile
                }
               
                localStorage.setItem("LoginData", JSON.stringify(logData));

                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    
    async SocialLogin(params) {
        console.log('params' ,params)

        const reponse = await Repository.post(`${baseUrl}/social/login`, params)
        console.log('params' ,params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
  
    async VarifyUser(params) {
   
        const reponse = await Repository.post(`${baseUrl}/verify/otp`, params)
            .then(response => {
                if(response.data.status){
            

                    let userId = response.data.userId;
                    localStorage.setItem("LoginId", userId);
                }
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
	
    async RegisterUser(params) {
        const reponse = await Repository.post(`${baseUrl}/signup`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async VarifyAccount(params) {
        
	    const reponse = await Repository.post(`${baseUrl}/verify/otp`, params)
            .then(response => {
                return response.data;
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }

    async ActiveUser(params) {
        let _id  = localStorage.getItem('LoginId')
      let  data = {
            _id : _id
        }

        const reponse = await Repository.post(`${baseUrl}/user-active`, data
 )
            .then(response => {
                console.log(response)
            })
            .catch(error => ({ error: JSON.stringify(error) }));
        return reponse;
    }
    

}



export default new AuthRepository();

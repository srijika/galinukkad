import React ,{useEffect, useState}from 'react';
import OtpInput from 'react-otp-input';
import { Button , notification} from 'antd';
import{connect} from 'react-redux';
import { varifyOtp } from '../../../store/auth/action';
import  Repository from '../../../repositories/Repository';
import Router from 'next/router';
import axios from 'axios';
import { ToastContainer, toast, Flip } from 'react-toastify';




const OtpVarification = ({ phoneNo, dispatch , auth }) => {
    const [state , setState] = useState({ otp: '' });
      // Timer 
 
      const [counter, setCounter] = React.useState(29);
      React.useEffect(() => {
        const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
      }, [counter]);

      React.useEffect(() => {setCounter(29)} , [])

          const resendOTP = async () =>{
        setCounter(29)
        let val = {email:phoneNo};
        const response = await axios.post(`/send-otp-to-user`, val);
        if (response.data.status) {
            // notification.success({ message: response.data.message });
            toast.success(response.data.message);
        } else {
            // notification.error({ message: response.data.message });
            toast.error(response.data.message);
        }




    }

    const  handleBackBtn = () => {
        Router.push('/account/login');
    }

    
    const varify = () => {
        
        const otp  = state.otp;
        if(validateEmail(phoneNo)){
            dispatch(varifyOtp({ otp:otp , email:phoneNo } ));
        }else{
            dispatch(varifyOtp({ otp:otp , mobile_number:phoneNo } ));
        }
    }

    const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    const handleChange = otp => setState({ otp });

    return (
        <div>
            <p style={{ textAlign: 'center', fontSize: '2rem', color: '#000' }}>
                Please enter the OTP sent to<br />
                <span style={{ color: '#096dd9' }}>{phoneNo}</span>
            </p>

            <div className="app-otp-input">
                <OtpInput
                    inputStyle={{
                        width: '5rem',
                        height: '5rem',
                        margin: '20px 1rem',
                        fontSize: '3rem',
                        borderRadius: 4,
                        border: '2px solid rgba(0,0,0,0.3)',
                    }}
                    numInputs={4}
                    separator={<span>-</span>}
                    onChange={handleChange}
                />

            </div>
            <div className="d-flex justify-content-center">
            <div style={{ textAlign: "center" }}><Button style={{
                padding: '1rem 4rem',
                textAlign: 'center',
                marginRight: "55px" ,
                height: "auto"
            }} type="primary" onClick={varify} >Verify Otp</Button></div>



<div style={{ textAlign: "center" }}>
{counter == 0 ? <Button style={{
                padding: '1rem ',
                textAlign: 'center',
                color:"#fcb800", 
                height: "auto" ,
                border : "none"
            }} type="default" onClick={resendOTP} >Resend </Button>
 : 
 
 <span style={{
                padding: '1rem ',
                textAlign: 'center',
                color:"#060400", 
                height: "auto" ,
                border : "none" ,
              display: "flex" ,
                fontSize: '22x'
            }} >Resend Otp In {counter}</span>}

 

            </div>
            </div>

        </div>
        
    );
};
const mapStateToProps = state => {
    return {auth:state.auth};
};
export default connect(mapStateToProps)(OtpVarification);

// import React from 'react';
// import OtpInput from 'react-otp-input';
// import { Button , notification} from 'antd';
// import {useState} from 'react';
// import{connect} from 'react-redux';
// import { varifyOtp } from '../../../store/auth/action';
// import  Repository from '../../../repositories/Repository';


// const OtpVarification = ({ phoneNo, dispatch , auth }) => {
//     const [state , setState] = useState({ otp: '' });

//     const  resendOTP = async() =>{
//         alert(phoneNo)
//         let val = phoneNo
//         await Repository.post('send-otp-to-user', val).then((response) => {
//             if (response.data.status) {
//                 notification.success({message: response.data.message});
//             }else{
//                 notification.error({ message: response.data.message });
//             }
//         }).catch((err) => {
//             notification.error({ message: 'OTP Send Failed ' });
//         });
//     }

    
//     const varify = () => {
        
//         const otp  = state.otp;
//         if(validateEmail(phoneNo)){
//             dispatch(varifyOtp({ otp:otp , email:phoneNo } ));
//         }else{
//             dispatch(varifyOtp({ otp:otp , mobile_number:phoneNo } ));
//         }
//     }

//     const validateEmail = (email) => {
//         var re = /\S+@\S+\.\S+/;
//         return re.test(email);
//     }
//     const handleChange = otp => setState({ otp });

//     return (
//         <div>
//             <p style={{ textAlign: 'center', fontSize: '2rem', color: '#000' }}>
//                 Please enter the OTP sent to<br />
//                 <span style={{ color: '#096dd9' }}>{phoneNo}</span>
//             </p>

//             <div className="app-otp-input">
//                 <OtpInput
//                     inputStyle={{
//                         width: '5rem',
//                         height: '5rem', 
//                         margin: '20px 1rem',
//                         fontSize: '3rem',
//                         borderRadius: 4,
//                         border: '2px solid rgba(0,0,0,0.3)',
//                     }}
//                     numInputs={4}
//                     separator={<span>-</span>}
//                     onChange={handleChange}
//                 />

//             </div>
//             <div className="d-flex justify-content-center">
//             <div style={{ textAlign: "center" }}>
//             <Button style={{
//                 padding: '1rem 4rem',
//                 textAlign: 'center',
//                 height: "auto",
//                 marginRight: '55px'
//             }} type="primary" onClick={varify} >Verify Otp</Button></div>

// <div style={{ textAlign: "center" }}>
//             <Button style={{
//                 padding: '1rem ',
//                 textAlign: 'center',
//                 height: "auto" ,
               
//             }} type="link" onClick={resendOTP} >Resend</Button></div>

// </div>
            
//         </div>
        
//     );
// };
// const mapStateToProps = state => {
//     return {auth:state.auth};
// };
// export default connect(mapStateToProps)(OtpVarification);


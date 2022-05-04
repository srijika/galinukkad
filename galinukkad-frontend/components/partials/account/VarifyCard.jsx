import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { login , sendOtp , socialLogin , varifyAccount} from '../../../store/auth/action';
import OtpInput from 'react-otp-input';
import { Modal } from 'antd';
import { Form, Input, Button, notification } from 'antd';
import { connect } from 'react-redux';
import OtpVarification from './OtpVarification';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import './css/Login.scss';
import  Repository from '../../../repositories/Repository';

class VarifyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            otp:''
        };
    }
    
    static getDerivedStateFromProps(props) {
        if (props.isLoggedIn === true && props.login.status === true) {
            if(Router.query && Router.query.redirect) {
                Router.push(Router.query.redirect);
            } else {
                 Router.push('/');
            }
        }
        return false;
    }

    handleChange = otp => this.setState({ otp });
    
    varify = async () => {
            let val = {};
            if(this.validateEmail(this.state.email)){
                val = { email: this.state.email, otp: this.state.otp };
            }else{
                val = { mobile_number: this.state.email, otp: this.state.otp };
            }
            await Repository.post('verify/otp', val).then((response) => {
                if (response.data.status) {
                    let val = localStorage.getItem("LoginCred");
                    this.props.dispatch(login(val)); 
                }else{
                    notification.error({ message: response.data.message });
                }
            }).catch((err) => {
                notification.error({ message: 'Account Verification Failed' });
            });
    }
    
    componentDidMount() {
        this.setState({ email:localStorage.getItem("user_email") });
    }

    componentDidUpdate() {
        const { accountVarified, accountVarifiedData} = this.props;
        if(accountVarified && accountVarifiedData && accountVarifiedData.status == true) {
            notification.success({message:accountVarifiedData.message , duration: 10000});
            Router.push('/account/login');
        }      
    }
    
    validateEmail = (email) =>{
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    resendOTP = async () =>{
        let val = {email : this.state.email};
        await Repository.post('send-otp-to-user', val).then((response) => {
            if (response.data.status) {
                notification.success({message: response.data.message});
            }else{
                notification.error({ message: response.data.message });
            }
        }).catch((err) => {
            notification.error({ message: 'OTP Send Failed  Failed' });
        });
    }

    handleBackBtn = () => {
        Router.push('/account/login');
    }

    render() {
        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form className="ps-form--account">
                        
                        <div className="ps-tab active" id="sign-in">
                            <div className="ps-form__content">
                                <h5
                                style={{
                                    margin:"0 0 25px",
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    textAlign: "center"
                                }}
                                >A OTP ( One Time Password ) has been sent to <span style={{ color: '#096dd9' }}>{this.state.email}</span>
                                Please enter the OTP in the field below to verify. </h5>
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
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>

                            <div style={{ textAlign: "center", paddingBottom:"20px" }}>
                                    <Button style={{
                                            padding: '1rem 4rem',
                                            textAlign: 'center',
                                            height: "auto"
                                        }} type="primary" onClick={this.varify} >Verify OTP</Button>
                                        <br/>

                                    <div style={{width:'100%', paddingBottom:"20px"}}>
                                            <div style={{width:'50%', float:'left', textAlign:'center'}}>
                                                <Button type="link" style={{color:"#fcb800"}} onClick={()=> this.handleBackBtn() }>Back</Button>
                                            </div>
                                            <div style={{width:'50%', float:'left', textAlign:'center'}}>
                                                <Button type="link" style={{color:"#fcb800"}} onClick={()=> this.resendOTP() }>Resend OTP</Button>
                                            </div>
                                        </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return state.auth;
};
export default connect(mapStateToProps)(VarifyCard);

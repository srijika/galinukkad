import React, { Component } from 'react';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import Router from 'next/router';
import { Form, Button, notification, Input } from 'antd';
import { connect } from 'react-redux';
import  Repository from '../../../repositories/Repository';

class EmailVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            otp:'' ,
            mobile : '' ,
            minutes: 1,
            seconds: 0,
        };
    }

    varify = async () => {
        let data =this.state;
        await Repository.post('verify/otp', data).then((response) => {
            if (response.data.status) {
                notification.success({message: "verify account Successfully!"});
                Router.push('/account/login');
            }else{
                notification.error({ message: response.data.message });
            }
        }).catch((err) => {
            notification.error({ message: 'Account Verification Failed' });
        });
    }

    handleChange = otp => this.setState({ otp });

    componentDidMount(){
        this.setState({ email:localStorage.getItem("user_email") });
        this.setState({ mobile:localStorage.getItem("mobile_number") });
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 60
                    }))
                }
            } 
        }, 1000)

    }

    resendOTP = async () =>{
        this.setState({ minutes:1 });

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
        Router.push('/account/register');
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }


    render() {
        const { minutes, seconds } = this.state
        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form className="ps-form--account">
                        <div className="ps-tab active" id="register">
                            <div className="ps-form__content">
                                <p style={{ textAlign: 'center', fontSize: '2rem', color: '#000' }}>
                                    A OTP ( One Time Password ) has been sent to emails <span style={{ color: '#096dd9' }}>{this.state.email}. </span> 
                                    Please enter the OTP in the field below to verify. 

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
                                        onChange={this.handleChange}
                                    />
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
                                            { minutes === 0 && seconds === 0
                    ?  <Button type="link" style={{color:"#fcb800"}} onClick={()=> this.resendOTP() }>Resend OTP! </Button>
                  :
                  <span style={{
                padding: '1rem ',
                textAlign: 'center',
                color:"#060400", 
                height: "auto" ,
                border : "none" ,
              display: "flex" ,
                fontSize: '24x'
            }} >Resend Otp In  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                }
                                               
                                            </div>
                                        </div>

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
export default connect(mapStateToProps)(EmailVerify);

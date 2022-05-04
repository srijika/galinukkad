import React, { Component } from 'react';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import Router from 'next/router';
import { Form, Button,Divider, notification, Input } from 'antd';
import { UserOutlined , EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { connect } from 'react-redux';
import  Repository from '../../../repositories/Repository';

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            showPasswordSvg : false,
        };
    }

   

     componentDidMount(){
        this.setState({ email: localStorage.getItem("user_email") });
    }
    
    onFinish = async (values) =>{
        let email = this.state.email;
        if(this.validateEmail(email)){
            let val = { username: email, password: values.password, otpchk: values.otp };
			await Repository.post('/resetPassword', val).then((response) => {
                if (response.data.status) {
                    notification.success({ message: response.data.message || response.data.msg || "Password Successfully Changed... Login again!" });
                    Router.push('/account/login');
                }else{
                    notification.error({ message: response.data.message || response.data.msg || "Something Went to wrong...Please Try Again!"});
                }
            }).catch((err) => {
                notification.error({ message: 'Account Verification Failed' });
            });		
        }
    }

    handelPassword = () => {
        this.setState({showPasswordSvg: !this.state.showPasswordSvg});
       
    }
    validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    handleBackBtn = () =>{
        Router.push('/account/login');
    }

    render() {
        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form className="ps-form--account" onFinish={this.onFinish }>
                        <div className="ps-tab active" id="register">
                            <div className="ps-form__content">
                                <div className="app-otp-input">
                                    <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                    Reset Password
                                    </div>
                                <Divider />
                                    <div className="form-group">
                                        <Form.Item name="password" rules={[ 
                                                { 	
                                                    required: true, 
                                                    message: 'Please input your Password!', 
                                                },
                                                {
                                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                    message: 'Minimum eight characters, at least one letter, one number and one special character:'
                                                }
                                            ]} >
                                            <Input className="form-control" 
                                             type={this.state.showPasswordSvg ? 'text': 'password'} 
                                            placeholder="New Password" 
                                            suffix = {this.state.showPasswordSvg ? <EyeTwoTone onClick={ this.handelPassword } /> : <EyeInvisibleOutlined onClick={ this.handelPassword } /> }
                                            
                                            />
                                        </Form.Item>
                                    </div>
                                   
                                    <div className="form-group">
                                        <p style={{textAlign:"center", fontSize:"16px", margin:"0"}}>Enter OTP</p>
                                        <Form.Item name="otp" rules={[{ required: true, message: 'Please input your Otp!', },]} >
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
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="form-group submit" style={{ textAlign: "center" }}>
                                            <Button type="primary" htmlType="submit" className="login-form-button"> Save </Button>
                                    </div>
                                    <div className="col-md-12" style={{ width: '100%' }}>
                                        <div className="row">
                                            <div className="col-md-6" style={{ textAlign: 'center' }}> 
                                                <Button type="link" onClick={()=> this.handleBackBtn()}>Back</Button>
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
export default connect(mapStateToProps)(Reset);

import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { register, clearRegister } from '../../../store/auth/action';

import { Form, Input, notification, Space } from 'antd';
import { UserOutlined , EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import  Repository from '../../../repositories/Repository';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count:0,
            showPassword : false,
        }; 
    }
    handelPassword = () => {
        this.setState({showPassword: !this.state.showPassword});
       
    }
    handleSubmit = async (val) => {		
        localStorage.setItem("user_email", val.email);
          localStorage.setItem("mobile_number", val.mobile_number);
		val.roleType = 'CUSTOMER';

        await Repository.post('/signup', val).then((response) => {
            if (response.data.status) {
                notification.success({message: "Success New Account Created! Verification email sent please check your email and login to verify.!"});
                Router.push('/account/emailverify');
            }else{
                if(response.data.message == "This Email is already registered" || response.data.msg == "This Email is already registered") {
                    notification.success({message: "Your email is already register in galinukkad so login with your email & password..!"});
                    Router.push('/account/login');
                }else if(response.data.message == "This Mobile No is already registered" || response.data.msg == "This Mobile No is already registered"){
                    notification.success({message: "Your mobile number is already register in galinukkad so login with your mobile number & password..!"});
                    Router.push('/account/login');
                } else {
                    notification['warning']({message: 'Error', description: response.data.msg || response.data.message || response.data.err })
                }
            }
        }).catch((err) => {
            notification.error({ message: 'Account Verification Failed' });
        });
    };
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.register.status === true && this.props.register.count > this.state.count) {
			this.setState({count:this.props.register.count})
            return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            Router.push('/account/login');
        }
    }
	
	componentWillUnmount(){
		this.props.dispatch(clearRegister({}));
	}

    render() {
        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form className="ps-form--account" onFinish={this.handleSubmit}>
                        <ul className="ps-tab-list">
                            <li>
                                <Link href="/account/login"><a>Login</a></Link>
                            </li>
                            <span className="login_divider">|</span>
                            <li className="active">
                                <Link href="/account/register">
                                    <a>Register</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="ps-tab active" id="register">
                            <div className="ps-form__content">
                                <h5>Register An Account</h5>
                                <div className="form-group">
                                    <Form.Item name="username" rules={[ { required: true, message: 'Field required!', },{
                                            pattern: /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
                    
                                            message: 'letters and digits, with hyphens, underscores and spaces as internal separator', 
                                        },
                                        { max: 25, message: 'Username must not be greater than 25 characters.' },
                                         ]}>
                                        <Input className="form-control" type="text" placeholder="Username"  />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <Form.Item name="email" rules={[ { required: true, message: 'Field required!', },{ type: 'email', message: 'The input is not valid E-mail!',} ]}>
                                        <Input className="form-control" type="email" placeholder="Email address" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <Form.Item name="mobile_number" rules={[ { required: true, message: 'Field required!', },{
                                            pattern: /^[0-9]+$/,
                                            message: 'Need to enter number'
                                        },
                                        { 
                                            len: 10, 
                                            message: 'Phone number should be 10 digits long.' 
                                        }, ]}>
                                        <Input className="form-control" type="tel" placeholder="Mobile Number" />
                                    </Form.Item>
                                </div>
                                <div className="form-group form-forgot">
                                    <Form.Item
                                        name="password" 
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your password!',
                                            },
                                            {
                                                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                message: 'Minimum eight characters, at least one letter, one number and one special character:'
                                            }
                                        ]}>
                                          
                                        <Input
                                            className="form-control"
                                            type={this.state.showPassword ? 'text': 'password'}
                                            placeholder="Password..."
                                            suffix = {this.state.showPassword ? <EyeTwoTone onClick={ this.handelPassword } /> : <EyeInvisibleOutlined onClick={ this.handelPassword } /> }
                                        />
                                       
                                    </Form.Item>
                                </div>
                                <div className="form-group submit">
                                    <button type="submit" className="ps-btn ps-btn-mobile ps-btn--fullwidth">
                                        Register
                                    </button>
                                </div>
                            </div>
							<p>&nbsp;</p>
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
export default connect(mapStateToProps)(Register);

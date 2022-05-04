import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { register, clearRegister } from '../../../store/auth/action';

import { Form, Input } from 'antd';
import { connect } from 'react-redux';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {count:0};
    }

    handleSubmit = val => {		
		val.roleType = 'CUSTOMER';
		console.log('register',this.props, val)
		this.props.dispatch(register(val));
		//Router.push('/account/login');
    };
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log(this.props)
		if (this.props.register.status === true && this.props.register.count> this.state.count) {
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
                                    <Form.Item name="username" rules={[ { required: true, message: 'Field required!', }, ]}>
                                        <Input className="form-control" type="text" placeholder="Username" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <Form.Item name="email" rules={[ { required: true, message: 'Field required!', }, ]}>
                                        <Input className="form-control" type="email" placeholder="Email address" />
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
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="password"
                                            placeholder="Password..."
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group submit">
                                    <button type="submit" className="ps-btn ps-btn--fullwidth">
                                        Register
                                    </button>
                                </div>
                            </div>
							<p>&nbsp;</p>
                            {/*<div className="ps-form__footer">
                                <p>Connect with:</p>
                                <ul className="ps-list--social">
                                    <li onClick={e=>console.log('123')}>
                                        <a className="facebook" href="#">
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="google" href="#">
                                            <i className="fa fa-google-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="twitter" href="#">
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="instagram" href="#">
                                            <i className="fa fa-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>*/}
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
	//console.log(state)
    return state.auth;
};
export default connect(mapStateToProps)(Register);

// import React, { Component } from 'react';
// import Link from 'next/link';
// import Router from 'next/router';
// import { login , sendOtp , socialLogin , checkUserActive} from '../../../store/auth/action';
// import { Modal } from 'antd';
// import { Form, Input,Button, notification } from 'antd';
// import { UserOutlined , EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import { ToastContainer, toast , Flip } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
// import { connect } from 'react-redux';
// import OtpVarification from './OtpVarification';
// import FacebookLogin from 'react-facebook-login';
// import GoogleLogin from 'react-google-login';
// import './css/Login.scss';
// import  Repository from '../../../repositories/Repository';

// class Login extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             form:null,
//             phoneNo:null,
//             openVarificationModel:false,
//             showPassword:false,
//             openFPModal:false,
//             showPasswordSvg : false,
//         };
//         this.form = null;
//     }

//     static getDerivedStateFromProps(props) {
//         if (props.isLoggedIn === true) {
//             if(Router.query && Router.query.redirect) {
//                 Router.push(Router.query.redirect);
//             } else {
//                  Router.push('/');
//             }
//         }if(props.data && props.data.status === false){
//             console.log('My message-',props.data.message);
//         }

//         return false;
//     }

//     handelPassword = () => {
//         this.setState({showPasswordSvg: !this.state.showPasswordSvg});

//     }

//     responseGoogle = (response) => {
//         const googleId = response.googleId;
//         const profile = response.profileObj;
//         // return ;
//         if(profile != undefined) {
//             const data = {
//                 "type": "google",
//                 "socialid": googleId,
//                 "email": profile.email,
//                 "username": profile.name,
//                 "profile_link": profile.imageUrl,
//                 "firbaseToken" : localStorage.getItem('firebase-Token'),
//                 "ip_address": ""
//             };

//             this.props.dispatch(socialLogin(data)); 
//         }
//     }

//     responseFacebook = (response) => {
//         const profile = response;
//         const accessToken = response.accessToken;
//         const data = {
//             "username":profile.name,
//             "email":profile.email,
//             "password":"",
//             "socialid":profile.id,
//             "type_login":"facebook",
//             "profile_link":profile.picture.data.url ? profile.picture.data.url : '' ,
//             "firbaseToken" : localStorage.getItem('firebase-Token'),
//             "name":profile.name,
//             "accessToken":accessToken,
//         };

//         this.props.dispatch(socialLogin(data)); 
//     }

//     handleFeatureWillUpdate(e) {
//         e.preventDefault();
//         notification.open({
//             message: 'Opp! Something went wrong.',
//             description: 'This feature has been updated later!',
//             duration: 500,
//         });
//     }


//     handleLoginSubmit = async (val) => {
//         if(val.password) {
//             val.isOtp = '0';
//             val.firbaseToken = localStorage.getItem('firebase-Token')
//             localStorage.setItem("LoginCred", JSON.stringify(val));
//             this.props.dispatch(login(val));
//         // let _id  = localStorage.getItem('LoginId')
//         // this.props.dispatch(checkUserActive(_id));

//         } else {
//             this.setState({showPassword:true});
//         }
//     }

//     handleOtp = async () => {
//         this.form.validateFields(['username']);
//         const username = this.form.getFieldValue('username');
//         if(username) {
//             let val = {};
//             if(this.validateEmail(username)){
//                 val = { email:username };
//             }else{
//                 val = { mobile_number:username };
//             }
//             await Repository.post('/send-otp-to-user', val).then((response) => {
//                 if (response.data.status) {
//                  //   notification.success({ message: response.data.message });
//                     toast.success( response.data.message );
//                     this.setState({openVarificationModel:true,phoneNo:username});
//                 }else{
//                    // notification.error({ message: response.data.message });
//                     toast.error( response.data.message );
//                 }
//             }).catch((err) => {
//                // notification.error({ message: 'Send OTP Failed' });
//                 toast.error('Send OTP Failed' );
//             }); 
//         }
//     }

//     validateEmail = (email) =>{
//         var re = /\S+@\S+\.\S+/;
//         return re.test(email);
//     }
//     handleHideVarificationModel = () => {
//         this.setState({openVarificationModel:false});
//     }

//     setFPVisible = () =>{
//         this.setState({openFPModal:true});
//     }

//     onRCFinish = async (val) => {
//         await Repository.post('/forgetpassword', val).then((response) => {
//             if (response.data.status) {
//                 localStorage.setItem("user_email", val.username);


//                 Router.push('/account/reset');
//             }else{
//                // notification.error({ message: response.data.message });
//                 toast.error( response.data.message );
//             }
//         }).catch((err) => {
//             //notification.error({ message: 'Email Verification Failed' });
//             toast.error('Email Verification Failed' );
//         });		
//     }

//     render() {
//         return (
//             <div className="ps-my-account">
//                 <div className="container">
//                     <Form
//                         ref={(ref) => this.form = ref}
//                         className="ps-form--account"
//                         onFinish={this.handleLoginSubmit.bind(this)}>
//                         <ul className="ps-tab-list">
//                             <li className="active">
//                                 <Link href="/account/login">
//                                     <a>Login</a>
//                                 </Link>
//                             </li>
//                             <span className="login_divider">|</span>
//                             <li>
//                                 <Link href="/account/register">
//                                     <a>Register</a>
//                                 </Link>
//                             </li>
//                         </ul>
//                         <div className="ps-tab active" id="sign-in">
//                             <div className="ps-form__content">
//                                 <h5>Log In Your Account</h5>
//                                 <div className="form-group">
//                                     <Form.Item
//                                         name="username"
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 pattern:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^[0-9]{10,10}$/,
//                                                 message: 'Please input your email / phone no.',
//                                             },
//                                         ]}>
//                                         <Input
//                                             className="form-control"
//                                             type="text"
//                                             placeholder="Please input your email / phone no."
//                                         />
//                                     </Form.Item>
//                                 </div>
//                                 {this.state.showPassword?
//                                     <div className="form-group form-forgot">
//                                         <Form.Item
//                                             name="password"
//                                             rules={[
//                                                 {
//                                                     required: true,
//                                                     message:
//                                                         'Please input your password!',
//                                                 },
//                                             ]}>
//                                             <Input
//                                                 className="form-control"
//                                                 type={this.state.showPasswordSvg ? 'text': 'password'}
//                                                 placeholder="Password..."
//                                                 suffix = {this.state.showPasswordSvg ? <EyeTwoTone onClick={ this.handelPassword } /> : <EyeInvisibleOutlined onClick={ this.handelPassword } /> }
//                                             />
//                                         </Form.Item>
//                                     </div>
//                                 :null}
//                                 <div className="submit">
//                                     <button type="submit" className="ps-btn ps-btn-mobile ps-btn--fullwidth">
//                                         Login
//                                     </button>
//                                 </div>
//                                 <br/>
//                                 <div className="submit" style={{textAlign:"center"}}>
//                                     <a className="login-form-forgot"  onClick={()=> this.setFPVisible() } >
//                                        <span>Forgot password</span> 
//                                     </a>
//                                 </div>
//                                 <h3 className="app-login-or-text gray-2" >OR</h3>
//                                 <div className="submit">
//                                     <button
//                                         onClick={this.handleOtp}
//                                         type="button"
//                                         className="ps-btn ps-btn--fullwidth app-login-otp-btn">
//                                             <span className="req_otp">Request OTP</span>
//                                     </button>
//                                 </div>
//                                 <div className="app-social-buttons" >
//                                 <GoogleLogin
//                                     // clientId="424844518575-nu5qv8e9hkvt5si44vmpigjgr0hub6it.apps.googleusercontent.com" //SANDIP ID NOT CREATED YET
//                                     clientId="393241437733-7ipi0r4e01auf33hid6i6tjngelddeh7.apps.googleusercontent.com" //Sunil Malakar OAuth ID
//                                     buttonText="LOGIN WITH GOOGLE"
//                                     onSuccess={this.responseGoogle}
//                                     onFailure={this.responseGoogle}
//                                 />

//                                 <FacebookLogin
//                                     // appId="416815282966680" //SANDIP ID NOT CREATED YET
//                                     appId="954602112120346" // Galinukkad FASCEBOOK ID
//                                     fields="name,email,picture"
//                                     callback={this.responseFacebook}
//                                 />
//                                 </div>

//                             </div>

//                         </div>
//                     </Form>


//                     <Modal
//                         title="Verify Otp"
//                         centered
//                         footer={null}
//                         width={1024}
//                         onCancel={this.handleHideVarificationModel}
//                         visible={this.state.openVarificationModel}>
//                         <OtpVarification phoneNo={this.state.phoneNo}>
//                         </OtpVarification>
//                     </Modal>

//                      <Modal className="login_block" visible={this.state.openFPModal} title="Recover Password" okText="Recover" onCancel={()=> this.setState({openFPModal:false})}  footer={null} width={300}>
//                         <Form name="normal_login" layout="vertical" className="login_form" initialValues={{ remember: true, }} onFinish={(val) => this.onRCFinish(val)} >
//                         <Form.Item name="username" rules={[ 
//                                 { 
//                                     required: true,
//                                     message: 'Please input your Email!'
//                                 },
//                                 {
//                                     type: 'email',
//                                     message: 'The input is not valid Email!',
//                                 }, 
//                             ]} >
//                             <Input placeholder="Email" />
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" className="login-form-button">Recover Password</Button>
//                         </Form.Item>
//                         </Form>
//                     </Modal>                       

//                 </div>
//             </div>
//         );
//     }
// }
// const mapStateToProps = state => {
//     return state.auth;
// };
// export default connect(mapStateToProps)(Login);
import React, { Component, Profiler } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { login, sendOtp, socialLogin, checkUserActive } from '../../../store/auth/action';
import { Modal } from 'antd';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { connect } from 'react-redux';
import OtpVarification from './OtpVarification';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import './css/Login.scss';
import Repository from '../../../repositories/Repository';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: null,
            phoneNo: null,
            openVarificationModel: false,
            showPassword: false,
            openFPModal: false,
            showPasswordSvg: false,
        };
        this.form = null;
    }

    static getDerivedStateFromProps(props) {
        if (props.isLoggedIn === true) {
            if (Router.query && Router.query.redirect) {
                Router.push(Router.query.redirect);
            } else {
                Router.push('/');
            }
        } if (props.data && props.data.status === false) {
            console.log('My message-', props.data.message);
        }

        return false;
    }

    handelPassword = () => {
        this.setState({ showPasswordSvg: !this.state.showPasswordSvg });

    }

    responseGoogle = (response) => {
        const googleId = response.googleId;
        const profile = response.profileObj;
        // return ;
        if (profile != undefined) {
            const data = {
                "type": "google",
                "socialid": googleId,
                "email": profile.email,
                "username": profile.name,
                "profile_link": profile.imageUrl,
                "firbaseToken": localStorage.getItem('firebase-Token'),
                "ip_address": ""
            };

            this.props.dispatch(socialLogin(data));
        }
    }

    responseFacebook = (response) => {
      
        const profile = response;

 

        const accessToken = response.accessToken;
        const data = {
            "username": profile.name,
            "email": profile.email,
            "password": "",
            "socialid": profile.id,
            "type_login": "facebook",
            "profile_link": profile.picture.data.url ? profile.picture.data.url : '',
            "firbaseToken": localStorage.getItem('firebase-Token'),
            "name": profile.name,
            "accessToken": accessToken,
            // "dob": Profile.dob,
            "gender": profile.gender ,
            profile : profile
        };

        this.props.dispatch(socialLogin(data));
    }

    handleFeatureWillUpdate(e) {
        e.preventDefault();
        notification.open({
            message: 'Opp! Something went wrong.',
            description: 'This feature has been updated later!',
            duration: 500,
        });
    }


    handleLoginSubmit = async (val) => {
        if (val.password) {
            val.isOtp = '0';
            val.firbaseToken = localStorage.getItem('firebase-Token')
            localStorage.setItem("LoginCred", JSON.stringify(val));
            this.props.dispatch(login(val));
            let _id = localStorage.getItem('LoginId')
            // this.props.dispatch(checkUserActive(_id));

        } else {
            this.setState({ showPassword: true });
        }
    }

    handleOtp = async () => {
        this.form.validateFields(['username']);
        const username = this.form.getFieldValue('username');
        if (username) {
            let val = {};
            if (this.validateEmail(username)) {
                val = { email: username };
            } else {
                val = { mobile_number: username };
            }
            await Repository.post('/send-otp-to-user', val).then((response) => {
                if (response.data.status) {
                    // notification.success({ message: response.data.message });
                    toast.success(response.data.message);
                    this.setState({ openVarificationModel: true, phoneNo: username });
                } else {
                    // notification.error({ message: response.data.message });
                    toast.error(response.data.message);
                }
            }).catch((err) => {
                // notification.error({ message: 'Send OTP Failed' });
                toast.error('Send OTP Failed');
            });
        }
    }

    validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    handleHideVarificationModel = () => {
        this.setState({ openVarificationModel: false });
    }

    setFPVisible = () => {
        this.setState({ openFPModal: true });
    }

    onRCFinish = async (val) => {
        await Repository.post('/forgetpassword', val).then((response) => {
            if (response.data.status) {
                localStorage.setItem("user_email", val.username);


                Router.push('/account/reset');
            } else {
                // notification.error({ message: response.data.message });
                toast.error(response.data.message);
            }
        }).catch((err) => {
            //notification.error({ message: 'Email Verification Failed' });
            toast.error('Email Verification Failed');
        });
    }

    render() {
        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form
                        ref={(ref) => this.form = ref}
                        className="ps-form--account"
                        onFinish={this.handleLoginSubmit.bind(this)}>
                        <ul className="ps-tab-list">
                            <li className="active">
                                <Link href="/account/login">
                                    <a>Login</a>
                                </Link>
                            </li>
                            <span className="login_divider">|</span>
                            <li>
                                <Link href="/account/register">
                                    <a>Register</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="ps-tab active" id="sign-in">
                            <div className="ps-form__content">
                                <h5>Login Your Account</h5>
                                <div className="form-group">
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^[0-9]{10,10}$/,
                                                message: 'Please input your email / phone no.',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Please input your email / phone no."
                                        />
                                    </Form.Item>
                                </div>
                                {this.state.showPassword ?
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
                                                type={this.state.showPasswordSvg ? 'text' : 'password'}
                                                placeholder="Password..."
                                                suffix={this.state.showPasswordSvg ? <EyeTwoTone onClick={this.handelPassword} /> : <EyeInvisibleOutlined onClick={this.handelPassword} />}
                                            />
                                        </Form.Item>
                                    </div>
                                    : null}
                                <div className="submit">
                                    <button type="submit" className="ps-btn ps-btn-mobile ps-btn--fullwidth">
                                        Login
                                    </button>
                                </div>
                                <br />
                                <div className="submit" style={{ textAlign: "center" }}>
                                    <a className="login-form-forgot" style={{ fontSize: "16px" }} onClick={() => this.setFPVisible()} >
                                        <span>Forgot password</span>
                                    </a>
                                </div>
                                <h3 className="app-login-or-text gray-2" >OR</h3>
                                <div className="submit">
                                    <button
                                        onClick={this.handleOtp}
                                        type="button"
                                        className="ps-btn ps-btn--fullwidth app-login-otp-btn">
                                        <span className="req_otp">Request OTP</span>
                                    </button>
                                </div>
                                <div className="app-social-buttons" >
                                    <GoogleLogin
                                        // clientId="424844518575-nu5qv8e9hkvt5si44vmpigjgr0hub6it.apps.googleusercontent.com" //SANDIP ID NOT CREATED YET
                                        clientId="393241437733-7ipi0r4e01auf33hid6i6tjngelddeh7.apps.googleusercontent.com" //Sunil Malakar OAuth ID
                                        buttonText="LOGIN WITH GOOGLE "
                                        onSuccess={this.responseGoogle}
                                        onFailure={this.responseGoogle}
                                        className="google-btn"

                                    />

                                    <FacebookLogin
                                        // appId="416815282966680" //SANDIP ID NOT CREATED YET
                                        appId="954602112120346" // Galinukkad FASCEBOOK ID
                                        fields="name,email,picture"
                                        callback={this.responseFacebook}
                                        // onSuccess={this.responseFacebook}
                                  

                                    />
                                </div>

                            </div>

                        </div>
                    </Form>


                    <Modal
                        title="Verify Otp"
                        centered
                        footer={null}
                        width={1024}
                        onCancel={this.handleHideVarificationModel}
                        visible={this.state.openVarificationModel}>
                        <OtpVarification phoneNo={this.state.phoneNo}>
                        </OtpVarification>
                    </Modal>

                    <Modal 
                   
                    visible={this.state.openFPModal} 
                    title="Recover Password" 
                    okText="Recover" 
                    onCancel={() => this.setState({ openFPModal: false })} 
                    footer={null}
                     width={1024}>
                        <Form name="normal_login" layout="vertical" className="login_form" initialValues={{ remember: true, }} onFinish={(val) => this.onRCFinish(val)} >
                            <Form.Item name="username" rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!'
                                },
                                {
                                    type: 'email',
                                    message: 'The input is not valid Email!',
                                },
                            ]} >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item  style={{ textAlign: "center" }}>
                                <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="login-form-button"
                                style={{
                                    padding: '1rem 4rem',
                                    textAlign: 'center',
                                    height: "auto"
                                }} >Recover Password</Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return state.auth;
};
export default connect(mapStateToProps)(Login);

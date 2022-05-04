import React, { Component } from 'react';
// import Link from 'next/link';
import { Form, Input, Radio, DatePicker , Modal, Button} from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { getUserList, updateInfo, clearAction } from '../../../store/users/action';
// import { logOut } from '../../../store/auth/action';
import AccountMenuSidebar from './modules/AccountMenuSidebar'
import jwt from 'jwt-decode'
import Router from 'next/router';
// import { IgnorePlugin } from 'webpack';
import axios from 'axios'
const dateFormat = 'YYYY/MM/DD';
// import

class UserInformation extends Component {
    constructor(props) {
        super(props);
		this.state = {
            count:0, 
            dcount:0, 
            detail:{}, 
            phoneNumberVerify: "", 
            OtpVerifyModal: false, 
            otp: "", 
            userData: {}
        };
        this.formRef = React.createRef();
        this.isUpdateInfo = true;
    }
	
	componentDidMount(){
        let token = localStorage.getItem('accessToken');
        if(token === undefined || token === null ) {
            Router.push('/account/login');
        }else {
            const user = jwt(localStorage.getItem('accessToken'));
            this.getUserDetail(user._id);
            console.log(user)
        }
	}
	
	getUserDetail=(userId)=>{
		this.props.dispatch(getUserList(userId));
	}
	
	handleLoginSubmit= val=>{
		val.photo='img';
		val._id=this.state.detail._id;
		this.props.dispatch(updateInfo(val));
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
     	if (this.props.update.status === true && this.props.update.count> this.state.count) {
			this.setState({count:this.props.update.count})
            return true
        }
		if (this.props.info.status === true && this.props.info.count> this.state.dcount) {
			let data = this.props.info.data;
            if(data) {
                
                this.setState({detail:data, dcount:this.props.info.count})
                this.formRef.current.setFieldsValue({['name']:data.name, ['phone']:data.phone, ['email']:data.email, ['dob']:moment(data.dob, dateFormat), ['gender']:data.gender});
                return null
            }
            
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {info} = this.props;


        if(info && this.isUpdateInfo) {


            this.setState({ userData: info.userLogin })

            this.formRef.current.setFieldsValue({
                name:info.profile.name,
                phone: info.userLogin.mobile_number,
                email:info.userLogin.email,
                dob: moment(info.profile.dob, dateFormat),
                gender:info.profile.gender
            });
            this.isUpdateInfo = false;
        }         
    }
	
	componentWillUnmount(){
		this.props.dispatch(clearAction());
	}



    phoneNumberOtpVerify = async () => {


        let phone_number = "";


        if(this.state.phoneNumberVerify) {
            phone_number = this.state.phoneNumberVerify;
        }else {
            phone_number = this.state.userData.mobile_number;
        }


        if(['', null, undefined].includes(phone_number)) {
            alert("Please enter your phone number");
            return ;
        }

        
        let email = this.props.info.userLogin.email;
        
        let data = {
            phone: phone_number, 
            email: email
        }
        
        const res = await axios.post('/send/otp/customer', data)
        if(res.data.status === false) {
            alert(res.data.message);
            return ;
        }

        this.setState({ OtpVerifyModal: true })
    }

    handleSubmitOtp = async () => {


        let phone_number;
        if(this.state.phoneNumberVerify) {
            phone_number = this.state.phoneNumberVerify;
        }else {
            phone_number = this.state.userData.mobile_number;
        }

        let email = this.props.info.userLogin.email;
        let mobile_otp  = this.state.otp;

        let data = {
            phone: phone_number, 
            email: email, 
            mobile_otp: mobile_otp
        }

        const res = await axios.post('/verify/otp/customer', data)

        if(res.data.status === true) {
            this.setState({ OtpVerifyModal: false })
            window.location.reload();
        }else {
            this.setState({ OtpVerifyModal: true })
            alert(res.data.message);

        }


    }


    render() {
		const {info} = this.props;
        const {userData} = this.state;
        const accountLinks = [
            {
                text: 'Account Information',
                url: '/account/user-information',
                icon: 'icon-user',
                active: true,
            },
            {
                text: 'Notifications',
                url: '/account/notifications',
                icon: 'icon-alarm-ringing',
            },
            // {
            //     text: 'Inbox',
            //     url: '/account/user-inbox',
            //     icon: 'icon-user',
            //     active: false
            // },
            {
                text: 'orders',
                url: '/account/orders',
                icon: 'icon-papers',
                active: false,
            },
            {
                text: 'My Coupons',
                url: '/account/my-coupons',
                icon: 'icon-papers',
                active: false,
            },
            {
                text: 'Address',
                url: '/account/addresses',
                icon: 'icon-map-marker',
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
                icon: 'icon-store',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
                icon: 'icon-heart',
            },
            {
                text: 'Support',
                url: '/account/support',
                icon: 'icon-papers',
                active: false
            }
        ];
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ps-page__left">
								<AccountMenuSidebar data={accountLinks} />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="ps-page__content">
                                <Form ref={this.formRef} className="ps-form--account-setting" layout="vertical" onFinish={this.handleLoginSubmit}>
                                    <div className="ps-form__header">
                                        <h3>Account Information </h3>
                                    </div>
                                    <div className="ps-form__content">
                                        <div className="form-group">
                                            <Form.Item label="Name" name="name" rules={[ { required: true, message: 'This field required!' },{ max: 25, message: 'Name must not be greater than 25 characters.' } ]}>
                                                <Input className="form-control" type="text" placeholder="Username" />
                                            </Form.Item>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">

                                                    {
                                                        
                                                        [undefined, "", null].includes(userData.mobile_number) || userData.isMobileVerified === false ? 
                                                        <>
                                                        <Form.Item label="Phone Number" name="phone">
                                                            <Input className="form-control" type="text" placeholder="Enter your phone number" onChange={(e) => {
                                                                this.setState({phoneNumberVerify: e.target.value})
                                                            }} />
                                                        </Form.Item>
                                                        <button type="button" className="btn btn-success btn-lg" onClick={this.phoneNumberOtpVerify}> Verify Phone </button>
                                                        </>
                                                        : 

                                                        <Form.Item label="Phone Number" name="phone"
                                                            rules={[ { required: true, message: 'This field required!', }, ]}>
                                                        <Input disabled className="form-control" type="text" placeholder="Enter your phone number"/>
                                                        </Form.Item>
                                                    }
                                                    
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <Form.Item label="Email" name="email"
                                                        rules={[ { required: true, message: 'This field required!', }, ]}>
                                                        <Input disabled className="form-control" type="text" placeholder="Username or email address" />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
													<Form.Item label="Birthday" name="dob"
                                                        rules={[ { required: true, message: 'This field required!', }, ]}>
                                                        <DatePicker 
                                                        disabledDate={(current) => {
              let customDate = moment().format("YYYY-MM-DD");
              return current && current > moment(customDate, "YYYY-MM-DD");
            }} 
                                                        style={{height:50}}/>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <Form.Item label="Gender" name="gender" 
														rules={[{ required: true, message:'This field required!', },
                                                        ]}>
                                                        <Radio.Group>
                                                            <Radio value="Male">Male</Radio>
                                                            <Radio value="Female">Female</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group submit">
                                            <button className="ps-btn ps-btn-mobile">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>





                <Modal
                visible={this.state.OtpVerifyModal} title="OTP Verify" onOk={this.handleOk} onCancel={() => { this.setState({ OtpVerifyModal: false }) }}
                footer={[ <Button key="back" onClick={ () => { this.setState({ OtpVerifyModal: false }) }} > Cancel </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSubmitOtp}> Verify OTP </Button>
                ]}
                >
                    <div className="form-group">
                        <Form.Item label="otp" name="otp" 
                            rules={[{ required: true, message:'This field required!', },
                            ]}>
                            <Input  className="form-control" type="text" placeholder="Please enter your otp" onChange={(e) => { this.setState({ otp: e.target.value }) }} />
                        </Form.Item>
                    </div>

                </Modal>

            </section>
        );
    }
}
const mapStateToProps = state => {
    return state.users;
};
export default connect(mapStateToProps)(UserInformation);
import React, {useState, Component, useEffect } from 'react';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import moment from 'moment';
import {Row, Col, Form, Input, Button,DatePicker, Card, Radio, Modal , notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_ApiUrl;

const dateFormat = 'MM/DD/YYYY';

const Account = props => {
	const [count, setCount] = useState(0)
	const [dcount, setDcount] = useState(0);
	const [ispostal, sePostal] = useState(true)

	
	const [userId, setUserId] = useState('')
	const [detailData, setDetailData] = useState({})
	
	const role = useState(localStorage.getItem('role'))
	const { dispatch } = props;
	const [form] = Form.useForm();
	const [myMobileNoOTP, setMyMobileNoOTP] = useState('');

	const [modalVisible, setModalVisible] = useState(false);
	let user_data = JSON.parse(localStorage.getItem('user'));
	const [myMobileNo, setMyMobileNo] = useState('');
	const [isMobileVerify, setIsMobileVerified] = useState(false);
	const [modalVerifyVisible, setModalVerifyVisible] = useState(false);

	const openModalForVerify = () => {
		let val = { mobile_number:myMobileNo };
		dispatch({ type: 'setting/resendOTPTOUser', payload: val, });
		setModalVerifyVisible(true);
	}





	useEffect(() => {
		let mobile_verified = localStorage.getItem('isMobileVerified');
		if(mobile_verified == 'false' || mobile_verified == false) {
			setIsMobileVerified(false);
		}else {
			setIsMobileVerified(true);
		}
	}, [])


	const handleCancel = () => {
		setModalVisible(false);
		setModalVerifyVisible(false);
	}

	const changeMobileOTP = (event) =>{
		setMyMobileNoOTP(event.target.value);
	}

	const addMobileVerify = async () => {

		let data = {
			otp : myMobileNoOTP, 
			mobile: myMobileNo,
		};
		
		const res = await axios.post(`${baseUrl}/is-mobile/verified`,  data);
		if(res.data.status === true) {
notification.success({message: res.data.message});


			
			localStorage.setItem('isMobileVerified', true);
			setModalVerifyVisible(false);
			setIsMobileVerified(true);
		}else {
notification.error({message: res.data.message});

			return; 
		}
		// console.log(res);	
	}


	useEffect(() => {
		let myMobileNo = user_data.mobile;
		setMyMobileNo(myMobileNo);

		let unmounted = false;
		setTimeout(()=>document.title = 'Setting', 100);
		dispatch({type: 'account/clearAction'});
		setUserId(localStorage.getItem('userId'))
		getDetail(localStorage.getItem('userId'))
		return () => {
			unmounted = true;
		}
    },[dispatch])

	const getDetail=(id)=> dispatch({ type: 'account/getDetail',  payload: { _id:id, profile_id: id },});
	
	useEffect(() => {

		let unmounted = false;
		console.log(props)
		let detail = props.account.detail;	
		if(!unmounted && detail.count > dcount && detail.status){
			setDcount(detail.count);
			let profile_data = props.account.detail ? props.account.detail.profile : {};
			let userLoginData = props.account.detail ? props.account.detail.userLogin : {};
			setDetailData(userLoginData);
			console.log('data isisis')
			console.log(props.account)
			form.setFieldsValue({
				['gender']: profile_data.gender,  ['name']: profile_data.name, ['email']: userLoginData.email, 
				['phone']: userLoginData.mobile_number,  
				// ['photo']: userLoginData.mobile_number, 
				['postal']: profile_data.postal, 
				['state']: profile_data.state, 
				['city']: profile_data.city, 
				['add1']: profile_data.add1, 
				['add2']: profile_data.add2, 
				['dob']: profile_data.dob && moment(new Date(profile_data.dob) || null, dateFormat)
			});
		}
		
		let edit = props.account.edit;		
		if(!unmounted && edit.count > count && edit.status){
			setCount(edit.count);
			getDetail(userId);
		}else if(!unmounted && edit.count > count && !edit.status){
			setCount(edit.count);
		}
		
		return () => {
			unmounted = true;
		}
    },[props.account])
	
	
	const verifyFormFun = val =>{
		getDetail(userId);
	}

	

	const onFinish = async val =>{
		const res = await axios.get(`https://api.postalpincode.in/pincode/${val.postal}`);
			console.log("res.data[0].Statusres.data[0].Status" ,res.data[0].Status)
			if(res.data[0].Status === "Error") {
				notification.error({message: "This pincode is not a available"});
				return;
			}else{
				sePostal(true)

			}
		if(!ispostal){
notification.error({message: "This pincode is not a available"});
return;
	}
		let date = val.dob;




		let values = {
			"name": val.name ,
			"email": val.email,
			"phone": val.phone,
			"gender": val.gender,
			"photo": detailData.photo || 'new image',
			"dob" : date, 
			"add1" : val.add1, 
			"add2" : val.add2, 
			"postal" : val.postal, 
			"state" : val.state, 
			"city" : val.city, 
		}


		dispatch({ type: 'account/editItem',  payload: values , history : props});
	}
	
	const handlePostal = async (e) =>{
		let value = e.target.value;

		form.setFieldsValue({
			city:'',
			state: '',
		});

		if(value.length === 6) {
			
			const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
			console.log(res.data[0].Status)
			if(res.data[0].Status === "Error") {
				sePostal(false)
			}else{
				sePostal(true)

			}



			if(res.data[0].PostOffice != null && res.data[0].PostOffice != undefined && res.data[0].PostOffice != "") {

				let pincode_data = res.data[0].PostOffice[0];
				form.setFieldsValue({
					city:pincode_data.District,
					state: pincode_data.State,
				});
			}else{
				form.setFieldsValue({
					city:'',
					state: '',
				});

			}
		}
	  }


  return (
	<div>
		<Apploader show={props.loading.global}/>
		<Card style={{ width: '100%' }} title="Account" bodyStyle={{padding:'20px 20px'}}>
			<Form name="normal_login" form={form} className="full-width-form" initialValues={{ remember: true, }} onFinish={onFinish} layout={'vertical'}>
				<Row gutter={16}>
					<Col  xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Name" rules={[ { required: true, message: 'Please input your Name!', },{ max: 25, message: 'Name must not be greater than 25 characters.' }, ]} >
						<Input placeholder="Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="email" label="Email" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Email" disabled/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						

							<Form.Item label="Phone">
								<Row gutter={12}>
									<Col xs={16} span={12}>
										<Form.Item name="phone" rules={[{ required: true, message: 'Field required!', },]}  >
											<Input disabled placeholder="Phone"  />
										</Form.Item>
									</Col>
									<Col  xs={8} span={12}>	
									{ (isMobileVerify === true) ? '' :
										<Button type="primary" className="btn-w25 mobile_verify_btn" onClick={openModalForVerify} >Verify</Button>
									} 
									</Col>
								</Row>
							</Form.Item>

					</Col>

					
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="dob" label="DOB" rules={[ { required: true, message: 'Field required!', }, ]} >
							<DatePicker format="YYYY-MM-DD"/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="gender" label="Gender"  rules={[ { required: true, message: 'Please select Gender!', }, ]}>
							<Radio.Group>
							  <Radio value="Male">Male</Radio>
							  <Radio value="Female">Female</Radio>
							  <Radio value="Other">Other</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>


					

				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="add1" label="Address 1" rules={[ { required: true, message: 'Field required!', },{ max: 50, message: 'This Field must not be greater than 50 characters.' }, ]} >
						<Input placeholder="Address 1" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="add2" label="Address 2" rules={[ { required: true, message: 'Field required!', },{ max: 50, message: 'This Field must not be greater than 50 characters.' }, ]} >
						<Input placeholder="Address 2" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="postal" label="Postal" onChange={(e) => { handlePostal(e) }} rules={[{	 required: true, message: 'Numeric Value Required' },{max : 6 , message: 'Postal Code must be 6 digits'}]} >
						<Input placeholder="Postal" type="number" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="state" label="State" rules={[ { required: true, message: 'Field required!', }, { max: 20, message: 'State must not be greater than 20 characters.' }, ]} >
						<Input placeholder="State" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="city" label="City" rules={[ { required: true, message: 'Field required!', }, { max: 20, message: 'City must not be greater than 20 characters.' }, ]} >
						<Input placeholder="City" />
						</Form.Item>
					</Col>

				</Row>
				
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
					
				</Form.Item>
				</Form>
			
        </Card>





{/* 
		<Card style={{ width: '100%' }} title="Address" bodyStyle={{padding:'20px 20px'}}>
			<Form name="normal_login" form={form} className="full-width-form" initialValues={{ remember: true, }} onFinish={onFinish} layout={'vertical'}>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Name" rules={[ { required: true, message: 'Please input your Name!', }, ]} >
						<Input placeholder="Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="email" label="Email" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Email" disabled/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
					
					</Col>

					
				
				</Row>
				
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
					
				</Form.Item>
				</Form>
			
        </Card> */}




		<Modal
			width={400}
			visible={modalVerifyVisible}
			title='Verify Your Mobile'
			footer={null}
			onCancel={handleCancel} >
				
				<div style={{ textAlign:'center',marginBottom: '1rem'}}>
              		A OTP ( One Time Password ) has been sent to <b>{ myMobileNo }</b> . Please enter the OTP in the field below to verify. 
				</div>
				<Form className="login-form" >
					<Form.Item name="otp" rules={[ { required: true, message: 'Please input your Otp!', }, ]} >
						<Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e) => changeMobileOTP(e)} placeholder="OTP Enter Here!" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" className="login-form-button" onClick={() => addMobileVerify()}> Verify </Button>
					</Form.Item>
				</Form>
		</Modal>


	</div>
  );
};

export default connect(({account, loading}) => ({
	account, loading
}))(Account);
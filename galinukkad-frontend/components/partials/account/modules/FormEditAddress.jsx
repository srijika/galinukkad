import React, { Component } from 'react';
import { Form, Input, Radio, DatePicker, Checkbox , Select } from 'antd';
import Router from 'next/router';
import { connect } from 'react-redux';
import {India} from '../../../../utilities/india';
import   '../../../../scss/developer/developer.css';
import axios from 'axios';



import { addressDetail, updateAddress, createAddress, clearAction } from '../../../../store/users/action';

class FormEditAddress extends Component {
	
	constructor(props) {
        super(props);
		this.state = {city : [] ,count:0, dcount:0, Ccount:0, detail:{} , name : ""  };
		this.formRef = React.createRef();		
    }
	
	componentDidMount(){
		
		if(Router.router.query.id !== undefined)
		{
			this.getAddressDetail();
		}
		else this.formRef.current.setFieldsValue({['isbilling']:false, ['isshipping']:false, ['isdefault']:false, });
	}


	  onStateChange = (e) =>{
		this.setState({india_state: e});
		var result = India.filter((val) => {
			return (val.state === e)
		  })
	let {districts} = result[0];

	this.setState({city : districts});

	  }



	  handlePostal = async (e) =>{
		let value = e.target.value;
		 


		if(value.length === 6) {
			const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`)

			if(res.data[0].PostOffice != null && res.data[0].PostOffice != undefined && res.data[0].PostOffice != "") {

				let pincode_data = res.data[0].PostOffice[0];
				console.log("state" ,pincode_data.State)
				console.log("District" ,pincode_data.District)

		this.formRef.current.setFieldsValue({['state']:pincode_data.State, ['city']:pincode_data.District, });

				
			}
		}
	  }
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		
		if (this.props.address.status === true && this.props.address.count > this.state.count) {
		
			if(Router.router.query.id !== undefined)
			{
				let index = this.props.address.data.findIndex(item=> item.id === Router.router.query.id)
				let data = this.props.address.data[index] || {};
	
				this.setState({count:this.props.address.count, detail:data});
				this.formRef.current.setFieldsValue({['add1']:data.add1, ['add2']:data.add2, ['companyname']:data.companyname, ['country']:data.country, ['email']:data.email, ['fname']:data.fname, ['lname']:data.lname, ['isbilling']:data.isbilling, ['isshipping']:data.isshipping, ['phone']:data.phone, ['postal']:data.postal, ['state']:data.state, ['city']:data.city, ['isdefault']:data.isdefault, });
			}
            return null
        }
		if (this.props.create.status === true && this.props.create.count > this.state.Ccount) {
			this.setState({Ccount:this.props.create.count})
			Router.push('/account/addresses');
			return null
        }
		if (this.props.addressUpdate.status === true && this.props.addressUpdate.count > this.state.dcount) {
			this.setState({dcount:this.props.addressUpdate.count})
			//Router.push('/account/addresses');
			return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
			this.getAddressDetail();

        }
    }
	
	getAddressDetail=()=>{
		this.props.dispatch(addressDetail());
	}


	
	handleLoginSubmit= val=>{
        val.country = "India"
	    
		if(Router.router.query.id !== undefined)
		{
			val._id= this.state.detail._id;
			this.props.dispatch(updateAddress(val));
		}
		else {
			this.props.dispatch(createAddress(val));
		}

		// let path = localStorage.getItem('edit_checkout_redirect_path');
		// if(![undefined, null, ''].includes(path)) {
		// 	Router.push(path);
		// 	localStorage.removeItem('edit_checkout_redirect_path');
		// }

	}
	
	GoBack=()=>{
		this.formRef.current.resetFields();
		Router.push('/account/addresses')
	}
	
	componentWillUnmount(){
		this.props.dispatch(clearAction());
	}
	
    render() {
        return (
			<Form ref={this.formRef} className="ps-form--account-setting ps-form--edit-address" layout="vertical" onFinish={this.handleLoginSubmit}>
                <div className="ps-form__header">
                    <h3>Billing address</h3>
                </div>
                <div className="ps-form__content">
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="First Name" name="fname" rules={[ { required: true, message: 'This field required!' },
							{
								pattern: /^[aA-zZ\s]+$/,
								message: 'Only alphabets are allowed for this field'
							}
							,{ max: 25, message: 'First Name must not be greater than 25 characters.' }
							,
							 ]}>
									<Input className="form-control" type="text" placeholder="First Name" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Last Name" name="lname" rules={[ { required: true, message: 'This field required!' },
							{
								pattern: /^[aA-zZ\s]+$/,
								message: 'Only alphabets are allowed for this field'
							}
							,{ max: 25, message: 'Last Name must not be greater than 25 characters.' }

							]}>
									<Input className="form-control" type="text" placeholder="Last Name" />
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="row">
						{/* <div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Company Name" name="companyname" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Company Name" />
								</Form.Item>
							</div>
						</div> */}
						
					 
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Address 1" name="add1" rules={[ { required: true, message: 'This field required!' },{ max: 100, message: 'Address 1 must not be greater than 100 characters.' }
 ]}>
									<Input className="form-control" type="text" placeholder="Street Address" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Address 2" name="add2" rules={[ { required: false, message: 'This field required!' }
								,{ max: 100, message: 'Address 2 must not be greater than 100 characters.' } ]}>
									<Input className="form-control" type="text" placeholder="Street Address" />
								</Form.Item>
							</div>
						</div>
			
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Postcode" name="postal" rules={[ 
						 	{
							required: true,
								message: 'Please input your Postal Code!', 
							},
							{
								pattern: /^[0-9]+$/,
								message: 'Need to enter number'
							},
							{ 
								len: 6, 
								message: 'Postal Code should be 6 digits long.' 
							},
						]}>
									<Input className="form-control" type="text" placeholder="Postal code" onChange={this.handlePostal} />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Country" name="country" >
									<Input className="form-control" defaultValue={"India"} value={"India"} disabled type="text" placeholder="Country" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group"> 
								<Form.Item label="State" name="state" rules={[ { required: true, message: 'This field required!' }, ]}>
								<Select placeholder="State" onChange={this.onStateChange}>
										{India.map((item, index) => <Select.Option key={index} value={item.state}>{item.state}</Select.Option>)}
									</Select>
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group"> 
								<Form.Item label="City" name="city" rules={[ { required: true, message: 'This field required!' }, ]}>
								
								<Select placeholder="City">
										{this.state.city && this.state.city.map((val, index) => <Select.Option key={index} value={val}>{val}</Select.Option>)}
									</Select>
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Phone" name="phone" rules={[ 
						 	{
							required: true,
								message: 'Please input your Phone Number!', 
							},
							{
								pattern: /^[0-9]+$/,
								message: 'Need to enter number'
							},
							{ 
								len: 10, 
								message: 'Phone number should be 10 digits long.' 
							},
						]}>
									<Input className="form-control" type="text" placeholder="Phone" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<div className="form-group">
									<Form.Item label="Email address" name="email" rules={[ { required: true, message: 'This field required!' },{type:'email'} ]}>
										<Input className="form-control" type="email" placeholder="Email address" />
									</Form.Item>
								</div>
							</div>
						</div>
					</div>

				
					{/* <div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item name="isbilling" valuePropName="checked">
									<Checkbox>Use same address for Billing</Checkbox>
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<div className="form-group">
									<Form.Item name="isshipping" valuePropName="checked">
										<Checkbox>Use same address for shipping</Checkbox>
									</Form.Item>
								</div>
							</div>
						</div>
					</div> */}
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item name="isdefault" valuePropName="checked">
									<Checkbox>Set primary address</Checkbox>
								</Form.Item>
							</div>
						</div>
					</div>
                    
                    <div className="form-group submit">
                        <button className="ps-btn ps-btn-continue-mobile" type="submit">Save Address</button>&nbsp;
						<button className="ps-btn ps-btn-continue-mobile ps-btn--black text-white" onClick={this.GoBack}>Cancel</button>
                    </div>
                </div>
            </Form>
        );
    }
}

const mapStateToProps = state => {
    return state.users;
};
export default connect(mapStateToProps)(FormEditAddress);
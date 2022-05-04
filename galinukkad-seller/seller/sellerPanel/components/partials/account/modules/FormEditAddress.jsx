import React, { Component } from 'react';
import { Form, Input, Radio, DatePicker, Checkbox } from 'antd';
import Router from 'next/router';
import { connect } from 'react-redux';
import { addressDetail, updateAddress, createAddress, clearAction } from '../../../../store/users/action';

class FormEditAddress extends Component {
	
	constructor(props) {
        super(props);
		this.state = {count:0, dcount:0, Ccount:0, detail:{}};
		this.formRef = React.createRef();		
    }
	
	componentDidMount(){
		//console.log('getAddressDetail', this.props, Router.router.query.id)
		if(Router.router.query.id !== undefined)
		{
			this.getAddressDetail();
		}
		else this.formRef.current.setFieldsValue({['isbilling']:false, ['isshipping']:false, ['isdefault']:false, });
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.address.status === true && this.props.address.count > this.state.count) {
		
			if(Router.router.query.id !== undefined)
			{
				let index = this.props.address.data.findIndex(item=> item.id === Router.router.query.id)
				let data = this.props.address.data[index] || {};
				this.setState({count:this.props.address.count, detail:data});
				this.formRef.current.setFieldsValue({['add1']:data.add1, ['add2']:data.add2, ['companyname']:data.companyname, ['country']:data.country, ['email']:data.email, ['fname']:data.fname, ['lname']:data.lname, ['isbilling']:data.isbilling, ['isshipping']:data.isshipping, ['phone']:data.phone, ['postal']:data.postal, ['state']:data.state, ['isdefault']:data.isdefault, });
			}
            return null
        }
		console.log(this.props.create.status === true && this.props.create.count > this.state.Ccount)
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
            this.getUserDetail();
        }
    }
	
	getAddressDetail=()=>{
		this.props.dispatch(addressDetail());
	}
	
	handleLoginSubmit= val=>{
		console.log(Router.router.query.id)
		if(Router.router.query.id !== undefined)
		{
			console.log('fd',Router.router.query.id)
			val._id=detail._id;
			this.props.dispatch(updateAddress(val));
		}
		else this.props.dispatch(createAddress(val));
	}
	
	GoBack=()=>{
		this.formRef.current.resetFields();
		Router.push('/account/addresses')
	}
	
	componentWillUnmount(){
		this.props.dispatch(clearAction());
	}
	
    render() {
		console.log(this.props)
        return (
			<Form ref={this.formRef} className="ps-form--account-setting ps-form--edit-address" layout="vertical" onFinish={this.handleLoginSubmit}>
                <div className="ps-form__header">
                    <h3>Billing address</h3>
                </div>
                <div className="ps-form__content">
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="First Name" name="fname" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="First Name" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Last Name" name="lname" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Last Name" />
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Company Name" name="companyname" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Company Name" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Country" name="country" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Country" />
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Address 1" name="add1" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Street Address" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Address 2" name="add2" rules={[ { required: false, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Street Address" />
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Postcode" name="postal" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="Postcode" />
								</Form.Item>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="State" name="state" rules={[ { required: true, message: 'This field required!' }, ]}>
									<Input className="form-control" type="text" placeholder="State" />
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<Form.Item label="Phone" name="phone" rules={[ { required: true, message: 'This field required!' }, ]}>
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
					<div className="row">
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
					</div>
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
                        <button className="ps-btn" type="submit">Save Address</button>&nbsp;
						<button className="ps-btn ps-btn--black text-white" onClick={this.GoBack}>Cancel</button>
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
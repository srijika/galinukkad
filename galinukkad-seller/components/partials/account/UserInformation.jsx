import React, { Component } from 'react';
import Link from 'next/link';
import { Form, Input, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { getUserList, updateInfo, clearAction } from '../../../store/users/action';
import { logOut } from '../../../store/auth/action';
import AccountMenuSidebar from './modules/AccountMenuSidebar'
const dateFormat = 'YYYY/MM/DD';

class UserInformation extends Component {
    constructor(props) {
        super(props);
		this.state = {count:0, dcount:0, detail:{}};
		this.formRef = React.createRef();
    }
	
	componentDidMount(){
		this.getUserDetail();
	}
	
	getUserDetail=()=>{
		//console.log('list')
		this.props.dispatch(getUserList());
	}
	
	handleLoginSubmit= val=>{
		//console.log(val)
		val.photo='img';
		val._id=this.state.detail._id;
		this.props.dispatch(updateInfo(val));
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
        //console.log(this.props, this.state)
        //console.log(this.props.update.status, this.props.update.count, this.props.update.status === true, this.props.update.count> this.state.count, this.props.update.status === true && this.props.update.count> this.state.count)
		if (this.props.update.status === true && this.props.update.count> this.state.count) {
			//console.log(this.props.update)
			this.setState({count:this.props.update.count})
            return true
        }
		if (this.props.info.status === true && this.props.info.count> this.state.dcount) {
			//console.log(this.props.info)
			let data = this.props.info.data;
			this.setState({detail:data, dcount:this.props.info.count})
			
            this.formRef.current.setFieldsValue({['name']:data.name, ['phone']:data.phone, ['email']:data.email, ['dob']:moment(data.dob, dateFormat), ['gender']:data.gender});
			return null
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
			//console.log('call')
            this.getUserDetail();
        }
    }
	
	componentWillUnmount(){
		this.props.dispatch(clearAction());
	}

    render() {
		const {info} = this.props;
		//console.log(this.props)
	
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
            {
                text: 'Invoices',
                url: '/account/invoices',
                icon: 'icon-papers',
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
                                        <h3>Account Information</h3>
                                    </div>
                                    <div className="ps-form__content">
                                        <div className="form-group">
                                            <Form.Item label="Name" name="name" rules={[ { required: true, message: 'This field required!' }, ]}>
                                                <Input className="form-control" type="text" placeholder="Username" />
                                            </Form.Item>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <Form.Item label="Phone Number" name="phone"
                                                        rules={[ { required: true, message: 'This field required!', }, ]}>
                                                       <Input className="form-control" type="text" placeholder="Enter your phone number"/>
                                                    </Form.Item>
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
                                                        <DatePicker style={{height:50}}/>
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
                                            <button className="ps-btn">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
const mapStateToProps = state => {
    return state.users;
};
export default connect(mapStateToProps)(UserInformation);
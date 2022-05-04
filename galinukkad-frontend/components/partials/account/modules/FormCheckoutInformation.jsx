import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Form, Input, Radio, Button, Select } from 'antd';
import { setOrderAddress, createOrderAddress } from '../../../../store/order/action';
import { withRouter } from "next/router";
import { addressDetail, addressDelete } from '../../../../store/users/action';
import Repository from '../../../../repositories/Repository';
import { notification } from 'antd';
import { India } from '../../../../utilities/india';
import axios from 'axios';
import { createAddress } from '../../../../store/users/action';
import { getUserList, updateInfo, clearAction } from '../../../../store/users/action';




class FormCheckoutInformation extends Component {
    state = {
        editAddress: '',
        city: []
    };
    constructor(props) {
        super(props);
        this.form;
    }

    onStateChange = (e) => {
        this.setState({ india_state: e });
        var result = India.filter((val) => {
            return (val.state === e)
        })
        let { districts } = result[0];

        this.setState({ city: districts });

    }
    handlePostal = async (e) => {
        let value = e.target.value;

        if (value.length === 6) {



            const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`)

            if (res.data[0].PostOffice != null && res.data[0].PostOffice != undefined && res.data[0].PostOffice != "") {

                let pincode_data = res.data[0].PostOffice[0];
                console.log("res.data[0]" , res.data)
                this.form.setFieldsValue({
                    // country: pincode_data.Country,
                    city: pincode_data.District,
                    state: pincode_data.State,
                });
            }
        }
    }


    handleLoginSubmit = async (data) => {


        let user_detail = JSON.parse(localStorage.getItem(''))

        // if(['', undefined, null].includes(user_detail)) {
        //     alert('Please add your details');
        //     return ;
        // }

        data['is_default'] = false;

        this.props.dispatch(createAddress(data));
        window.location.reload();

        // newly ctreated address then redirect on shipping 
        const isLoggedIn =  localStorage.setItem('isNewAddress',JSON.stringify(data));



    //     await Repository.post('/getByPincode-shipping-codes?pincode='+data.postal).then(async (response) => {
    //         if (response.data.status) {


    //             if(response.data.data && response.data.data.length > 0){

    //                 // this.props.dispatch(setOrderAddress(address));
    //                 // Router.push('/account/shipping');
    //                 this.props.dispatch(await createOrderAddress(data));
    //                 Router.push('/account/shipping');
    //             }else{                    
    //                 notification.error({ message: 'Pincode not available to delivery service!' });
    //             }
    //         }else{
    //             notification.error({ message: response.data.message });
    //         }
    //     }).catch((err) => {
    //         notification.error({ message: 'Pincode not found!' });
    //     });

     };

    componentDidMount = () => {
      
       
        const { mode } = this.props.router.query;
        const { address } = this.props
        let userId = localStorage.getItem('LoginId');
        this.getUserDetail(userId);
        if (mode === 'edit' && this.form) {
            this.form.setFieldsValue({ ...address });
        } 
        if (typeof window !== 'undefined') {
            const isLoggedIn = localStorage.getItem('accessToken');
            if (isLoggedIn) {
                this.props.dispatch(addressDetail());

                let LoginCred = localStorage.getItem('LoginData')
                const userDetail = JSON.parse(LoginCred);
                this.form.setFieldsValue({
                    // country: pincode_data.Country,
                    email: userDetail.email ,
                    phone: userDetail.mobile_number,
                });
            }
        }

        if(localStorage.getItem('isNewAddress')){

            setTimeout(() => {
                const newAddr = JSON.parse(localStorage.getItem('isNewAddress'));
                this.handleAddressSelect(newAddr);
                localStorage.removeItem('isNewAddress');
            }, 100)
        }

        console.log('componentDidMount' , this.props.users)

    }


    getUserDetail=(userId)=>{
		this.props.dispatch(getUserList(userId));
	}


    editAddressFun = (redirect_path) => {
        // localStorage.setItem('edit_checkout_redirect_path', window.location.href);
        Router.push(redirect_path);
    }



    handleAddressSelect = async (address) => {
        let product = [];
        

        this.props.cartItems.map((item) => {
            let d = {
                _id: item._id,
                title: item.title,
                loginid: item.loginid,
                quantity: item.quantity,
            };
            product.push(d);
        })

        let data = {
            pincode: address.postal,
            products: product
        };


            await Repository.post('/getByPincode-shipping-codes?pincode=' + address.postal, data).then((response) => {
                if (response.data.status) {
                    
                    if (response.data.data && response.data.data.length > 0) {
                        
                        localStorage.setItem('shipping_price', JSON.stringify(response.data.data));

                        console.log('address________address' , address)
                        
                        this.props.dispatch(setOrderAddress(address));
                        Router.push('/account/shipping');
                    } else {
                        notification.error({ message: 'Pincode not available to delivery service!' });
                    }
                } else {
                    notification.error({ message: response.data.message });
                }
            }).catch((err) => {
                notification.error({ message: 'Pincode not found!' });
            });
        

    }


    editAddress(address) {
        this.form.setFieldsValue({ ...address });
    }
    render() {

        const { amount, cartItems, cartTotal, addressDetails } = this.props;
        const { editAddress } = this.state;
        let addressList = [];
        if (addressDetails.address.data) {
            addressList = addressDetails.address.data.map((address, index) => {


                return (
                    <div key={index} className=" app-address-card col-12 col-md-6 col-lg-3 ">
                       
                        <figure>
                            <small>Ship to</small>
                            <p>

<div>

<div className=""><span className="font-weight-bold">Phone: </span>{address.phone}</div>
<div className=""><span className="font-weight-bold">Email: </span>{address.email}</div>
<div className=""><span className="font-weight-bold">Address1: </span>{address.add1}</div>
<div className=""><span className="font-weight-bold">Address2: </span>{address.add2}</div>
<div className="">{address.state} , {address.country} <span className="font-weight-bolder text-dark">({address.postal})</span></div>
{/* <div className="font-weight-bolder text-dark">{address.postal}</div> */}



</div>
                                
               
                            </p>

                            <Button className="check_ship_btn mr-4" onClick={() => { this.handleAddressSelect(address) }} type="primary" >Ship Here</Button>&nbsp;

                            <a className="check_edit" onClick={() => { this.editAddressFun(`/account/edit-address?id=${address._id}`) }} style={{ color: "#1890ff", fontWeight: "bold" }}  >  Edit </a>

                            {/* <Button className="check_ship_btn mr-4" onClick={() => {this.handleAddressSelect(address)}} type="primary" >Ship Here</Button>
                        <Link   href={`/account/edit-address?id=${address._id}`}>
                                                        <a  
                                                        className="check_edit"
                                                        >Edit</a>
                                                    </Link> */}
                        </figure>
                    </div>
                );
            });
        }


        return (
            <div className="app_checkout">
                <div className="app-checkoout-address-list">
                    {addressList}
                </div>
                <Form
                    ref={(ref) => { this.form = ref }}
                    className="ps-form--checkout"

                    onFinish={this.handleLoginSubmit}>
                    <div className="ps-form__content">
                        <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <div className="ps-form__billing-info">
                                    <h3 className="ps-form__heading">
                                        Contact Information
                                    </h3>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <Form.Item
                                                    label="Email Add."
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            type: 'email',
                                                            message: 'Enter Email Here',
                                                        },
                                                    ]}>
                                                    <Input
                                                        className="form-control"
                                                        type="email"
                                                        placeholder="Enter Email Here"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <Form.Item
                                                label="Phone No."
                                                name="phone"
                                                rules={[
                                                    {
                                                        required: true,
                                                        len: 10,
                                                        type: 'string',
                                                        message: 'Enter phone here.',
                                                    },
                                                ]}>
                                                <Input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Phone number"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    {/* <div className="form-group">
                                    <div className="ps-checkbox">
                                        <input
                                            className="form-control"
                                            type="checkbox"
                                            id="keep-update"
                                        />
                                        <label htmlFor="keep-update">
                                            Keep me up to date on news and
                                            exclusive offers?
                                        </label>
                                    </div>
                                </div> */}
                                    <h3 className="ps-form__heading">
                                        Shipping Address
                                    </h3>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <Form.Item
                                                    label="First Name"
                                                    name="fname"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Enter your first name!',
                                                        },
                                                    ]}>
                                                    <Input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="First Name"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <Form.Item
                                                    label="Last Name"
                                                    name="lname"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Enter your last name!',
                                                        },
                                                    ]}>
                                                    <Input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Last Name"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <Form.Item
                                            name="add1"
                                            label="Address Line 1"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Enter an address Line 1',
                                                },
                                            ]}>
                                            <Input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter an address Line 1"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Address Line 2"
                                            name="add2"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Enter an address Line 2',
                                                },
                                            ]}>
                                            <Input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter an address Line 2"
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            
                                            <div className="form-group">
                                                <Form.Item
                                                    name="postal"
                                                    label="Postal Code"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Enter a postal code!',
                                                        },
                                                    ]}>
                                                    <Input
                                                        className="form-control"
                                                        type="postalCode"
                                                        placeholder="Postal Code"
                                                        onChange={this.handlePostal}
                                                    />
                                                </Form.Item>

                                                

                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            
                                            <div className="form-group">
                                               

                                                <Form.Item
                                                    name="country"
                                                    label="Country"
                                                  >
                                                    <Input
                                                     defaultValue={"India"}  disabled
                                                    
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Enter Country"
                                                    />
                                                </Form.Item>
                                                

                                            </div>
                                        </div>
                                        
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                               

                                                {/* <Form.Item label="State" name="state" rules={[{ required: true, message: 'This field required!' },]}>
                                                    <Select placeholder="State" onChange={this.onStateChange}>
                                                        {India.map((item, index) => <Select.Option key={index} value={item.state}>{item.state}</Select.Option>)}
                                                    </Select>
                                                </Form.Item> */}
                                                <Form.Item label="State" name="state" rules={[{ required: true, message: 'This field required!' },]}>
                                                    <Select placeholder="State" onChange={this.onStateChange}>
                                                        {India.map((item, index) => <Select.Option key={index} value={item.state}>{item.state}</Select.Option>)}
                                                    </Select>
                                                </Form.Item>


                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                               

                                                {/* <Form.Item label="State" name="state" rules={[{ required: true, message: 'This field required!' },]}>
                                                    <Select placeholder="State" onChange={this.onStateChange}>
                                                        {India.map((item, index) => <Select.Option key={index} value={item.state}>{item.state}</Select.Option>)}
                                                    </Select>
                                                </Form.Item> */}
                                      
                                                       <Form.Item label="City" name="city" rules={[{ required: true, message: 'This field required!' },]}>

<Select placeholder="City">
    {this.state.city && this.state.city.map((val, index) => <Select.Option key={index} value={val}>{val}</Select.Option>)}
</Select>
</Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="ps-form__submit">
                                        <span className="d-none d-sm-block">
                                            <Link href="/account/shopping-cart">
                                                <a>
                                                    <i className="icon-arrow-left mr-2"></i>
                                                    Return to shopping cart
                                                </a>
                                            </Link>
                                        </span>
                                        <div className="ps-block__footer">
                                            <button className="ps-btn ps-btn-continue-mobile">
                                                Continue to shipping
                                            </button>
                                        </div>
                                        <span className="ps-block_continue d-block d-sm-none">
                                            <Link href="/account/shopping-cart">

                                                <a>
                                                    <i className="icon-arrow-left mr-2"></i>
                                                    Return to shopping carts
                                                </a>
                                            </Link>


                                        </span>

                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12  ps-block--checkout-order">
                                <div className="ps-form__orders">
                                    <h3>Your order</h3>
                                    <div className="ps-block--checkout-order">
                                        <div className="ps-block__content">
                                            <figure>
                                                <figcaption>
                                                    <strong>Product</strong>
                                                    <strong>total</strong>
                                                </figcaption>
                                            </figure>
                                            <figure className="ps-block__items">
                                                {cartItems &&
                                                    cartItems.map((product, index) => (
                                                        <Link
                                                            href="/"
                                                            key={index}>
                                                            <a>
                                                                <strong>
                                                                    {product.title}
                                                                    <span>
                                                                        x
                                                                        {
                                                                            product.quantity
                                                                        }
                                                                    </span>
                                                                </strong>
                                                                <small>
                                                                    ₹
                                                                    {product.quantity *
                                                                        product.price}
                                                                </small>
                                                            </a>
                                                        </Link>
                                                    ))}
                                            </figure>
                                            <figure>
                                                <figcaption>
                                                    <strong>Subtotal</strong>
                                                    <small>₹ {amount}</small>
                                                </figcaption>
                                            </figure>
                                            <figure className="ps-block__shipping">
                                                <h3>Shipping</h3>
                                                <p>Calculated at next step</p>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapToProps = (state) => {

    console.log('allsate' , state)
    return {
        address: state.order.orderAddress,
        addressDetails: state.users ,
        users : state
    };
}
export default connect(mapToProps)(withRouter(FormCheckoutInformation));



import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import {connect} from 'react-redux'
import {getOrdersList} from '../../../store/order/action';
import { Button, notification, Input , Form} from 'antd';

import Router from 'next/router';
import  Repository from '../../../repositories/Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


class CreateTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:'' ,
            error: ''
        };
    }

    componentDidMount() {
        
    }

    updateMessage = (event) =>{

        let value = event.target.value;



        this.setState({ message: value });
    }

    onFinish = async (value) =>{
        

    let val = {
        message:value.description,
        replay:''
    }

    console.log(val , value);
    await Repository.post('/create-manage-caselog', val).then((response) => {
        if (response.data.status) {
            // notification.success({message: "Successfully created Ticket!"});
    toast.success("Successfully created Ticket!");

            Router.push('/account/support');
        }else{
            notification['warning']({message: 'Error', description: response.data.msg || response.data.message || response.data.err })
        }
    }).catch((err) => {
        // notification.error({ message: 'Ticket Create Failed' });
    toast.error("Ticket Create Failed");

    });




    }


    render() {
        const { orders } = this.props;
        const accountLinks = [
            {
                text: 'Account Information',
                url: '/account/user-information',
                icon: 'icon-user',
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
                icon: 'icon-papers',
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
                icon: 'icon-papers',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
                icon: 'icon-papers',
            },
            {
                text: 'Support',
                url: '/account/support',
                icon: 'icon-papers',
                active: true
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
                                <div className="ps-section--account-setting">
                                    <div style={{
                                        display:'flex',
                                        justifyContent:'space-between'
                                    }} className="ps-section__header">
                                        <h3>Support</h3>
                                        <div>
                                            <Button type="warning" className="crt_tic" onClick={() => {Router.push({pathname:'/account/support'})}} >
                                                My Tickets
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="ps-section__content">  
                                    <Form
                        className=""
                        onFinish={this.onFinish}
                        >
              
                                    <label> Description </label>
                        <Form.Item
                            name="description" 
                            rules={[ {required: true,   message: 'Please Enter description', },{ max: 100, message: 'Description must not be greater than 100 characters.' } ]}
                            >
                            <Input.TextArea
                                className="form-control  "
                                
                                placeholder="Describe your concern here.."
                            />
                        </Form.Item>
                        <div className="form-group ">
                        <button type="submit" className="mt-4 ps-btn ps-btn-mobile ps-btn--fullwidth"
                        >Create Ticket</button>
                    </div>
 </Form>

</div>
         

    
        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapToProps = (state) =>  {
    return {
        orders:state.order.orderList
    }
};
const dispatchToProps = (dispatch) => {
    return {
        getOrders:() => {
            dispatch(getOrdersList())
        }
    }
};
export default connect(mapToProps,dispatchToProps)(CreateTicket);

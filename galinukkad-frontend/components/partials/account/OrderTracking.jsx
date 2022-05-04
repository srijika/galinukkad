import React , {useState}from 'react';
import './css/OrderTracking.scss';
import { Form, Input,Button, notification } from 'antd';
import axios  from 'axios';
import Moment from 'react-moment';
import {toast } from 'react-toastify';

const OrderTracking = () => {

    const [form] = Form.useForm();

    const [showTracking, setShowTracking] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});

    const getOrderStatus = (status) => {
        /*
        // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
        */

        let statusReturned = null;
        switch (status) {
            case 0:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'black' }}>Placed</span>
                break;
            case 1:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'green' }}>Delivered</span>
                break;
            case 2:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Cancelled</span>
                break;
            case 3:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Returned</span>
                break;
            case 4:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'blue' }}>Refunded</span>
                break;
            default:
                statusReturned = <span style={{ 'textAlign': 'center' }}>-</span>
                break;
        }

        return statusReturned;
    }



    const onFinish = async (values) => {
        console.log('Success:', values);

 
        let res = await axios.post('/order/track', values);
      
        if(res.data.status === true) {
            toast.success("Order tracked successfully");
            setOrderDetail(res.data.orderDetail);
            setShowTracking(true);
        }else{
            toast.error("You Enter Wrong Tracking ID");
        }
    };
    

   return( <div className="ps-order-tracking">
        <div className="container">
            <div className="ps-section__header">
                <h3>Order Tracking</h3>
                <p>
                    To track your order please enter your Order ID in the box below and press the
                    "Track" button. This was given to youon your receipt and in the confirmation
                    email you should have received.
                </p>
            </div>
            
            <div className="ps-section__content" >
                
                {/* <form className="ps-form--order-tracking" action="/" method="get"> */}
                <Form
                        // ref={(ref) => this.form = ref}
                        form={form}
                        className="ps-form--order-tracking"
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        // onFinish={handleOrderTracking(this)}
                        >


                    <div className="form-group">
                         <label>Order Tracking ID</label>
                        <Form.Item
                            name="tracking_id" 
                            rules={[ {required: true,   message: 'Please enter your order item tracking id', }, ]}
                            >
                            <Input
                                className="form-control"
                                type="text"
                                placeholder="Enter Order Tracking ID"
                            />
                        </Form.Item>
                    </div>
                    {/* <div className="form-group">
                         <label>Billing Email</label>
                        <Form.Item name="email" 
                         rules={[ { required: true, message: 'Please enter your email', },{ type: 'email', message: 'The input is not valid E-mail!',} ]}
                        >
                            <Input
                                className="form-control"
                                type="text"
                                placeholder="Your Billing email"
                            />
                        </Form.Item>
                    </div> */}
                    <div className="form-group">
                        <button type="submit" className="ps-btn ps-btn--fullwidth"
                        //  onClick={handleSubmit}
                        >Track Your Order</button>
                        {/* <button onClick={() => { setState({
                            ...state,
                            clicked:true
                        })}}type="button" className="ps-btn ps-btn--fullwidth">Track Your Order</button> */}
                    </div>
                </Form>
            </div>

            {showTracking && orderDetail?
            <div className="ps-section__content">
                <div class="site-locations row" style={{ justifyContent: 'center' }}>

                    <div class="col-md-3">
                        <i class="fa fa-check"></i>
                        Order Status : <br />
                        {getOrderStatus(orderDetail.item_status && orderDetail.item_status)}
                    </div>
                    <div class="col-md-3">
                        <i class="fa fa-calendar"></i>
                        Delivered Date : <br />
                        {orderDetail && orderDetail.delivered_date ? <Moment format="DD-MMMM-YYYY" >{orderDetail.delivered_date}</Moment>: ""}
                    </div>
                    <div class="col-md-3">
                        <i class="fa fa-map-marker"></i>
                            Item Status : <br />
                          <span className="text-center"></span>  {orderDetail && orderDetail.track_status.replace(/_/g, " ")}
                        {/* { orderDetail.address.fname }  { orderDetail.address.lname } <br />

                         { orderDetail.address.add1 }  { orderDetail.address.add2 } <br />

                         { orderDetail.address.city },  { orderDetail.address.state },

                          { orderDetail.address.country }, { orderDetail.address.postal } */}

                        {/* customer  Mali Mohalla Tabiji <br /> Rajasthan, India, 302017 */}
                    </div>
                </div>
            </div>:null}
        </div>
    </div>);
};

export default OrderTracking;

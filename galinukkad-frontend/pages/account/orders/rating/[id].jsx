import React, { Component } from 'react';
import { Form, Input, Rate, Divider, Tag } from 'antd';
const { TextArea } = Input;
import { ToastContainer, toast , Flip } from 'react-toastify';

import Link from 'next/link';
import { Button } from 'antd';
import moment from 'moment';
import { baseUrl } from '../../../../repositories/Repository';
import  Repository from '../../../../repositories/Repository';
import { notification } from 'antd';
import Router  from 'next/router';
import {connect} from 'react-redux';
import {getOrderDetails} from '../../../../store/order/action';
import Newsletters from '../../../../components/partials/commons/Newletters';
import FooterDefault from '../../../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../../../components/elements/BreadCrumb';
import Orders from '../../../../components/partials/account/Orders';
import HeaderMobile from '../../../../components/shared/headers/HeaderMobile';
import NavigationList from '../../../../components/shared/navigation/NavigationList';
import './track.scss';

const ratingDesc = ['Very Bad', 'Bad', 'Good', 'Very Good', 'Excellent'];

class OrderDetails extends Component {
    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }
    constructor(props) {
        super(props);

        this.state = {
            rating: 5,
            message:"message",
            orderId: "",
            product_id:""

        };
    }

    componentDidMount() {
        
        let query_string = this.props.query.id.split('-');
        let orderId = query_string[0];
        let productId = query_string[2];
        this.setState({orderId: orderId, product_id: productId})        

        this.props.dispatch(getOrderDetails({order_id:orderId, product_id: productId}));
    }

    handleChangeRating = value => {
        this.setState({ rating: value });
    };

    handleChangeReviews = event =>{
        this.setState({ message: event.target.value });
    }

    onFinish = ({review}) => {


                    if(this.state.rating){
                        this.ReviewProduct(review);
                    }else{
                        toast.error('Not Give Rating' );
                        
                        
                    }

    }

    ReviewProduct = async (review) => {


        let data ={
            product_id: this.state.product_id,
            message:review,
            rating:this.state.rating
        };
 
        await Repository.post('review/product',data).then((response) => {
            if (response.data.status) {
                toast.success(response.data.message);
                Router.push('/account/orders');
            }else{
                toast.error( response.data.message );
            }
        }).catch((err) => {
            toast.error( 'Review Product Failed' );
        });
    }

    render() {
        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Orders',
                url: '/account/orders',
            },
            {
                text: 'Rating & Reviews',
            },
        ];

        const { order } = this.props;
        let orderDetails = order;

        console.log('order isisi');
        console.log(order);
        return (
            <div className="site-content">
        <HeaderDefault />
        {/* <HeaderMobile /> */}
        <NavigationList />
        <div className="ps-page--my-account">
            <BreadCrumb breacrumb={breadCrumb} />
            <section className="ps-my-account ps-page--account">
                <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="app-track-order">
                            <h3 className="app-track-order-heading"> Rate this product</h3>   
                            <h4> Product Name:  {order && order.orderDetail.product_id.title} </h4>      
                            <h4> Product Price:  {order && order.orderDetail.product_id.price} </h4>      
                            <div className="row app-track-order-wrapper">
                                <div className="col-md-5 col-sm-12">
                                <Rate tooltips={ratingDesc} onChange={this.handleChangeRating} value={this.state.rating} />
                                        {this.state.rating ? <span className="ant-rate-text">{ratingDesc[this.state.rating - 1]}</span> : ''}
                                    
                                </div>
                            </div>
                            <Divider />
                            <h3 className="app-track-order-heading"> Review this product</h3>  
                            {/* <TextArea rows={4} onChange={this.handleChangeReviews} />
                            <div className="col-md-3 col-sm-12" style={{marginTop:"20px", padding:"0"}}>
                                <button className="app-heighlighted-btn" onClick={this.submitRatingAndReviews}> Continue </button>
                            </div> */}

                            <Form
                        className=""
                        onFinish={this.onFinish}
                        >
              
                        <Form.Item
                            name="review" 
                            rules={[ {required: true,   message: 'Please Enter Review', },{ max: 200, message: 'Review must not be greater than 200 characters.' } ]}
                            >
                            <Input.TextArea
                                className="form-control  "
                                
                                placeholder="Enter your review here.."
                            />
                        </Form.Item>
                        {/* <div className="col-md-3 col-sm-12">

                        <div className="form-group  ">
                        <button type="submit" className="mt-3 app-heighlighted-btn"
                        >Continue</button>
                    </div>
                    </div> */}

                    <div className="col-md-3 col-sm-12" style={{marginTop:"20px", padding:"0"}}>
                                <button className="w-50 app-heighlighted-btn review_btn"  type="submit"> Continue </button>
                            </div>

 </Form>

                        </div>
                    </div>
                </div>
                </div>
            </section>
        </div>
        <Newsletters layout="container" />
        <FooterDefault />
        </div>
        );
    }
}

const mapToProps = (state) => {
    return {
        order:state.order.orderDetails
    }
}
export default connect(mapToProps)(OrderDetails);

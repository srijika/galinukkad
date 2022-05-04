
import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableInvoices from './modules/TableInvoices';
import {connect} from 'react-redux'
import {getOrdersList,getMyOrderList,getOrderDetails} from '../../../store/order/action';
import {Modal, Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,notification, Switch, Row, Col, Avatar, Pagination, Tabs,  Popconfirm , Rate , Checkbox} from 'antd';
import Repository from '../../../repositories/Repository';
import Moment from 'react-moment';
import {baseUrl} from '../../../repositories/Repository.js'
import OrderListItem from '../../../components/partials/account/modules/OrderListItem';
import axios from 'axios';


const { Text } = Typography;
const { TextArea } = Input;
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrderDetails:false,
            showSellerFeedback:false,
            showOrderRefund:false,
            showOrderReturn:false,
            orderRefund:null,
            orderReturn:null,
            orderReturnData: {
                id:null,
                product_id:[],
                description:null
            },
            orderRefundData: {
                id:null,
                product_id:[],
                description:null
            },
            sellerReview: {
                seller_id:null,
                rating:null,
                message:null,
                isItemDescribed : 1
            },
        };
        this.isShow = false;
    }
    

    handleSellerRatingChange = (review) => {
        this.setState({sellerReview : {...this.state.sellerReview,rating:review}})
    }

    handleSellerMessageChange = (event) => {
        this.setState({sellerReview : {...this.state.sellerReview,message:event.target.value}})
    }

    handleSellerIsItemDescribedChange = (event) => {
        this.setState({sellerReview : {...this.state.sellerReview,isItemDescribed:event.target.value}})
    }

    componentDidMount() {
        this.props.getOrders();
    }

    orderSelect = (orderId) => {
        this.isShow = true;
        this.setState({isOrderDetails:true});
        this.props.getOrderDetails(orderId);
    };
    handleModalDestroy = () => {
        this.setState({isOrderDetails:false});
    }
    handleSellerFeedback = (order) => {
        this.setState({showSellerFeedback:true, sellerReview:{  
            seller_id:order.loginid,
            rating:null,
            message:null,
            isItemDescribed : 1
            }});
    }

    handleOrderRefund = (order) => {
        this.setState({showOrderRefund:true, orderRefund: order, orderRefundData:{product_id:[], description:null , id:order._id}});
    }

    handleOrderReturn = (order) => {
        this.setState({showOrderReturn:true,orderReturn: order, orderReturnData:{ product_id:[], description:null , id:order._id}});
    }

    handleSellerFeedbackModalCancel = () => {
        this.setState({showSellerFeedback:false});
    }
    
    handleOrderRefundModalCancel = () => {
        this.setState({showOrderRefund:false});
    }

    handleOrderRefundModalOk = () => {
        if(this.state.orderRefundData.product_id.length != 0 && this.state.orderRefundData.description) {
            Repository.post("/refund/order",{...this.state.orderRefundData})
            .then(() => {
                notification.success({message:"Sent Successfully"});
                this.setState({showOrderRefund:false});
            }).catch((err) => {
                notification.error({message:"Something Went Wrong. Try again"});
                this.setState({showOrderRefund:false});
            })
        } else {
            const message = this.state.orderRefundData.product_id.length == 0?"Please Choose at least one product":"Please enter description.";
            notification.error({message})
        }
    }
    
    handleOrderReturnModalCancel = () => {
        this.setState({showOrderReturn:false});
    }

    handleOrderReturnModalOk = () => {
        if(this.state.orderReturnData.product_id.length != 0 && this.state.orderReturnData.description) {
            Repository.post("/return/order",{...this.state.orderReturnData})
            .then(() => {
                notification.success({message:"Sent Successfully"});
                this.setState({showOrderReturn:false});
            }).catch((err) => {
                notification.error({message:"Something Went Wrong. Try again"});
                this.setState({showOrderReturn:false});
            })
        } else {
            const message = this.state.orderReturnData.product_id.length == 0?"Please Choose at least one product":"Please enter description.";
            notification.error({message})
        }
    }

    handleOrderReturnProductChange = (event) => {
        this.setState({orderReturnData:{ ...this.state.orderReturnData, product_id:event}});
    };
    handleOrderReturnProductDescriptionChange = (e) => {
        this.setState({orderReturnData:{ ...this.state.orderReturnData, description: e.target.value}});
    }
    
    handleOrderRefundProductChange = (event) => {
        this.setState({orderRefundData:{ ...this.state.orderRefundData, product_id:event}});
    }

    handleOrderRefundProductDescriptionChange = (e) => {
        this.setState({orderRefundData:{ ...this.state.orderRefundData, description: e.target.value}});
    }

    handleSellerFeedbackModalOk = () => {
        
        if(this.state.sellerReview.rating != null && this.state.sellerReview.isItemDescribed != null && this.state.sellerReview.message != null ) {
            Repository.post("/review/seller",{...this.state.sellerReview})
            .then(() => {
                notification.success({message:"Reviews Added Successfully"});
                this.setState({showSellerFeedback:false});
            }).catch((err) => {
                notification.error({message:err.data.message});
                this.setState({showSellerFeedback:false});
            })
        } else {
            let message = "";
            if (this.state.sellerReview.rating === null) {
                message = "Please provide rating.";
            } else if(this.state.sellerReview.isItemDescribed === null) {
                message = "Please Choose Items as described by the seller yes or no.";
            } else if(this.state.sellerReview.message === null) {
                message = "Please enter message.";
            } else {
                message = "Something went wrong";
            }
            notification.error({message})
        }
        /* Submit Seller feedback */
    }



    



    render() {
        const { orders, orderDetail } = this.props;
        const { isOrderDetails }  = this.state;
        if(this.isShow) {
            this.isShow = false;
            this.setState({isOrderDetails:true});
        }
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
           
            {
                text: 'orders',
                url: '/account/orders',
                icon: 'icon-papers',
                active: true,
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
                active: false
            }
        ];
            const columns = [
                {
                title: 'image',
                dataIndex: 'image',
                width:100,
                render:(val,data)=>  (data.detail?<img src={baseUrl+'/'+data.detail.images.file}></img>:'-')
                },
                {
                title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Products Name</strong>,
                dataIndex: 'title',
                render:(val,data)=> <div>{data.detail?data.detail.title:'-'}</div>
                },
                { title:<strong>Vendor</strong>, dataIndex: 'vendor', render:(val,data)=> <div>{data.detail?data.detail.vendor:'-'}</div> },
                { title:<strong>Price</strong>, width:100, dataIndex: 'price',  render:(val,data)=> <div>₹ {data.detail?data.detail.price:'-'}</div> },
                { title:<strong>Quantity</strong>, width:100, dataIndex: 'quantity'  , render:(val,data)=> <div>{data.quantity?data.quantity:'-'}</div>  },
                { title:<strong>Actions</strong>, width:100, dataIndex: 'actions', render:  (val,data) => {
                    return(
                        <Button style={{marginTop: '0.625rem'}} block onClick={() => this.handleSellerFeedback(orderDetail._id)} >Give Seller Feedback</Button>
                    );
                }}
            ];
        const listData = [];
        let total = 10, limit = 10; 
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="ps-page__content">
                                <div className="ps-section--account-setting">
                                    <div className="ps-section__header">
                                        <h3>My Orders</h3>
                                    </div>
                                    <div className="ps-section__content mobile_ps-section__content">
                                        {console.log(orders)}
                                        {
                                            orders ? orders.length > 0 ? orders.map((order, index) => <OrderListItem key={index} order={order}/> ) : "No Order Available" : "No order available"
                                        }
                                        <Modal
                                            title="Order Details"
                                            centered
                                            footer={null}
                                            destroyOnClose={true}
                                            visible={isOrderDetails}
                                            onCancel={this.handleModalDestroy}
                                            width={1000}>
                                        <div>
                                               <Row gutter={5} style={{marginBottom: '0.625rem'}} >
                                        <Col span={14}>
                                            <Card title="Order summary" bordered={false}>
                                                    <Row gutter={10}>
                                                        <Col span={12} >
                                                            <div>
                                                                <label className="order-detail-bold" >Order date:</label>&nbsp;&nbsp;<span className="order-detail-light">{orderDetail && orderDetail.create?<Moment format="MM-
                                                                DD-YYYY" >{orderDetail.create}</Moment>:'-'}</span><br/>
                                                            </div>
                                                        </Col>
                                                        <Col span={12} >
                                                            <div>
                                                                <label className="order-detail-bold" >Payment Method: </label>&nbsp;&nbsp;<span className="order-detail-light">{orderDetail?orderDetail.payment_method:'-'}</span><br/>
                                                                <label className="order-detail-bold" >Payment Status:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">{orderDetail?(orderDetail.status ? <span style={{color:'green'}}>PAID</span> : <span style={{color:'red'}}>UNPAID</span>):'-'}</span><br/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                            </Card>    
                                        </Col>
                                        <Col span={10}>
                                            <Card title="Ship to" bordered={false} >
                                                {(orderDetail && orderDetail.address && orderDetail.address.companyname != "null")?<div>{orderDetail.address.companyname}, </div>:null}
                                                {orderDetail && orderDetail.address ? orderDetail.address.fname:null} {orderDetail && orderDetail.address?<span>{orderDetail.address.lname}, <br/></span>:null}
                                                {orderDetail && orderDetail.address ?<div>{orderDetail.address.add1}, </div>:null}
                                                {orderDetail && orderDetail.address ?<div>{orderDetail.address.add2}, </div>:null}
                                                {orderDetail && orderDetail.address ?<span>{orderDetail.address.postal}, </span>:null} {orderDetail && orderDetail.address?<span>{orderDetail.address.state}, <br/></span> :null}
                                                {orderDetail && orderDetail.address ?orderDetail.address.country:null}

                                                {orderDetail && !orderDetail.address?'No address Found':null}
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Table
                                    style={{marginBottom:"0.625rem"}} 
                                    columns={columns} 
                                    dataSource={orderDetail?orderDetail.product:[]} 
                                    rowKey={record => record.id}
                                    pagination={null}
                                    />
                                    </div>
                                        </Modal>
                                        <Modal
                                        title="Seller Feedback"
                                        centered
                                        destroyOnClose={true}
                                        visible={this.state.showSellerFeedback}
                                        onCancel={this.handleSellerFeedbackModalCancel}
                                        onOk={this.handleSellerFeedbackModalOk}
                                        okText="Submit Review"
                                        width={1000}
                                        >
                                                <strong>Rate Seller</strong><br/>
                                                <Rate  style={{ fontSize: 36 }} tooltips={"12345"} onChange={this.handleSellerRatingChange} />
                                                <Card style={{marginTop:'1rem'}}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <div style={{disaply:'flex', marginBottom:'1rem'} }>
                                                                <strong>Items as described by the seller?</strong>
                                                                <div style={{marginLeft:'1rem'}} >
                                                                <Radio.Group name="radiogroup" defaultValue={1} onChange={this.handleSellerIsItemDescribedChange}>
                                                                    <Radio value={1}>yes</Radio>
                                                                    <Radio value={0}>No</Radio>
                                                                </Radio.Group>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col span={24}>
                                                            <div>
                                                                <strong>Comments:</strong>
                                                                <TextArea rows={4} placeholder="Write Here..."  onChange={this.handleSellerMessageChange} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                        </Modal>
                                        
                                        <Modal
                                        title="Refund Order"
                                        centered
                                        destroyOnClose={true}
                                        visible={this.state.showOrderRefund}
                                        onCancel={this.handleOrderRefundModalCancel}
                                        onOk={this.handleOrderRefundModalOk}
                                        okText="Submit"
                                        width={1000}
                                        >
                                            <Checkbox.Group style={{ width: '100%' }} onChange={this.handleOrderRefundProductChange}>
                                                <Row>
                                            { this.state.orderRefund && this.state.orderRefund.product.map((p) => {
                                                    
                                                   return (
                                                      <Col span={8}>
                                                        <Checkbox value={p.id} >{p.title}</Checkbox>
                                                      </Col>
                                                    );
                                            })}
                                            </Row>
                                            </Checkbox.Group>
                                            <strong>Description</strong>
                                            <TextArea onChange={this.handleOrderRefundProductDescriptionChange} rows={4} placeholder="Write Here..."/>
                                        </Modal>
                                        <Modal
                                        title="Return Order"
                                        centered
                                        destroyOnClose={true}
                                        visible={this.state.showOrderReturn}
                                        onCancel={this.handleOrderReturnModalCancel}
                                        onOk={this.handleOrderReturnModalOk}
                                        okText="Submit"
                                        width={1000}
                                        >
                                            <Checkbox.Group style={{ width: '100%' }} onChange={this.handleOrderReturnProductChange} >
                                                <Row>
                                                    {this.state.orderReturn && this.state.orderReturn.product.map((p) => {
                                                            
                                                        return (
                                                            <Col span={8}>
                                                                <Checkbox value={p.id} >{p.title}</Checkbox>
                                                            </Col>
                                                            );
                                                    })}
                                                </Row>
                                            </Checkbox.Group>
                                            <strong>Description</strong>
                                            <TextArea onChange={this.handleOrderReturnProductDescriptionChange}  rows={4} placeholder="Write Here..."/>
                                        </Modal>
                                    
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
        orders:state.order.orderList,
        orderDetail:state.order && state.order.orderDetails && state.order.orderDetails.order
    }
};
const dispatchToProps = (dispatch) => {
    return {
        getOrders:() => {
            dispatch(getMyOrderList())
        },
        getOrderDetails:(orderId) => {
            dispatch(getOrderDetails({order_id:orderId}));
        }
    }
};
export default connect(mapToProps,dispatchToProps)(Orders);


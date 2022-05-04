import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableInvoices from './modules/TableInvoices';
import { connect } from 'react-redux'
import { getOrdersList, getOrderDetails } from '../../../store/order/action';
import { Modal, Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, notification, Switch, Row, Col, Avatar, Pagination, Tabs, Popconfirm, Rate, Checkbox } from 'antd';
import Repository from '../../../repositories/Repository';
import Moment from 'react-moment';
import { baseUrl } from '../../../repositories/Repository.js';
import './css/Order.scss';
import OrderDetails from './modules/OrdersDetail';
const { Text } = Typography;
const { TextArea } = Input;
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrderDetails: false,
            showSellerFeedback: false,
            showOrderRefund: false,
            showOrderReturn: false,
            orderRefund: null,
            orderReturn: null,
            orderReturnData: {
                id: null,
                product_id: [],
                description: null
            },
            orderRefundData: {
                id: null,
                product_id: [],
                description: null
            },
            sellerReview: {
                seller_id: null,
                rating: null,
                message: null,
                isItemDescribed: 1
            },
        };
        this.isShow = false;
    }


    handleSellerRatingChange = (review) => {
        this.setState({ sellerReview: { ...this.state.sellerReview, rating: review } })
    }

    handleSellerMessageChange = (event) => {
        this.setState({ sellerReview: { ...this.state.sellerReview, message: event.target.value } })
    }

    handleSellerIsItemDescribedChange = (event) => {
        this.setState({ sellerReview: { ...this.state.sellerReview, isItemDescribed: event.target.value } })
    }

    componentDidMount() {
        this.props.getOrders();
    }
    orderSelect = (orderId) => {
        this.isShow = true;
        this.props.getOrderDetails(orderId);
    };
    handleModalDestroy = () => {
        this.setState({ isOrderDetails: false });
    }
    handleSellerFeedback = (order) => {
        this.setState({
            showSellerFeedback: true, sellerReview: {
                seller_id: order.loginid,
                rating: null,
                message: null,
                isItemDescribed: 1
            }
        });
    }

    handleOrderRefund = (order) => {
        this.setState({ showOrderRefund: true, orderRefund: order, orderRefundData: { product_id: [], description: null, id: order._id } });
    }

    handleOrderReturn = (order) => {
        this.setState({ showOrderReturn: true, orderReturn: order, orderReturnData: { product_id: [], description: null, id: order._id } });
    }

    handleSellerFeedbackModalCancel = () => {
        this.setState({ showSellerFeedback: false });
    }

    handleOrderRefundModalCancel = () => {
        this.setState({ showOrderRefund: false });
    }

    handleOrderRefundModalOk = () => {
        if (this.state.orderRefundData.product_id.length != 0 && this.state.orderRefundData.description) {
            Repository.post("/refund/order", { ...this.state.orderRefundData })
                .then(() => {
                    notification.success({ message: "Sent Successfully" });
                    this.setState({ showOrderRefund: false });
                }).catch((err) => {
                    notification.error({ message: "Something Went Wrong. Try again" });
                    this.setState({ showOrderRefund: false });
                })
        } else {
            const message = this.state.orderRefundData.product_id.length == 0 ? "Please Choose at least one product" : "Please enter description.";
            notification.error({ message })
        }
    }

    handleOrderReturnModalCancel = () => {
        this.setState({ showOrderReturn: false });
    }

    handleOrderReturnModalOk = () => {
        if (this.state.orderReturnData.product_id.length != 0 && this.state.orderReturnData.description) {
            Repository.post("/return/order", { ...this.state.orderReturnData })
                .then(() => {
                    notification.success({ message: "Sent Successfully" });
                    this.setState({ showOrderReturn: false });
                }).catch((err) => {
                    notification.error({ message: "Something Went Wrong. Try again" });
                    this.setState({ showOrderReturn: false });
                })
        } else {
            const message = this.state.orderReturnData.product_id.length == 0 ? "Please Choose at least one product" : "Please enter description.";
            notification.error({ message })
        }
    }

    handleOrderReturnProductChange = (event) => {
        this.setState({ orderReturnData: { ...this.state.orderReturnData, product_id: event } });
    };
    handleOrderReturnProductDescriptionChange = (e) => {
        this.setState({ orderReturnData: { ...this.state.orderReturnData, description: e.target.value } });
    }

    handleOrderRefundProductChange = (event) => {
        this.setState({ orderRefundData: { ...this.state.orderRefundData, product_id: event } });
    }

    handleOrderRefundProductDescriptionChange = (e) => {
        this.setState({ orderRefundData: { ...this.state.orderRefundData, description: e.target.value } });
    }

    handleSellerFeedbackModalOk = () => {

        if (this.state.sellerReview.rating != null && this.state.sellerReview.isItemDescribed != null && this.state.sellerReview.message != null) {
            Repository.post("/review/seller", { ...this.state.sellerReview })
                .then(() => {
                    notification.success({ message: "Reviews Added Successfully" });
                    this.setState({ showSellerFeedback: false });
                }).catch((err) => {
                    notification.error({ message: err.data.message });
                    this.setState({ showSellerFeedback: false });
                })
        } else {
            let message = "";
            if (this.state.sellerReview.rating === null) {
                message = "Please provide rating.";
            } else if (this.state.sellerReview.isItemDescribed === null) {
                message = "Please Choose Items as described by the seller yes or no.";
            } else if (this.state.sellerReview.message === null) {
                message = "Please enter message.";
            } else {
                message = "Something went wrong";
            }
            notification.error({ message })
        }
        /* Submit Seller feedback */
    }

    render() {
        const { orders, orderDetail } = this.props;
        const { isOrderDetails } = this.state;

        if (this.isShow) {
            this.isShow = false;
            this.setState({ isOrderDetails: true });
        }
        const columns = [
            {
                title: 'image',
                dataIndex: 'image',
                width: 100,
                render: (val, data) => (console.log('datadata', data))
            },
            {
                title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Products Name</strong>,
                dataIndex: 'title',
                render: (val, data) => <div>{data.detail ? data.detail.title : '-'}</div>
            },
            { title: <strong>Vendor</strong>, dataIndex: 'vendor', render: (val, data) => <div>{data.detail ? data.detail.vendor : '-'}</div> },
            { title: <strong>Price</strong>, width: 100, dataIndex: 'price', render: (val, data) => <div>₹ {data.detail ? data.detail.price : '-'}</div> },
            { title: <strong>Quantity</strong>, width: 100, dataIndex: 'quantity', render: (val, data) => <div>{data.quantity ? data.quantity : '-'}</div> },
            {
                title: <strong>Actions</strong>, width: 100, dataIndex: 'actions', render: (val, data) => {
                    return (
                        <Button style={{ marginTop: '0.625rem' }} block onClick={() => this.handleSellerFeedback(orderDetail._id)} >Give Seller Feedback</Button>
                    );
                }
            }
        ];
        const listData = [];
        let total = 10, limit = 10;
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ps-page__content">
                                <div className="ps-section--account-setting">
                                    <div className="ps-section__header">
                                        <h3>Your Orders</h3>
                                    </div>
                                    <div className="ps-section__content">
                                        <OrderDetails orders={orders}></OrderDetails>
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

const mapToProps = (state) => {
    return {
        orders: state.order.orderList,
        orderDetail: state.order && state.order.orderDetails && state.order.orderDetails.order
    }
};
const dispatchToProps = (dispatch) => {
    return {
        getOrders: () => {
            dispatch(getOrdersList())
        },
        getOrderDetails: (orderId) => {
            dispatch(getOrderDetails({ order_id: orderId }));
        }
    }
};
export default connect(mapToProps, dispatchToProps)(Orders);
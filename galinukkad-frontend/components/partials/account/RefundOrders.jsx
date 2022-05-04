// import React, { Component } from 'react';
// import AccountMenuSidebar from './modules/AccountMenuSidebar';
// import TableRefundOrders from './modules/TableRefundOrders';
// import { connect } from 'react-redux';
// import { Modal, Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, notification, Switch, Row, Col, Avatar, Pagination, Tabs, Popconfirm, Rate, Checkbox } from 'antd';
// import { getOrdersList } from '../../../store/order/action';

// class RefundOrders extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }


//     componentDidMount() {
//         this.props.getOrders();
//     }

//     render() {
//         const { orders } = this.props;

//         return (
//             <section className="ps-my-account ps-page--account">
//                 <div className="container">
//                     <div className="row">

//                         <div className="col-lg-8">
//                             <div className="ps-page__content">
//                                 <div className="ps-section--account-setting">
//                                     <div className="ps-section__header">
//                                         <h3>Return Order</h3>
//                                     </div>
//                                     <div className="ps-section__content">


//                                         {/* <TableInvoices 
//                                         orders={orders} 
//                                         onOrderSelect={this.orderSelect}
//                                         onOrderRefund={this.handleOrderRefund}
//                                         onOrderReturn={this.handleOrderReturn}
//                                         /> */}
//                                         <div>
//                                             <h4>Choose items to return</h4>
//                                             <div className="form-group d-flex">
//                                                 <div className="mr-2">
//                                                     <Checkbox.Group style={{ width: '100%' }} >
//                                                         <Row>
//                                                             {/* {this.state.orderReturn && this.state.orderReturn.product.map((p) => {
                                                                                
//                                                                             return ( */}
//                                                             <Col span={8}>
//                                                                 <Checkbox></Checkbox>
//                                                             </Col>
//                                                             {/* ); */}
//                                                             {/* }) */}
//                                                             {/* } */}
//                                                         </Row>
//                                                     </Checkbox.Group>
//                                                 </div>
//                                                 <div className="mr-4">

//                                                     <div className="d-flex justify-content-between">
//                                                         <div>
//                                                             <img src="#" alt="galinukkad-image" />
//                                                         </div>
//                                                         <div>
//                                                             <a href="#">Cute Doll</a>
//                                                             <p>₹ 700</p>
//                                                         </div>
//                                                     </div>
//                                                     <div>
//                                                         <h4>Why are you returning this item?</h4>
//                                                         <input type="text" classname="form-control" />
//                                                     </div>
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     {/* <h4>How can we make it right?</h4> */}
//                                                     {/* <div> */}
//                                                     <h4>How can we make it right?</h4>
//                                                     <div className="ps-form__decs">
//                                                         <div className="ps-radio">
//                                                             <input
//                                                                 className="form-control"
//                                                                 type="radio"
//                                                                 id="refund-type-1"
//                                                                 name="refund-type"
//                                                             />
//                                                             <label htmlFor="refund-type-1">
//                                                                 Replace with exact same item.
//                                                                 </label>
//                                                         </div>
//                                                         <div className="ps-radio">
//                                                             <input
//                                                                 className="form-control"
//                                                                 type="radio"
//                                                                 id="refund-type-2"
//                                                                 name="refund-type"
//                                                             />
//                                                             <label htmlFor="refund-type-2">
//                                                                 Add to your account
//                                                                 </label>
//                                                         </div>
//                                                     </div>
//                                                     {/* </div> */}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg-4">
//                             <div className="ps-page__left text-center" style={{ paddingTop: '20%' }}>
//                                 {/* <AccountMenuSidebar data={accountLinks} /> */}
//                                 <a
//                                     className="ps-btn ps-btn--black color-white"
//                                     href="#">
//                                     Continue
//                                 </a>
//                                 <div className="pt-4">
//                                     <p>Items you are returning</p>
//                                     <img src="#" alt="galinukkad-image" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <hr />
//                 </div>
//             </section>
//         );
//     }
// }

// const mapToProps = (state) => { 
//     return {
//         orders: state.order.orderList
//     }
// };
// const dispatchToProps = (dispatch) => {
//     return {
//         getOrders: () => {
//             dispatch(getOrdersList())
//         }
//     }
// };
// export default connect(mapToProps, dispatchToProps)(RefundOrders);

import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableRefundOrders from './modules/TableRefundOrders';
import {connect} from 'react-redux'
import {getOrdersList} from '../../../store/order/action';

class RefundOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {
        this.props.getOrders();
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
                                    <div className="ps-section__header">
                                        <h3>Refund Orders</h3>
                                    </div>
                                    <div className="ps-section__content">
                                        <TableRefundOrders orders={orders}/>
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
export default connect(mapToProps,dispatchToProps)(RefundOrders);
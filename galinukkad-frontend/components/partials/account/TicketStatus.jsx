import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import {connect} from 'react-redux'
import {getOrdersList} from '../../../store/order/action';
import { Button } from 'antd';
import Router from 'next/router';
class TicketStatus extends Component {
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
                                            <Button type="primary" onClick={() => {Router.push({pathname:'/account/support'})}}
                                            >
                                                My Tickets
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button type="primary" onClick={() => {Router.push({pathname:'/account/ticket-status'})}}
                                            >
                                                Ticket Status
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="ps-section__content">  
                                        <form className="ps-form--order-tracking" action="/" method="get">
                                            <div className="form-group">
                                                <label>Ticket ID</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter ticket id"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <button type="button" className="ps-btn ps-btn--fullwidth">Search Status</button>
                                            </div>
                                        </form>
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
export default connect(mapToProps,dispatchToProps)(TicketStatus);

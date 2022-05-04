import React, { Component } from 'react';
import Link from 'next/link';
import { Table, Form, Divider, Input, Radio, DatePicker } from 'antd';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableNotifications from './modules/TableNotifications';
import { connect } from 'react-redux';
import {actionTypes , markAsReadNotification ,deleteNotification , markAsUnreadNotification} from '../../../store/notifications/action';
import  Repository from '../../../repositories/Repository';
import moment from 'moment';


class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications:[]
        };
    }


    componentDidMount = () => {
       this.getAllLastNotification()
    }

    getAllLastNotification = async () => {
        await Repository.post('/notification/listing', {limit:10, page:0}).then((response) => {
            if (response.data.status) {
                this.setState({notifications:response.data.notification})
            }
        }).catch((err) => {
            // notification.error({ message: 'Account Verification Failed' });
        });
    }

    handleMarkAs = (payload,status) => {
        if(status == 0) {
            this.props.dispatch(markAsReadNotification(payload));
        } else {
            this.props.dispatch(markAsUnreadNotification(payload));
        }
    }
    
    handleDelete = (payload) => {
        this.props.dispatch(deleteNotification(payload));
    }

    markAs = async (id, status) =>{
        if(status == 0){
            await Repository.post('/mark-as-read', {id:id}).then((response) => {
                if (response.data.status) {
                    this.getAllLastNotification()
                }
            }).catch((err) => {
                notification.error({ message: 'Failed! Try again' });
            });
        }else{
            await Repository.post('/mark-as-unread', {id:id}).then((response) => {
                if (response.data.status) {
                    this.getAllLastNotification()
                }
            }).catch((err) => {
                notification.error({ message: 'Failed! Try again' });
            });
        }
        
    }



    deleteNotification = async (id) => {
        await Repository.post('/delete-notification', {id:id}).then((response) => {
            if (response.data.status) {
                this.getAllLastNotification()
            }
        }).catch((err) => {
            notification.error({ message: 'Failed! Try again' });
        });
    }

    render() {
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
                active: true,
            },
            {
                text: 'Orders',
                url: '/account/orders',
                icon: 'icon-papers',
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

        const tableColumn = [
            {
                title: 'Date Create',
                dataIndex: 'create',
                render: (text, record) => {
                    return moment(text).format('DD-MM-YYYY h:mm:ss a')
                }
            },
            {
                title: 'Message',
                dataIndex: 'message'
            },
            {
                title: 'Notification Type',
                dataIndex: 'notification_type'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (text, record) => {
                    return (
                    <span className="text-center"
                    style={{
                        color:record.status === 1 ? 'green' : 'red'
                    }} > { record.status === 1 ? 'Read' : 'Unread' } </span>);
                },
                key: 'status'
            },
            {
                title: 'Action',
                key: 'action',
                width: '250px',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={() => this.markAs(record._id, record.status)} >Mark as {record.status == 0 ? "Read" : "Unread" } </a>
                            <Divider type="vertical" />
                            <a onClick={() => this.deleteNotification(record._id)} >Delete</a>
                        </span>
                    );
                },
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
                                        <h3>Notifications</h3>
                                    </div>
                                    <div className="ps-section__content table-responsive">
                                        <Table columns={tableColumn} dataSource={this.state.notifications} rowKey={record => record._id} />
                                        {/* <TableNotifications notifications={this.state.notifications} markAs={this.handleMarkAs} deleteNotification={this.handleDelete}/> */}
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
        notifications:state.notification.notifications
    }
}

export default connect(mapToProps)(Notifications);

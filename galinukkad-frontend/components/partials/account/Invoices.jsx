import React, { Component } from 'react';
import AccountMenuSidebar from './modules/AccountMenuSidebar';
import TableInvoices from './modules/TableInvoices';

class Invoices extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            },
            // {
            //     text: 'Inbox',
            //     url: '/account/user-inbox',
            //     icon: 'icon-user',
            //     active: false
            // },
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
                                        <h3>Invoices</h3>
                                    </div>
                                    <div className="ps-section__content">
                                        <TableInvoices />
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

export default Invoices;

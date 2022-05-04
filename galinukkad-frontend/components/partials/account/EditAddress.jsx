import React, { Component } from 'react';
import Link from 'next/link';
import FormEditAddress from './modules/FormEditAddress';
import AccountMenuSidebar from './modules/AccountMenuSidebar'

class EditAddress extends Component {
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
                text: 'Address',
                url: '/account/addresses',
                icon: 'icon-map-marker',
                active: true,
            },
            {
                text: 'My Coupons',
                url: '/account/my-coupons',
                icon: 'icon-papers',
                active: false,
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
                icon: 'icon-store',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
                icon: 'icon-heart',
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
                            <div className="ps-page__left" style={{height:'auto'}}>
                                <AccountMenuSidebar data={accountLinks} />
                            </div>
							<p/>
                        </div>
                        <div className="col-lg-8">
                            <div className="ps-page__content">
                                <FormEditAddress />
								<p/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default EditAddress;

import React, { Component } from 'react';
import Link from 'next/link';
import AccountMenuSidebar from './modules/AccountMenuSidebar'
import Repository from '../../../repositories/Repository';
import Slider from 'react-slick';
import { carouselFullwidth, carouselStandard } from '../../../utilities/carousel-helpers';
import Product from '../../../components/elements/products/Product';

class RecentViewedProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {products:[]};
    }

    componentDidMount() {
        Repository.get('/recent-viewed-products')
        .then((res) => {
            const products = res.data.products.map((productData) => productData.product).filter((mappedData) => mappedData);
            this.setState({products});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render() {
        const { products } = this.state;
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
                icon: 'icon-map-marker',
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
                active: true,
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

        const productSlider = (
            <Slider {...carouselStandard} infinite={products.length < 4 ? false : true}
                className="ps-carousel">
                    {products.map(product => {
                        return (
                            <Product style="max-width:125px" product={product} key={product._id}/>
                        );
                    })}
            </Slider>
        );

        // if(products.length < 0) {
        //     productSlider = <p> No Related products found </p>;
        // }
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="d-none">
                            <div className="ps-page__left">
                                <AccountMenuSidebar data={accountLinks} />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <section className="ps-section--account-setting">
                            <div className="ps-section__header">
                                        <h3>Recent Viewed Products </h3>
                            </div>
                                <div className="ps-section__content">
                                {products.length > 0 ? 
                                productSlider

                                : "No Related products found"}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default RecentViewedProducts;

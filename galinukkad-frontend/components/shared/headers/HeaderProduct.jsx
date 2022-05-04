import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import NavigationDefault from '../navigation/NavigationDefault';
import HeaderActions from './modules/HeaderActions';
import MenuCategories from './modules/MenuCategories';
import SearchHeader from './modules/SearchHeader';
import { addItem } from '../../../store/cart/action';
import { stickyHeader } from '../../../utilities/common-helpers';
import { isStaticData } from '../../../utilities/app-settings';
import { baseUrl } from '../../../repositories/Repository';
import {getImageName} from '../../../utilities/functions-helper';
import TopNavBar from './headerMain.jsx';

class HeaderProduct extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
    }

    handleAddItemToCart = (e) => {
        e.preventDefault();
        const { productData } = this.props;
        const productsData = {...productData, quantity: 1};
        this.props.dispatch(addItem(productsData));
    };

    handleScroll = () => {
        let number =
            window.pageXOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

        if (number >= 300) {
            document
                .getElementById('headerSticky')
                .classList.add('header--sticky');
        } else {
            document
                .getElementById('headerSticky')
                .classList.remove('header--sticky');
        }
    };

    render() {
        const { productData } = this.props;
        const { singleProduct } = this.props;
        return (
            <header>
                <TopNavBar></TopNavBar>
            </header>
            // <header
            //     className="header header--1 header--product"
            //     data-sticky="true"
            //     id="headerSticky">
            //     <div className="header__top">
            //         <div className="ps-container">
            //             <div className="header__left">
            //                 <Link href="/">
            //                     <a className="ps-logo">
            //                         {/*<img
            //                             src="/static/img/logo_light.png"
            //                             alt="Galinukkad"
            //                         />*/}
			// 						<h2 style={{margin:0}}>Galinukkad</h2>
            //                     </a>
            //                 </Link>
            //                 <div className="menu--product-categories">
            //                     <div className="menu__toggle">
            //                         <i className="icon-menu"></i>
            //                         <span> Shop by Department</span>
            //                     </div>
            //                     <div className="menu__content">
            //                         <MenuCategories />
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="header__center">
            //                 <SearchHeader />
            //             </div>
            //             <div className="header__right">
            //                 <HeaderActions />
            //             </div>
            //         </div>
            //     </div>
            //     <NavigationDefault />
            //     <nav className="navigation navigation--product">
            //         <div className="container">
            //             <article className="ps-product--header-sticky">
            //                 <div className="ps-product__thumbnail">
            //                     <img
            //                         src={
            //                             isStaticData === false
            //                                 ? `${baseUrl}/${getImageName(productData.thumbnail[0])}`
            //                                 : singleProduct.thumbnail.url
            //                         }
            //                         alt="Galinukkad"
            //                     />
            //                 </div>
            //                 <div className="ps-product__wrapper">
            //                     <div className="ps-product__content">
            //                         <Link
            //                             href="/product/[pid]"
            //                             as={`/product/${productData.id}`}>
            //                             <a className="ps-product__title" style={{color: '#212529'}}>
            //                                 {productData.title}
            //                             </a>
            //                         </Link>
            //                     </div>
            //                     <div className="ps-product__shopping">
            //                         {singleProduct.is_sale ? (
            //                             <span className="ps-product__price">
            //                                 <span>${productData.price}</span>
            //                                 <del>
            //                                     ${productData.sale_price}
            //                                 </del>
            //                             </span>
            //                         ) : (
            //                             <span className="ps-product__price">
            //                                 <span>${productData.price}</span>
            //                             </span>
            //                         )}
            //                         <a
            //                             className="ps-btn"
            //                             href="#"
            //                             onClick={(e) =>
            //                                 this.handleAddItemToCart(e)
            //                             }>
            //                             Add to Cart
            //                         </a>
            //                     </div>
            //                 </div>
            //             </article>
            //         </div>
            //     </nav>
            // </header>
        );
    }
}
export default connect((state) => state.product)(HeaderProduct);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import Link from 'next/link';
import { Modal } from 'antd';
import Router from 'next/router'; 

import ProductDetailQuickView from '../detail/ProductDetailQuickView';
import { baseUrl } from '../../../repositories/Repository';
import { formatCurrency } from '../../../utilities/product-helper';
import { addItem } from '../../../store/cart/action';
import { addItemToCompare } from '../../../store/compare/action';
import { addItemToWishlist } from '../../../store/wishlist/action';
import { isStaticData } from '../../../utilities/app-settings';
import { getImageName } from '../../../utilities/functions-helper';
import { notification } from 'antd';
import { ToastContainer, toast , Flip } from 'react-toastify';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isQuickView: false,
        };
    }

    handleAddItemToCart = (e) => {
        e.preventDefault();

        const { product } = this.props;
        
        this.props.dispatch(addItem(product));
    };

    handleAddItemToCompare = (e) => {
        e.preventDefault();
        const { product  } = this.props;
        console.log('product_cat',this.props);

        let compareItems = this.props[0].compareItems;
        if(compareItems && compareItems.length > 0) {
            if(compareItems[0].category != product.category) {
                toast.error(`Please clear your compare list and again compare this category`);
                return ;
            }

            this.arrayIdExist(compareItems, product._id, 'compare list');

        }

        this.props.dispatch(addItemToCompare(product));
    };

    arrayIdExist = (arr, id, message) => {
        arr.map((item) => {
            if(item._id === id) {
                toast.error(`This product has been already added in your ${message}`);
                return ;
            }
        })
    }


    handleAddItemToWishlist = (e) => {
        e.preventDefault();
        const { product } = this.props;
        let wishlistItems = this.props[1].wishlistItems;


        this.arrayIdExist(wishlistItems, product._id, 'wishlist');


        let _id  = localStorage.getItem('LoginId');
       
        if(localStorage.getItem('accessToken'))
        {
            this.props.dispatch(addItemToWishlist(product));

        }
        else{
            // notification.error({ message: 'Please Login in your account!' });
    toast.error("Please Login in your account!");

            Router.push('/account/login');
            window.scrollTo(100, 200)

        }

    };

    handleShowQuickView = (e) => {
        e.preventDefault();
        this.setState({ isQuickView: true });
    };

    handleHideQuickView = (e) => {
        e.preventDefault();
        this.setState({ isQuickView: false });
    };

    render() {
        const { product, currency } = this.props;

        
        let productBadge = null;
        if (product.badge && product.badge !== null) {
            product.badge.map((badge) => {
                if (badge.type === 'sale') {
                    return (productBadge = (
                        <div className="ps-product__badge">{badge.value}</div>
                    ));
                } else if (badge.type === 'outStock') {
                    return (productBadge = (
                        <div className="ps-product__badge out-stock">
                            {badge.value}
                        </div>
                    ));
                } else {
                    return (productBadge = (
                        <div className="ps-product__badge hot">
                            {badge.value}
                        </div>
                    ));
                }
            });
        }
        return (
            <div className="ps-product bg-light">
                <div className="ps-product__thumbnail">
                    <Link href="/product/[pid]" as={`/product/${product._id}`}>
                        <a> {product.images ? <LazyLoad>
                                <img
                                    // style={{ height: "240px" }}
                                    className="product_images_mobile"
                                    src={
                                         isStaticData === false
                                            ? `${baseUrl}/${getImageName(product.images.file)}`
                                            : product.images.file
                                    }
                                    alt="Galinukkad"
                                />
                            </LazyLoad>
                            : ''}

                        </a>
                    </Link>
                    {product.badge ? productBadge : ''}
                    <ul className="ps-product__actions">
                        {/* <li>
                            <a
                                href="#"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Read More"
                                onClick={this.handleAddItemToCart.bind(this)}>
                                <i className="icon-bag2"></i>
                            </a>
                        </li> */}
                        <li>
                            <a
                                href="#"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Quick View"
                                onClick={this.handleShowQuickView.bind(this)}>
                              <i class="fa fa-eye text-warning " aria-hidden="true"></i>

                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Add to wishlist"
                                onClick={this.handleAddItemToWishlist.bind(
                                    this
                                )}>
                                    <i class="fa fa-heart text-warning" aria-hidden="true"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Compare"
                                onClick={this.handleAddItemToCompare.bind(
                                    this
                                )}>
                               <i class="fa fa-balance-scale text-warning" aria-hidden="true"></i>

                            </a>
                        </li>
                    </ul>
                </div>
                <div className="ps-product__container">
                    <Link href="/product/[pid]" as={`/product/${product._id}`}>
                                <a className="ps-product__vendor">{product.brand !== undefined ? product.brand : '&nbsp'}</a>
                    </Link>
                    <div className="ps-product__content">
                        <Link
                            href="/product/[pid]"
                            as={`/product/${product._id}`}>
                            <a className="ps-product__title">{product.title}</a>
                        </Link>
                        {product.is_sale === true ? (
                            <p className="ps-product__price sale">
                                {/* {currency ? currency.symbol : '$'} */}
                                &#8377;
                                {formatCurrency(product.price)}
                                <del className="ml-2"> 
                                    {/* {currency ? currency.symbol : '$'}  */}
                                    &#8377;
                                    {formatCurrency(product.sale_price)}
                                </del>
                            </p>
                        ) : (
                            <p className="ps-product__price ">
                                 &#8377; {formatCurrency(product.price)}
                                    {
                                        (product.mrp_price) ? 
                                        <strike style={{ marginLeft: "10px", fontWeight: "bold", fontSize: "12px", color: "grey" }}>&#8377;{formatCurrency(product.mrp_price)}</strike>
                                        : ""
                                    }
                            </p>
                        )}
                    </div>
                   
                </div>
                <Modal
                    title={product.title}
                    centered
                    footer={null}
                    width={1024}
                    onCancel={this.handleHideQuickView}
                    visible={this.state.isQuickView}>
                    <ProductDetailQuickView product={product} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return [state.compare ,state.wishlist];
};

export default connect(mapStateToProps)(Product);

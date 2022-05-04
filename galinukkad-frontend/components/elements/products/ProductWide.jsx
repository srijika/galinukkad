import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { addItem } from '../../../store/cart/action';
import { addItemToCompare } from '../../../store/compare/action';
import { addItemToWishlist } from '../../../store/wishlist/action';
import { isStaticData } from '../../../utilities/app-settings';
import { formatCurrency } from '../../../utilities/product-helper';
import { baseUrl } from '../../../repositories/Repository';

class ProductWide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isQuickView: false,
        };
    }

    handleAddItemToCart = e => {
        e.preventDefault();
        const { product } = this.props;
        this.props.dispatch(addItem(product));
    };

    handleAddItemToCompare = e => {
        e.preventDefault();
        const { product } = this.props;
        this.props.dispatch(addItemToCompare(product));
    };

    handleAddItemToWishlist = e => {
        e.preventDefault();
        const { product } = this.props;
        this.props.dispatch(addItemToWishlist(product));
    };

    handleShowQuickView = e => {
        e.preventDefault();
        this.setState({ isQuickView: true });
    };

    handleHideQuickView = e => {
        e.preventDefault();
        this.setState({ isQuickView: false });
    };

    render() {
        const { product, currency } = this.props;
        let productRating = null;
        if (product.badge) {
            product.badge.map(badge => {
                if (badge.type === 'sale') {
                    return (productRating = (
                        <div className="ps-product__badge">{badge.value}</div>
                    ));
                } else if (badge.type === 'outStock') {
                    return (productRating = (
                        <div className="ps-product__badge.out-stock">
                            {badge.value}
                        </div>
                    ));
                } else {
                    return (productRating = (
                        <div className="ps-product__badge.hot">
                            {badge.value}
                        </div>
                    ));
                }
            });
        }
        return (
            <div className="ps-product ps-product--wide">
                <div className="ps-product__thumbnail">
                    <Link href="/product/[pid]" as={`/product/${product.id}`}>
                        <a>
                            <img
                                src={
                                    isStaticData === false
                                        ? `${baseUrl}/${product.images.file}`
                                        : `${product.thumbnail.url}`
                                }
                                alt="Galinukkad"
                                style={{ height: "140px", width: "200px" }}
                            />
                        </a>
                    </Link>
                </div>
                <div className="ps-product__container">
                    <div className="ps-product__content">
                        <Link
                            href="/product/[pid]"
                            as={`/product/${product._id}`}>
                            <a className="ps-product__title">{product.title}</a>
                        </Link>
                        <p className="ps-product__vendor">
                            Sold by:
                            <Link href="/shop" >
                                <a className="ml-2 text-capitalize">{product.vendor}</a>
                            </Link>
                        </p>
                                
                        {/* <div>
                    <strong>Variants</strong>
                    {
                        product.variants && product.variants.length > 0 && product.variants[0] != "undefined" ?

                        <div className="ps-list--dot">
                            {product && product.variants.map(
                                (item,res) => (
                                    <div key={res}>
                                        <div className="d-flex">
                                            
                                            <div style={{  display: "flex", marginTop: "10px"}}> 
                                                <span > {item.label} :  </span>
                                                <div className="ml-2">   
                          
                                                    {item && item.value.split(',').map((variant) => {
                                                        return (
                                                            <button className="btn btn-secondary ml-1" type="button"> {variant} </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                )
                            )}
                        
                        </div>
                        :<p>No Vairants</p>

                    }
                    </div> */}



                        {product.productFeatures && product.productFeatures.length > 0?<ul className="ps-product__desc">
                        {product.productFeatures.map((item) => {
                            return <li>{item.label} : {item.value}</li>
                        })}
                    </ul>:<p> </p>
                    }
                    </div>

                   
                    <div className="ps-product__shopping">
                        {product.is_sale === true ? (
                            <p className="ps-product__price sale">
                                {currency ? currency.symbol : '$'}
                                {formatCurrency(product.price)}
                                <del className="ml-1">
                                    {currency ? currency.symbol : '$'}
                                    {product.sale_price}{' '}
                                </del>
                            </p>
                        ) : (
                            <p className="ps-product__price">
                                {currency ? currency.symbol : '$'}
                                {formatCurrency(product.price)}
                            </p>
                        )}
                         {/* <a
                            className="ps-btn"
                            href="#"
                            onClick={this.handleAddItemToCart.bind(this)}>
                            Add to cart
                        </a> 
                        <ul className="ps-product__actions">
                            <li>
                                <a
                                    href="#"
                                    onClick={this.handleAddItemToWishlist.bind(
                                        this
                                    )}>
                                    <i className="icon-heart"></i> Wishlist
                                </a>
                            </li> 
                             <li>
                                <a
                                    href="#"
                                    onClick={this.handleAddItemToCompare.bind(
                                        this
                                    )}>
                                    <i className="fa fa-balance-scale" aria-hidden="true"></i> Compare
                                </a>
                            </li> 
                        </ul> */}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.setting;
};
export default connect(mapStateToProps)(ProductWide);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import { addItem , buyItem } from '../../../../../store/cart/action';
import Link from 'next/link';
import Rating from '../../../Rating';
// import {calculateReviews} from '../../../../../utilities/functions-helper';
import {   FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton, } from "react-share";
import { FacebookIcon, TwitterIcon  , LinkedinIcon, WhatsappIcon} from "react-share";
class InformationQuickView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            disabled:false
        };
    }

    handleAddItemToCart = e => {
        e.preventDefault();
        const { product } = this.props;
        let tempProduct = {...product};
        tempProduct.quantity = this.state.quantity;
        this.props.dispatch(addItem(product));
    };

    handleBuyItemToCart = e => {
        e.preventDefault();
        const { product } = this.props;
        let tempProduct = product;
        tempProduct.quantity = this.state.quantity;
        this.props.dispatch(buyItem(product));
        this.setState({disabled: true});
    };

    handleIncreaseItemQty = e => {
        e.preventDefault();
        this.setState({ quantity: this.state.quantity + 1 });
    };

    handleDecreaseItemQty = e => {
        e.preventDefault();
        if (this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    };


    calculateReviews(reviews) {
        let reviewCount = 0;
        
         if(reviews && reviews.length > 0) {
             let totalReviews = reviews.length;
             reviews.forEach((review) => {
                 reviewCount += review.rating;
             });
             reviewCount /= totalReviews;
             return reviewCount;
         }
         else {
             return 0;
         }
 
     }

    render() {
        const { product } = this.props;


        console.log('product isisisisiiis');
        console.log(product);


        let title;
        let url;
        if (typeof window !== "undefined") {
            title = window.document.title 
            url = window.location.href + '/product/' + product._id
        }
        console.log(url)


        return (
            <div className="ps-product__info">
                <h1>{product.title} </h1>
                <div className="ps-product__meta">
                    {![undefined, '', null].includes(product.brand) 
                    ? 
                    <p>
                        Brand:
                        <Link href="/shop">
                            <a className="ml-2 share_links text-capitalize">{product.brand}</a>
                        </Link>
                    </p>
                    : ""}
                    <div className="ps-product__rating">
                        {/* <Rating rating={this.calculateReviews(product.review)} />
                        <span>({product.review && product.review.length > 0?product.review.length: 0} review)</span> */}
                    </div>
                </div>
                {product.is_sale === true ? (
                    <h4 className="ps-product__price sale">
                        &#8377;{product.price} <del>&#8377;{product.sale_price}</del>
                    </h4>
                ) : (
                    <h4 className="ps-product__price">&#8377;{product.price}</h4>
                )}
                <div className="ps-product__desc">
                    <p>
                        Sold By:
                        <Link href="/shop">
                            <a>
                                <strong> {product.vendor}</strong>
                            </a>
                        </Link>
                    </p>





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
                                                    {/* {console.log(item)} */}
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
                </div>
                {/* <div className="ps-product__shopping">
                    <figure>
                        <figcaption>Quantity</figcaption>
                        <div className="form-group--number">
                            <button
                                className="up"
                                onClick={this.handleIncreaseItemQty.bind(this)}>
                                <i className="fa fa-plus"></i>
                            </button>
                            <button
                                className="down"
                                onClick={this.handleDecreaseItemQty.bind(this)}>
                                <i className="fa fa-minus"></i>
                            </button>
                            <input
                                className="form-control"
                                type="text"
                                placeholder={this.state.quantity}
                                disabled
                            />
                        </div>
                    </figure>
                     <a
                        className="ps-btn ps-btn--black"
                        href="#"
                        disabled={this.state.disabled}
                        onClick={this.handleAddItemToCart.bind(this)}>
                        Add to cart
                    </a>
                    <a 
                    disabled={this.state.disabled}
                    onClick={this.handleBuyItemToCart.bind(this)}
                    className="ps-btn" href="#">
                        Buy Now
                    </a> 
                </div> */}
                <div className="ps-product__specification">
                    {/* <Link href="/page/blank">
                        <a className="report">Report Abuse</a>
                    </Link> */}
                    <p>
                        <strong>SKU:</strong> {product.sku}
                    </p>
                    <p className="categories">
                        <strong> Categories:</strong>
                        {product.category_name}
                        
                    </p>
                    <p className="tags">
                        <strong> Tags</strong>
                        {(product.keywords && product.keywords.length) ? product.keywords.map((text,i) => {
                            return (
                                <span key={i}>
                                    <Link href="/shop">
                                        <a>{text}</a>
                                    </Link>
                                    {i !== (product.keywords.length - 1)?',':null }
                                    </span>
                                    )
                        }) : <span>No tags found.</span>}
                    </p>
                </div>
                <div className="ps-product__sharing">
                    {/* <a className="facebook" href="#">
                        <i className="fa fa-facebook"></i>
                    </a>
                    <a className="twitter" href="#">
                        <i className="fa fa-twitter"></i>
                    </a>
                    <a className="google" href="#">
                        <i className="fa fa-google-plus"></i>
                    </a>
                    <a className="linkedin" href="#">
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <a className="instagram" href="#">
                        <i className="fa fa-instagram"></i>
                    </a> */}
                    <FacebookShareButton quote={title} url={url} title={title} className="ml-2 share_links ">
            <FacebookIcon
              size={"6rem"} // You can use rem value instead of numbers
              round
            />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title} className="ml-2 share_links">
            <TwitterIcon size={"6rem"} round />
          </TwitterShareButton>

          <WhatsappShareButton title={title} url={url} separator=":: " className="ml-2 share_links">
            <WhatsappIcon size={"6rem"} round />
          </WhatsappShareButton>

          <LinkedinShareButton
          className="ml-2 share_links"
            title={title}
            url={url}
            windowWidth={770}
            windowHeight={600}
          >
            <LinkedinIcon size={"6rem"} round />
          </LinkedinShareButton>



                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.cart;
};
export default connect(mapStateToProps)(InformationQuickView);

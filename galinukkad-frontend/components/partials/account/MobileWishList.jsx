import React, { Component } from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { isStaticData } from '../../../utilities/app-settings';
import { baseUrl } from '../../../repositories/Repository';
import { getImageName } from '../../../utilities/functions-helper';
import { addItem } from '../../../store/cart/action';
import { removeWishlistItem } from '../../../store/wishlist/action';
// import Link from 'next/link';
import { Rate } from 'antd';
import ProductCart from '../../elements/products/ProductCart';
import {getWishlistList} from '../../../store/wishlist/action.js'

import {
    getCart,
    increaseItemQty,
    decreaseItemQty,
    removeItem,
} from '../../../store/cart/action';

import Link from 'next/link';
// import ProductCart from '../../elements/products/ProductCart';

class MobileWishList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(getWishlistList());
    }

      handleRemoveWishListItem = (e, product) => {
        e.preventDefault();
        this.props.dispatch(removeWishlistItem(product));
    };


    render() {
        const { amount, cartTotal, cartItems } = this.props;
        const { wishlistItems } = this.props;
        let currentCartItems = wishlistItems;
        // if (cartItems && cartItems.length > 0) {
        //     currentCartItems = cartItems;
        // }
console.log(currentCartItems)
        
        return (
            <div className="ps-section--shopping ps-shopping-cart mb-5">
                <div className="container">
                <div className="d-flex justify-content-between ">
                    <span className="wishlist_header">
                    My WishList:
                    </span>

                        <span className="pr-2 pt-3 " style={{ borderBottom : "1px solid #000" , fontSize : "16px" }}>
                    {currentCartItems.length} Items
                    </span>
                    </div>
                    <hr/>
                    <div className="ps-section__content mt-5">
                        <div className="">
                            <div className="row">
                                <div className="col-lg-9">


                            {currentCartItems.map((product, index) => (
                            <div className="cart_res" >
<ul className="cart-wrap">
  <li className="item-info">
    <div className="item-img">
    <Link href="/product/[pid]" as={`/product/${product._id}`}>
      <a >
      <LazyLoad>
        <img
         src={
            isStaticData === false
                ? `${baseUrl}/`+getImageName(product.images.file)
                : product.thumbnail.url
        }
          alt="Sp. red fresh guava - 1kg / canada"
          height={100}
        />
        </LazyLoad>
      </a>
      </Link>

    </div>
    <div className="item-title">
    <Link href="/product/[pid]" as={`/product/${product._id}`}>
      <a className="text-info">
      {product.title.substr(0,60)}
      </a>
      </Link>

      <span className="item-option">
      <span>Brand:</span>
        <span className="ml-2">{product.brand}</span>
        <br />
        <span>Vendor:</span>
        <span className="ml-2">{product.vendor}</span>

      </span>
     
    
    </div>
  </li>
  <li className="">
     <span className="remove-wrap">
    <a
                                                        href="#"
                                                        onClick={e =>
                                                            this.handleRemoveWishListItem(
                                                                e,
                                                                product
                                                            )
                                                        }>
                                                    
                                                 <left>   <i class="fa fa-times  text-left  text-warning pl-5 fa-lg" aria-hidden="true"></i></left> 
                                                    </a>
      </span>
  
  </li>
  <li className="item-price">
    <span className="amount full-price">
      <span
        className="Bold-theme-hook-DO-NOT-DELETE bold_cart_item_total"
        style={{ display: "none !important" }}
      />
      <span
        className="money money_bolder font-weight-bolder"
        // data-original-value={3000}
        // data-inr="Rs. 2,225.91"
      >
         <span className="item-option">
        <span className="item-price">
          <span
            className="Bold-theme-hook-DO-NOT-DELETE bold_cart_item_price"
            style={{ display: "none !important" }}
          />
          <span className="money">
            <span
              className="money font-weight-bold " 
            //   data-original-value={3000}
            //   data-inr="Rs. 2,225.91"
            >
             ₹ {parseFloat(product.price).toFixed(2)}
            </span>
          </span>
          <div className="item-remove">
    
    </div>
        </span>
      </span>
      </span>
    </span>
  </li>
</ul>
</div>
                                    ))}


<div className="d-flex justify-content-between  pb-3 ">

<Link href="/"><a className="mt-4"><i class="fa fa-arrow-left mr-3" aria-hidden="true"></i> Continue shopping</a></Link> 
    
        {/* <span className="pr-2 text-warning">
    Clear Cart
    </span> */}
    </div>
    <hr />

                        </div>
                        

                        </div>
                        {/* <div className="ps-section__cart-actions">
                            
                        </div> */}
                    </div>
                   
                </div>
                
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
console.log(state.cart)

    return state.wishlist;
};
export default connect(mapStateToProps)(MobileWishList);















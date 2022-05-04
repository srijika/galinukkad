import React, { Component } from 'react';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { isStaticData } from '../../../utilities/app-settings';
import { baseUrl } from '../../../repositories/Repository';
import { getImageName } from '../../../utilities/functions-helper';

import {
    getCart,
    increaseItemQty,
    decreaseItemQty,
    removeItem,
} from '../../../store/cart/action';

import Link from 'next/link';
import ProductCart from '../../elements/products/ProductCart';

class ShoppingCartMobile extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(getCart());
    }

    handleIncreaseItemQty = (event, product) => {
        this.props.dispatch(increaseItemQty(product));
    }

    handleDecreaseItemQty = (event, product) => {
        this.props.dispatch(decreaseItemQty(product));
    }

    handleRemoveCartItem = product => {
        this.props.dispatch(removeItem(product));
    };

    render() {
        const { amount, cartTotal, cartItems } = this.props;
        let currentCartItems = [];
        if (cartItems && cartItems.length > 0) {
            currentCartItems = cartItems;
        }
console.log(currentCartItems)
        
        return (
            <div className="ps-section--shopping ps-shopping-cart mb-5">
                <div className="container">
                <div className="d-flex justify-content-between ">
                    <span className="wishlist_header">
                    My Cart:
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
                            {/* <table className="table ps-table--shopping-cart">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                       
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCartItems.map((product, index) => (
                                        <tr key={index}>
                                            <td>
                                                <ProductCart product={product}/>
                                            </td>
                                            <td className="price">
                                                ₹ {parseFloat(product.price).toFixed(2)}
                                            </td>
                                            <td>
                                                <div>
                                                <div className="form-group--number my-3 w-75">
                                                    <button
                                                        className="up mr-3"
                                                        onClick={(e) => this.handleIncreaseItemQty(e, product)}>
                                                        +
                                                    </button>
                                                    <button
                                                        className="down ml-3 "
                                                        onClick={(e) => this.handleDecreaseItemQty(e, product)}>
                                                        -
                                                    </button>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="1"
                                                        value={product.quantity}
                                                        readOnly={true}
                                                    />
                                                </div>
<br />
                                                <a
                                                    
                                                    onClick={this.handleRemoveCartItem.bind(
                                                        this,
                                                        product
                                                    )}>
                                                    <i className="icon-cross text-dark font-weight-bold"></i>
                                                </a>
</div>
                                            </td>
                                            <td>
                                                ₹ {parseFloat(product.quantity * product.price).toFixed(2)}
                                            </td>
                                           
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}


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
        <span>Size:</span>
        <span>{product.variants.length === 0 ? "-" : product.variants[0].size}</span>
      </span>
     
      <span className="item-option">
        <span className="item-price">
          <span
            className="Bold-theme-hook-DO-NOT-DELETE bold_cart_item_price"
            style={{ display: "none !important" }}
          />
          <span className="money">
            <span
              className="money"
            //   data-original-value={3000}
            //   data-inr="Rs. 2,225.91"
            >
             ₹ {parseFloat(product.price).toFixed(2)}
            </span>
          </span>
        </span>
      </span>
    </div>
  </li>
  <li className="item-qty">
    <div className="product-quantity-action">
      <div className="product-quantity" data-variant={40039110443157}>
        <div className="cart-plus-minus">
          <div className="dec qtybutton"  onClick={(e) => this.handleDecreaseItemQty(e, product)}>-</div>
          <input type="text" value={product.quantity}
                                                        readOnly={true} className="qt" />
          <div className="inc qtybutton"  onClick={(e) => this.handleIncreaseItemQty(e, product)}>+</div>
        </div>
        <span className="dec qtybtn" />
        <span className="inc qtybtn" />
      </div>
    </div>
    <div className="item-remove">
      <span className="remove-wrap">
        <a  
                                                    onClick={this.handleRemoveCartItem.bind(
                                                        this,
                                                        product
                                                    )}>Remove</a>
      </span>
    </div>
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
       ₹ {parseFloat(product.quantity * product.price).toFixed(2)}
      </span>
    </span>
  </li>
</ul>
</div>
                                    ))}


<div className="d-flex justify-content-between  pb-3 ">

<Link href="/"><a className="mt-3 " ><i class="fa fa-arrow-left mr-3" aria-hidden="true"></i> Continue shopping</a></Link> 
    
        {/* <span className="pr-2 text-warning">
    Clear Cart
    </span> */}
    </div>
    <hr />

                        </div>
                        
<div className="col-lg-3">

                            <div className="ps-section__footer">
                                <div className="ps-block--shopping-total">
                                    <div className="ps-block__header">
                                        <p className="font-weight-bolder text-dark">
                                            Subtotal <span className="font-weight-bolder text-dark">₹ {amount}</span>
                                        </p>
                                    </div>
                                    <div className="ps-block__content">
                                        <ul className="ps-block__product">
                                            {cartItems.length > 0
                                                ? cartItems.map(
                                                      (product, index) => {
                                                          if (index < 3) {
                                                              return (
                                                                  <li key={index}>
                                                                      <span className="ps-block__estimate">
                                                                          <Link
                                                                              href="/product/[pid]"
                                                                              as={`/product/${product.id}`}>
                                                                              <a className="ps-product__title">
                                                                                  {
                                                                                      product.title
                                                                                  }
                                                                                  <br />{' '}
                                                                                  x{' '}
                                                                                  {
                                                                                      product.quantity
                                                                                  }
                                                                              </a>
                                                                          </Link>
                                                                      </span>
                                                                  </li>
                                                              );
                                                          }
                                                      }
                                                  )
                                                : ''}
                                        </ul>
                                        <h3>
                                            Total <span>₹ {amount}</span>
                                        </h3>
                                    </div>
                                </div>
                                {amount == 0 ? '' : 
                                 <Link href="/account/checkout">
                                 <a className="ps-btn ps-btn--fullwidth">
                                     Proceed to checkout
                                 </a>
                             </Link>}
                            
                        
                    </div>
                            
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

    return state.cart;
};
export default connect(mapStateToProps)(ShoppingCartMobile);














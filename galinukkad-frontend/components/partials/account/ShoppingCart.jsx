import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    getCart,
    increaseItemQty,
    decreaseItemQty,
    removeItem,
    updateCartAmount
} from '../../../store/cart/action';

import Link from 'next/link';
import ProductCart from '../../elements/products/ProductCart';

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

       
        this.getCartData()
    }

    getCartData = () => {
        this.props.dispatch(getCart());
        setTimeout(() =>{
            console.log("totalAmt" , this.props.cartItems)
            let totalAmt ;
            if(this.props.cartItems.length === 0){
                totalAmt = 0;
            }else{
                totalAmt= this.props.cartItems && this.props.cartItems.map((item)=> {
                    return (item.price * item.quantity)
        
                }).reduce((acc , totalAmt) => {
                    return acc += totalAmt
                })
            }
  

     
        console.log("totalAmt" , totalAmt)
        
        this.props.dispatch(updateCartAmount(totalAmt));

        }, 10)


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
        console.log("amount_________" , amount)
        let currentCartItems = [];
        if (cartItems && cartItems.length > 0) {
            currentCartItems = cartItems;
        }
        return (
            <div className="ps-section--shopping ps-shopping-cart mb-5">
                <div className="container">
                    <div className="text-center">
                    {/* <Link href="/" >
                                <a className="text-info align-self-center">
                                    <i className="icon-arrow-left"></i>
                                    Back to Home
                                </a>
                            </Link> */}
                        <h2 className="mt-5 pt-4 mb-5 pb-5">Shopping Cart</h2>
                    </div>
                    <div className="ps-section__content mt-5">
                        <div className="table-responsive">
                            <div className="row">
                                <div className="col-lg-9">
                            <table className="table ps-table--shopping-cart">
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
                                                {product.quantity < product.inventory - 1 ?
                                                    <button
                                                        className="up mr-3"
                                                        onClick={(e) => this.handleIncreaseItemQty(e, product)}>
                                                        +
                                                    </button> 
                                                    : 
                                                    <button
                                                        className="up mr-3 bg-danger"
                                                        disabled
                                                        onClick={(e) => this.handleIncreaseItemQty(e, product)}>
                                                        +
                                                    </button>
                                                }
                                                    
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
                                               { console.log("productsssssssssss" , product.quantity)}

                                                </div>
<br />
                                                <a
                                                    href="#"
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
                            </table>

<div className="d-flex justify-content-between  pb-3">

<Link href="/"><a><i class="fa fa-arrow-left mr-3" aria-hidden="true"></i> Continue shopping</a></Link> 
    
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

                                                                              <span className="ps-product__title">
                                                                                  {
                                                                                      product.title
                                                                                  }
                                                                                  <br />{' '}
                                                                                  x{' '}
                                                                                  {
                                                                                      product.quantity
                                                                                  }
                                                                              </span>
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
                                {console.log("amount == 0" , amount == 0)}
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
export default connect(mapStateToProps)(ShoppingCart);















// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import {
//     getCart,
//     increaseItemQty,
//     decreaseItemQty,
//     removeItem,
// } from '../../../store/cart/action';

// import Link from 'next/link';
// import ProductCart from '../../elements/products/ProductCart';

// class ShoppingCart extends Component {
//     constructor(props) {
//         super(props);
//     }

//     componentDidMount() {
//         this.props.dispatch(getCart());
//     }

//     handleIncreaseItemQty = (event, product) => {
//         this.props.dispatch(increaseItemQty(product));
//     }

//     handleDecreaseItemQty = (event, product) => {
//         this.props.dispatch(decreaseItemQty(product));
//     }

//     handleRemoveCartItem = product => {
//         this.props.dispatch(removeItem(product));
//     };

//     render() {
//         const { amount, cartTotal, cartItems } = this.props;
//         let currentCartItems = [];
//         if (cartItems && cartItems.length > 0) {
//             currentCartItems = cartItems;
//         }
//         return (
//             <div className="ps-section--shopping ps-shopping-cart mb-5">
//                 <div className="container">
//                     <div className="text-center">
//                     {/* <Link href="/" >
//                                 <a className="text-info align-self-center">
//                                     <i className="icon-arrow-left"></i>
//                                     Back to Home
//                                 </a>
//                             </Link> */}
//                         <h2 className="mt-5 pt-4 mb-5 pb-5">Shopping Cart</h2>
//                     </div>
//                     <div className="ps-section__content mt-5">
                            
              
//                     <div className="ps-section__content mt-4">
//                         <div className="col-lg-12">
//                         <div class="row">
//                         <div class="col-lg-6">
//                         <div className="table-responsive">
//                             <div className="row">
//                                 <div className="col-lg-9">
//                             <table className="table ps-table--shopping-cart">
//                                 <thead>
//                                     <tr>
//                                         <th>Product</th>
//                                         <th>Price</th>
//                                         <th>Quantity</th>
//                                         <th>Total</th>
                                       
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {currentCartItems.map((product, index) => (
//                                         <tr key={index}>
//                                             <td>
//                                                 <ProductCart product={product}/>
//                                             </td>
//                                             <td className="price">
//                                                 ₹ {parseFloat(product.price).toFixed(2)}
//                                             </td>
//                                             <td>
//                                                 <div>
//                                                 <div className="form-group--number my-3 w-75">
//                                                     <button
//                                                         className="up mr-3"
//                                                         onClick={(e) => this.handleIncreaseItemQty(e, product)}>
//                                                         +
//                                                     </button>
//                                                     <button
//                                                         className="down ml-3 "
//                                                         onClick={(e) => this.handleDecreaseItemQty(e, product)}>
//                                                         -
//                                                     </button>
//                                                     <input
//                                                         className="form-control"
//                                                         type="text"
//                                                         placeholder="1"
//                                                         value={product.quantity}
//                                                         readOnly={true}
//                                                     />
//                                                 </div>
// <br />
//                                                 <a
//                                                     href="#"
//                                                     onClick={this.handleRemoveCartItem.bind(
//                                                         this,
//                                                         product
//                                                     )}>
//                                                     <i className="icon-cross text-dark font-weight-bold"></i>
//                                                 </a>
// </div>
//                                             </td>
//                                             <td>
//                                                 ₹ {parseFloat(product.quantity * product.price).toFixed(2)}
//                                             </td>
                                           
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>

// <div className="d-flex justify-content-between  pb-3">
//     <span className="wishlist_header text-warning pe-auto">
//     Continue shopping
//     </span>

//         <span className="pr-2 text-warning">
//     Clear Cart
//     </span>
//     </div>
//     <hr />

//                         </div>
                        
// <div className="col-lg-3">
//                             </div>
//                             </div>

//                         <div class="col-lg-4">


//                             <div className="ps-section__footer">
//                                 <div className="ps-block--shopping-total">
//                                     <div className="ps-block__header">
//                                         <p className="font-weight-bolder text-dark">
//                                             Subtotal <span className="font-weight-bolder text-dark">₹ {amount}</span>
//                                         </p>
//                                     </div>
//                                     <div className="ps-block__content">
//                                         <ul className="ps-block__product">
//                                             {cartItems.length > 0
//                                                 ? cartItems.map(
//                                                       (product, index) => {
                                                          
//                                                               return (
//                                                                   <li key={index}>
//                                                                       <span className="ps-block__estimate">
//                                                                           <Link
//                                                                               href="/product/[pid]"
//                                                                               as={`/product/${product.id}`}>
//                                                                               <a className="ps-product__title">
//                                                                                   {
//                                                                                       product.title
//                                                                                   }
//                                                                                   <br />{' '}
//                                                                                   {' '}
//                                                                                   {
//                                                                                       product.quantity
//                                                                                   }
//                                                                               </a>
//                                                                           </Link>
//                                                                       </span>
//                                                                   </li>
//                                                               );
//                                                           }
//                                                   )
//                                                 : ''}
//                                         </ul>
                                        
//                                         <h3>
//                                             Total <span>₹ {amount}</span>
//                                         </h3>
//                                     </div>
//                                 </div>
//                                 <Link href="/account/checkout">
//                                     <a className="ps-btn ps-btn--fullwidth" style={{ width : '303px' }}>
//                                         Proceed to checkout
//                                     </a>
//                                 </Link>
                            
                        
//                     </div>
                            
//                         </div>
//                         </div>
//                         {/* <div className="ps-section__cart-actions">
                            
//                         </div> */}
//                         </div>

//                         </div>
//                     </div>
//                     </div>
//                 </div>
                
//                 </div>
//                         </div>
//         );
//     }
// }

// const mapStateToProps = state => {
// console.log(state.cart)

//     return state.cart;
// };
// export default connect(mapStateToProps)(ShoppingCart);

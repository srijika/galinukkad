import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCart , updateCartAmount} from '../../../store/cart/action';
import Link from 'next/link';
import StripeCheckout from 'react-stripe-checkout';
import  Repository from '../../../repositories/Repository';
import axios from 'axios';
import { notification } from 'antd';
import Router  from 'next/router';
import { actionTypes } from '../../../store/cart/action';
import { toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';




class Shipping extends Component {
    state = { 
        shippingInfo: '',
        shippingCharge:0 ,
        promocodeApply:false,
        clearcartdispatch: {},
        promocode:'',
        updatedPrice:0 ,
        amountCart : 0
    };
    constructor(props) {
        super(props);
       
       
    }

    handlePayment = () => {
        this.setState({ showPayment : true});
        this.setState({ clearcartdispatch : true});

        console.log(this.props)
    }

    changePromoCode = (event) => {
        this.setState({promocode : event.target.value});
    }

    applyPromoCode = async () =>{ 
        if(this.state.promocode && this.state.promocode.length > 0){
            const { amount } = this.props;
            console.log("amount" , amount)
            await Repository.get('/apply-coupon-codes-on-all-product?code='+this.state.promocode+'&product_amt='+amount).then((response) => {
                if (response.data.status) {
                    console.log("updated price" , response.data.data)
                    this.setState({ promocodeApply:true, })

                    toast.success('Coupon Code applied successfully!');
                    //update cart Amount
                    this.props.dispatch(updateCartAmount(response.data.data));
                }else{
                    toast.error(response.data.message);
                }
            }).catch((err) => {
                toast.error("Please Login in your account!");
                Router.push('/account/login');
            });
        }else{
            
    toast.error("Please add promo code!");

        }
    }
    removePromoCode = async () =>{
        const { amount } = this.props;
        console.log(this.state.amountCart);
        this.setState({ promocodeApply:false })
        toast.success('Remove successfully!');
        this.props.dispatch(updateCartAmount(this.state.amountCart));



    }

    handleToken = async (token, addresses) => {

        const { shippingInfo } = this.state;
        const { cartItems , amount } = this.props;
        console.log(amount)
        console.log("cartItems : ", cartItems);
        let paramsItem = {...shippingInfo , payment_method: 'card',address_id: shippingInfo._id, product: cartItems.map((item) => ({id:item._id , quantity : item.quantity, price: item.price, shipping_rates: item.shipping_rates, variants:item.variants, coupon_code: item.coupon_code})), stripe_token: token.id, currency: "INR" , amount: (parseInt(amount) + 20) }
        console.log("paramsItem : ", paramsItem);
        
        // await Repository.post('place/order', paramsItem)
        // .then((response) => {
        //     if (response.data.status) {
        //         notification.success({
        //             message: 'Payment Successfull',
        //           });
        //         this.props.dispatch({ type: actionTypes.CLEAR_CART});
        //         Router.push('/account/orders');
        //     }else{
        //         notification.error({
        //             message: response.data.message
        //         });
        //     }
        // }).catch((err) => {
        //     notification.error({
        //         message: 'Payment Failed',
        //     });
        // });
    }

    processRazorPay = async () =>{


        const { shippingInfo } = this.state;
        let shipping_price = JSON.parse(localStorage.getItem('shipping_price'));

        const { cartItems , amount } = this.props;
        console.log(amount)
        let masterData = {...shippingInfo , 
            payment_method: 'card',
            address_id: shippingInfo._id, 
            product: cartItems.map((item) => ({ id:item._id , 
                quantity : item.quantity, 
                variants : item.variants, 
                price: item.price, 
                shipping_rates: item.shipping_rates, 
                coupon_code: item.coupon_code 
            })), 
            stripe_token: '', 
            currecy: "INR" , 
            shipping: "Free",
            shipping_price: shipping_price,
            amount: (parseInt(amount) + parseInt(this.state.shippingCharge) ) 
        }
        // amount: (parseInt(amount) + parseInt(this.state.shippingCharge)) 
        console.log(parseInt(amount) + parseInt(this.state.shippingCharge))
        
        await Repository.post('place/order', masterData)
        .then((response) => {

            console.log(response);

            if (response.data.status) { 

                console.log('responseresponse');
                console.log(response);
                let order_id = response.data.data;
                this.OperRazorPay(response, masterData, order_id);
            }else{
                notification.error({
                    message: response.data.message
                });
            }
        }).catch((err) => {
            notification.error({
                message: 'Payment Failed',
            });
        });
    }

    OperRazorPay = async (response, masterData, order_id) =>{
        const { dispatch , amount } = this.props;
        
        const res = await this.loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            notification.error({
                message: "Razorpay SDK failed to load. Are you online?"
            });
            return;
        }

        console.log('res is : ');
        console.log(res);

        const options = {
            key: response.data.razorpayData.merchant_key_id,
            amount: (masterData.amount * 100).toString(),
            currency: masterData.currency,
            name: masterData.fname +' '+masterData.lname,
            description: "Test Transaction",
            image: '/static/img/index.jpeg',
            order_id: response.data.razorpayData.id,
            handler: async function (response1) {
                
                
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response1.razorpay_payment_id,
                    razorpayOrderId: response1.razorpay_order_id,
                    razorpaySignature: response1.razorpay_signature,
                };

                console.log('data is working');
                console.log(response.data.razorpayData.id);

                await Repository.post('razorpay/order/response', data)
                .then((response) => {

                    if(response.data.status) {   
                        toast.success('Payment Successfull');
                        dispatch({ type: actionTypes.CLEAR_CART });
                        Router.push('/account/orders');
                    }

                }).catch((err) => {
                    notification.error({
                        message: 'Payment Failed',
                    });
                });

                
            },
            prefill: {
                name: masterData.fname +' '+masterData.lname,
                email: masterData.email,
                contact: masterData.phone,
            },
            notes: {
                address: masterData.add1 +' '+ masterData.add2 +' '+ masterData.postal,
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }



    loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    componentDidMount() {
        // this.props.dispatch(getCart());
        this.getCartData()
        const { address , amount }  = this.props;
        this.setState({ amountCart:amount });

        this.props.dispatch(updateCartAmount(amount));

        
        if(address) {
            this.setState({shippingInfo:{...address}});    
        } else {
            Router.push('checkout');
        }

        if(this.props.cartItems){
            // this.props.cartItems.map((product, index)=>{

            //     shipRate += product.shipping_rates*product.quantity;
            // })
            // const { amount} = this.props;
            // let shipRate = 0;
            // if(parseInt(amount) < 500 ){
            //     shipRate = 50
            // }else{
            //     shipRate = 0
         
            // }

            let shipping_price = JSON.parse(localStorage.getItem('shipping_price'));
            let galinukkad_price = shipping_price.reduce((value,item) => value + item.total_quantity_galinukkad_price, 0)
            this.setState({shippingCharge:galinukkad_price}); 
            
        } 
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

    render() {
        const { amount, cartItems , address } = this.props;
        const { shippingInfo } = this.state;
        console.log("this.props" ,this.props)

        return (
            <div className="ps-checkout ps-section--shopping">
     
                <div className="container">
                    <div className="ps-section__header">
                        <h1>Shipping Information</h1>
                    </div>
                    <div className="ps-section__content">
                        <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <div className="ps-block--shipping">
                                    <div className="ps-block__panel">
                                        <figure>
                                        <small>
                                                <b>
                                                Contact
                                                </b>
                                            </small>
                                            <p>{shippingInfo && shippingInfo.email}</p>
                                            {/* <Link href="/account/checkout">
                                                <a>Change</a>
                                            </Link> */}
                                        </figure>
                                        <figure>
                                            <small>
                                                <b>
                                                    Ship to
                                                </b>
                                            </small>
                                            <p>
                                        {shippingInfo && shippingInfo.postal}&nbsp;
                                        {shippingInfo && shippingInfo.add1},&nbsp; 
                                        {shippingInfo && shippingInfo.add2},&nbsp;
                                        {shippingInfo && shippingInfo.state},&nbsp;
                                        {shippingInfo && shippingInfo.country}
                                            </p>
                                            <Link href="/account/checkout?mode=edit">
                                                <a>Change</a>
                                            </Link>
                                        </figure>
                                    </div>
                                    <h4>Shipping Method</h4>
                                    <div className="ps-block__panel">
                                        <figure>
                                        <small>
                                                <b>
                                                Ecom Express
                                                </b>
                                            </small>
                                            {/* <strong>₹ {parseInt this.state.shippingCharge ?(this.state.shippingCharge) : 10}.00</strong> */}
                                            <strong>₹ {parseInt(this.state.shippingCharge) }.00</strong>

                                        </figure>
                                        {/* <strong>₹ {parseInt this.state.shippingCharge) : 10}.0g> */}
                                    </div>
                                    <div className="ps-block__footer">
                                    <span className="d-none d-sm-block">
                                    <Link href="/account/shopping-cart">
                                        <a>
                                            <i className="icon-arrow-left mr-2"></i>
                                            Return to shopping cart
                                        </a>
                                    </Link>
                                    </span>
                                        {/* <StripeCheckout
                                            stripeKey="pk_test_51Hp48qFPyhppKVhzjLTWZQgC9G3pp5IF4RM4Akh4CG9uTE2w1AkBHLtMSZ8wPWHlzHP5U3RAnQrCDuHquUyMCL0C00R9ddVAKH"
                                            token={this.handleToken}
                                            amount={(parseInt(amount) + 20) * 100}
                                            currency="INR"
                                            image={'/static/img/index.jpeg'}
                                            name="galinukkad.com"
                                        > */}
                                            <button className="ps-btn ps-btn-continue-mobile" onClick={this.processRazorPay}>
                                                Continue to payment
                                            </button>
                                            <span className="ps-block_continue d-block d-sm-none">
<Link href="/account/shopping-cart">
    
                                        <a>
                                        <i className="icon-arrow-left mr-2"></i>
                                            Return to shopping cart
                                        </a>
                                    </Link>


</span>
                                        {/* </StripeCheckout> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12  ps-block--checkout-order">
                                <div className="ps-form__orders">
                                    <div className="ps-block--checkout-order">
                                        <div className="ps-block__content">
                                            <figure>
                                                <figcaption>
                                                    <strong>Product</strong>
                                                    <strong>total</strong>
                                                </figcaption>
                                            </figure>
                                            <figure className="ps-block__items">
                                                {cartItems &&
                                                    cartItems.map((product, index) => (
                                                        <Link
                                                            key={index}
                                                            href="/" >
                                                            <a>
                                                                <strong>
                                                                    {
                                                                        product.title
                                                                    }
                                                                    <span>
                                                                        x
                                                                        {
                                                                            product.quantity
                                                                        }
                                                                    </span>
                                                                </strong>
                                                                <small>
                                                                    ₹ 
                                                                    {product.quantity *
                                                                        product.price}
                                                                </small>
                                                            </a>
                                                        </Link>
                                                    ))}
                                            </figure>
{/* 
                                            <figure className="">
                                               
                                            <figcaption className="div_discount">Coupon Discount</figcaption>
                                            </figure> */}
                                                      <div className="ps-product__shopping">
                    <figure>

                        <figcaption className="div_discount mb-4">Coupon Discount </figcaption>
                        { this.state.promocodeApply === true ? 
                        <>
                        <div className="mb-3">
                        <a className=" procode-btn bg-danger"  onClick={()=> this.removePromoCode()}> Cancel </a>
                        </div>
                        <span style={{color:'green'}}>Coupon Code applied</span> 
                       
                        </>
                        : 
                            <div className="row m-2 d-block">
                                <input className="form-control col-md-12 mb-3" type="text" placeholder="Enter promo code here" value={this.state.promocode} onChange={(e) => this.changePromoCode(e)} />  
                              
                                <a className=" procode-btn"  onClick={()=> this.applyPromoCode()}> Apply </a>
                            </div>
                          }
                    </figure>
                </div>
                                            <figure>
                                                <figcaption>
                                                    <strong>Subtotal</strong>
                                                    <small>₹ {amount}</small>
                                                </figcaption>
                                            </figure>
                                            <figure>

                                                <figcaption>
                                                    <strong>Shipping</strong>
                                                    <small>₹ {parseInt(this.state.shippingCharge) }.00</small>
                                                </figcaption>
                                                {/* <small>₹ {parseInt this.state.shippingCharge) : 10}.0l> */}
                                            </figure>
                                            <figure className="ps-block__total">
                                                <h3>
                                                    Total
                                                    <strong>
                                                        ₹ { parseInt(amount) + parseInt(this.state.shippingCharge)  }
                                                        .00
                                                        {/* ₹ {parseInt(amount) ? parseInt(this.state.shippingCharge)0} */}
                                                    </strong>
                                                </h3>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        cartItems: state.cart.cartItems, 
        amount: state.cart.amount,
        address:  state.order.orderAddress
           };
};

export default connect(mapStateToProps)(Shipping);


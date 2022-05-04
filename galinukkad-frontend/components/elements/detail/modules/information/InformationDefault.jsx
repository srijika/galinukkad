import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router , {useRouter} from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { getProductsById } from '../../../../../store/product/action';


import Rating from '../../../Rating';
import { Select, notification, Input , Form} from 'antd';
import { addItem,buyItem } from '../../../../../store/cart/action'; 
import { addItemToCompare } from '../../../../../store/compare/action';
import { addItemToWishlist } from '../../../../../store/wishlist/action';
const { Option } = Select;
import  Repository from '../../../../../repositories/Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {   FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton, } from "react-share";
import { FacebookIcon, TwitterIcon  , LinkedinIcon, WhatsappIcon} from "react-share";
class InformationDefault extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            disabled:false,
            orderVariant:[],
            promocodeApply:false,
            pincodeApply:false,
            pincode:'',
            promocode:'',
            updatedPrice:0 ,
            returnDay : 0 ,
            isProductCart : false
        };

    }
    componentDidMount() {
        if(localStorage.getItem('pincodeApply') == 1){
            // this.setState({pincode : localStorage.getItem('pincode'), pincodeApply:true});
            this.setState({pincode : localStorage.getItem('pincode'), pincodeApply:false});

        }
        this.checkSingleProductVariant();
        this.getReturnDay();

    }

    getReturnDay = async () => {
        
        let res = await axios.get(`/getAll-return-policy-days`);
        if(res.data.status === true && res.data.data.length > 0) {
            this.setState({ returnDay: res.data.data[0].days});
        }
    
    }


    checkSingleProductVariant = () => {
        
        let product = this.props.product;
        const oVariant = this.state.orderVariant;
        product.variants.map((item, key) => {
            if(item.value != undefined && item.value.length === 1) {
                let obj = {};
                obj[item.label] = item.value[0];
                oVariant.push(obj);
            }
        })
        this.setState({ orderVariant: oVariant});
    }

    handleAddItemToCart = e => {
        e.preventDefault();
        let errVariot;
            const { product } = this.props;

            if(this.state.orderVariant.length == product.variants.length){
                let tempProduct = product;
                let variant = this.state.orderVariant
                tempProduct.quantity = this.state.quantity;

                tempProduct.variants = variant;
                this.props.dispatch(getProductsById(product._id));


       

                if(this.state.updatedPrice > 0){
                    product.sale_price = this.state.updatedPrice;
                    product.price = this.state.updatedPrice;

                }
                // THIS IS MY COUPON CODE
                // product.promocode = this.state.promocode;      
                this.props.dispatch(addItem(product));
            }else{

let label1 = []
let label2 = []

if(product.variants.length !== 0 && this.state.orderVariant !== 0 ){
 product.variants.map((variant) =>{ label1.push(variant.label) })
this.state.orderVariant.map((variant) =>{let vari = Object.keys(variant)
label2.push(vari[0]) })
const found = label1.filter((val, index) => {
    console.log('index', index) // Stops at array1.length - 1
    return !label2.includes(val)
  })
  

  toast.warning(`Please select ${found[0]} variants!`);
  
}



                // if(this.state.orderVariant.length == product.variants.length){

                // }else{
                //     toast.error("Please select variants!");

                // }
                

            }
      
    };

    handleBuyItemToCart = e => {
        e.preventDefault();
        const { product } = this.props;


        if(this.state.orderVariant.length !== product.variants.length){
            // notification.error({ message: 'Please select variants!' });
    toast.error("Please select variants!");

return

        }
        
    
        // if(this.state.pincodeApply === true){
            if(localStorage.getItem('accessToken'))
            {
           console.log("hi")
          
                let tempProduct = product;
                tempProduct.quantity = this.state.quantity;
                tempProduct.variants = this.state.orderVariant;
                if(this.state.updatedPrice > 0){
                    product.sale_price = this.state.updatedPrice;
                    product.price = this.state.updatedPrice;
                }

                this.props.dispatch(buyItem(product));
                // this.setState({disabled: true});  
          }
            else{
                // notification.error({ message: 'Please Login in your account!' });
    toast.error("Please Login in your account!");

                Router.push(`/account/login?redirect=/product/${product._id}`);
            }
        // }else{
        //     notification.error({ message: 'Need to check pincode!' });
        // }
    };

    // handleAddItemToCompare = e => {
    //     e.preventDefault();
    //     const { product } = this.props;
    //     this.props.dispatch(addItemToCompare(product)); 
    // };
    handleAddItemToCompare = (e) => {
        e.preventDefault();
        const { product  } = this.props;
        console.log('product_cat',this.props);

        let compareItems = this.props.compare.compareItems;
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


    handleAddItemToWishlist = e => {



        e.preventDefault();
        const { product , wishlist} = this.props;
        const { wishlistTotal ,wishlistItems} = wishlist;



        if(localStorage.getItem('accessToken'))
        {


            if(wishlistItems.length !== 0){
                const productId = product._id
                const checkCart = wishlistItems.find(item => item._id == productId);
                if(checkCart !== undefined){

                    return toast.error("You already add in wishlist!");
    
                }
                
     
                if(wishlistTotal  >= 10){
                    toast.error("You cross the limit!");
                                
                            }else{ 
                                 
                              
                                this.props.dispatch(addItemToWishlist(product));
                            } 

            }else{
              

              
            if(wishlistTotal  >= 20){
    toast.error("You cross the limit!");
                
            }else{ 
                 
              
                this.props.dispatch(addItemToWishlist(product));
            } 
           
        }
      
      } 
        else{
            // notification.error({ message: 'Please Login in your account!' });
    toast.error("Please Login in your account!");

            Router.push('/account/login');
            window.scrollTo(100, 200)

        }
    };

    handleIncreaseItemQty = e => {
        e.preventDefault();
        const { product } = this.props;
        if(this.state.quantity + 1 <= product.inventory){
            this.setState({ quantity: this.state.quantity + 1 });
        }else{
            // notification.error({ message: 'No more quantity available!' });
    toast.error("No more quantity available!");

        }
    };

    handleDecreaseItemQty = e => {
        e.preventDefault();
        if (this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    };
    
    addOrderVariant = (e, label, values)=>{
        e.preventDefault();
        const oVariant = this.state.orderVariant;
        let asd =  oVariant.filter((itemd) => { return itemd[label];} )
        if(asd.length > 0){
            let newoVariant = [];
            oVariant.forEach((item)=>{
                if(item[label]){
                    item[label] = values;
                }
                newoVariant.push(item);
            })
            this.setState({ orderVariant: newoVariant});
        }else{
            let obj = {};
            obj[label] = values;
            oVariant.push(obj);
            this.setState({ orderVariant: oVariant});
        }
    }

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

    changePromoCode = (event) => {
        this.setState({promocode : event.target.value});
    }

     onFinish = async (values) => {
    let {pincode} = values
        console.log(values);
        // return;
       
        let product = this.props.product;
        let data = {
            product_id: product._id, 
            seller_id: product.loginid, 
        }

        if(pincode && pincode.length > 0){

            data['pincode'] = pincode;
            const res = await axios.post(`/shipping-code-check`, data);

            if(res.data.status) {
                toast.success(res.data.message);
                this.setState({ pincodeApply:true })
                localStorage.setItem('pincodeApply','1')
                localStorage.setItem('pincode',pincode)
            }else {
                toast.error(res.data.message);
                this.setState({ pincodeApply:false});
                localStorage.removeItem('pincodeApply')
                localStorage.removeItem('pincode')
            }

       }else{
            toast.error('Please add pincode!');
       }


    };
     applyPromoCode = async () =>{
        if(this.state.promocode && this.state.promocode.length > 0){
            const { product } = this.props;
            await Repository.get('/apply-coupon-codes-on-product?code='+this.state.promocode+'&product_id='+product._id).then((response) => {
                if (response.data.status) {
                    this.setState({ promocodeApply:true, updatedPrice : response.data.data })
                    toast.success('Promo Code applied successfully!');
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
    changePinCode = (event) =>{
        this.setState({pincode : event.target.value});
    }

    applyPinCode = async () =>{
        
    
        let product = this.props.product;
        let data = {
            product_id: product._id, 
            seller_id: product.loginid, 
        }

        if(this.state.pincode && this.state.pincode.length > 0){

            data['pincode'] = this.state.pincode;
            const res = await axios.post(`/shipping-code-check`, data);

            if(res.data.status) {
                toast.success(res.data.message);
    

            }else {
                toast.error(res.data.message);

            }


            // if(localStorage.getItem('accessToken') || localStorage.getItem('accessToken') === null){
            //     await Repository.post('/getByPincode-shipping-codes?pincode='+this.state.pincode, data).then((response) => {
            //         if (response.data.status) {

            //             // if(response.data.data && response.data.data.length > 0){
                            // this.setState({ pincodeApply:true })
            //                 localStorage.setItem('pincodeApply','1')
                            // localStorage.setItem('pincode',this.state.pincode)
            //                 toast.success("Product is available for delivery in this pin code!");


            //         }else{
                        
                        // this.setState({ pincodeApply:false});
            //             toast.error(response.data.message);
            //         }
            //     }).catch((err) => {
            //         toast.error('Pincode not found!');    
            //     });
            // }else{
            //     toast.error("Please Login in your account!");   
            //     Router.push('/account/login');
            // }
       }else{
            toast.error('Please add pincode!');
       }
    }

    render() {
        const { product, currency,  cart ,  wishlist , compare} = this.props;
        const { cartItems } = cart;
        const { wishlistItems } = wishlist;
        const { compareItems } = compare;


      
        let isProductCart = false;
        let isProductWishList = false;
        let isProductCompare = false;



        let outOfStock = product.inventory === 0 ? true : false
        let orderVariant = this.state.orderVariant;
        let title, url;
        if (typeof window !== "undefined") {
            title = window.document.title 
            url = window.location.href + '/product/' + product._id
        }

        if(cartItems.length !== 0){
            const productId = product._id
            console.log("id", productId)
            const checkCart = cartItems.find(item => item._id == productId);
            if(checkCart !== undefined){
                isProductCart = true
               
            }

        }

        if(compareItems.length !== 0){
            const productId = product._id
            const checkCompare = compareItems.find(item => item._id == productId);
            if(checkCompare !== undefined){
                isProductCompare = true
                
            }

        }

        if(wishlistItems.length !== 0){
            const productId = product._id
            const checkWishList = wishlistItems.find(item => item._id == productId);
            if(checkWishList !== undefined){
                isProductWishList   = true
               
            }

        }


     

        return (
            <div className="ps-product__info">
                <h1>{product.title}</h1>
                <div className="ps-product__meta">
                    <p>
                        Brand: 
                        <Link href="/shop">
                            <a className="ml-2 text-capitalize">
                            {product.brand}
                            </a>
                        </Link>
                    </p>
                    <div className="ps-product__rating">
                        <Rating rating={this.calculateReviews(product.review)} />
                        <span>({product.review && product.review.length > 0?product.review.length: 0} review)</span>
                    </div>
                </div>


                <div style={{ display: "flex" }}>

                {product.is_sale === true ? 
                    ( this.state.promocodeApply ?  
                        ( 
                            <h4 className="ps-product__price sale">
                                <del className="mr-2">
                                    {currency ? currency.symbol : '₹'}
                                    {this.state.updatedPrice}
                                </del>
                                {currency ? currency.symbol : '₹'}
                                {product.price}
                            </h4> 
                    ) : (
                        <h4 className="ps-product__price sale">
                        <del className="mr-2">
                            {currency ? currency.symbol : '₹'}
                            {product.sale_price}
                        </del>
                        {currency ? currency.symbol : '₹'}
                        {product.price}
                    </h4> )
                ) : (
                    this.state.promocodeApply ?  
                    <h4 className="ps-product__price">
                        {currency ? currency.symbol : '₹'}
                        {this.state.updatedPrice}
                    </h4>
                    :
                    <h4 className="ps-product__price">
                        {currency ? currency.symbol : '₹'}
                        {product.price}
                    </h4>
                )}
                
                {product.mrp_price ? <strike style={{ marginLeft: "8px", marginTop: "3px", color: "grey", fontSize: "16px" }}>{currency ? currency.symbol : '₹'}{product.mrp_price}</strike> : "" }

                </div>

                <div className="ps-product__desc">
                    <p>
                        Sold By:
                        <Link href="/shop">
                            <a>
                                <strong> {product.vendor}</strong>
                            </a>
                        </Link>
                    </p>
                    {product.productFeatures && product.productFeatures.length > 0?<ul className="ps-list--dot">
                        {product.productFeatures.map((item) => {
                            return <li>{item.label} : {item.value}</li>
                        })}
                    </ul>:
                    <p></p>
                    }
                    <strong className="mt-2">Variants</strong>
                    {
                        product.variants && product.variants.length > 0 && product.variants[0] != "undefined" ?

                        <div className="ps-list--dot">
                            {product.variants.map(
                                (item,res) => (


                                    <div key={res}>
                                        <div className="d-flex">
                                            <div className="col-1 offset-1 col-md-2 ml-0 pl-0" style={{marginTop: '6px'}}>
                                                <span style={{ margin: 'auto 0' , }}>{String(item?.label).charAt(0).toUpperCase() + String(item?.label).slice(1)}:</span>
                                            </div>
                                            <div className="col-sm-10 col-md-10 ">
                                                <strong style={{paddingBottom: '1rem'}}> </strong>
                                                {
                                                 item.value && item.value.map((variant, index) => ( 
                                                    (orderVariant.filter((itemdd)=>{ return ( itemdd[item.label] == variant )})).length == 0 ? 
                                                        <button key={index} 
                                                            type="button"
                                                            className="btn size_btn"
                                                            onClick={(event) => this.addOrderVariant(event, item.label, variant)} >
                                                                { variant?.charAt(0).toUpperCase() + variant?.slice(1) }
                                                        </button>
                                                        :
                                                        <button  key={index} 
                                                            type="button" 
                                                            style={{margin:'0px 5px 5px', fontSize: '1.5rem',  fontWeight: '600', borderBottom : '2px solid black', backgroundColor: 'yellow !important', color:'black'}} 
                                                            className="btn size_btn"
                                                            onClick={(event) => this.addOrderVariant(event, item.label, variant)} >
                                                                { variant?.charAt(0).toUpperCase() + variant?.slice(1) } 
                                                                {console.log(variant?.charAt(0).toUpperCase() + variant?.slice(1))}
                                                        </button>
                                                )) }
                                            </div> 
                                        </div> 
                                    </div>
                                )
                            )}
                        
                        </div>
                        :<p>No Varients</p>

                    }
                </div>

                <Form
                        className="ps-form--order-tracking"
                        onFinish={this.onFinish}
                        >
              
              <figcaption className="mb-2">Pincode </figcaption>

                    <div className="d-flex ">
                        <Form.Item
                            name="pincode" 
                            rules={[ {required: true,   message: 'Please Enter Pincoe', },{
                                            pattern: /^[0-9]+$/,
                                            message: 'Need to enter number'
                                        },
                                        { 
                                            max: 6, 
                                            message: 'Pincode should be 6 digits long.' 
                                        }, ]}
                            >
                            <Input
                                className="form-control  col-md-12 col-sm-12"
                               
                                placeholder="Delivery Pincode"
                            />
                        </Form.Item>
                    <div className="form-group ml-3">
                        <button type="submit" className="ps-btn1 mobile-ps-btn1"
                        >Check</button>
                    </div>

                    </div>
                    { this.state.pincodeApply === true ? <span style={{color:'green'}}>Pincode is available</span> : '' }

              

                </Form>
                {/* <div className="ps-product__shopping">
                    <figure>
                        <figcaption>Pincode </figcaption>
                        <div className="row  ps_margin">
                            <input  className="form-control  col-md-6 col-sm-6" type="text"  maxlength="10" value={this.state.pincode} onChange={(e) => this.changePinCode(e)} placeholder="Delivery Pincode"  />  
                            &nbsp; &nbsp;
                            <a className="ps-btn1 mobile-ps-btn1"  onClick={()=> this.applyPinCode()}> Check </a>
                        </div>
                        { this.state.pincodeApply === true ? <span style={{color:'green'}}>Pincode is available</span> : '' }
                    </figure>
                </div> */}


                
                {/* <div className="ps-product__shopping">
                    <figure>
                        <figcaption>Pincode </figcaption>
                        <div className="row  ps_margin">
                            <input  className="form-control  col-md-6 col-sm-6" type="text"  maxlength="10" value={this.state.pincode} onChange={(e) => this.changePinCode(e)} placeholder="Delivery Pincode"  />  
                            &nbsp; &nbsp;
                            <a className="ps-btn1 mobile-ps-btn1"  onClick={()=> this.applyPinCode()}> Check </a>
                        </div>
                        { this.state.pincodeApply === true ? <span style={{color:'green'}}>Pincode is available</span> : '' }
                    </figure>
                </div> */}

                {/* <div className="ps-product__shopping">
                    <figure>

                        <figcaption>Promo Code </figcaption>
                        { this.state.promocodeApply === true ? <span style={{color:'green'}}>Promo Code applied</span> : 
                            <div className="row m-2">
                                <input className="form-control col-md-6" type="text" placeholder="Enter promo code here" value={this.state.promocode} onChange={(e) => this.changePromoCode(e)} />  
                                &nbsp; &nbsp;
                                <a className="ps-btn1 mobile-ps-btn1"  onClick={()=> this.applyPromoCode()}> Apply </a>
                            </div>
                          }
                    </figure>
                </div> */}

               {outOfStock === true ?  
               <>
                <div className="" >
                 <h1 className=" text-danger font-weight-bold mb-4">Out Of Stock</h1>  
               </div>
               <hr className=" "/>
               </> 
               :
                <div className="ps-product__shopping">
                <figure className="qty_align_sm">
                    <figcaption>Quantity:</figcaption>
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
                
                {isProductCart == true ? 

                    <Link href="/account/shopping-cart">
                                    <a className="ps-btn ps-btn--black"> Go to cart</a>
                                </Link>

 
:
<a
                        className="ps-btn ps-btn--black"
                        
                        disabled={this.state.disabled}
                        onClick={this.handleAddItemToCart.bind(this)}>
                        Add to cart
                    </a>

}
                <a
                    className="ps-btn"
                    
                    disabled={this.state.disabled}
                    onClick={this.handleBuyItemToCart.bind(this)}>
                    Buy Now 
                </a>
                <div className="ps-product__actions mt-lg-0 mt-md-2 mt-sm-0">
                    <a
                        
                        onClick={this.handleAddItemToWishlist.bind(this)}>
                        {isProductWishList ?<i class='fas fa-heart' style={{color: 'red'}}></i> :  <i className="icon-heart"></i> }
                       
                    </a>
                    <a
                        
                        onClick={this.handleAddItemToCompare.bind(this)}>
                        
                        {isProductCompare ?  <i className="fa fa-balance-scale"  style={{color: '#fcb800'}} aria-hidden="true"></i> :
                        <i className="fa fa-balance-scale"  aria-hidden="true"></i>
                          }

                    </a>
                </div>
            </div>
           
               }
                <div className="ps-product__specification">
                    <p>
                        <span className="product_sub_title">SKU:</span> {product.sku}
                    </p>
                 
                    <p className="categories">
                    <span className="product_sub_title">Categories:</span>
                        {(product.category_name && product.category_name.length > 0)?product.category_name.map((text,i) => {
                            return (
                                <span key={product._id} className='text-info'>
                                       {text}
                                    {i !== (product.category_name.length - 1)?', ':null }
                                    </span>
                                    )
                        }):<span className="product_sub_title">No Categories Found</span>}
                    </p>
                    <p className="tags">
                    <span className="product_sub_title">Tags:</span>
                        {(product.keywords && product.keywords.length) ? product.keywords.map((text,i) => {
                            return (
                                <span key={text}>
                                    <Link href="/shop">
                                        <a>{text}</a>
                                    </Link>
                                    {i !== (product.keywords.length - 1)?', ':null }
                                    </span>
                                    )
                        }) : <span>No tags found.</span>}
                    </p>
                    <p> <span className="product_sub_title">  Product Weight: </span>  {product.weight}gms </p>

                    <p className="mt-4"> 
                    <i class="fa fa-undo text-info" aria-hidden="true"></i>   {this.state.returnDay} Days Returns
                    </p>
                </div>

                <div className="ps-product__sharing">
                    Share Product : <br />
                                
                    <FacebookShareButton quote={title} url={url} title={title} className="ml-2 share_links ">
                        <FacebookIcon size={"6rem"}  />
                    </FacebookShareButton>

                    <TwitterShareButton url={url} title={title} className="ml-2 share_links">
                        <TwitterIcon size={"6rem"}  />
                    </TwitterShareButton>

                    <WhatsappShareButton title={title} url={url} separator=":: " className="ml-2 share_links">
                        <WhatsappIcon size={"6rem"}  />
                    </WhatsappShareButton>
                    
                    <LinkedinShareButton className="ml-2 share_links" title={title} url={url} windowWidth={770} windowHeight={600} >
                        <LinkedinIcon size={"6rem"}  />
                    </LinkedinShareButton>

                </div>
                {/* <div className="ps-product__sharing">
                    <a className="facebook" >
                        <i className="fa fa-facebook"></i>
                    </a>
                    <a className="twitter" >
                        <i className="fa fa-twitter"></i>
                    </a>
                    <a className="google" >
                        <i className="fa fa-google-plus"></i>
                    </a>
                    <a className="linkedin" >
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <a className="instagram" >
                        <i className="fa fa-instagram"></i>
                    </a>
                </div> */}
                {
                    outOfStock === true ? '' : 

                    <div className="ps-product__actions-mobile">
{isProductCart == true ? 
    <Link href="/account/shopping-cart">
                                    <a className="ps-btn ps-btn--black"> Go to cart</a>
                                </Link>
 
:
<a
                        className="ps-btn ps-btn--black"
                        
                        disabled={this.state.disabled}
                        onClick={this.handleAddItemToCart.bind(this)}>
                        Add to cart
                    </a>

}
            



                    <a
                        className="ps-btn"
                        
                        disabled={this.state.disabled}
                        onClick={this.handleBuyItemToCart.bind(this)}>
                        Buy Now
                    </a>
                </div>
         
                }
                   </div>
  
        );
    }
}

const mapStateToProps = state => {
   console.log("state__________",  state)

    return {cart : state.cart , compare : state.compare , wishlist : state.wishlist};

};

export default connect(mapStateToProps)(InformationDefault);
 
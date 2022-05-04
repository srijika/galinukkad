import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../../store/cart/action';
import { removeWishlistItem } from '../../../store/wishlist/action';
import Link from 'next/link';
import ProductCart from '../../elements/products/ProductCart';
import {getWishlistList} from '../../../store/wishlist/action.js'
import {Modal, Empty, Card, Typography, Alert,Input, Button, Table, Divider ,notification, Switch, Row, Col, Avatar, Pagination, Tabs,  Popconfirm , Rate , Checkbox , Radio } from 'antd';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import LazyLoad from 'react-lazyload';
import { isStaticData } from '../../../utilities/app-settings';
import { baseUrl } from '../../../repositories/Repository';
import { getImageName } from '../../../utilities/functions-helper';
const {TextArea} = Input;


class Wishlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ShowAddtocart: false,
            productData: {},
            orderVariant:[],



        };
    }

    componentDidMount() {
        this.props.dispatch(getWishlistList());

    }
    checkSingleProductVariant = (productData) => {
        
        let product = productData;
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


    handleModalCancel = () => {
        this.setState({ShowAddtocart:false});
   }

    handleAddItemToCartEmpty = ( product) => {
        product.quantity = 1;
        product.variants = [];
        this.props.dispatch(addItem(product));

    };

    openModal = (e, product) =>{
        if( product.variants.length === 0){
            this.handleAddItemToCartEmpty(product);
        
        }else{
            this.setState({ShowAddtocart:true});
            this.setState({productData:product});
      
        }
        
    }

    

    handleAddItemToCart = () => {
    const  product  = this.state.productData;
            if(this.state.orderVariant.length == product.variants.length){
                let tempProduct = product;
                tempProduct.quantity = 1;
                tempProduct.variants = this.state.orderVariant;
                if(this.state.updatedPrice > 0){
                    product.sale_price = this.state.updatedPrice;
                    product.price = this.state.updatedPrice;

                }
              
                
        this.setState({ShowAddtocart:false});
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


            }
      
    };


    handleModelOk = async () => {

        this.handleAddItemToCart();

// if( this.state.productData.variants.length === 0){
//     this.handleAddItemToCartEmpty(this.state.productData);

// }else{
//     this.handleAddItemToCart();


// }

         };

    handleRemoveWishListItem = (e, product) => {
        e.preventDefault();
        this.props.dispatch(removeWishlistItem(product));
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



    render() {
        const { wishlistItems } = this.props;
        let orderVariant = this.state.orderVariant;


        return (
            <div className="ps-section--shopping ps-whishlist">
                <div className="container">
           

                <div className="d-flex justify-content-between pb-3 mt-5 mb-4">
                    <span className="wishlist_header">
                    My wishlist:
                    </span>

                        <span className="pr-2">
                    {wishlistItems.length} Items
                    </span>
                    </div>

                    <div className="ps-section__content">
                        {wishlistItems && wishlistItems.length === 0 ? (
                            <div className="alert alert-danger" role="alert">
                                Wishlist is empty!
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table ps-table--whishlist">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "55%" }}>Product name</th>
                                            {/* <th style={{ width: "20%" }}>Action</th> */}
                                            <th style={{ width: "15%" }}>Price</th>
                                            <th style={{ width: "15%" }}>Vendor</th>
                                            <th style={{ width: "15%" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlistItems.map((product, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <ProductCart
                                                        product={product}
                                                    />
                                                </td>
                                                {/* <td>{product.vendor}</td> */}

                                                {/* <td className="price">
                                                 <a href="#">
                                                    Add To Cart
                                                </a>
                                                <br />
                                                <a href="#">
                                                    Buy Now
                                                </a> 
                                                </td> */}
                                                <td className="price">
                                                    ₹ {product.price}
                                                </td>
                                                <td>{product.vendor}</td>
                                                <td>
                                                    <a
                                                    style={{marginRight:"10px"}}
                                                        href="#"
                                                        onClick={e =>
                                                            this.handleRemoveWishListItem(
                                                                e,
                                                                product
                                                            )
                                                        }>
                                                            <i class="fa fa-trash fa-1x" aria-hidden="true"></i>
                                                        
                                                    </a>

                                                    <a
                                                        href="#"
                                                        onClick={e =>
                                                            this.openModal(
                                                                e,
                                                                product
                                                            )
                                                        }>
                                                      <i class="fa fa-cart-arrow-down" aria-hidden="true"></i>

                                                        
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                      <hr />

                <div className="d-flex justify-content-between pb-3">
                    <span className="wishlist_header">
                        <Link href="/"><a><i class="fa fa-arrow-left mr-3" aria-hidden="true"></i> Continue shopping</a></Link> 
                    </span>
                        {/* <span className="wishlist_header">
                            <a>
                                Clear Wishlist
                            </a>
                        </span> */}
                    </div>
                </div>



                <Modal
            title="Choose One"
            centered
            destroyOnClose={true}
            visible={this.state.ShowAddtocart}
            onCancel={this.handleModalCancel}
            onOk={this.handleModelOk}
            okText="CONTINUE"
            width={1000}
            >



{this.state.productData._id !== undefined && this.state.productData !== null ?
<>
    <div className="ps-product--cart">
            <div className="ps-product__thumbnail">
                <Link href="/product/[pid]" as={`/product/${this.state.productData._id}`}>
                    <a>
                        <LazyLoad>
                            <img
                                src={
                                    isStaticData === false
                                        ? `${baseUrl}/`+getImageName(this.state.productData.images.file)
                                        : this.state.productData.thumbnail.url
                                }
                                className="img-size"
                                alt="Galinukkad"
                            />
                        </LazyLoad>
                    </a>
                </Link>
            </div>
            <div className="ps-product__content">
                {this.state.productData.brand}<br />
                <Link href="/product/[pid]" as={`/product/${this.state.productData._id}`}>
                    <a className="ps-product__title">
                        {this.state.productData.title}
                        </a>
                </Link>
            </div>
        </div>

        {
            this.state.productData._id !== undefined && this.state.productData !== null && this.state.productData.variants && this.state.productData.variants.length > 0 && this.state.productData.variants[0] != "undefined" ? 
   <>
   <br/>
   <strong className="mt-4">Variants</strong>
   <div className="ps-list--dot">
        {this.state.productData.variants.map(
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

   </>

    :<p>No Vairants</p>

}


</>


:''}

      

             
            </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => {
    console.log("state.wishlist" ,state.wishlist)
    return state.wishlist;
};
export default connect(mapStateToProps)(Wishlist);

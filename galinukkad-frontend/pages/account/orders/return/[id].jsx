import React, { Component } from 'react';
import { Table,Checkbox, notification, Divider, Tag } from 'antd';
import Link from 'next/link';
import { Button } from 'antd';
import Moment from 'react-moment';
import { baseUrl } from '../../../../repositories/Repository';
import  Repository from '../../../../repositories/Repository';
import Router  from 'next/router';
import { connect } from 'react-redux';
import { getOrderDetails } from '../../../../store/order/action';
import Newsletters from '../../../../components/partials/commons/Newletters';
import FooterDefault from '../../../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../../../components/elements/BreadCrumb';
import Orders from '../../../../components/partials/account/Orders';
import HeaderMobile from '../../../../components/shared/headers/HeaderMobile';
import NavigationList from '../../../../components/shared/navigation/NavigationList';
import './account-return.css';
import Item from 'antd/lib/list/Item';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// import dummyImage from '../../../../public/static/img/dummy_image.jpg'
class OrderDetails extends Component {
    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    constructor(props) {
        super(props);

        this.state = {
            id:null,
            product_id:null,
            description:'',
            productImage:'',
            productTitle:'',
            price:0,
            setForReplace:false,
            agreeForReturn:false, 
            return_images: [], 
            showPreviewImages:  [],
            otherTextInputShow: false
        }
    }

    getOrderStatus(status) {
        /*
        // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
        */
        let statusReturned = null;
        switch (status) {
            case 0:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'green' }}>Placed</span>
                break;
            case 1:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'green' }}>Delivered</span>
                break;
            case 2:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Cancelled</span>
                break;
            case 3:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Returned</span>
                break;
            case 4:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'blue' }}>Refunded</span>
                break;
            default:
                statusReturned = <span style={{ 'textAlign': 'center' }}>-</span>
                break;
        }

        return statusReturned;
    }

    productSelectForReturn(e, product_id, productImage, productTitle, price){
        const orderId = this.props.query.id;
        if(e.target.checked){
            this.setState({ id:orderId, product_id:product_id, productImage:productImage, productTitle:productTitle, price:price });
        }else{
            this.setState({ id:orderId, product_id:null, productImage:'', productTitle:'', price:0 });
        }
    }
    
    answerSelectForReturn(e){
        let desc = e.target.value;

        if(desc === "other") {
            this.setState({ otherTextInputShow: true })
        }else {
            this.setState({ otherTextInputShow: false})
        }


        if(desc){
            this.setState({description: desc});
        }
    }
    
    productSelectForReplace(e){
        if(e.target.checked){
            this.setState({setForReplace: true})
        }else{
            this.setState({setForReplace: false})
        }
    }

    agreedForReturn(e){
        if(e.target.checked){
            this.setState({agreeForReturn: true})
        }else{
            this.setState({agreeForReturn: false})
        }
    }
    

    returnMyProduct = async (order) => {    

        if(this.state.description.length > 50){
            return;
        }


        //    if(this.state.id){

        
        //         if(this.state.product_id){
                    if(this.state.description){
                        if(this.state.agreeForReturn){
                            if(this.state.setForReplace){
                                this.ReplaceProduct();
                            }else{
                                this.ReturnProduct(order);
                            }
                        }else{
                            // notification.error({ message: "Please select return and refund agreement!" });
                            toast.error("Please select return agreement!");
                        }
                    }else{
                        // notification.error({ message: "Please Select Valid Reason!" });
                        toast.error("Please Select Reason!");
                    }
        
        // else{
        //             // notification.error({ message: "Please Select Product!" });
        //             toast.error("Please Select Product!");
        //         }
        //    }else{
        //         // notification.error({ message: "Please Select Product!" });
        //         toast.error("Please Select Product!");
        //    } 
    }

    ReplaceProduct = async () => {
        let data ={
            order_id: this.state.id,
            product_id: this.state.product_id,
            description: this.state.description
        };
        await Repository.post('create-replace-order-product',data).then((response) => {
            if (response.data.status) {
                // notification.success({message: response.data.message});
                toast.success(response.data.message);

                Router.push('/account/orders');
            }else{
                // notification.error({ message: response.data.message });
                toast.error(response.data.message);

                
            }
        }).catch((err) => {
            // notification.error({ message: 'Order Replace Failed' });
                toast.error('Order Replace Failed');

       });
    }

    ReturnProduct = async (order) => {
        // let data ={
        //     id: order._id,
        //     product: {
        //             id:  order.orderDetail.product_id._id,
        //             description: this.state.description,
        //             order_item_id: order.orderDetail._id,
        //             price: order.orderDetail.product_id.price
        //         }
        // };

        

          
        const formData = new FormData();
        formData.append('id', order._id)
        formData.append('product_id', order.orderDetail.product_id._id)
        formData.append('description', this.state.description)
        formData.append('order_item_id', order.orderDetail._id)
        formData.append('price', order.orderDetail.product_id.price)
        formData.append('images', this.state.return_images)


        await Repository.post('return/order', formData).then((response) => {

            if (response.data.status) {
                // notification.success({message: "Request Taken Successfully!"});
                toast.success("This Product has been Successfully Returned");
                Router.push('/account/orders');
            }else{
                // notification.error({ message: response.data.message });
                toast.error(response.data.message);

            }
        }).catch((err) => {
            // notification.error({ message: 'Order Return Failed' });
                toast.error("Order Return Failed");

        });
    }

    componentDidMount() {
        const orderId = this.props.query.id;
        let product_id = localStorage.getItem('ProductId');
        this.props.dispatch(getOrderDetails({ order_id: orderId, product_id: product_id }));
    }


    

    returnImageHandler = (e) => {
        this.setState({ return_images: e.target.files[0] , showPreviewImages: URL.createObjectURL(e.target.files[0])   });
        // this.setState({ files: [...this.state.files, ...e.target.files] }) ;
    }



    render() {

        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Orders',
                url: '/account/orders',
            },
            {
                text: 'return',
            },
        ];



        const { order } = this.props;
        const {showPreviewImages} = this.state;
        let product = order ? order.orderDetail.product_id : "";
        return (
            <div className="site-content">
                <HeaderDefault />
                {/* <HeaderMobile /> */}
                <NavigationList />
                <div className="ps-page--my-account">
                    <BreadCrumb breacrumb={breadCrumb} />
                    <section className="ps-my-account ps-page--account">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="ps-page__content">
                                        <div className="ps-section--account-setting">
                                            <div className="ps-section__header">
                                                {/* <h3>Choose Item to return</h3> */}
                                                <h3>&nbsp;</h3>

                                            </div>
                                            
                                
                                                
                                                    <div  className="ps-section__content">
                                                        <div className="row">
                                                            <div className="col-1 app-product-cbk">
                                                                
                                                                {/* <Checkbox otherProps onChange={e => this.productSelectForReturn(e, product._id, product.images.file , product.title, product.price)} /> */}
                                                            </div>
                                                            <div className="col-md-6 col-sm-11">
                                                                <div className="app-product-card">
                                                                    <div className="bg-light">
                                                                        {product.images ?  
                                                                        <img src={baseUrl+'/'+ product.images.file} height="200px" width="200px" />
                                                                    : ""}
                                                                    </div>
                                                                    <div>
                                                                        <h5>{product.title}</h5>
                                                                        <p>Rs {product.price}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5 col-sm-12">
                                                                <div className="app-return-actions">
                                                                    <div>
                                                                        <label className="text-dark">Why are you returning this?</label>
                                                                        <select  className=" form-select-dev" onChange={e => this.answerSelectForReturn(e)} >
                                                                            <option disabled selected value  >Select Reason</option>
                                                                            <option value="Performance or Quality not educate">Performance or Quality not educate</option>
                                                                            <option value="Product Damaged, But shipped box OK">Product Damaged, But shipped box OK</option>
                                                                            <option value="Missing Parts or accessories">Missing Parts or accessories</option>
                                                                            <option value="Product and shipping box damaged">Both Product and shipping box damaged</option>
                                                                            <option value="Wrong item was sent">Wrong item was sent</option>
                                                                            <option value="Item Defective or dosen't work">Item Defective or dosen't work </option>
                                                                            <option value="other"> Other </option>
                                                                        </select>
                                                                    </div>
                                                                
                                                                </div>
                                                                {this.state.otherTextInputShow  &&
                                                                    <input type="text" className="form-control" style={{ height: "32px" }} placeholder="Type your message" onChange={(e) => {
                                                                    this.setState({ description: e.target.value })
                                                                }} />}


{this.state.description.length > 50 &&

    <div class="ant-form-item-explain ant-form-item-explain-error order_return_error"><div role="alert">message must not be greater than 50 characters.</div></div>

 }

                                                            </div>

                                                            
                                                        </div>
                                                        
                                                         <div className="row mt-5">
                                                        <div className="mx-auto col-md-10 col-sm-12 border bg-light p-2 mt-5">
                                                            
                                                                <div className="row">
                                                                    <div className="col-md-9 col-sm-12">

                                                                    <label className="ml-4" > Select Image </label> <br />
                                                                    <input className="formc-control" style={{ border: "1px solid silver" }} type="file" name="return_images" onChange={(e)=> { this.returnImageHandler(e) }} accept="image/*" multiple />
                                                                    </div>
                                                                    <div className="col-md-2 col-sm-12 mt-3 ">

                                                                    {
                                                                        showPreviewImages && showPreviewImages.length > 0 ? 
                                                                        <img src={this.state.showPreviewImages} className=" ml-2" style={{ height: "80px", width : "80px" }} /> 
                                                                        : 
                                                                        
                                                                        <>
                                                                        <img src="/static/img/dummy_image.jpg" className="ml-2" style={{ height: "80px", width : "80px" }} /> 
                                                                        
                                                                        </>
                                                                    }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                           
                                                        </div>
                                                  

                                                                
                                                    </div>
                                                        
                                   
                                            

                                        </div>
                                        
                                    </div>
                                </div>

                                <div className="col-lg-4 ">
                                
                                    <div className="ps-page__content">
                                        <div className="ps-section--account-setting return_box">
                                            <div className="ps-section__content app-return-rhs" >
                                                {/* <div className="app-return-rhs-selected-imgs">
                                                    <label>Items you are returning</label>
                                                    <Divider />
                                                    <div className="d-flex" style={{ flexWrap: 'wrap' }}>
                                                        {this.state.productTitle}
                                                    </div>
                                                    {
                                                        this.state.productImage ? 
                                                            <div className="d-flex" style={{ flexWrap: 'wrap' }}>
                                                                <img src={baseUrl+'/'+ this.state.productImage }  width="200px" height="200px" />
                                                            </div>
                                                            : ""
                                                    }
                                                    
                                                </div> */}
                                                <Divider />
                                                
                                                    <div className="d-flex" style={{ flexWrap: 'wrap' }}>
                                                        <span>
                                                            <Checkbox otherProps onChange={e => this.agreedForReturn(e)} />   <b>&nbsp; Return this item </b> <br />
                                                         <div className="mt-4">  &nbsp; I agree to return all item in original condotion, with MRP tags attached, user manual, warranty cards, and original accessories, in manufaturer packaging.</div> 
                                                        </span>
                                                    </div>
                                                
                                                <Divider />
                                                <div className="d-flex justify-content-center">
                                                    <button className="app-heighlighted-btn" onClick={() => { this.returnMyProduct(order) }}> Continue </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Newsletters layout="container" />
                <FooterDefault />
            </div>
        );



    }
}

const mapToProps = (state) => {
    return {
        order: state.order.orderDetails
    }
}
export default connect(mapToProps)(OrderDetails);

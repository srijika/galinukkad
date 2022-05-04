import React, { Component  , useState} from 'react';
import '../css/OrderListItem.scss';
import moment from 'moment';
import axios from 'axios'; 
import ProductRepository from '../../../../repositories/ProductRepository';
import {Modal, Empty, Card, Typography, Alert,Input, Button, Table, Divider ,notification, Switch, Row, Col, Avatar, Pagination, Tabs,  Popconfirm , Rate , Checkbox , Radio } from 'antd';
import Repository from '../../../../repositories/Repository';
import Router from 'next/router'
import { baseUrl } from '../../../../repositories/Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';
import Moment from 'react-moment';
import 'react-toastify/dist/ReactToastify.min.css';


const {TextArea} = Input;
const OrderListItemSingleProduct = props => {

    const { product , order } = props;
    let order_item = order.order_item;
    console.log(order);
    return (
        <React.Fragment>
            <div className="a-fixed-left-grid a-spacing-base">
            <div className="a-fixed-left-grid-inner" style={{paddingLeft: '100px'}}>
                <div className="a-text-center a-fixed-left-grid-col a-col-left" style={{width: '100px', marginLeft: '-100px', float: 'left'}}>
                    <div className="item-view-left-col-inner">
                       
                            <img alt="Product " src={`${baseUrl}/`+ product.images.file} height={90} width={90} />
                      
                    </div>
                </div>
                <div className="a-fixed-left-grid-col a-col-right" style={{paddingLeft: '1.5%', float: 'left'}}>
                    <div className="a-row">
                        <a className="a-link-normal"   onClick={() => Router.push("/product/"+product._id)}>
                            {product.title} 
                        </a>
                    </div>
                    <div className="a-row">
                        <span className="a-size-small a-color-price">
                        <span style={{textDecoration: 'inherit', whiteSpace: 'nowrap'}}>
                          <span className="currencyINR">&nbsp;&nbsp;</span>
                          <span className="currencyINRFallback">
                            Rs. </span>{Math.floor(parseInt(props.product.price))}</span>
                        </span> 
                    </div>
                    <div className="a-row">
                        <span className="a-color-secondary a-text-bold">
                        </span> 
                        <span className="a-color-secondary">
                        </span> 
                    </div>
                    <div className="a-row">
                        <span onClick={() => Router.push("/product/"+product._id)} className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn buy_agn_cta" id="a-autoid-10">
                            <span className="text-center">
                                <a  aria-label="Buy it again" className="a-button-text" role="button" id="a-autoid-10-announce">
                                    <i className="fa fa-undo"/>&nbsp;Buy it again
                                </a>
                            </span>
                        </span>
                        {/* {order.payment_status === "Paid"
                          ?  <span> Delivered Date :  <Moment format="MM-DD-YYYY" >{order_item.delivered_date}</Moment> </span>
                          : ""
                        } */}
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

class OrderListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
          cancelReason : '' ,
          otherError : '' ,
          isError : false ,
          error: '' ,
            orderProducts: [],
            orderId : '' ,
            modelVisible:false,
            showOrderReturn: false,
            CancelMessage:'',
            CancelMessageInput:'',
            ProductId : "",

            productPrice : 0,
            showOrderRefund:false,
            orderReturnData: {
              id:null,
              product_id:[],
              description:null
          },
          orderRefundData: {
              id:null,
              product_id:[],
              description:null
          },
        }
    }
    
   

    openModal = (orderId, clickable_product_id) =>{
      this.setState({modelVisible: true});
      this.setState({orderId: orderId, ProductId: clickable_product_id});
  }

  handleModelCancel = () => {
		this.setState({modelVisible:false})
    this.setState({otherError :""});
    this.setState({isError :false});
	};

  handleModelOk = async () => {

if(this.state.CancelMessageInput === '' && this.state.CancelMessage === "others"){
  this.setState({otherError :"this field is requied"});
  this.setState({isError : true});
  return

}

    if(this.state.isError === false){
      let LoginCred = localStorage.getItem('LoginCred')
      const userDetail = JSON.parse(LoginCred);
      let data = {
        order_id: this.state.orderId,
        description: this.state.CancelMessage === "others" ? this.state.CancelMessageInput : this.state.CancelMessage ,
        cancel_id : userDetail.username, 
        product_id: this.state.ProductId
      }
      if(data.description === ''){
        toast.error('Please select a reason');
        return

    }
          await Repository.post('cancel/order', data).then((response) => {
              if (response.data.status) {
                  // notification.success({message: 'Order Cancel Successfull',}); 
      toast.success('Order Cancel Successfull');
  
      
  
                  this.setState({OrderId:'',CancelMessage:'', modelVisible:false})
                  Router.push('/account/orders');
                  window.location.reload(true)
              }else{
           
      toast.error(response.data.message);
  
              }
          }).catch((err) => {
  
  
      toast.error('Order Cancel Failed');
  
          });
    }
    
		
	};

  GetNoteForCancel = (event) =>{
  
      this.setState({CancelMessage : event.target.value});
       
    
}

GetNoteForCancelInput = (event) =>{
  let string =  event.target.value
  this.setState({CancelMessageInput :string});
  console.log("string " , string)
  if(string.length == 0){
    this.setState({otherError :"this field is required"});
  this.setState({isError : true});
  }else if(string.length > 100 && this.state.CancelMessage === "others"){
  this.setState({otherError :"comment should be less than 100 character"});
  this.setState({isError : true});


}else{
  this.setState({otherError :""});
  this.setState({isError :false});


}
  
  
}



    handleReturnOrder = () => {
      this.setState({showOrderReturn: true , orderReturnData: {id:this.props.order._id,product_id:[], description:null} });
    };

 
    

    handleOrderReturnModalOk = () => {
        if(this.state.orderReturnData.product_id.length != 0 && this.state.orderReturnData.description) {
            Repository.post("/return/order",{...this.state.orderReturnData})
            .then(() => {props
                // notification.success({message:"Sent Successfully"});
    toast.success("Sent Successfully");

                this.setState({showOrderReturn:false});
            }).catch((err) => {
                // notification.error({message:"Something Went Wrong. Try again"});
    toast.error("Something Went Wrong. Try again");

                this.setState({showOrderReturn:false});
            })
        } else {
            const message = this.state.orderReturnData.product_id.length == 0?"Please Choose at least one product":"Please enter description.";
            // notification.error({message})
            toast.error(message);
        }
    }

    handleOrderRefundModalOk = () => {
      if(this.state.orderRefundData.product_id.length != 0 && this.state.orderRefundData.description) {
          Repository.post("/refund/order",{...this.state.orderRefundData})
          .then(() => {
              // notification.success({message:"Sent Successfully"});
    toast.success("Sent Successfully");

              this.setState({showOrderRefund:false});
          }).catch((err) => {
              // notification.error({message:"Something Went Wrong. Try again"});
    toast.error("Something Went Wrong. Try again");

              this.setState({showOrderRefund:false});
          })
      } else {
          const message = this.state.orderRefundData.product_id.length == 0?"Please Choose at least one product":"Please enter description.";
          // notification.error({message})
    toast.error(message);

      }
  }

    handleOrderReturnProductChange = (event) => {
      this.setState({orderReturnData:{ ...this.state.orderReturnData, product_id:event}});
  };


  handleOrderReturnProductDescriptionChange = (e) => {
    this.setState({orderReturnData:{ ...this.state.orderReturnData, description: e.target.value}});
  }

  handleRefundOrder = (order) => {
        this.setState({showOrderRefund:true, orderRefundData:{product_id:[], description:null , id:this.props.order._id}});
    }
    
        
    handleOrderRefundModalCancel = () => {
      this.setState({showOrderRefund:false});
  }
  
  handleOrderRefundProductChange = (event) => {
    this.setState({orderRefundData:{ ...this.state.orderRefundData, product_id:event}});
  }


  
  handleOrderRefundProductDescriptionChange = (e) => {
    this.setState({orderRefundData:{ ...this.state.orderRefundData, description: e.target.value}});
}





  getOrderStatusFunction = (order_item, order) => {

      let product = order_item.product_id;

  

     if(order.payment_status  === "Paid"){

       let html =[];
          // TRACK BUTTON SHOW ON ALL STATUS
          // if(order_item.item_status != 2) {
          html = [<span onClick={() => Router.push('/account/orders/track/' + order._id  + 'track' + product._id )} className="a-button a-button-normal a-spacing-mini a-button-base app-heighlighted-btn" id="a-autoid-12">
              <span><a id="Write-a-product-review_2" className="a-button-text" role="button"> Track Package</a>  </span>
          </span>];
      // }



      // IF PRODUCT PLACED THAN CANCEL AND ORDER TRACK BUTTON SHOW
      if(order_item.item_status === 0) {
          html.push(<span onClick={() => this.openModal(order._id, product._id)} className="a-button a-button-normal a-spacing-mini        a-button-base app-heighlighted-btn-cancel bg-white" id="a-autoid-12"><span><a id="Write-a-product-review_2"  className="a-button-text" role="button">
            Cancel Item
                  </a></span>
            </span>)
      }


      //  IF PRODUCT CANCELEED THAN PRODUCT CANCELLED MESSAGE BUTTON  SHOW 
      if(order_item.item_status === 2) {
          html.push(<button type="button" style={{ cursor: "not-allowed" }} disabled={true} className="a-button a-button-normal a-spacing-mini a-button-base app-heighlighted-btn-cancel bg-danger" id="a-autoid-12">
              Product Cancelled
            </button>)
      }
      

      if(order_item.item_status === 3) {
        html.push(<button type="button" style={{ cursor: "not-allowed" }} disabled={true} className="a-button a-button-normal a-spacing-mini a-button-base app-heighlighted-btn-cancel bg-warning" id="a-autoid-12">
            Item Return in Process
          </button>)
    }


      // REFUND PRODUCT POLICY WHEN ORDER DELIVERED 
      if(order_item.item_status === 1) {
          html.push(
            <div>  

                  <span onClick={() => { Router.push('/account/orders/rating/' + order._id  + '-rating-' + product._id ) }} className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel">
                    <span className="">
                      <a id="Write-a-product-review_2" href="#" className="a-button-text" role="button">
                          Write a product review
                      </a>
                    </span>
                  </span>
                  {/* <span onClick={() => { Router.push('/account/orders/rating/' + order._id) }} className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel">
                    <span className="">
                      <a id="Write-a-product-review_2" href="#" className="a-button-text" role="button">
                          Write a product review
                      </a>
                    </span>
                  </span> */}
                  
                  {!this.props.order.returnable ?      
                      <span className="a-declarative" data-action="a-modal" data-a-modal="{&quot;width&quot;:600,&quot;name&quot;:&quot;archive-order-modal&quot;,&quot;url&quot;:&quot;/gp/css/order-history/archive/archiveModal.html?orderId=406-4771444-0020320&shellOrderId=&quot;,&quot;header&quot;:&quot;Archive this order&quot;}">
                      <span onClick={() => {localStorage.setItem("ProductId", product._id );  Router.push('/account/orders/return/' + this.props.order._id)}}  className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel" id="a-autoid-13">
                        <span className="">
                          <a id="Archive-order_2"   className="a-button-text" role="button">
                            Return Package 
                          </a>
                        </span>
                      </span>
                    </span>
                    :
                    <span  className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel bg-danger" id="a-autoid-13">
                        <span className="">
                          <a id="Archive-order_2"   className="a-button-text" role="button">
                            Return Policy Ended
                          </a>
                        </span>
                      </span>
                    
                    }
                   
              </div>
          )
      }



      
        return html;   



     }else {
       return (
        <span style={{ marginTop: "10px" }}>   Order not placed </span>
       )
     }
                      
  }







    render() {
        const { order } = this.props;
        return (
    <div className="a-box-group a-spacing-base order">

{/* <div className=" a-box a-color-offset-background order-info">
          <div className="a-box-inner">
            <div className="a-fixed-right-grid"><div className="a-fixed-right-grid-inner " style={{paddingRight: '290px'}}>
                <div className="a-fixed-right-grid-col a-col-left" style={{paddingRight: '0%', float: 'left'}}>
                  <div className="a-row">
                    <div className="a-column a-span3">
                      <div className="a-row a-size-mini">
                        <span className="a-color-secondary label">
                          Order placed
                        </span>
                      </div>
                      <div className="a-row a-size-base">
                        <span className="a-color-secondary value">
                          { moment(order.create).format("DD MMMM YYYY")}
                        </span>
                      </div>
                    </div>
                
                    <div className="a-column a-span7 recipient a-span-last">
                      <div className="a-row a-size-mini">
                        <span className="a-color-secondary label">
                          Payment Status 
                        </span>
                      </div>
                      <div className="a-row a-size-base">
                        <span className="a-color-secondary">
                          <span className="a-declarative" data-action="a-popover" data-a-popover="{&quot;width&quot;:&quot;250&quot;,&quot;inlineContent&quot;:&quot;\u003cdiv className=\&quot;a-row recipient-address\&quot;>\u003cdiv className=\&quot;displayAddressDiv\&quot;>\n\u003cul className=\&quot;displayAddressUL\&quot;>\n\u003cli className=\&quot;displayAddressLI displayAddressFullName\&quot;>Karan Talwar\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressAddressLine1\&quot;>EJ 198\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressAddressLine2\&quot;>Chahar Bagh\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressCityStateOrRegionPostalCode\&quot;>JALANDHAR, PUNJAB 144001\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressCountryName\&quot;>India\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressPhoneNumber\&quot;>Phone: \u003cspan dir=\&quot;ltr\&quot;> 6280905038\u003c/span>\u003c/li>\n\u003c/ul>\n\u003c/div>\n\n\u003c/div>&quot;,&quot;closeButton&quot;:&quot;false&quot;,&quot;closeButtonLabel&quot;:&quot;&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;dataStrategy&quot;:&quot;inline&quot;,&quot;name&quot;:&quot;recipient&quot;,&quot;popoverLabel&quot;:&quot;&quot;}">
                              <span className="trigger-text ml-4">

                                  {order.payment_status === "Paid" ? 
                                  <span className="text-success">   Success </span>
                                    // order.status === 2 ? <span className="text-danger">Cancelled</span> : order.status === 1 ? <span className="text-success">Delivered</span> : order.status === 3 ? <span className="text-danger">Returned</span> : order.status === 4 ? <span className="text-success">Refunded</span> : <span className="text-success">Order Placed</span> 

                                  : 
                                  <span className="text-danger"> Pending </span>
                                }
                              
                              </span>
                              <i className="a-icon a-icon-popover" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a-fixed-right-grid-col actions a-col-right  mobile_orderlist" >
                  <div className="a-row a-size-mini">
                    <span className="a-color-secondary label">
                      Order ID : 
                    </span>
                    <span className="a-color-secondary value">
                      <bdi dir="ltr">{order._id}</bdi>
                    </span>
                  </div>
                  <div className="a-row a-size-base">
                    <ul className="a-unordered-list a-nostyle a-vertical">
                      <a className="a-link-normal text-info" onClick={() => Router.push('/account/orders/invoice/' + this.props.order._id)}>
                        Order Details
                      </a>
                      <i className="a-icon a-icon-text-separator" role="img" />
                    </ul>
                  </div>
                </div>
              </div></div>
          </div></div>
      */}

<div className=" a-box a-color-offset-background order-info">
          <div className="a-box-inner">
            <div className="a-fixed-right-grid"><div className="a-fixed-right-grid-inner mobile-a-fixed-right-grid-inner  " >
                <div className="a-fixed-right-grid-col a-col-left mobile-a-fixed-right-grid-col">
                  <div className="a-row">
                    <div className="a-column a-span3">
                      <div className="a-row a-size-mini">
                        <span className="a-color-secondary label">
                          Order placed
                        </span>
                      </div>
                      <div className="a-row a-size-base">
                        <span className="a-color-secondary value mobile_id_date">
                          { moment(order.create).format("DD MMMM YYYY")}
                        </span>
                      </div>
                    </div>
                
                    <div className="a-column a-span7 recipient a-span-last">
                      <div className="a-row a-size-mini">
                        <span className="a-color-secondary label">
                          Payment Status 
                        </span>
                      </div>
                      <div className="a-row a-size-base">
                        <span className="a-color-secondary">
                          <span className="a-declarative" data-action="a-popover" data-a-popover="{&quot;width&quot;:&quot;250&quot;,&quot;inlineContent&quot;:&quot;\u003cdiv className=\&quot;a-row recipient-address\&quot;>\u003cdiv className=\&quot;displayAddressDiv\&quot;>\n\u003cul className=\&quot;displayAddressUL\&quot;>\n\u003cli className=\&quot;displayAddressLI displayAddressFullName\&quot;>Karan Talwar\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressAddressLine1\&quot;>EJ 198\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressAddressLine2\&quot;>Chahar Bagh\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressCityStateOrRegionPostalCode\&quot;>JALANDHAR, PUNJAB 144001\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressCountryName\&quot;>India\u003c/li>\n\u003cli className=\&quot;displayAddressLI displayAddressPhoneNumber\&quot;>Phone: \u003cspan dir=\&quot;ltr\&quot;> 6280905038\u003c/span>\u003c/li>\n\u003c/ul>\n\u003c/div>\n\n\u003c/div>&quot;,&quot;closeButton&quot;:&quot;false&quot;,&quot;closeButtonLabel&quot;:&quot;&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;dataStrategy&quot;:&quot;inline&quot;,&quot;name&quot;:&quot;recipient&quot;,&quot;popoverLabel&quot;:&quot;&quot;}">
                              <span className="trigger-text ml-4">

                                  {order.payment_status === "Paid" ? 
                                  <span className="text-success">   Success </span>
                                    // order.status === 2 ? <span className="text-danger">Cancelled</span> : order.status === 1 ? <span className="text-success">Delivered</span> : order.status === 3 ? <span className="text-danger">Returned</span> : order.status === 4 ? <span className="text-success">Refunded</span> : <span className="text-success">Order Placed</span> 

                                  : 
                                  <span className="text-danger"> Pending </span>
                                }
                              
                              </span>
                              <i className="a-icon a-icon-popover" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a-fixed-right-grid-col actions a-col-right  mobile_orderlist" >
                  <div className="a-row a-size-mini">
                    <span className="a-color-secondary label">
                      Order ID : 
                    </span>
                    <span className="a-color-secondary value mobile_id_date">
                      <bdi dir="ltr">{order._id}</bdi>
                    </span>
                  </div>
                  <div className="a-row a-size-base">
                    <ul className="a-unordered-list a-nostyle a-vertical">
                      <a className="a-link-normal text-info mobile_id_date" onClick={() => Router.push('/account/orders/invoice/' + this.props.order._id)}>
                        Order Details
                      </a>
                      <i className="a-icon a-icon-text-separator" role="img" />
                    </ul>
                  </div>
                </div>
              </div></div>
          </div></div>
        <div className="a-box shipment shipment-is-delivered">
          <div className="a-box-inner">
                <div className="a-row shipment-top-row js-shipment-info-container">
                  <div style={{marginRight: '230px', paddingRight: '20px'}}> 
                    {/* <div className="a-row">
                    {
                    this.props.order.orderStatus == "Delivered" ||  this.props.order.orderStatus == "delivered" ?
                      <span className="a-size-medium a-color-base a-text-bold">
                        Delivered at {moment(order.delivered_date).format("DD MMMM YYYY")}
                      </span>
                      : 
                      this.props.order.status === 2 ?
                      "Cancelled Product" :
                      <span className="a-size-medium a-color-base a-text-bold">  
                        {order.payment_status === "Paid" ? <span>Expected Delivered at {moment(order.expected_delivered_date).format("DD MMMM YYYY") } </span>
                          : ""}
                      </span> 
                    }
                    </div> */}
                  </div>
                  <div className="actions" style={{width: '230px'}}>
                  </div>
                </div>


            <div className="a-fixed-right-grid a-spacing-top-medium">
              <div className="a-fixed-right-grid-inner a-grid-vertical-align a-grid-top app-order-list">

              {console.log('this.props.order MUMUMUM')}
              {console.log(this.props.order)}




    {
       order && order.orderItemsProduct.map((order_item, index) => {

        return (

             <div key={index} className="row app-order-list-row-container">
                  <div className="col-md-6 col-sm-12">
                    <OrderListItemSingleProduct product={order_item.product_id}  order={order}  />
                  </div>
                  
                  <div className="col-md-3 col-sm-12">
                  </div>



                  <div className="col-md-3 col-sm-12">
                    
                    {this.getOrderStatusFunction(order_item, order)}
                    

                   
                </div>

            </div>


          


        )

      })
    }




    {/* {
       this.props.order && Array.isArray(this.props.order.product) && this.props.order.product.length > 0  ?
        this.props.order.product.map((product, index) => {

            
        
                 return (
                        <div key={index} className="row app-order-list-row-container">
                  <div className="col-md-6 col-sm-12">
                    <OrderListItemSingleProduct product={product}/>
                  </div>
                  
                       <div className="col-md-3 col-sm-12">
                            </div>
                 
                    {this.props.order.payment_status === "Paid" ?
                      <div className="col-md-3 col-sm-12">
                        <div className="a-button-stack">
                          <span   onClick={() => Router.push('/account/orders/track/' + this.props.order._id  + 'track' + product.product._id )} className="a-button a-button-normal a-spacing-mini a-button-base app-heighlighted-btn" id="a-autoid-12">
                            <span><a id="Write-a-product-review_2" className="a-button-text" role="button"> Track Package</a>  </span>
                         </span>


                          {this.props.order.orderStatus !== "Delivered" && this.props.order.orderStatus !== "Returned" && this.props.order.orderStatus !== "Refund" &&  this.props.order.orderStatus !== "Cancelled" ?      
                          <span   onClick={() => this.openModal(this.props.order._id, product.product._id)} className="a-button a-button-normal a-spacing-mini a-button-base app-heighlighted-btn-cancel bg-white" id="a-autoid-12"><span><a id="Write-a-product-review_2"  className="a-button-text" role="button">
                            Cancel Items
                                  </a></span>
                            </span>
                            :
                            ''
                          }

                      {
                        this.props.order.orderStatus === "Delivered" ||  this.props.order.orderStatus == "delivered" ? 
                          <div>  
                            <span onClick={() => { localStorage.setItem("ProductId", product.product._id ); Router.push('/account/orders/rating/' + this.props.order._id) }} className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel">
                              <span className="">
                                <a id="Write-a-product-review_2" href="#" className="a-button-text" role="button">
                                    Write a product review
                                </a>
                              </span>
                            </span>
                            {this.props.order.returnable ?          <span className="a-declarative" data-action="a-modal" data-a-modal="{&quot;width&quot;:600,&quot;name&quot;:&quot;archive-order-modal&quot;,&quot;url&quot;:&quot;/gp/css/order-history/archive/archiveModal.html?orderId=406-4771444-0020320&shellOrderId=&quot;,&quot;header&quot;:&quot;Archive this order&quot;}">
                               <span onClick={() => Router.push('/account/orders/return/' + this.props.order._id)}  className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel" id="a-autoid-13">
                                 <span className="">
                                   <a id="Archive-order_2"   className="a-button-text" role="button">
                                     Return Package
                                   </a>
                                 </span>
                               </span>
                             </span>
                             :
                             <span  className="a-button a-spacing-mini a-button-primary a-button-icon reorder-modal-trigger-button app-heighlighted-btn-cancel bg-danger" id="a-autoid-13">
                                 <span className="">
                                   <a id="Archive-order_2"   className="a-button-text" role="button">
                                     Return Policy Ended
                                   </a>
                                 </span>
                               </span>
                             
                             }
                   
                            </div>
                           : 
                            ''
                      }

                    </div>
                  </div>

                  : "" }
                </div>      
            );
      })
        : "Loading...."
  } */}
              </div>
              </div>
          </div>
                   {/* Return Order Model */}
            <Modal
            title="Return Order"
            centered
            destroyOnClose={true}
            visible={this.state.showOrderReturn}
            onCancel={this.handleOrderReturnModalCancel}
            onOk={this.handleOrderReturnModalOk}
            okText="Submit"
            width={1000}
            >
                <Checkbox.Group style={{ width: '100%' }} onChange={this.handleOrderReturnProductChange} >
                    <Row>
                        { this.props.order && this.props.order.product &&  this.props.order.product.map((p, index) => {
                                
                            return (
                                <Col key={index} span={8}>
                                    <Checkbox value={p.id?p.id:'1234567879'} >{p.title?p.title:'Order Item'}</Checkbox>
                                </Col>
                                );
                        })}
                    </Row>
                </Checkbox.Group>
                <strong>Description</strong>
                <TextArea onChange={this.handleOrderReturnProductDescriptionChange}  rows={4} placeholder="Write Here..."/>
            </Modal>
                          {/* Refund Order Model */}
            <Modal
                title="Refund Order"
                centered
                destroyOnClose={true}
                visible={this.state.showOrderRefund}
                onCancel={this.handleOrderRefundModalCancel}
                onOk={this.handleOrderRefundModalOk}
                okText="Submit"
                width={1000}
                >
                  
                    <Checkbox.Group style={{ width: '100%' }} onChange={this.handleOrderRefundProductChange}>
                    <Row>
                        { this.props.order && this.props.order.product &&  this.props.order.product.map((p, index) => {
                                
                            return (
                                <Col key={index} span={8}>
                                    <Checkbox value={p.id?p.id:'1234567879'} >{p.title?p.title:'Order Item'}</Checkbox>
                                </Col>
                                );
                        })}
                    </Row>
                    </Checkbox.Group>
                    <strong>Description</strong>
                    <TextArea onChange={this.handleOrderRefundProductDescriptionChange} rows={4} placeholder="Write Here..."/>
            </Modal>

            <Modal
                        title="Select Cancellation Reason"
                        visible={this.state.modelVisible}
                        onOk={this.handleModelOk}
                        onCancel={this.handleModelCancel} >
                        <Radio.Group onChange={this.GetNoteForCancel} value={this.state.CancelMessage}>
        
          <Radio value="Order Created by Mistake">Order Created by Mistake</Radio> <br />
          <Radio value="Item(s) Would Not Arrive on Time">Item(s) Would Not Arrive on Time</Radio> <br />
          <Radio value="Shipping Cost Too High">Shipping Cost Too High</Radio> <br />
          <Radio value="Item Price Too High">Item Price Too High</Radio> <br />
          <Radio value="Need to Change Payment Method">Need to Change Payment Method</Radio> <br />
              <Radio value="others">
                Others 
               
          </Radio>
        
      </Radio.Group>
      {this.state.CancelMessage === "others" ?  
                <>
                <TextArea size="large" className="mt-2"  maxlength="200"  placeholder="Comments" onChange={(e)=>this.GetNoteForCancelInput(e)} /> 
                <div className="text-danger">{this.state.otherError}</div>
                </>
                : ''}  
                        </Modal>
          </div> 
          </div>
        );
    }
}

export default OrderListItem;

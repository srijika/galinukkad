import React, { Component } from 'react';
import { Table, Modal, Input, Divider, Tag , Radio} from 'antd';
import Link from 'next/link';
import { Button } from 'antd';
import moment from 'moment';
import { baseUrl } from '../../../../repositories/Repository';
import  Repository from '../../../../repositories/Repository';
import { notification } from 'antd';
import Router  from 'next/router';
import {connect} from 'react-redux';
import {getOrderDetails} from '../../../../store/order/action';
import Newsletters from '../../../../components/partials/commons/Newletters';
import FooterDefault from '../../../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../../../components/elements/BreadCrumb';
import Orders from '../../../../components/partials/account/Orders';
import HeaderMobile from '../../../../components/shared/headers/HeaderMobile';
import NavigationList from '../../../../components/shared/navigation/NavigationList';
import './track.scss';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const {TextArea} = Input;
class OrderDetails extends Component { 
    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    constructor(props) {
        super(props);  
        this.state = {
            modelVisible:   false,
            CancelMessage:'',
            otherError : '' ,
          isError : false ,
          error: '' ,
            CancelMessageInput:'',
            orderId : '',
            productId: '', 

        };
    }

    componentDidMount() {

        console.log('this.props is');
        console.log(this.props);


        const orderId = this.props.query.id;
        this.setState({orderId: orderId});
        console.log("this.props.query")
        console.log(this.props.query)

        let orderIds = orderId.substr(0, 24);
        let productIds = orderId.substr(29, 60);
        this.setState({productId : productIds, orderId: orderIds});

        this.props.dispatch(getOrderDetails({order_id:orderIds , product_id:productIds}));
    }


    



    openModal = () =>{
        this.setState({modelVisible: true});
    }

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
            cancel_id : userDetail.email, 
            product_id: this.state.productId
		}
        if(data.description === ''){
            toast.error('Please select a reason');
            return

        }

        return
        await Repository.post('cancel/order', data).then((response) => {
            if (response.data.status) {
                // notification.success({message: 'Order Cancel Successfull',});
                toast.success('Order Cancel Successfull');
                this.setState({OrderId:'',CancelMessage:'', modelVisible:false})
                Router.push('/account/orders');
            }else{
                toast.error(response.data.message);
            }
        }).catch((err) => {
            toast.error('Order Cancel Failed');
        });
    }
		
	};

	handleModelCancel = () => {
		this.setState({modelVisible:false})
        this.setState({otherError :""});
        this.setState({isError :false});
	};

    GetNoteForCancel = (event) =>{
        this.setState({CancelMessage : event.target.value});
    }
    cancelMyOrder = async orderId =>{
        
        if(orderId){
            await Repository.post('cancel/order',{id: orderId,"description": "cancel desc"}).then((response) => {
                if (response.data.status) {
                    // notification.success({message: 'Order Cancel Successfull',})
    toast.success('Order Cancel Failed');
    ;
                    Router.push('/account/orders');
                }else{
                    // notification.error({
                    //     message: response.data.message
                    // });
    toast.error(response.data.message);

                }
            }).catch((err) => {
                // notification.error({
                //     message: 'Order Cancel Failed',
                // });
    toast.error('Order Cancel Failed');

            });
        }
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
    
    viewMyOrderProduct = async productId =>{
        if(productId){
            Router.push("/product/"+productId)
        }
    }


    getOrderPaymentStatusMessage = (orderDetails) => {  


        if(orderDetails === undefined) {
            return ;
        }

        let item_status = orderDetails.orderDetail.item_status;


        if(orderDetails.payment_status === "Unpaid") {
            return ( <div class="alert alert-danger"> <strong>Message!</strong> Payment Pending </div> )
        }


        let statusReturned = null;
        switch (item_status) {
            case 0:
                statusReturned = <div class="alert alert-success"> Order Item Placed </div>
                break;
            case 1:
                statusReturned = <div class="alert alert-success"> Order Item Delivered</div>
                break;
            case 2:
                statusReturned = <div class="alert alert-danger"> Order Item  Cancelled</div>
                break;
            case 3:
                statusReturned = <div class="alert alert-warning">  Item Returned Proceed</div>
                break;
            case 4:
                statusReturned = <div class="alert alert-primary">  Refunded</div>
                break;
            default:
                statusReturned = <span style={{ 'textAlign': 'center' }}>-</span>
                break;
        }

        return statusReturned;


    }







    orderItemCancelled(orderDetails) {
        return (
            <span className="app-track-progress-milestone" >
            {
                    orderDetails ? 
                    orderDetails.orderDetail.track_status === 'Out_For_Delivery' || orderDetails.orderDetail.item_status === 2 ?
                    <div>  
                        <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                    </div>
                        :
                        ""

                        : ""
                }  
                <div>
                {/* <span  className="app-milestone-heading-unactive"> Cancelled </span> */}
                <span className="app-milestone-heading-active text-danger">Cancelled : { orderDetails ?  moment(orderDetails.orderDetail.cancelled_date).format("DD MMMM YYYY") : "" }  </span>
                </div>
            </span>
        )
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
                text: 'track',
            },
        ];

        const { order } = this.props;
        let orderDetails = order;
        let products = order ? order.product : [];
        // let thumbnailImage = products.length > 0 ? products[0].product.thumbnailImage : ""; 
        let thumbnailImage = order ? `thumbnail/${order.imageName}
        ` : []; 
        
        
        let orderTrackStatus = orderDetails ?orderDetails.orderDetail.track_status : "";
        console.log('orderTrackStatus sdf');
        console.log(orderTrackStatus);


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
                    <div className="col-12">
                        <div className="app-track-order">

                        {this.getOrderPaymentStatusMessage(orderDetails)}
                    

                            <h3 className="app-track-order-heading"> Arriving Saturday</h3>           

                            <h4> Product Name : {orderDetails && orderDetails.orderDetail.product_id.title} </h4>
                            <h4> Price : {orderDetails && orderDetails.orderDetail.product_id.price} </h4>
                            {orderDetails && orderDetails.orderDetail.item_tracking_id != undefined 
                            ? 
                            <h4> Tracking ID : {orderDetails.orderDetail.item_tracking_id } </h4>
                            : ""
                            }
                            <div className="row app-track-order-wrapper">
                                <div className="col-md-5 col-sm-12">
                                    <div className="app-track-progress">
                                        <span className="app-track-progress-milestone" >
                                            {
                                                orderTrackStatus ? 
                                                    orderTrackStatus == 'Ordered' || orderTrackStatus == 'Returned'?
                                                        <div>  
                                                        <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                            <span className="app-track-progress-milestone-marker">
                                                                {
                                                                     orderDetails.orderDetail.item_status === 2 || orderDetails.orderDetail.item_status === 3 
                                                                     ? 
                                                                     <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>         
                                                                     : 
                                                                     <span className="app-track-progress-milestone-marker-percentage" style={{height:'40%'}}></span>
                                                                }
                                                            
                                                        </span>
                                                        </div> 
                                                    :
                                                        orderTrackStatus == 'Shipped'|| orderTrackStatus == 'Out_For_Delivery' || orderTrackStatus == 'Delivered' || orderTrackStatus == 'Returned' ?
                                                            <div>  
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                                <span className="app-track-progress-milestone-marker">
                                                                <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                            </span>
                                                            </div>
                                                        :
                                                            <div>  
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                                <span className="app-track-progress-milestone-marker">
                                                                <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                            </span>
                                                            </div>
    
                                                : <div>  
                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                    <span className="app-track-progress-milestone-marker">
                                                    <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                </span>
                                                </div>
                                            }  

                                            <div>
                                            <span className="app-milestone-heading-active">Ordered : { orderDetails ?  moment(orderDetails.create).format("DD MMMM YYYY") : "" }  </span>
                                            </div>
                                        </span>
                                        

                                        
                                        {
                                        orderDetails && orderDetails.orderDetail.item_status === 2 ?
                                            
                                                this.orderItemCancelled(orderDetails)

                                            : 
                                            <>
                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus ? 
                                                        orderTrackStatus == 'Shipped' || orderTrackStatus == 'Returned' ?
                                                            <div>  
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                                <span className="app-track-progress-milestone-marker">
                                                                <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                            </span>
                                                            </div> 
                                                        :
                                                            orderTrackStatus == 'Out_For_Delivery' || orderTrackStatus == 'Delivered' || orderTrackStatus == 'Returned' ?
                                                                <div>  
                                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                                    <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                                </span>
                                                                </div>
                                                            :
                                                                <div>  
                                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                                    <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                                </span>
                                                                </div>
        
                                                    : <div>  
                                                    <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                        <span className="app-track-progress-milestone-marker">
                                                        <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                    </span>
                                                    </div>
                                                }  
                                                <div>
                                                <span  className="app-milestone-heading-unactive"> Shipped </span>
                                                </div>
                                            </span>
                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus ? 
                                                        orderTrackStatus == 'Out_For_Delivery' || orderTrackStatus == 'Returned' ?
                                                            <div>  
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                                <span className="app-track-progress-milestone-marker">
                                                                <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                            </span>
                                                            </div> 
                                                        :
                                                            orderTrackStatus == 'Delivered' || orderTrackStatus == 'Returned' ?
                                                                <div>  
                                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                                    <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                                </span>
                                                                </div>
                                                            :
                                                                <div>  
                                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                                    <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                                </span>
                                                                </div>
        
                                                    : <div>  
                                                    <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                        <span className="app-track-progress-milestone-marker">
                                                        <span className="app-track-progress-milestone-marker-percentage" ></span>
                                                    </span>
                                                    </div>
                                                } 
    
                                                <div>
                                                <span className="app-milestone-heading-unactive">Out for delivery</span>
                                                </div>
                                            </span>
                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus &&
                                                        orderTrackStatus == 'Delivered' || orderTrackStatus == 'Returned'  ?
                                                       
                                                        <div>  
                                                                <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                               {orderTrackStatus == 'Returned' || orderTrackStatus == 'Refund' ?  <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" style={{height:'100%'}}></span>
                                                                </span> : ''} 
                                                                   
                                                                </div>
                                                             
        
                                                        :   <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>

                                                        </div>
                                                } 
                                                    <div>
                                                    <span className="app-milestone-heading-unactive">Delivered</span>
                                                    </div>
                                            </span>
                                            {orderTrackStatus && orderTrackStatus == 'Returned' || orderTrackStatus == 'Product Pickup' ?
                                            <>
                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus &&
                                                        orderTrackStatus == 'Delivered' || orderTrackStatus == 'Returned' ?
                                                        <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                            <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" style={{height:'40%'}}></span>
                                                                    </span>
                                                        </div>
        
                                                        :   <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                        </div>
                                                } 
                                                    <div>
                                                    <span className="app-milestone-heading-unactive">Return Request Accept</span>
                                                    </div>
                                            </span>

                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus &&
                                                       orderTrackStatus == 'Refund' ||  orderTrackStatus == 'Returned' ?
                                                        <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                            <span className="app-track-progress-milestone-marker">
                                                                    <span className="app-track-progress-milestone-marker-percentage" style={{height:'0%'}}></span>
                                                                    </span>
                                                        </div>
        
                                                        :   <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                        </div>
                                                } 
                                                    <div>
                                                    <span className="app-milestone-heading-unactive">Product Pickup</span>
                                                    </div>
                                            </span>
                                            <span className="app-track-progress-milestone" >
                                            {
                                                    orderTrackStatus &&
                                                        orderTrackStatus == 'Refund'   ?
                                                        <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-checked"></span>
                                                        </div>
        
                                                        :   <div>
                                                            <span className="app-track-progress-milestone-checkbox app-track-progress-milestone-checkbox-unchecked"></span>
                                                        </div>
                                                } 
                                                    <div>
                                                    <span className="app-milestone-heading-unactive">Refund</span>
                                                    </div>
                                            </span>
                                            </>
                                             :
                                            ''
                                            }
                                          
                                            
                                        

                                         
                                                </>
                                        }

                                        </div>    

                                     
                                    
                                </div>
                                <div className="col-md-7 col-sm-12 d-flex justify-content-center">
                                    <div className="app-order-image-container">
                                        <img src={baseUrl+'/'+ thumbnailImage} style={{ height: '200px', width: "200px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                <div className="app-order-tracking-deliery-container">
                    <div className="app-order-tracking-deliery-cardContainer">
                        <h1>Shipping Address</h1>
                        <div className="app-order-tracking-deliery-cardContainer-shippingAddress">
                            <p>{orderDetails && orderDetails.userInfo.name}</p>
                            <p>{orderDetails && orderDetails.address.add1}</p>
                            <p>{orderDetails && orderDetails.address.add2}</p>
                            <p>{orderDetails && orderDetails.address.state}, {orderDetails && orderDetails.address.country}, {orderDetails && orderDetails.address.postal}</p>
                        </div>
                    </div>

                    <div className="app-order-tracking-deliery-cardContainer">
                        <div className="app-order-tracking-deliery-cardContainer-shippingAddress">

                                            

                            {(orderDetails != undefined && orderDetails.orderDetail.item_status === 2) ?  <span style={{ color: "red" }}> Order Cancelled </span> :
                            (orderDetails != undefined && orderDetails.orderDetail.item_status === 1) ? <span style={{ color: "green" }}> Order Delivered </span> :

                            (orderDetails != undefined && orderDetails.orderDetail.item_status === 3) ? <span className="bg-warning text-light p-3" > Order Returned </span> :
                            (orderDetails != undefined && orderDetails.orderDetail.item_status === 4) ? <span style={{ color: "green" }}> Order Refunded </span> :

                                    <a className="app-order-tracking-deliery-cardContainer-shippingAddress-link" 
                                        onClick={this.openModal} >
                                        Cancel Items </a>  
                                        
                         }
                         </div>
                         
                    </div>

                    {/* <Modal
                        title="Write Some Note Here!"
                        visible={this.state.modelVisible}
                        onOk={this.handleModelOk}
                        onCancel={this.handleModelCancel} >
                        <Input size="large" placeholder="Note" onChange={(e)=>this.GetNoteForCancel(e)} />
                        
                        </Modal> */}


                        <Modal 
                        title="Select Cancellation Reason"
                        visible={this.state.modelVisible}
                        onOk={this.handleModelOk}
                        onCancel={this.handleModelCancel} >
                        <Radio.Group onChange={this.GetNoteForCancel} value={this.state.CancelMessage}>
        {/* <Space direction="vertical"> */}
          <Radio value="Order Created by Mistake">Order Created by Mistake</Radio> <br />
          <Radio value="Item(s) Would Not Arrive on Time">Item(s) Would Not Arrive on Time</Radio> <br />
          <Radio value="Shipping Cost Too High">Shipping Cost Too High</Radio> <br />
          <Radio value="Item Price Too High">Item Price Too High</Radio> <br />
          <Radio value="Need to Change Payment Method">Need to Change Payment Method</Radio> <br />
              <Radio value="others">
                Others
               
         
          
          </Radio>
        {/* </Space> */}
      </Radio.Group>

      {this.state.CancelMessage === "others" ?  
                <>
                <TextArea size="large" className="mt-2" maxlength="200"  placeholder="Comments" onChange={(e)=>this.GetNoteForCancelInput(e)} /> 
                <div className="text-danger">{this.state.otherError}</div>
                </>
                
                : ''}
                        
                        </Modal>

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
        order:state.order.orderDetails
    }
}
export default connect(mapToProps)(OrderDetails);

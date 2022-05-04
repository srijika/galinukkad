import React, {Component} from 'react';
import { Rate } from 'antd';
import Rating from '../../../Rating';
import {calculateReviews} from '../../../../../utilities/functions-helper';
import {reviewPercentage} from '../../../../../utilities/functions-helper';
import { Form, Input, notification , Row, Col } from 'antd';
import { connect } from 'react-redux';
import { actionTypes } from '../../../../../store/product/action';
import { getProductsById } from '../../../../../store/product/action';
import  Repository from '../../../../../repositories/Repository.js';
import Moment from 'react-moment';
import ShowMoreText from 'react-show-more-text';
import { ToastContainer, toast , Flip } from 'react-toastify';
import Router , {useRouter} from 'next/router';



class PartialReview extends  Component {
    formRef = React.createRef();	
    constructor(props) {
        super(props);
        // this.fetchReviews();
        this.state = {
            reviewSubmitted : this.props.reviewSubmitted
        }
    }

   
    state = {
        rating:1,
        name:'',
        email:'',
        message:'',
        reviews:[],
        total : 0,
        limit: 10
    }

     // user review-----------


     componentDidMount() {
        this.fetchReviews();
    }

    fetchReviews(pageNo=0) {
        const {productId} = this.props;

     
            Repository.post('review/listing',{ product_id: productId, page:pageNo, limit: this.state.limit})
            .then((res) => {
                console.log(res);
                if(res.data.status) {
                    const data = res.data.data;
                    this.setState({ reviews: [...data], total: res.data.count})
                }
            }).catch((error) => {
               console.log(error);
        
              })
    

       
    }

    paginate = (pageNo) => {
        this.fetchReviews(pageNo-1);
    }


    // user review-----------
    lastSubmittedResult;
    lastSubmittedError;
    
    
    onFinish = (values) => {
        values.product_id = this.props.productId;
        if(this.state.rating === undefined){
            values.rating = 1;

        }else{
            values.rating = this.state.rating;

        }


        
        this.props.postReview(values);
        this.formRef.current.resetFields();
        setTimeout(() => {
        this.fetchReviews();

        } ,100)
    }

    updateRating = (rating) => {
        this.setState({rating:rating});
    };

    componentDidUpdate() {
        console.log("componentDidUpdate : ",this.props);
        const {reviewSubmitted , reviewSubmitResultError} =  this.props;
        
        if(reviewSubmitted && reviewSubmitted.status === true ) {
            // notification.open({
            //     message: 'Review Submitted.',
            //     description: 'Thanks for review.',
            //     duration: 500,
            //     placement:'bottomLeft'
            // });
           
            this.lastSubmittedResult = reviewSubmitted.status;
            this.props.updateProductData(this.props.productId);
        } else if (reviewSubmitted && reviewSubmitted.status === false ) {
            // notification.open({
            //     message: 'Error!',
            //     description: reviewSubmitted.message,
            //     duration: 500,
            //     placement:'bottomLeft'
            // });
            toast.error(reviewSubmitted.message);
            this.lastSubmittedResult = reviewSubmitted.status;
        } 
        else if (reviewSubmitted && reviewSubmitted.error && reviewSubmitted.error.response.data === 'Unauthorized') {
            // notification.open({
            //     message: 'Error!',
            //     description: 'Please Login First!',
            //     duration: 500,
            //     placement:'bottomLeft'
            // });
            toast.error('Please Login First!');
            Router.push('/account/login');

               
        }


    }

    render() {
    const { reviews , form } = this.props;

    const {reviewSubmitted , reviewSubmitResultError} =  this.props;
    let isProductBuy = this.props.product.singleProduct.isProductBuy
    console.log("this.props.prrere" , this.props.product.singleProduct.isProductBuy)

    return (<div className="row">
        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 ">
            <div className="ps-block--average-rating">
                <div className="ps-block__header">
                    <h3>{calculateReviews(reviews)}</h3>
                    <Rating rating={calculateReviews(reviews)} />
                    
                    <span>1 Review</span>
                </div>
                <div className="ps-block__star">
                    <span>5 Star</span>
                    <div className="ps-progress" data-value="50">
                        <span style={{width:reviewPercentage(5,reviews)+'%'}} ></span>
                    </div>
                    <span>{reviewPercentage(5,reviews)+'%'}</span>
                </div>
                <div className="ps-block__star">
                    <span>4 Star</span>
                    <div className="ps-progress" data-value="0">
                    <span style={{width:reviewPercentage(4,reviews)+'%'}} ></span>
                    </div>
                    <span>{reviewPercentage(4,reviews)+'%'}</span>
                </div>
                <div className="ps-block__star">
                    <span>3 Star</span>
                    <div className="ps-progress" data-value="0">
                    <span style={{width:reviewPercentage(3,reviews)+'%'}} ></span>
                    </div>
                    <span>{reviewPercentage(3,reviews)+'%'}</span>
                </div>
                <div className="ps-block__star">
                    <span>2 Star</span>
                    <div className="ps-progress" data-value="0">
                    <span style={{width:reviewPercentage(2,reviews)+'%'}} ></span>
                    </div>
                    <span>{reviewPercentage(2,reviews)+'%'}</span>
                </div>
                <div className="ps-block__star">
                    <span>1 Star</span>
                    <div className="ps-progress" data-value="0">
                    <span style={{width:reviewPercentage(1,reviews)+'%'}} ></span>
                    </div>
                    <span>{reviewPercentage(1,reviews)+'%'}</span>
                </div>
            </div>
        </div>
        {isProductBuy === true ? 
            <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12 ">
            <Form className="ps-form--review"  ref={this.formRef} onFinish={(values) => {this.onFinish(values)}} >
                <h4>Submit Your Review</h4>
                <p>
                    Your email address will not be published. Required fields are marked
                </p>
                <div className="form-group form-group__rating">
                    <label>Your rating of this product</label>
                        <Rate onChange={this.updateRating} defaultValue={this.state.rating} allowClear={false}/> 
                </div>
                <div className="form-group">
                    <Form.Item
                        name="message"
                        rules={[{ required: true, message: 'Please input your Message!' },{ max: 100, message: 'Message must not be greater than 100 characters.' },]}
                    >
                        <Input.TextArea defaultValue={this.state.message} placeholder="Write your message" />
                    </Form.Item>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  ">
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' },{ max: 25, message: 'Name must not be greater than 25 characters.' },]}
                    >
                        <Input defaultValue={this.state.name} placeholder="Your Name" />
                    </Form.Item>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  ">
                    {/* <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' },{type: 'email'}]}
                    >
                </Form.Item> */}
                    {/* <Input  value={this.state.email} placeholder="Your Email" /> */}
                    </div>
                </div>
                <div className="form-group submit">
                    <button className="ps-btn">Submit Review</button>
                </div>
            </Form>
        </div>
        :''}
    
        {/* user reviews */}
      
        <Row style={{"width":'98%',"paddingLeft":"2%"}}>
        <h3 className="mt-5">PUBLIC REVIEWS</h3>
                {this.state.reviews && this.state.reviews.length > 0 ? this.state.reviews.map((review, index) => (
                    <Col span="24" key={index}>
                    <div className="app-review-card">
                        <div className="app-review-card-header">
                        <img src={review.userInfo.profile && review.userInfo.profile.photo?review.userInfo.profile.photo:"https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"} />

                        {/* <img src={review.userInfo.profile && review.userInfo.profile.photo?review.userInfo.profile.photo:"https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} /> */}
                        
                        <div>
                        <Rate style={{fontSize : '1.5rem'}} tooltips={"12345"}  value={review.rating} disabled={true} /><br/>
                        {review.userInfo.username}
                        </div>
                        </div>
                        <span className="app-review-card-date">
                        <Moment format="D MMM YYYY">
                            {review.create}
                        </Moment>
                        </span>
                        <div className="app-review-card-desc">
                        <ShowMoreText
                            lines={1}
                            more='Show more'
                            less='Show less'
                            className='app-review-show-more'
                            anchorClass='app-anchor-show-more'
                            onClick={this.executeOnClick}
                            expanded={false}
                            >
                            {review.message}
                            </ShowMoreText>
                        </div>
                    </div>
                    </Col>  
                )):
                <Col span="24" >
                <p>No Reviews Available</p>
                </Col> }
            </Row>
            {this.state.total > this.state.limit?<Pagination defaultCurrent={1} total={this.state.total} onChange={this.paginate} />:null}
    </div>
       
    );
    }
}

const mapsToProps = (state) => {
    return {
        reviewSubmitted: state.product.reviewSubmitResult,
        reviewSubmitResultError:  state.product.reviewSubmitResult ,
        product:  state.product

    };
};

const dispatchToProps = (dispatch) => {
    return {
        postReview: (payload) => {
            dispatch({type: actionTypes.POST_PRODUCT_REVIEW, payload})
        },
        updateProductData: (payload) => {
            dispatch(getProductsById(payload))
        }
    }
}


export default connect(mapsToProps,dispatchToProps)(PartialReview);

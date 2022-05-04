import React, {Component} from 'react';
import './css/PartialSellerReview.css';
import {Rate , Row, Col} from 'antd';
import ShowMoreText from 'react-show-more-text';
import  Repository from '../../../../../repositories/Repository.js';
import Moment from 'react-moment';
import { Pagination } from 'antd';

class PartialSellerReview extends  Component {
    
    state = {
        reviews:[],
        total : 0,
        limit: 10
    }

    componentDidMount() {
        this.fetchReviews();
    }

    fetchReviews(pageNo=0) {
        const {productId} = this.props;
        Repository.post('review/listing',{ product_id: productId, page:pageNo, limit: this.state.limit})
        .then((res) => {
            if(res.data.status) {
                const data = res.data.data;
                this.setState({ reviews: [...data], total: res.data.count})
            }
        })
    }

    paginate = (pageNo) => {
        this.fetchReviews(pageNo-1);
    }

    render() {
    return (
        <div>
            <Row>
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
                )):<p>No Reviews Available</p>}
            </Row>
            {this.state.total > this.state.limit?<Pagination defaultCurrent={1} total={this.state.total} onChange={this.paginate} />:null}
        </div>
    );
    }
}

export default PartialSellerReview;

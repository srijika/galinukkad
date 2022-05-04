import React, { Component } from 'react';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

import PartialDescription from './PartialDescription';
import PartialSpecification from './PartialSpecification';
import PartialVendor from './PartialVendor';
import PartialReview from './PartialReview';
import PartialSellerReview from './PartialSellerReview';
import PartialQuestionAnswer from './PartialQuestionAnswer';
import PartialOffer from './PartialOffer';
import { connect } from 'react-redux';
import {calculateReviews} from '../../../../../utilities/functions-helper';

class DefaultDescription extends Component {
    constructor(props) {
        super(props);
    }
    render() {
       let isLoggedIn = true;
        const { singleProduct } = this.props;
        if (this.props.isLoggedIn !== true) {
            isLoggedIn = false;
        }
        return (
            <div>
                <div className="ps-product__content ps-tab-root">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Description" key="1">
                            <PartialDescription description={singleProduct.description} />
                        </TabPane>
                        <TabPane tab="Vendor" key="3">
                            <PartialVendor productId={singleProduct.loginid} sellerAddress={singleProduct.seller_address} />
                        </TabPane>
                        <TabPane tab={'Reviews (' + (singleProduct.review && singleProduct.review.length > 0?singleProduct.review.length:0) + ')'} key="4">
                            <PartialReview productId={singleProduct._id} reviews={singleProduct.review} />
                        </TabPane>
                        {/* <TabPane  tab="Users Review" key="5">
                            <PartialSellerReview productId={singleProduct._id} />
                        </TabPane> */}
                        <TabPane tab="Questions and Answers" key="6">
                            <PartialQuestionAnswer productId={singleProduct._id} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return state.auth;
};
export default connect(mapStateToProps)(DefaultDescription);


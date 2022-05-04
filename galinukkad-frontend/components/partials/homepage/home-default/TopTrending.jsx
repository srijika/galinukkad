import React, { Component } from 'react';
import ProductHorizontal from '../../../elements/products/ProductHorizontal';
import { connect } from 'react-redux';
import Link from 'next/link';
import { getColletionBySlug } from '../../../../utilities/product-helper';
import {getCollectionIdBySlug} from '../../../../utilities/product-helper';
import Repository from '../../../../repositories/Repository';


class TopTrending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
      
        };
    }
    componentDidMount() {
        this.getTopSaleProduct()
    }
    getTopSaleProduct = async () => {
        await Repository.post('/top-sale-product-category-wise-list', {}).then((response) => {
            if (response.data.status) {
                 this.setState({ allData: response.data.top_trending })
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    render() {
        // const { collections, collectionSlug } = this.props;
        // const products = getColletionBySlug(collections, collectionSlug);
        // const collectionId = getCollectionIdBySlug(collections, collectionSlug);



        return (
            <div className="ps-product-list ps-new-arrivals">
                <div className="ps-container">
                    <div className="ps-section__header ps-section__header_sale">
                        <h3>Top Trending Products</h3>
                     
                    </div>
                    <div className="ps-section__content">
                        <div className="row">
                            {this.state.allData && this.state.allData.map(product => (
                                <div
                                    className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 "
                                    key={product.title}>
                                    <ProductHorizontal product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state => state.collection)(TopTrending);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import Product from '../../../elements/products/Product';
import { carouselStandard } from '../../../../utilities/carousel-helpers';
import { getColletionBySlug } from '../../../../utilities/product-helper';
import Repository from '../../../../repositories/Repository'; 
import Router, {withRouter} from 'next/router';
import {Spin} from 'antd';
class BestSaleItems extends Component {
    constructor(props) {
        super(props);
        this.state = { products: [] };
    }

    handleCarouselPrev = (e) => {
        e.preventDefault();
        this.slider.slickPrev();
    };

    handleCarouselNext = (e) => {
        e.preventDefault();
        this.slider.slickNext();
    };


    componentDidMount = () => {
        Repository.get('/best-selling-product')
        .then((res) => {
            const { bestSellingProduct }  = res.data;
            this.setState({products:bestSellingProduct});
        })
        .catch(() => {
            //  Router.push('/page/page-404');
             Router.push('/');

            console.log("/page/page-404")
        });
    }

    render() {
        // const { collections, collectionSlug } = this.props;
        // const products = getColletionBySlug(collections, collectionSlug);
        const  { products } = this.state;
        return (
            <div className="ps-block--shop-features">
                <div className="ps-block__header">
                    <h3>Best Sale Items Data</h3>
                    <div className="ps-block__navigation">
                        <a
                            className="ps-carousel__prev"
                            onClick={this.handleCarouselPrev}>
                            <i className="icon-chevron-left"></i>
                        </a>
                        <a
                            className="ps-carousel__next"
                            onClick={this.handleCarouselNext}>
                            <i className="icon-chevron-right"></i>
                        </a>
                    </div>
                </div>
                <div className="ps-block__content">
                {!products || products.length == 0?
                            <div style={{ display:"flex", justifyContent:"center", padding:'1rem', flex:'1 1'}}>
                                <Spin />
                            </div>
                            :null
                }
                    {products && products.length > 0 ? (
                        <Slider
                            ref={(slider) => (this.slider = slider)}
                            {...carouselStandard}
                            arrows={false}
                            infinite={false}
                            className="ps-carousel">
                            {products.map((product) => (
                                <Product product={product} key={product._id} />
                            ))}
                        </Slider>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}

export default connect((state) => state.collection)(BestSaleItems);

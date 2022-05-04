import React, { Component } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import Product from '../../../elements/products/Product';
import { carouselFullwidth } from '../../../../utilities/carousel-helpers';
import { getColletionBySlug } from '../../../../utilities/product-helper';
import { connect } from 'react-redux';
import CollectionProducts from './modules/CollectionProducts';
import { getCollectionIdBySlug } from '../../../../utilities/product-helper';
import Repository from '../../../../repositories/Repository';
import { Form, Input, notification } from 'antd';

class Clothings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            items: null,
            currentCollection: 'newArrivals',
        };
    }

    componentDidMount() {
        this.getTopSaleProduct()
    }

    getTopSaleProduct = async () => {
        await Repository.post('/top-sale-product-category-wise-list', {}).then((response) => {
            if (response.data.status) {
                 this.setState({ allData: response.data.data })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const { allData } = this.state;
        console.log("allData" , allData);
        console.log("this.state" , this.state);


        return (
            <div>
                {
                    allData.length > 0 && allData.map((items, index) =>{
                        

                            return( items.category ? 
                                (<div key={index} className="ps-product-list ps-garden-kitchen">
                            <div className="ps-container">
                                <div className="ps-section__header">
                                    <h3>{items.category.name}  </h3>
                                    <ul className="ps-section__links">
                                        <li>
                                            <Link href={"/shop?scategory="+items.category._id}>
                                                <a>View All</a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="ps-section__content">
                                    <CollectionProducts products={items.category.products} />
                                </div>
                            </div>
                        </div> )
                   
                   : ""
                   )
                
                })
            }
             
            </div>
        );
    }
}

export default connect(state => state.collection)(Clothings);

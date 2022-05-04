import React, { Component } from 'react';
import Slider from 'react-slick';
import Product from '../../../components/elements/products/Product';
import { carouselFullwidth, carouselStandard } from '../../../utilities/carousel-helpers';
import { getColletionBySlug } from '../../../utilities/product-helper';
import { connect } from 'react-redux';
import  Repository from '../../../repositories/Repository';


class RelatedProduct extends Component {
    oldProductId = null;
    constructor(props) {
        super(props);
        this.state = {
            sCategory:'',
            allData:[]
        };
    }

    componentDidMount() {
        const { singleProduct } = this.props;
        console.log("singleProduct" , singleProduct)
        this.setState({ sCategory: singleProduct.subCategory })
        // this.getRelatedProduct(singleProduct.subCategory)
        this.getRelatedProduct(singleProduct.subCategory , singleProduct.brand , singleProduct.title ,  singleProduct._id )

    }

    componentDidUpdate(){
        const { singleProduct } = this.props;
        if(this.state.sCategory != singleProduct.subCategory){
            this.setState({ sCategory: singleProduct.subCategory })
            this.getRelatedProduct(singleProduct.subCategory , singleProduct.brand , singleProduct.title ,  singleProduct._id )
        // this.getRelatedProduct(singleProduct.subCategory)

        }
    }

    getRelatedProduct = async (subCategory_id , brand , title , _id) =>{
const data = {
    _id : _id , 
    subcategory_slug:subCategory_id ,
    brand:brand ,
    title:title

}
console.log(data)

        await Repository.post('/product-by-subcategory-2', data).then((response) => {
            if (response.data.status) {
                this.setState({ allData: response.data.data })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

  


    render() {
        const { allData } = this.state;
        const { boxed, layout } = this.props;
        const {relatedProducts} = this.props ;
      
            return (
                <div
                    className={`ps-section--default ps-related-products ${
                        boxed === true ? 'boxed' : ''
                    }`}>
                    <div className="ps-section__header">
                        <h3>Related products</h3>
                    </div>
                    {allData && allData.length > 0?<div className="ps-section__content">
                        <Slider {...carouselFullwidth} infinite={allData.length < 7 ? false : true}
                                className="ps-carousel">
                            {allData.map((product,index) => {
                                return (
                                    <Product product={product} key={index}/>
                                );
                            })}
                        </Slider>
                    </div>:<p>No related products found</p>}
                </div>
            );
      

    }
}

const mapStateToProps = state => {
    console.log("state.product" ,state.product)
    return state.product;
};

export default connect(mapStateToProps)(RelatedProduct);

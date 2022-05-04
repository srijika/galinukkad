import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../../store/cart/action';
import { removeCompareItem } from '../../../store/compare/action';
import { baseUrl } from '../../../repositories/Repository';
import Link from 'next/link';
import { Rate } from 'antd';

class Compare extends Component {
    constructor(props) {
        super(props);
    }

    handleAddItemToCart = product => {
        this.props.dispatch(addItem(product));
    };

    handleRemoveCompareItem = (e, product) => {
        e.preventDefault(); 
        this.props.dispatch(removeCompareItem(product));
    };

    render() { 
        const { compareItems } = this.props;
        console.log("compareItems" ,compareItems )
        return (
            <div className="ps-compare ps-section--shopping">
                <div className="container">
                    <div className="ps-section__header">
                        <h2>Compare Product</h2> 
                    </div>
                    <div className="ps-section__content">
                        {compareItems && compareItems.length === 0 ? (
                            <div className="alert alert-danger" role="alert">
                                Compare list is empty!
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table ps-table--compare">
                                    <tbody>
                                    <tr>
                                        <td className="heading font-weight-bold" rowSpan="1">
                                            Action
                                        </td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product,index) => (
                                                <td key={index}>
                                                    <a
                                                        href="#"
                                                        onClick={e =>
                                                            this.handleRemoveCompareItem(
                                                                e,
                                                                product,
                                                            )
                                                        }>
                                                         <i className="icon-cross font-weight-bold"></i>
                                                    </a>
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold" rowSpan="2">
                                            Product
                                        </td>
                                      
                                    </tr>
                                    <tr>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product, index) => (
                                                <td key={index}>
                                                    <div className="ps-product--compare">
                                                        <div className="ps-product__thumbnail">
                                                            <Link
                                                                href="/product/[pid]"
                                                                as={`/product/${product._id}`}>
                                                                <a>
                                                                    <img height={130} width={120}
                                                                        src={
                                                                            `${baseUrl}/`+ product.images.file
                                                                        }
                                                                        alt="Galinukkad"
                                                                    />
                                                                </a>
                                                            </Link>
                                                        </div>
                                                        <div className="ps-product__content">
                                                            <Link
                                                                href="/product/[pid]"
                                                                as={`/product/${product._id}`}>
                                                                <a className="ps-product__title mobile_ps-product__title">
                                                                    {
                                                                        <strong>{product.title}</strong>
                                                                    }
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold">Rating</td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product,index) => (
                                                <td key={index}>
                                                    <Rate
                                                        disabled
                                                        defaultValue={0}
                                                    />
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold">Sub Category</td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product,index) => (
                                                <td key={index}>
                                                    <Link href="#">
                                                        <a>
                                                            <strong className="text-secondary">{product.sub_cat_name}</strong>
                                                        </a>
                                                    </Link>
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold">Brand</td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product,index) => (
                                                <td key={index}>
                                                    <Link href="#">
                                                        <a>
                                                            <strong className="text-secondary">{product.brand}</strong>
                                                        </a>
                                                    </Link>
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold ">Price</td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product, index) => {
                                                if (product.sale === true) {
                                                    return (
                                                        <td
                                                            key={
                                                                index
                                                            }>
                                                            <h4 className="price sale mobile_compare_price">
                                                                ₹ 
                                                                {
                                                                    product.price
                                                                }
                                                                <del>
                                                                    ₹ {product.salePrice}
                                                                </del>
                                                            </h4>
                                                        </td>
                                                    );
                                                } else
                                                    return (
                                                        <td
                                                            key={
                                                                index
                                                            }>
                                                            <h4 className="price  mobile_compare_price">
                                                                ₹ {' '}
                                                                {
                                                                    product.price
                                                                }
                                                            </h4>
                                                        </td>
                                                    );
                                            })
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    <tr>
                                        <td className="heading font-weight-bold">Sold By</td>
                                        {compareItems &&
                                        compareItems.length > 0 ? (
                                            compareItems.map((product,index) => (
                                                <td key={index}>
                                                    <Link href="/vendor/store-list">
                                                        <a>
                                                            <strong className="text-secondary">{product.vendor}</strong>
                                                        </a>
                                                    </Link>
                                                </td>
                                            ))
                                        ) : (
                                            <td></td>
                                        )}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.compare;
};
export default connect(mapStateToProps)(Compare);

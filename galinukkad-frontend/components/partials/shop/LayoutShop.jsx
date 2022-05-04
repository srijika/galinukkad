import React, { Component } from 'react';
import { connect } from 'react-redux';
import Product from '../../elements/products/Product';
import ProductWide from '../../elements/products/ProductWide';
import ShopWidget from './modules/ShopWidget';
import BestSaleItems from './modules/BestSaleItems';
import RecommendItems from './modules/RecommendItems';
import { Pagination, Skeleton } from 'antd';
import { getProducts } from '../../../store/product/action';
import { Spin } from 'antd';
import Router , { withRouter } from 'next/router';
class LayoutShop extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        listView: true,
    };

    handleChangeViewMode = (event) => {
        event.preventDefault();
        this.setState({ listView: !this.state.listView });
    };

    handlePagination(page, pageSize) {
        const params = {
            _start: page === 1 ? 0 : page * pageSize,
            _limit: pageSize,
        };
        this.props.handlePaginationChanged(page-1); 
        // this.props.dispatch(getProducts(params));
    }

    onSortChange = (event) => {
         const query = {...this.props.router.query};

         query.sort = event.target.value;
         Router.push({pathname:'/shop',query});
         
    }

    sortAscending = () => {
        // const { prices } = this.state;
        this.props.products.sort((a, b) => a.price - b.price)   
        // this.setState({ prices })
      }

    render() {
      
        var { allProducts, totalProducts , products , productsDatas, productCount , isLoading , currentPage , router } = this.props;
        // const products = allProducts;
        const total = productsDatas ? productsDatas.length: products.length;
        products = productsDatas ? productsDatas : products
        const query = {...this.props.router.query};
        if(query.sort == '4') {
            products.sort((a, b) => a.price - b.price)
        } else if (query.sort == '5') {
            products.sort((a, b) => a.price - b.price).reverse()
        } else 
            products.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).reverse();
        // products.sort((a, b) => a.price - b.price).reverse()
        const viewMode = this.state.listView;
        // console.log(
        //     'products,products.length == 0,isLoading: ', products,products.length == 0,isLoading 
        // );
        return (
            <div>
                    
            <div className="ps-shopping">
                {/* <BestSaleItems collectionSlug="shop_best_sale_items" /> */}
                {/* <RecommendItems collectionSlug="shop-recommend-items" /> */}
                <div className="ps-shopping__header">
                    <p>
                        <strong className="mr-2">{total}</strong>
                        Products found
                    </p>
                    <div className="ps-shopping__actions">
                        <select
                            defaultValue = {router.query.sort}
                            onChange={this.onSortChange}
                            className="ps-select form-control"
                            data-placeholder="Sort Items">
                            <option key={0} value="1">Sort by latest</option>
                            <option key={1} value="4">Sort by price: low to high</option>
                            <option key={2} value="5">Sort by price: high to low</option>
                        </select>
                        <div className="ps-shopping__view">
                            <p>View</p>
                            <ul className="ps-tab-list">
                                <li
                                    className={
                                        viewMode === true ? 'active' : ''
                                    }>
                                    <a
                                        href="#"
                                        onClick={this.handleChangeViewMode}>
                                        <i className="icon-grid"></i>
                                    </a>
                                </li>
                                <li
                                    className={
                                        viewMode !== true ? 'active' : ''
                                    }>
                                    <a
                                        href="#"
                                        onClick={this.handleChangeViewMode}>
                                        <i className="icon-list4"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="ps-shopping__content">
                    {viewMode === true ? (
                        <div className="ps-shopping-product">
                            <div className="row">
                            {isLoading ?
                            <div style={{ display:"flex", justifyContent:"center", padding:'1rem', flex:'1 1'}}>
                                <Spin />
                            </div>
                            :null
                            }   
                                {!isLoading && products && products.length > 0
                                    ? products.map((item, index) => (
                                          <div key={index} 
                                              className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6 ">
                                   
                                              <Product product={item} />
                                          </div>
                                      ))
                                    : ''}
                            </div>
                        </div>
                    ) : (
                        <div className="ps-shopping-product">
                            {products && products.length > 0
                                ? products.map((item) => (
                                      <ProductWide
                                          product={item}
                                          key={item.id}
                                      />
                                  ))
                                : ''}
                        </div>
                    )}
                   { !isLoading? 
                     total !== 0 ?
                   <div className="ps-shopping__footer text-center pb-20">
                        <Pagination
                            total={productCount}
                            pageSize={12}
                            responsive={true}
                            defaultCurrent={currentPage}
                            onChange={this.handlePagination.bind(this)}
                        />
                    </div>
                    : null
                    :null}
                </div>
            </div>
        </div>
        );
    }
}

export default connect((state) => state.product)(withRouter(LayoutShop));

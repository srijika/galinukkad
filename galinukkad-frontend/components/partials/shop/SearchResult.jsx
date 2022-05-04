import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import {
    searchProductByKeyword
} from '../../../store/product/action';
import Product from '../../elements/products/Product';
import ProductWide from '../../elements/products/ProductWide';
import ShopWidget from './modules/ShopWidget';
import { Pagination } from 'antd';

class SearchResult extends Component {
    state = {
        listView: true,
        pageNumber: 0,
        results: [],
        allProducts:[]
    };
    isNewResult = false;
    isUpdated = false;
    previousKeyword = '';
    isinitAllProducts = false;
    componentDidMount() {
        this.getResult();
    }

    handleChangeViewMode = event => {
        event.preventDefault();
        this.setState({ listView: !this.state.listView });
    };
    paginate = (pageNo) => {
        this.getResult(pageNo-1);
    }

    getResult(){
        const { query } = this.props.router;
        if (query) {
            this.isinitAllProducts = false;
            this.isUpdated = true;
            this.previousKeyword = query.keyword;
            this.props.dispatch(searchProductByKeyword(query.keyword));
        }
        
    }

    componentDidUpdate(prevProps, prevState) {
        const { allProducts } = this.props;
        if((!this.isinitAllProducts) && JSON.stringify(allProducts) != JSON.stringify(this.state.allProducts)) {
            this.isinitAllProducts = true;
            this.setState({allProducts:allProducts}); 
        }

        const { query } = this.props.router;
        if(!this.isUpdated || query.keyword != this.previousKeyword) {
            this.getResult();
        }
        
    }


    handler = (data) => {
        this.setState({ allProducts:data });
    }


    render() {
        const { totalProducts , productsDataFilter} = this.props;
        const {allProducts} = this.state;
        const viewMode = this.state.listView;
        return (
            <div className="ps-layout--shop">
                <ShopWidget baseUrl="/search" productFilters={productsDataFilter} handler={this.handler} />
                <div className="ps-layout__right">
                    <div className="ps-shopping">
                        <div className="ps-shopping__header">
                            {allProducts && allProducts.length > 0 ? (
                                <p>
                                    <strong>
                                        {allProducts ? allProducts.length : 0}
                                    </strong>
                                    <span className="ml-1">Products founds</span>
                                </p>
                            ) : (
                                <p>Not found! Try with another keyword.</p>
                            )}

                            <div className="ps-shopping__actions">
                                <div className="ps-shopping__view">
                                    <p>View</p>
                                    <ul className="ps-tab-list">
                                        <li
                                            className={
                                                viewMode === true
                                                    ? 'active'
                                                    : ''
                                            }>
                                            <a
                                                href="#"
                                                onClick={
                                                    this.handleChangeViewMode
                                                }>
                                                <i className="icon-grid"></i>
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                viewMode !== true
                                                    ? 'active'
                                                    : ''
                                            }>
                                            <a
                                                href="#"
                                                onClick={
                                                    this.handleChangeViewMode
                                                }>
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
                                        {allProducts && allProducts.length > 0
                                            ? allProducts.map(item => (
                                                  <div
                                                      className="col-lg-4 col-md-4 col-sm-6 col-6 "
                                                      key={item._id}>
                                                      <Product product={item} />
                                                  </div>
                                              ))
                                            : ''}
                                    </div>
                                </div>
                            ) : (
                                <div className="ps-shopping-product">
                                    {allProducts && allProducts.length > 0
                                        ? allProducts.map(item => (
                                              <ProductWide
                                                  product={item}
                                                  key={item.id}
                                              />
                                          ))
                                        : ''}
                                </div>
                            )}
                            <div className="ps-shopping__footer">
                                {/* <div className="ps-pagination">
                                    <ul className="pagination">
                                        <li className="active">
                                            <a href="#">1</a>
                                        </li>
                                        <li>
                                            <a href="#">2</a>
                                        </li>
                                        <li>
                                            <a href="#">3</a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Next Page
                                                <i className="icon-chevron-right"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div> */}
                                {/* {(totalProducts && totalProducts > 10)?<Pagination defaultCurrent={1} total={50} onChange={totalProducts}/>:null} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapToProps = (state) => {
    return {
        allProducts: state.product.searchFilterResults,
       totalProducts: state.product.searchFilterResultsCount,
       productsDataFilter: state.product.productsDataFilter
    }
   };
export default withRouter(connect(mapToProps)(SearchResult));

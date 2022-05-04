import React, { Component } from 'react';
import { Select } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import {
getProductFiltered
} from '../../../../store/product/action';
import ProductResult from '../../../elements/products/ProductSearchResult';
import { connect } from 'react-redux';
import { getProductsByKeyword, getProductNameBySearchKeyword, searchProductByKeyword } from
'../../../../store/product/action';
import { List } from 'antd';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class SearchHeader extends Component {

constructor(props) {
super(props);
this.isPropChanged = false;
this.isUpdated = false;
this.handler = this.handler.bind(this)
this.state = {
searchPanel: false,
searchValue: '',
productsDataFilter: []
};
this.searchRef = null;
}

searchByProductName = (keyword, object) => {
let matches = [];
let regexp = new RegExp(keyword.toLowerCase(), 'g');

object.forEach(product => {
if (product.title.toLowerCase().match(regexp))
matches.push(product);
});

return matches;
};
handler(data) {
this.state.shopProducts = data
this.isUpdated
}

handleSearch(e) { 
if (e.target.value !== '') {
const keyword = e.target.value;
this.setState(() => {
return { 
searchPanel: true,
searchValue: keyword 
};
});
this.props.dispatch(getProductNameBySearchKeyword(keyword));
} else {
this.setState({ searchPanel: false, searchValue: '' });
}
}

handleSubmit(e) {

if(this.state.searchValue === ""){
toast.error('Please enter some value');

}

e.preventDefault();
const searchValue = this.state.searchValue;
if(searchValue) {
Router.push(`/search?keyword=${searchValue}`);
this.setState(() => { return {
searchPanel: false,
searchValue : ''
}});
}
}

handleSuggestionSubmit(e, keyword) {

e.preventDefault();
Router.push(`/search?keyword=${keyword}`);
this.setState({
searchPanel: false,
searchValue: ''
});
}

render() {
const { searchPanel, currentPage } = this.state;
let {searchResults, shopProducts, totalProducts, productsDataFilter } = this.props;
searchResults = searchResults ? searchResults:[];
return (

<>
    <span className="d-none d-sm-block">
        <form className="ps-form--quick-search ml-lg-0 ml-md-4 ml-sm-0" method="get" action="/">
            {/* className="d-sm-none d-md-block" */}
            <input ref={(searchInput)=> this.searchRef = searchInput }
            className="form-control"
            value={this.state.searchValue}
            type="text"
            placeholder="I'm shopping for..."
            onChange={this.handleSearch.bind(this)}
            />
            <button onClick={this.handleSubmit.bind(this)}>Search</button>

            <div className={`ps-panel--search-result${ searchPanel && searchPanel===true ? ' active ' : '' }`}>
                <div className="ps-panel__content">
                    <List size="small" itemLayout="horizontal" dataSource={searchResults} renderItem={item=> (
                        <List.Item style={{cursor:'pointer'}} onClick={(event)=> this.handleSuggestionSubmit(event,
                            item.title)}
                            key={item.id}>
                            <List.Item.Meta title={item.title} />
                        </List.Item>
                        )}
                        />
                </div>
                <div className="ps-panel__footer text-center">
                    <Link href="/search">
                    <a>See all results</a>
                    </Link>
                </div>
            </div>

        </form>
    </span>
    {/* <span className="d-block d-sm-none">
        <Link href="/account/compare">
        <a className="header__extra" style={{ color: "black" }} data-toggle="tooltip" data-placement="top"
            title="Search">
            <i className="fa fa-search d-block d-sm-none" aria-hidden="true"></i>
        </a>
        </Link>
    </span> */}
</>

);
}
}


const mapToProps = (state) => {
return {
shopProducts: state.payload.productsDatas,
totalProducts: state.payload.productsDataCount,
productsDataFilter : state.payload.productsDataFilter
}
};
export default connect(state=> state.product)(SearchHeader);
import React, { Component, useState } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Slider, Checkbox , InputNumber,Button, Form} from 'antd';
import Repository from '../../../../repositories/Repository';
import axios from 'axios';
import {
    getSearchKeywordsVendor
} from '../../../../store/product/action';
import { withRouter } from 'next/router';
import './ShopWidget.scss';
import {
    getProductByCategories,
    getProductByCategoriesFilter,
    getProductBySubCategory 
} from '../../../../store/product/action';

class ShopWidget extends Component {
   
    constructor(props) {
        super(props);
        this.handlerCheck = false;
        this.flags = {
            isInitSetFlag : false,
            
        }
        
        this.state = {
            form:null,
            vendorsGroup : [],
            categories:[],
            brands:[],
            vendors: 'santa',
            selectedCategory:null,
            min: null,
            max: 1000,
            rangeMin:0,
            rangeMax:10000,
           update:false,
           vendorlist: [],
           variantsList: [],
           callCount:0,
        //    priceMin:'',
        //    priceMax:'',
        //    vendor: [],
        //    variants: [],
        //    category: '',
        initFilters:{
            minPrice:0,
            maxPrice:10000,
            vendor:[],
            variants:[],
            sub_category:[],
            isPriceSlider: false
        },
        body: {
            page: 0,
            limit: 100,
            sortColumn: "price",
            sortBy: "desc",
            filter: "",
            category: "",
            sub_category: "",
            queryStr: {
                title: "",
                is_featured: "",
                is_hot: "",
                is_sale: "",
                is_active: "",
                product_status: 1,
                is_premium_package: "",
                price: [],
                sale_price: [],
                vendor: [],
                variants: []
            }
        },
        
        };
        this.form = null;
        this.sliderRef = null;
    }

    onFinish = async () => {
            const { query } = this.props.router;
            const {min,max,cat} = this.state;
            let values = {};
            values = {...this.state.body}
            values.queryStr.price = [min ? min : this.state.initFilters.minPrice,max ? max: this.state.initFilters.maxPrice];
            values.queryStr.vendor = this.state.vendorlist ? this.state.vendorlist : [];
            values.queryStr.variants = this.state.variantsList;

            let allCategoryDetails = JSON.parse(localStorage.getItem("categoryDetails"));
            allCategoryDetails.forEach((items)=>{
                if(items._id == query.category){
                    values.category = items.name;
                }
                if(items.subCategories.length > 0){
                    items.subCategories.forEach((sitems)=>{
                        if(sitems._id == query.scategory){
                            values.sub_category = sitems.name;
                        }
                    })
                }
            })

            this.props.dispatch(await getSearchKeywordsVendor(values));   
    }

    onChangeRange = value => {
        if (value[0] < value[1]) {
            const filters  = {...this.state.initFilters};
            filters.minPrice =value[0];
            filters.maxPrice = value[1];
            filters.isPriceSlider = true;
            this.setState({ initFilters:filters , min: value[0], max: value[1] }, () => { 
                this.onFinish(); 
            });
        }
      };
     
      onChangeRangeMin = (value,e) => {
        if (this.state.max > value) {
            const filters  = {...this.state.initFilters};
            filters.minPrice = value;
            this.setState( {  initFilters:filters , min: value , rangeMin: value }, () => { this.onFinish(); });
        }
      };

      onChangeRangeMax = (value,e) => {
        if (this.state.min < value) {
            const filters  = {...this.state.initFilters};
            filters.maxPrice = value;
            this.setState({ initFilters:filters , max: value , rangeMax: value  }, () => { this.onFinish(); });
        }
      };
    
      onAfterChangeRange = value => {
            console.log("onAfterChange: ", value);
      };  

      async handleFilterByBrand(value) {
        const { query } = this.props.router;
        console.log("query" ,query)

        this.setState({vendorlist: value}, () => { this.onFinish(); })
        this.getCategoryDetails();  
        // this.getCategoryDetails();

        if(value == ''){
            if(query.category){
                this.props.dispatch(await getProductByCategoriesFilter({query:query.category}));
            }

            if(query.scategory){
                this.props.dispatch(await getProductBySubCategory({query:query.scategory}));
            }
        }


    }

    handleFilterByVariants(name, value) {
        const v = {name: name, value: value};
        const varList  = this.state.variantsList;
        if(varList.find((data) => data.name == name)) {
            const dataIndex = varList.findIndex((data) => data.name == name);
            if(value.length == 0) {
                varList.splice(dataIndex,1);
                this.setState({variantsList: varList}, () => { this.onFinish(); })
            } else {
                varList.splice(dataIndex,1,v);
                this.setState({variantsList: varList}, () => { this.onFinish(); })
            }
       } else {
            varList.push(v);
            this.setState({variantsList: varList}, () => { this.onFinish(); })
       }

    }

    getIndex(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i]['name'] == value) {
                return i;
            }
        }
        return -1; 
    }
    
    onTodoChange(e){
    }
  
    handleFilterProductsByCategory(e, slug) {
        e.preventDefault();
        const { query } = this.props.router;
        const baseUrl  = this.props.baseUrl?this.props.baseUrl:'/shop';
        if (slug !== null) {
            Router.push({ pathname: baseUrl , query: { ...query , category: slug } });
        } else {
            const removeCategory = {...query};
            delete removeCategory.category;
            Router.push({ pathname: baseUrl , query: { ...removeCategory } });
        }
    }

    componentDidMount() {
        const { query } = this.props.router;
        const {minPrice,maxPrice} = query;
        console.log(' queryqueryquery  ' , query);
        this.setState({
            selectedCategory:query.category || null,
            minPrice: minPrice?Number(minPrice):'',
            maxPrice: maxPrice?Number(maxPrice):''   
        });
        this.getCategoryDetails();
    }

    componentDidUpdate(prevProps,prevState) {
        const { asPath } = this.props.router;
        const filters = {...this.state.initFilters};
        let { productFilters } = this.props;


        
        if(!this.flags.isInitSetFlag) {
            productFilters = productFilters || [];
            productFilters.forEach((filter,i) => {
                if(i !== productFilters.length-1) {
                    for(const key in filter) {
                        filters[key] = filter[key];
                    }
                }
                
            }); 
           

            

            if(productFilters.length > 0) {
               this.setState({initFilters:filters, rangeMin:filters.minPrice, rangeMax:filters.maxPrice}, () => { 
                    this.flags.isInitSetFlag = true;
                    if(this.handlerCheck){
                        this.props.handler(this.props.productsDatas);
                        this.handlerCheck  = false;
                    }
               }); 
            }
        }else{
            let oldPath = localStorage.getItem("routeFilterPath");
            if(oldPath != asPath){
                localStorage.setItem("routeFilterPath", asPath);
                this.setState({callCount:1},()=>{  
                    this.flags.isInitSetFlag = false;
                });
            }
        }
    }

    getCategoryDetails(){
        const { query } = this.props.router;
        const getCat = axios.post('/getcat',{_id:query.category});
        axios.all([getCat])
        .then(axios.spread((...responses) => {
            let prodRes = responses[0].data;
            this.setState({ cat:prodRes });
        }))
        .catch((err) => {
            console.log('err:' , err);
        });


        
    }


    clear = () => {
        const { query } = this.props.router;
        delete query.minPrice;
        delete query.maxPrice;
        Router.push({ pathname: '/shop', query: { ...query } });
        this.setState({
            minPrice:'',
            maxPrice:'',
        })
    }

    handleSuggestionSubmit(e, keyword, name) {
        e.preventDefault();
        Router.push(`/shop?scategory=${keyword}`);

    }

    apply = () => {
        const { query } = this.props.router;
        const baseUrl  = this.props.baseUrl?this.props.baseUrl:'/shop';
        if(this.state.minPrice != '' && this.state.maxPrice != '') {
            Router.push({ pathname: baseUrl , query: { ...query , minPrice: this.state.minPrice , maxPrice: this.state.maxPrice}});
        }
        else if( this.state.minPrice == '') {
            delete query.minPrice;
            Router.push({ pathname: baseUrl , query: { ...query , maxPrice: this.state.maxPrice}});
        } else if(this.state.maxPrice == '') {
            delete query.maxPrice;
            Router.push({ pathname: baseUrl , query: { ...query , minPrice: this.state.minPrice}});
        }
    }

    render() {
        const { max, min } = this.state;
        var arr = []
        const { categories, brands, cat } = this.state;
        const { products , productCount , isLoading , currentPage,   productsDataFilter } = this.props;
        const vendorsGroup = [];
        let varientGroup = [];
        let subcategoryGroup = [];
        const filterGroup = [];
        let step = 0;
        if(productsDataFilter && productsDataFilter.length > 0){
            productsDataFilter.forEach((items)=>{
                console.log("vendor" , items)

                if(items.vendor){
                    items.vendor.map((vendor,index)=> {
                        if(vendor != undefined && vendor != "undefined"){
                            vendorsGroup.push({
                                label: vendor,
                                value: vendor,
                                key: vendor
                            });
                        }
                    })
                }
                if(items.variants){
                    varientGroup = items.variants;
                }
                if(items.sub_category){
                    subcategoryGroup = items.sub_category;
                }
            })
        }

        return (
            <div className="ps-layout__left">
                <Form  ref={(ref) => this.form = ref} className="ps-form--account" onFinish={this.onFinish.bind(this)}>
                <aside className="widget widget_shop">
                    {/* <i className="fa fa-balance-scale" aria-hidden="true"></i> */}
                <h3 className="filter_heading">Filters</h3>
                    <h4 className="widget-title">Sub-Categories</h4>
                    <ul className="ps-list--categories" style={{listStyle: "square", paddingLeft:"20px"}}>
                        {/* { subcategoryGroup.length > 0 && subcategoryGroup.map((itemd)=>{
                            if(itemd){
                                return ( <li key={itemd._id} style={{cursor: "pointer"}} onClick={(event) => this.handleSuggestionSubmit(event, itemd._id, itemd.name)}>
                                        {itemd.name}
                                </li> )
                            }
                        }) } */}

                        { subcategoryGroup.length > 0 && subcategoryGroup.map((itemd)=>{
                            if(itemd){
                                return ( <li key={itemd._id} >
                                        {itemd.name}
                                </li> )
                            }
                        }) }
                    </ul>
                </aside>
                <aside className="widget widget_shop">
                    <h4 className="widget-title">By Vendors</h4>
                    <figure>
                    <Form.Item
                            name="vendor">
                            {console.log("vendorsGroup" ,vendorsGroup)}
                        {vendorsGroup && vendorsGroup.length > 0?<Checkbox.Group
                            defaultValue={this.state.body.vendor }
                            onChange={this.handleFilterByBrand.bind(this)}
                            options={vendorsGroup}
                        />:'No brand found'}
                    </Form.Item>

                    </figure>
                    <figure>
                        <h4 className="widget-title">By Prices</h4>
                        <Form.Item
                        name="price">

                         

                        <Slider
                            className="slider-main-div"
                            min={this.state.rangeMin}
                            max={this.state.rangeMax}
                            onAfterChange={this.onChangeRange}
                            range={true}
                            />
                            <div className="range-input-number-main">
                            <InputNumber
                                className="min-input-main"
                                min={this.state.initFilters.minPrice}
                                max={1000}
                                value={this.state.initFilters.minPrice}
                                defaultValue={this.state.initFilters.minPrice}

                                onChange={this.onChangeRangeMin}
                            />
                            <span className="range-span"> to </span>
                            <InputNumber
                                className="min-input-main"
                                min={this.state.initFilters.minPrice}
                                max={this.state.initFilters.maxPrice}
                                value={this.state.initFilters.maxPrice}
                                onChange={this.onChangeRangeMax}
                            />
                            </div>
                            </Form.Item>
                    </figure>
                    <p className="ps-list--dot"> </p>
                    <figure>
                                <Form.Item
                                name="value">
                    { varientGroup.map((item,index)=> {
                            if (item != "undefined" || item != undefined) {
                                return (
                                    <div key={item.name}>
                                            <h4 className="widget-title" name="name"  >{item.name}</h4>
                                            {/* {
                                                arr = [],
                                                item.value.map((val)=>{
                                                    arr.push({
                                                        label: val,
                                                        value: val,
                                                        key: val
                                                    })
                                                })
                                            } */}
                                            <Checkbox.Group 
                                            name={item.name}
                                            key={item} 
                                            defaultValue={this.state.varaints}
                                            onChange={this.handleFilterByVariants.bind(this, item.name)}
                                            options={arr}
                                            /> 
                                            <p className="ps-list--dot"></p>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                      
                    }
                    
                    </Form.Item>
                </figure>
                </aside>
                {/* <button className="ps-btn submit" onClick={this.filteredVendors}> */}
                {/* <button className="ps-btn submit">
                    Filter
                </button> */}
                </Form>
                
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    return state.product;
};
export default connect(mapStateToProps)(withRouter(ShopWidget));

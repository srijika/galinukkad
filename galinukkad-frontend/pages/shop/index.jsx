import React from 'react';
import { connect } from 'react-redux';
import Router, {withRouter} from 'next/router';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import Newletters from '../../components/partials/commons/Newletters';
import LayoutShop from '../../components/partials/shop/LayoutShop';
import BreadCrumb from '../../components/elements/BreadCrumb';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';
import ShopBrands from '../../components/partials/shop/ShopBrands';
import ShopBanner from '../../components/partials/shop/ShopBanner';
import ShopWidget from '../../components/partials/shop/modules/ShopWidget';
import {
    getProductByCategories,
    getProductByCategoriesFilter,
    getProductBySubCategory 
} from '../../store/product/action';
// import { getSearchProductFilter } from '../../store/product/action';
// import { getSingleProductById } from '../../store/product/action';


class ShopDefaultPage extends React.Component {
    state = {shopProducts:[], totalProducts:0, isLoading:false , currentPage:1, productsDataFilter: []};
    constructor(props) {
        super(props);
       
        this.isPropChanged = false;
        this.isUpdated = false;
        this.handler = this.handler.bind(this)

    }

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

   async componentDidMount(id) {
        const { query } = this.props.router;
         this.catsubcatcall(query)
         this.isUpdated = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.isPropChanged = this.isPropsChanged(nextProps)) || this.isUpdated || nextState.isLoading != this.state.isLoading ;
    }


    isPropsChanged = (nextProps) => {
        return this.props.query?.category != nextProps.query?.category ||
        this.props.query.sort != nextProps.query.sort || 
        this.props.query.minPrice != nextProps.query.minPrice || 
        this.props.query.maxPrice != nextProps.query.maxPrice;
    }

    componentDidUpdate(prevProps,prevState) {
        const { query } = this.props.router;
       if(this.isPropChanged) {
            this.setState({isLoading:true,currentPage:1});
            this.catsubcatcall(query)
            this.isUpdated = true;
       } else if(prevState.isLoading == this.state.isLoading) {
            this.setState({isLoading:false});
            this.isUpdated = false;
       }  
    }
 
    async catsubcatcall(query){
        const {shopProducts}= this.props;
        if(query.category) { 
            let data ={
                query:   query.category,
                id:   shopProducts

            }
            this.props.dispatch(await getProductByCategoriesFilter(data));
         } else if(query.scategory) {

            let data ={
                query: query.scategory,
                id:   shopProducts

            }
            console.log("getProductBySubCategory____" ,data)
            // this.props.dispatch(await getProductBySubCategory(data));
            this.props.dispatch(await getProductBySubCategory(data));

         }
          
    }

    handler(data) {
        this.state.shopProducts = data
        this.isUpdated
      }

    handlePaginationChanged(page) {
        
        const { query } = this.props.router;
        
        
        let filterParams = {};
        if(!query.sort) {
            filterParams = {
                ...query,
                sort:1,
                page
            };
        } else {
            filterParams = {
                ...query,
                page
            };
        }
        let nextPage = ++page;
        this.setState({isLoading:true,currentPage:nextPage});
        if(query.category) {
            this.props.dispatch(getProductByCategories(query.category));
         } else if(query.scategory) {
             this.props.dispatch(getProductBySubCategory(query.scategory));
         } 
        this.isUpdated = true;
    }

    render() {
        const { query } = this.props.router;
        
        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Shop',
            },
        ];
        const {shopProducts, totalProducts, productsDataFilter  } = this.props;
        const { isLoading , currentPage } = this.state;
        return (
            <div className="site-content">
                <HeaderDefault />
                {/* <HeaderMobile /> */}
                <NavigationList />
                <div className="ps-page--shop">
                    <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
                    <div className="ps-container">
                        <div className="ps-layout--shop">
                            <ShopWidget 
                                handler = {this.handler}
                                productFilters={productsDataFilter?productsDataFilter:[]}
                                products={shopProducts?shopProducts:[] }
                                productCount={totalProducts?totalProducts:0} 
                                handlePaginationChanged={(page) => this.handlePaginationChanged(page)}
                                isLoading={isLoading}
                                currentPage={currentPage}
                            />
                            <div className="ps-layout__right">
                                <LayoutShop 
                                products={shopProducts?shopProducts:[] } 
                                productCount={totalProducts?totalProducts:0} 
                                handlePaginationChanged={(page) => this.handlePaginationChanged(page)}
                                isLoading={isLoading}
                                currentPage={currentPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Newletters layout="container" />
                <FooterDefault />
            </div>
        );
    }
}

const mapToProps = (state) => {
console.log("state.product.productsDataFilter" ,state.product.productsDataFilter)
console.log("state.product.productsDatas" ,state.product.productsDatas)
console.log("state.product.productsDataCount" ,state.product.productsDataCount)


 return {
    shopProducts: state.product.productsDatas,
    totalProducts: state.product.productsDataCount,
    productsDataFilter : state.product.productsDataFilter
 }
};
export default connect(mapToProps)(withRouter(ShopDefaultPage));

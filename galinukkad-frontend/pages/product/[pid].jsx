import React from 'react';
import { connect } from 'react-redux'; 
import Router from 'next/router';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import Newletters from '../../components/partials/commons/Newletters';
import CustomerBought from '../../components/partials/product/CustomerBought';
import ProductDetailFullwidth from '../../components/elements/detail/ProductDetailFullwidth';
import ProductWidgets from '../../components/partials/product/ProductWidgets';
import NavigationList from '../../components/shared/navigation/NavigationList';
import BreadCrumb from '../../components/elements/BreadCrumb';
import HeaderMobileProduct from '../../components/shared/header-mobile/HeaderMobileProduct';
import { getProductsById } from '../../store/product/action';
import HeaderProduct from '../../components/shared/headers/HeaderProduct';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import { getCollections } from '../../store/collection/action';
import RelatedProduct from '../../components/partials/product/RelatedProduct';
import Repository from '../../repositories/Repository';

class ProductDefaultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pid:''};
    }

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }
    componentDidMount() {
        const { pid } = this.props.query;
        const { query } = this.props;
        this.setState({ pid: pid })
        if (query) {
            const collectionsParams = [
                'customer_bought',
                'shop-recommend-items',
                'widget_same_brand',
            ];
            this.props.dispatch(getProductsById(pid));
            this.props.dispatch(getCollections(collectionsParams));
            this.addRecentViewProduct(pid)
        }
        Router.events.on('routeChangeStart', (url) => {
            const nextPid = url.split('/').pop();
            if (nextPid !== '' && isNaN(parseInt(nextPid)) === false) {
                this.props.dispatch(getProductsById(nextPid));
            }
        });
    }

    addRecentViewProduct = (pid) => {
        Repository.post('/add-recent-viewed-products',{product_id:pid})
        .then((res) => {
                
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const { singleProduct , error} = this.props;
        console.log('singleProduct__________singleProduct' , singleProduct?.subCategory)
        
        if(error && error.error == 'error') {
              //  Router.push('/page/page-404');
              Router.push('/');

              console.log("/page/page-404")
        }
        
        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Shop',
                url: `/shop/?scategory=${singleProduct?.subCategory}`,
            },
            {
                text: singleProduct ? singleProduct.title : '',
            },
        ];

        return (
            <div className="layout--product">
              <span className="d-none d-sm-block">  <HeaderDefault /></span>
              <span className="d-block d-sm-none">  <HeaderMobileProduct /></span>
                {/* <HeaderMobileProduct /> */}
                <NavigationList />
                <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
                <div className="ps-page--product">
                    <div className="ps-container">
                        <div className="ps-page__container">
                            <div className="ps-page__left">
                                <ProductDetailFullwidth  />
                            </div>
                            <div className="ps-page__right">
                                <ProductWidgets collectionSlug="widget_same_brand" />
                            </div>
                        </div>
                        {singleProduct?<RelatedProduct
                            productId={this.state.pid}
                            layout="fullwidth"
                            collectionSlug="shop-recommend-items"
                        />:null}
                    </div>
                </div>
                <Newletters />
                <FooterDefault />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        singleProduct: state.product? state.product.singleProduct:null,
        error:state.product?state.product.error:null
    }
}

export default connect(mapStateToProps)(ProductDefaultPage);

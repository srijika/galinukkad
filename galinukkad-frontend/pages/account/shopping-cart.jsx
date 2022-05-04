import React from 'react';
import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import ShoppingCart from '../../components/partials/account/ShoppingCart';
import ShoppingCartMobile from '../../components/partials/account/ShoppingCartMobile';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';

const ShoppingCartPage = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Shopping Cart',
        },
    ];
    return (
        <div className="site-content">
            <HeaderDefault />
            {/* <HeaderMobile /> */}
            <NavigationList />
            <div className="ps-page--simple">
                <BreadCrumb breacrumb={breadCrumb} />

                <span className="d-none d-lg-block">  <ShoppingCart /></span>      
              <span className="d-block d-lg-none">  <ShoppingCartMobile /></span>
            

            </div>
            <Newsletters layout="container" />
            <FooterDefault />
        </div>
    );
};

export default ShoppingCartPage;

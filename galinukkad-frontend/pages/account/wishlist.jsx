import React from 'react';
import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import Wishlist from '../../components/partials/account/Wishlist';
import MobileWishList from '../../components/partials/account/MobileWishList';

import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';

const WishlistPage = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Wishlist',
        },
    ];
    return (
        <div className="site-content">
            <HeaderDefault />
            {/* <HeaderMobile /> */}
            <NavigationList />
            <div className="ps-page--simple">
                <BreadCrumb breacrumb={breadCrumb} />

              
                <span className="d-none d-lg-block">  <Wishlist /></span>      
              <span className="d-block d-lg-none">  <MobileWishList /></span>
            </div>
            <Newsletters layout="container" />
            <FooterDefault />
        </div>
    );
};

export default WishlistPage;

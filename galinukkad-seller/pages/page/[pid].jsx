import React from 'react';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import Newletters from '../../components/partials/commons/Newletters';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';
import BlankContent from '../../components/partials/page/[pid]';
import HeaderSingleDefault from '../../components/shared/headers/HeaderSingleDefault';
import HeaderVendorMobile from '../../components/shared/headers/HeaderVendorMobile';


const BlankPage = () => {
    return (
        <div className="site-content">
            <HeaderSingleDefault />
            <HeaderVendorMobile />
            <NavigationList />
            <div className="ps-page--single">
                <BlankContent/>
            </div>
            <Newletters layout="container" />
            <FooterDefault />
        </div>
    );
};

export default BlankPage;

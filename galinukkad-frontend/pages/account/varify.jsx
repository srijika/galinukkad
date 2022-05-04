import React from 'react';

import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import VarifyCard from '../../components/partials/account/VarifyCard';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';


const LoginPage = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Verify',
        },
    ];
    return (
        <div className="site-content">
            {/* <HeaderDefault /> */}
            {/* <HeaderMobile /> */}
            <NavigationList />
            <div className="ps-page--my-account">
                <BreadCrumb breacrumb={breadCrumb} />
                <VarifyCard />
            </div>
            <Newsletters layout="container" />
            <FooterDefault />
        </div>
    );
};

export default LoginPage;

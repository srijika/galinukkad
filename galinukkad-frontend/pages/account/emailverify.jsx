import React from 'react';

import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import EmailVerify from '../../components/partials/account/EmailVerify';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';

const EmailVerifyPage = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Verify your account',
        },
    ];

    return (
        <div className="site-content">
            <HeaderDefault />
            {/* <HeaderMobile /> */}
            <NavigationList />
            <div className="ps-page--my-account">
                <BreadCrumb breacrumb={breadCrumb} />
                <EmailVerify />
            </div>
            <Newsletters layout="container" />
            <FooterDefault />
        </div>
    );
};

export default EmailVerifyPage;

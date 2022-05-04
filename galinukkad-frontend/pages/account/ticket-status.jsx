import React, {Component} from 'react';

import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import TicketStatus from '../../components/partials/account/TicketStatus';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';

class TicketStatusForm extends Component {

    render() {
        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Support',
            },
        ];
        return (
            <div className="site-content">
                <HeaderDefault />
                {/* <HeaderMobile /> */}
                <NavigationList />
                <div className="ps-page--my-account">
                    <BreadCrumb breacrumb={breadCrumb} />
                    <TicketStatus />
                </div>
                <Newsletters layout="container" />
                <FooterDefault />
            </div>
        );
    }

};

export default TicketStatusForm;

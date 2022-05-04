import React, {Component} from 'react';

import Newsletters from '../../components/partials/commons/Newletters';
import FooterDefault from '../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../components/elements/BreadCrumb';
import Tickets from '../../components/partials/account/Tickets';
import HeaderMobile from '../../components/shared/headers/HeaderMobile';
import NavigationList from '../../components/shared/navigation/NavigationList';

class Support extends Component {

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
                    <Tickets />
                </div>
                <Newsletters layout="container" />
                <FooterDefault />
            </div>
        );
    }

};

// const mapToProps = (state) => {
//     return {
//         orders: state.orders
//     };
// }

// const dispatchToProps = (dispatch) => {
//     return {
//         getMyOrders:() => {
//             dispatch()
//         }
//     };
// };
export default Support;

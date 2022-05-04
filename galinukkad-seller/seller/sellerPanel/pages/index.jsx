import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationList from '../components/shared/navigation/NavigationList';
import HeaderSingleDefault from '../components/shared/headers/HeaderSingleDefault';
import HeaderMobile from '../components/shared/headers/HeaderMobile';
import HeaderVendorMobile from '../components/shared/headers/HeaderVendorMobile';
import FooterDefault from '../components/shared/footers/FooterDefault';
import BreadCrumb from '../components/elements/BreadCrumb';
import VendorBanner from '../components/partials/vendor/VendorBanner';
import VendorAbout from '../components/partials/vendor/VendorAbout';
import VendorMileStone from '../components/partials/vendor/VendorMileStone';
import VendorBestFees from '../components/partials/vendor/VendorBestFees';
import VendorTestimonials from '../components/partials/vendor/VendorTestimonials';
import VendorFaqs from '../components/partials/vendor/VendorFaqs';
import Newletters from '../components/partials/commons/Newletters';
import ContactVendorForm from '../components/partials/page/ContactFormVendor';
import '../scss/home-default.scss';

class Index extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="site-content">
                <HeaderSingleDefault />
				<HeaderVendorMobile />
				<NavigationList />
				<div className="ps-page--single">
					{/*<BreadCrumb breacrumb={breadCrumb} />*/}
					<VendorBanner />
					<VendorTestimonials />
					<VendorAbout />
					<VendorMileStone />
					<VendorBestFees />
					<VendorFaqs />
					<ContactVendorForm />
					{/* <VendorBanner /> */}
					<Newletters layout="container" />
				</div>
				<FooterDefault />
            </div>
        );
    }
}

export default connect(state => state.collection)(Index);

import React, { Component } from 'react';
import NavigationDefault from '../components/shared/navigation/NavigationDefault';

import { connect } from 'react-redux';
import HeaderDefault from '../components/shared/headers/HeaderDefault';
import FooterFullwidth from '../components/shared/footers/FooterFullwidth';
import HomeBanner from '../components/partials/homepage/home-default/HomeBanner';
import SiteFeatures from '../components/partials/homepage/home-default/SiteFeatures';
import HomeAdsColumns from '../components/partials/homepage/home-default/HomeAdsColumns';
import ConumerElectronics from '../components/partials/homepage/home-default/ConumerElectronics';
import Clothings from '../components/partials/homepage/home-default/Clothings';
import GardenAndKitchen from '../components/partials/homepage/home-default/GardenAndKitchen';
import HomeAds from '../components/partials/homepage/home-default/HomeAds';
import DownLoadApp from '../components/partials/commons/DownLoadApp';
import NewArrivals from '../components/partials/homepage/home-default/NewArrivals';
import TopTrending from '../components/partials/homepage/home-default/TopTrending';

import Newletters from '../components/partials/commons/Newletters';
import HeaderMobile from '../components/shared/headers/HeaderMobile';
import NavigationList from '../components/shared/navigation/NavigationList';
import HomeDefaultDealOfDay from '../components/partials/homepage/home-default/HomeDefaultDealOfDay';
import HomeDefaultTopCategories from '../components/partials/homepage/home-default/HomeDefaultTopCategories';
import SubscribePopup from '../components/shared/SubscribePopup';
import '../scss/home-default.scss';
import { getCollections } from '../store/collection/action';
import 'react-toastify/dist/ReactToastify.min.css';
import HomeBlogs from './blog/HomeBlogs';
import Faq from '../components/partials/homepage/faqs/Faq'
import { Modal } from 'antd';


class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscribe: false,
        };
    }

    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    componentDidMount() {
        const { query } = this.props;
        if (query) {
            const collectionsSlug = [
                'deal_of_the_day',
                'consumer_electronics',
                'clothings',
                'garden_and_kitchen',
                'new_arrivals_products',
                'fullwidth_consumer_electronic_bestseller',
                'fullwidth_consumer_electronic_most_popular',
                'fullwidth_clothing_bestseller',
                'fullwidth_clothing_most_popular',
                'fullwidth_kitchen_best_seller',
                'fullwidth_kitchen_most_popular',
            ];
            this.props.dispatch(getCollections(collectionsSlug),()=>{
                this.setState({ subscribe: false });
            });
        }
    }

    render() {
        const { subscribe } = this.state;
        console.log("subscribe" ,subscribe)
        return (
            <div className="site-content">

                <HeaderDefault />
                <NavigationDefault /> 

                {/* <HeaderMobile /> */}
                <NavigationList />
                <SubscribePopup active={subscribe} />
                <main id="homepage-1">
                    <HomeBanner />
                        
                    <SiteFeatures />
                     <HomeDefaultDealOfDay collectionSlug="deal_of_the_day" />
                    {/* <HomeAdsColumns /> */}
                    <HomeDefaultTopCategories />
                    <Clothings collectionSlug="clothing_&_apparel" />
                    <NewArrivals />
                    <TopTrending />

                    <HomeAds />
                    <HomeBlogs />
                    <Faq /> <br />

                    <Newletters />
                </main>
                <FooterFullwidth />
            </div>
        );
    }
}

export default connect(state => state.collection)(Index);

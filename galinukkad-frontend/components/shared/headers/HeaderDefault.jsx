import React, { Component } from 'react';
import Link from 'next/link';
import NavigationDefault from '../navigation/NavigationDefault';
import HeaderActions from './modules/HeaderActions';
import MenuCategories from './modules/MenuCategories';
import SearchHeader from './modules/SearchHeader';
import SearchHeader2 from './modules/SearchHeader2';

import { stickyHeader } from '../../../utilities/common-helpers';
import Repository from '../../../repositories/Repository';
import Menu from '../../elements/menu/Menu';

import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Modal, notification } from 'antd';
import axios from 'axios'
import { getSingleSettingData } from '../../../helper/helpers';
import Router from 'next/router'

class HeaderDefault extends Component {
    constructor({ props }) {
        super(props);
        this.state = {productCategories:[] , visible : false, maintenanceModeModal: false};
    }


    
    componentDidMount() {
        

        this.getSiteSettingData();

        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
        Repository.post('/getsubcatbycategories',{})
        .then((res) => {
            const {data} = res.data ;
            localStorage.setItem("categoryDetails", JSON.stringify(data));
             const categoryMenuItems = data.map((category, index) => {
                if(category.subCategories && category.subCategories.length > 0) {

                    const subMenu = {
                        "key" : index,
                        "icon": "icon-desktop",
                        "text": category.name,
                        "url": "/shop?category="+category._id,
                        "extraClass": "menu-item-has-children has-mega-menu",
                        "subClass": "sub-menu",
                        "megaContent": [{
                            "heading": "",
                            "megaItems": []
                        }]
                    };

                    category.subCategories.forEach((childMenuItem, sindex) => {
                        subMenu.megaContent[0].megaItems.push( {
                            "key" : index+''+sindex,
                            "text": childMenuItem.name,
                            "url": "/shop?scategory="+childMenuItem._id
                        });
                    });
                    return subMenu;
                } else {
                    return {
                        "key" : index,
                        "icon": "icon-star",
                        "text": category.name,
                        "url": "/shop?category="+category._id
                    };
                }
            });
            this.setState({productCategories:categoryMenuItems});
        })
        .catch((err) => {
            console.log('err:' , err);
        });
    }




    getSiteSettingData = async () => {
        try {
            let _id = localStorage.getItem('LoginId');
            const res = await axios.post('/list/setting', { _id: _id });
            let settings = res?.data?.settings;
            
            let userStatus = getSingleSettingData(settings, 'userStatus');
            let maintenanceMode = getSingleSettingData(settings, 'PUBLIC_WEB_UNDER_MAINTENANCE');

            if(maintenanceMode === "yes" || maintenanceMode === "Yes") {
                Router.push('/') 
                this.setState({ maintenanceModeModal: true })
            }else {
                this.setState({ maintenanceModeModal: false })
            }

            // IF USER STATUS DEACTIVE TRUE THAN 
            if (userStatus) {
                localStorage.clear();
                window.location.reload();
            }

            if (!['', undefined, null].includes(settings)) {
                localStorage.setItem('site_settings', JSON.stringify(settings));
            }
        } catch (e) {
            console.log(e);
        }
    };




    render() {
        return (
            <header
                className="header header--1  "
                data-sticky="true"
                id="headerSticky"
                >

                <div className="header__top   " >
                    <div className="ps-container">
                        <div className="header__left ">
                            <Link href="/"><a className="ps-logo"><img className="mw-100 header_logo_img"  src="/static/img/index.png" alt="Galinukkad" /></a></Link>
             <div className="menu--product-categories">
                                <div className="menu__toggle">
                                    <i className="icon-menu"></i>
                                    <span> Shop by Category </span>
                                </div>
                                <div className="menu__content menu_content2">
                                    <Menu
                                    data={this.state.productCategories}
                                    className="menu--dropdown"
                                />
                                </div>
                            </div>
                        </div>
                        <div className="header__center">
                            <SearchHeader />
                        </div>
                        <div className="header__right">
                            <HeaderActions />
                        </div>
                    </div>
                    
                    <div className="ps-search--mobile">
                    <SearchHeader2 />
                </div>
                <div>
                {/* <NavigationDefault /> */}

                </div>

                </div> 
                <ToastContainer
position="top-center"
transition={Flip}
autoClose={1000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
draggable
// toastClassName="toast-container"

/>

<Modal
                    centered
                    footer={null}
                    width={800}
                    closable={false}
                    visible={this.state.maintenanceModeModal}
                >
                        <img style={{  width: "100%", height: "80vh" }}  src="/static/img/under-maintenance.jpg" alt="Galinukkad" />
                </Modal>
         </header>

        );
    }
}

export default HeaderDefault;

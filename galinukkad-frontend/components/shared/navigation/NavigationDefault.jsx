import React, { Component } from 'react';
import Link from 'next/link';
import { notification } from 'antd';
import Menu from '../../elements/menu/Menu';

import menuData from '../../../public/static/data/menu';
import CurrencyDropdown from '../headers/modules/CurrencyDropdown';
import LanguageSwicher from '../headers/modules/LanguageSwicher';
import Repository from '../../../repositories/Repository';
import Router from 'next/router';
import './navmy.scss'

class NavigationDefault extends Component {
    constructor(props) {
        super(props);
        this.state = {productCategories:[], announcement: ""};
    }

    componentDidMount() {


        Repository.post('/getsubcatbycategories',{})
        .then((res) => {
            const {data} = res.data ;
            localStorage.setItem("categoryDetails", JSON.stringify(data));
             const categoryMenuItems = data.map((category, index) => {
                if(category.subCategories && category.subCategories.length > 0) {

                    const subMenu = {
                        "key": index,
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
                        "key": index,
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


        Repository.post('/get/announcement/for/customer', {}).then((res) => {
            this.setState({ announcement: res.data.announcement.message })
        }).catch((err) => {
            console.log('err:' , err);
        })
    }

    handleFeatureWillUpdate(e) {
        e.preventDefault();
        notification.open({
            message: 'Opp! Something went wrong.',
            description: 'This feature has been updated later!',
            duration: 500,
        });
    }

    render() {
        return (

            

            <nav className="navigation">

                

                    { this.state.announcement ? 
                <div style={{  background: 'white' }} className="marquee_heading">
                <section class="section_my">
                    <p class="marquee text-styling" > <span className="text_glowing">{this.state.announcement}.</span></p>
                </section>
                </div>
                : ""} 



                <div className="ps-container">
                    <div className="navigation__left">
                        <div className="menu--product-categories"> 
                            <div className="menu__toggle">
                                <i className="icon-menu"></i>
                                <span> Shop by Category</span>
                            </div>
                            <div className="menu__content">
                                <Menu
                                    data={this.state.productCategories}
                                    className="menu--dropdown"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="navigation__right" style={{ height: 50 }}>
                        <Menu
                            data={[]}
                            className="menu"
                        />
                        <ul className="navigation__extra align_ul">
                            <li>
                                <a target="_blank" href="https://seller.galinukkad.com/vendor/become-a-vendor">Sell on Galinukkad</a>
                            </li>
                            <li>
                                <Link href="/account/order-tracking">
                                    <a>Track your order</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavigationDefault;

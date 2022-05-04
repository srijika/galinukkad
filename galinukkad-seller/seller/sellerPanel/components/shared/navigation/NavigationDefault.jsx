import React, { Component } from 'react';
import Link from 'next/link';
import { notification } from 'antd';
import Menu from '../../elements/menu/Menu';

import menuData from '../../../public/static/data/menu';
import CurrencyDropdown from '../headers/modules/CurrencyDropdown';
import LanguageSwicher from '../headers/modules/LanguageSwicher';

class NavigationDefault extends Component {
    constructor(props) {
        super(props);
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
                <div className="ps-container">
                    <div className="navigation__left">
                        <div className="menu--product-categories">
                            <div className="menu__toggle">
                                <i className="icon-menu"></i>
                                <span> Shop by Department</span>
                            </div>
                            <div className="menu__content">
                                <Menu
                                    data={menuData.product_categories}
                                    className="menu--dropdown"
                                />
                            </div>{/**/}
                        </div>
                    </div>
                    <div className="navigation__right" style={{ height: 50 }}>
                        <Menu
                            data={[]}
                            className="menu"
                        />
                        {/*menuData.menuPrimary.menu_1*/}

                        <ul className="navigation__extra">
                            <li>
                                <a target="_blank" href="https://galinukkad.vercel.app/vendor/become-a-vendor">Sell on Galinukkad</a>
                            </li>
                            <li>
                                <Link href="/account/order-tracking">
                                    <a>tract your order</a>
                                </Link>
                            </li>
                            {/*<li>
                                <CurrencyDropdown />
                            </li>
                            <li>
                                <LanguageSwicher />
                            </li>*/}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavigationDefault;

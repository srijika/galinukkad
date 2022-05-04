import React, { Component } from 'react';
import Link from 'next/link';
import NavigationDefault from '../navigation/NavigationDefault';
import HeaderActions from './modules/HeaderActions';
import MenuCategories from './modules/MenuCategories';
import SearchHeader from './modules/SearchHeader';
import { stickyHeader } from '../../../utilities/common-helpers';

class HeaderDefault extends Component {
    constructor({ props }) {
        super(props);
    }

    componentDidMount() {
        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
    }

    render() {
        return (
            <header
                className="header header--1"
                data-sticky="true"
                id="headerSticky">
                <div className="header__top">
                    <div className="ps-container">
                        <div className="header__left">
                            {/*<Link href="/">
                                <a className="ps-logo">
                                    <img
                                        src="/static/img/logo_light.png"
                                        alt="logo"
                                    />									
                                </a>								
                            </Link>*/}
                            <Link href="/"><a className="ps-logo"><img className="mw-100"  src="/static/img/index.png" alt="Galinukkad" /></a></Link> 
							{/* <h2 style={{margin:0}}><Link href="/"><a className="ps-logo">Galinukkad</a></Link></h2> */}
                            <div className="menu--product-categories">
                                <div className="menu__toggle">
                                    <i className="icon-menu"></i>
                                    <span> Shop by Department</span>
                                </div>
                                <div className="menu__content">
                                    <MenuCategories />
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
                </div>
                <NavigationDefault />
            </header>
        );
    }
}

export default HeaderDefault;

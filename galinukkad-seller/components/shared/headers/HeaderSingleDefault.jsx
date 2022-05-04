import React, { Component } from 'react';
import Link from 'next/link';
import NavigationDefault from '../navigation/NavigationDefault';
import HeaderActions from './modules/HeaderActions';
import MenuCategories from './modules/MenuCategories';
import SearchHeader from './modules/SearchHeader';
import MenuFlip from './modules/menuflip';
import { stickyHeader } from '../../../utilities/common-helpers';

class HeaderSingleDefault extends Component {
    constructor({ props }) {
        super(props);
    }

    componentDidMount() {
        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
    }

    render() {
        const mystyle = {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
          };
        return (
            <header
                className="header header--1"
                data-sticky="true"
                id="headerSticky">
                <div className="header__top">
                    <div className="ps-container">
                        <div className="header__left">
                            <Link href="https://galinukkad.com/"><a className="ps-logo"><img className="mw-100" style={{minWidth: '70px'}}  src="/static/img/index.png" alt="Galinukkad" /></a></Link>
                             {/* <MenuFlip /> */}
                        </div>
                        <div className="header__center">
                        </div> 
                        <div className="header__right">
                             <HeaderActions hideAction={true}/> 
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default HeaderSingleDefault;
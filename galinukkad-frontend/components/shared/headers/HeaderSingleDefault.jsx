import React, { Component } from 'react';
import Link from 'next/link';
import NavigationDefault from '../navigation/NavigationDefault';
import HeaderActions from './modules/HeaderActions';
import MenuCategories from './modules/MenuCategories';
import SearchHeader from './modules/SearchHeader';
import MenuFlip from './modules/menuflip';
import { stickyHeader } from '../../../utilities/common-helpers';
import TopNavBar from './headerMain.jsx';

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
            <header>
                <TopNavBar></TopNavBar>
             </header>
            // <header
            //     className="header header--1"
            //     data-sticky="true"
            //     id="headerSticky">
            //     <div className="header__top">
            //         <div className="ps-container">
            //             <div className="header__left">
            //                 {/*<Link href="/">
            //                     <a className="ps-logo">
            //                         <img
            //                             src="/static/img/logo_light.png"
            //                             alt="logo"
            //                         />									
            //                     </a>								
            //                 </Link>*/}
			// 				{/* <h2 style={{margin:0}}> */}
			// 				{/* <Link href="/vendor/become-a-vendor"><a style={{fontWeight: 900}}>Galinukkad</a></Link> */}
            //                 <Link href="/vendor/become-a-vendor"><a className="ps-logo"><img className="mw-100" style={{minWidth: '70px'}}  src="/static/img/index.png" alt="Galinukkad" /></a></Link>
			// 				{/* </h2> */}
            //                  <MenuFlip />
                          
            //                 {/*<div className="menu--product-categories">
            //                     <div className="menu__toggle">
            //                         <i className="icon-menu"></i>
            //                         <span> Shop by Department</span>
            //                     </div>
            //                     <div className="menu__content">
            //                         <MenuCategories />
            //                     </div>
            //                 </div>*/}
            //             </div>
            //             <div className="header__center">
            //             </div>
            //             <div className="header__right">
            //                 <HeaderActions hideAction={true}/>
            //             </div>
            //         </div>
            //     </div>
            //     {/*<NavigationDefault />*/}
            // </header>
        );
    }
}

export default HeaderSingleDefault;
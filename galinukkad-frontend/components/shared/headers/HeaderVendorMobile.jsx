import React, { Component } from 'react';
import CurrencyDropdown from './modules/CurrencyDropdown';
import Link from 'next/link';
import LanguageSwicher from './modules/LanguageSwicher';
import MobileHeaderVenderAction from './modules/MobileHeaderVenderAction';
import MenuFlip from './modules/menuflip';
import TopNavBar from './headerMain.jsx';
class HeaderMobile extends Component {
    constructor({ props }) {
        super(props);
    }

    render() {
        return (
            <header>
                <TopNavBar></TopNavBar>
            </header>
          
        );
    }
}

export default HeaderMobile;

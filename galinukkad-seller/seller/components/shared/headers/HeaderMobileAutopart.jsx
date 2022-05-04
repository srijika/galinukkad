import React, { Component } from 'react';
import CurrencyDropdown from './modules/CurrencyDropdown';
import Link from 'next/link';
import LanguageSwicher from './modules/LanguageSwicher';
import MobileHeaderActions from './modules/MobileHeaderActions';

class HeaderMobileAutopart extends Component {
    constructor({ props }) {
        super(props);
    }

    render() {
        return (
            <header className="header header--mobile autopart">
                <div className="header__top">
                    <div className="header__left">
                        <p>Welcome to Galinukkad Online Shopping Store !</p>
                    </div>
                    <div className="header__right">
                        <ul className="navigation__extra">
                            <li>
                                <a target="_blank" href="https://galinukkad.vercel.app/vendor/become-a-vendor">Sell on Galinukkad</a>
                            </li>
                            <li>
                                <Link href="/account/order-tracking">
                                    <a>Tract your order</a>
                                </Link>
                            </li>
                            <li>
                                <CurrencyDropdown />
                            </li>
                            <li>
                                <LanguageSwicher />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="navigation--mobile">
                    <div className="navigation__left">
                        <h2 style={{margin:0}}>Galinukkad</h2>
                    </div>
                    <MobileHeaderActions />
                </div>
                <div className="ps-search--mobile">
                    <form
                        className="ps-form--search-mobile"
                        action="/"
                        method="get">
                        <div className="form-group--nest">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Search something..."
                            />
                            <button>
                                <i className="icon-magnifier"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </header>
        );
    }
}

export default HeaderMobileAutopart;

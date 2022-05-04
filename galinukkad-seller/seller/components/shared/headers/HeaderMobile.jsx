import React, { Component } from 'react';
import CurrencyDropdown from './modules/CurrencyDropdown';
import Link from 'next/link';
import LanguageSwicher from './modules/LanguageSwicher';
import MobileHeaderActions from './modules/MobileHeaderActions';
import MenuFlip from './modules/menuflip';
class HeaderMobile extends Component {
    constructor({ props }) {
        super(props);
    }

    render() {
        return (
            <header className="header header--mobile">
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
                                    <a>track your order</a>
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
                        <Link href="/">
                            <a className="ps-logo">
                                {/*<img
                                    src="/static/img/logo_light.png"
                                    alt="Galinukkad"
                                />*/}
								{/* <h2 style={{margin:0}}>Galinukkad</h2> */}
                                <Link href="/"><a className="ps-logo"><img className="mw-100"  src="/static/img/index." alt="Galinukkad" /></a></Link>
                            </a>
                        </Link>
                        {/* <MenuFlip /> */}

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

export default HeaderMobile;

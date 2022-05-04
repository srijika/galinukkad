import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';

import MiniCart from './MiniCart';
import AccountQuickLinks from './AccountQuickLinks';

class HeaderActions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { compare, wishlist, auth, hideAction } = this.props;
        return (
            <div className="header__actions">
			{!hideAction &&
                <Fragment>
				<Link href="/account/compare">
                    <a className="header__extra" style={{ color: "black" }} data-toggle="tooltip" data-placement="top" title="Compare">
                    <i className="fa fa-balance-scale" aria-hidden="true"></i>
                    {/* <i class="fas fa-balance-scale"></i> */}
                    {/* <i class="fas fa-balance-scale-right"></i> */}
                        {/* <i className="fa fa-balance-scale" aria-hidden="true"></i> */}
                        <span>
                            <i>
                                {compare
                                    ? compare.compareTotal
                                    : compare.compareTotal}
                            </i>
                        </span>
                    </a>
                </Link>
                <Link href="/account/wishlist">
                    <a className="header__extra" style={{ color: "black" }}>
                        <i className="icon-heart"></i>
                        <span>
                            <i>{wishlist.wishlistTotal}</i>
                        </span>
                    </a>
                </Link>
                <MiniCart />
				</Fragment>
				}
                {auth.isLoggedIn && Boolean(auth.isLoggedIn) === true ? (
                    <AccountQuickLinks isLoggedIn={true} hideLogin={hideAction}/>
                ) : (
                    <AccountQuickLinks isLoggedIn={false} hideLogin={hideAction}/>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(HeaderActions);

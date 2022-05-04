import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { logOut } from '../../../../store/auth/action';
class AccountQuickLinks extends Component {
    constructor(props) {
        super(props);
    }

    handleLogout = e => {
        e.preventDefault();
        this.props.dispatch(logOut());
    };

    render() {
        const accountLinks = [
            {
                text: 'Account Information',
                url: '/account/user-information',
            },
            {
                text: 'Notifications',
                url: '/account/notifications',
            },
            // {
            //     text: 'Inbox',
            //     url: '/account/user-inbox'
            // },
            {
                text: 'Orders',
                url: '/account/orders',
            },
            {
                text: 'My Coupons',
                url: '/account/my-coupons',
            },
            {
                text: 'Address',
                url: '/account/addresses',
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
            },
            {
                text: 'Support',
                url: '/account/support',
            },
        ];                                                                                                                                                                                                                                                                                                                  
        const { isLoggedIn, hideLogin } = this.props;
       
       
        if (isLoggedIn === true) {
            const userDetails = JSON.parse(localStorage.getItem('persist:eStore'));
            const auth =  JSON.parse(userDetails.auth);
            const username = auth?.login?.user?.username;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            return (
                <div className="ps-block--user-account">
                    <i className="icon-user"></i>
                    <br/>
              
                    <div className='header-username'>
                        <b>{username}</b>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    </div>
             
                    <div className="ps-block__content">
                        <ul className="ps-list--arrow">
                            {accountLinks.map(link => (
                                <li key={link.text}>
                                    <Link href={link.url}>
                                        <a className="hover-shadow">{link.text}</a>
                                    </Link>
                                </li>
                            ))}
                            <li className="ps-block__footer">
                                <a
                                    href="#"
                                    onClick={this.handleLogout.bind(this)}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ps-block--user-header" style={hideLogin?{alignItems: 'center'}:{}}>
                    <div className="ps-block__left">
                        <i className="icon-user d-none d-sm-block"></i>
                    </div>
                    <div className="ps-block__right">
                        {!hideLogin && <Link href="/account/login">
                            <a>Login</a>
                        </Link>}
                            {/* <span className="mx-2"> &#124; </span> */}
						{hideLogin?
							<a target="_blank" href="http://15.207.135.132/#/login">Login for existing sellers</a>
						:<Link href="/account/register">
                            <a>Register</a>
                        </Link>}
                    </div>
                </div>
            );
        }
    }
}
const mapStateToProps = state => {
    return state;
};
export default connect(mapStateToProps)(AccountQuickLinks);

import React, { useEffect } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { logOut } from '../../../../store/auth/action';
import Router from 'next/router';


const AccountMenuSidebar = (props) => {

    useEffect(() => {
        let token = localStorage.getItem('accessToken');
        if(token === undefined || token === null ) {
            Router.push('/account/login');
        }
    }, [])

    return (
    <aside className="ps-widget--account-dashboard">
        <div className="ps-widget__header">
            {/* <img src="/static/img/users/3.jpg" /> */}

			<Avatar style={{ backgroundColor: '#fcb800', height: 50, width: 59, padding: '10px 0' }} icon={<i className="icon-user"></i>} />
            <figure>    
                <figcaption> Hello </figcaption>
                <p>{props.info.userLogin ? props.info.userLogin.email : ''}  </p>
            </figure>
        </div>
        <div className="ps-widget__content">
            <ul>
                {props.data.map(link => (
                    <li key={link.text} className={link.active ? 'active' : ''}>
                        <Link href={link.url}>
                            <a>
                                <i className={link.icon}></i>
                                {link.text}
                            </a>
                        </Link>
                    </li>
                ))}
                <li>
					<a onClick={()=> props.dispatch(logOut())}>
						<i className="icon-power-switch"></i>
						Logout
					</a>
				</li>
            </ul>
        </div>
    </aside>
    )
};

const mapStateToProps = state => {
    return state.users;
};
export default connect(mapStateToProps)(AccountMenuSidebar);
//export default AccountMenuSidebar;
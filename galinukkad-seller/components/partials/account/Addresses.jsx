import React, { Component } from 'react';
import Link from 'next/link';
import { Popconfirm, message } from 'antd';
import AccountMenuSidebar from './modules/AccountMenuSidebar'
import { addressDetail, addressDelete } from '../../../store/users/action';
import { connect } from 'react-redux';

class Addresses extends Component {
    constructor(props) {
        super(props);
		this.state = {count:0, dcount:0, detail:[]};		
    }
	
	componentDidMount(){
		//console.log('getAddressDetail')
		this.getAddressDetail();
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.address.status === true && this.props.address.count > this.state.count) {
			this.setState({count:this.props.address.count, detail:this.props.address.data || []})
            return null
        }
		if (this.props.addressDel.status === true && this.props.addressDel.count > this.state.dcount) {
			this.setState({dcount:this.props.addressDel.count})
            return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.getAddressDetail();
        }
    }
	getAddressDetail=()=>{
		this.props.dispatch(addressDetail());
	}
	
	deleteFun= id=>{
		this.props.dispatch(addressDelete({_id:id}));
	}

    render() {
		const {detail} = this.state;
        const accountLinks = [
            {
                text: 'Account Information',
                url: '/account/user-information',
                icon: 'icon-user',
            },
            {
                text: 'Notifications',
                url: '/account/notifications',
                icon: 'icon-alarm-ringing',
            },
            {
                text: 'Invoices',
                url: '/account/invoices',
                icon: 'icon-papers',
            },
            {
                text: 'Address',
                url: '/account/addresses',
                icon: 'icon-map-marker',
                active: true,
            },
            {
                text: 'Recent Viewed Product',
                url: '/account/recent-viewed-product',
                icon: 'icon-store',
            },
            {
                text: 'Wishlist',
                url: '/account/wishlist',
                icon: 'icon-heart',
            },
        ];
		console.log(this.props, detail)
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ps-page__left" style={{height:'auto'}}>
								<AccountMenuSidebar data={accountLinks} />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="ps-section--account-setting">
                                <div className="ps-section__content">
                                    <div className="row">
                                        <div className="col-md-12 col-12">
                                            <figure className="ps-block--address">
                                                <figcaption>
                                                    Billing address
													
													<Link href="/account/edit-address" >
                                                        <a style={{float:'right'}}>Add New</a>
                                                    </Link>
                                                </figcaption>
												{detail.map((item,index)=>{
													return <div className="ps-block__content" key={index}>
														<div>
															<div style={{float:'right'}}>
																{!item.isdefault && <Popconfirm title="Are you sure delete this?" onConfirm={()=>this.deleteFun(item._id)} okText="Yes" cancelText="No" >
																	<a className="text-danger" >Delete</a>
																</Popconfirm>}
																&nbsp;
																<Link href={"/account/edit-address?id="+item._id}>
																	<a>Edit</a>
																</Link>
															</div>
															{item.isdefault && <i className="icon-circle" style={{background: 'green', color: '#fff', borderRadius: 13}}/>} {item.fname+' '+item.lname},<br/>
															Phone: {item.phone},<br/>
															Email: {item.email},<br/>
															Address: {item.add1+' '+item.add12},<br/>
															{item.state+', '+item.country+', '+item.postal}
														</div>
														<hr/>
													</div>
												})}
												
												{detail.length === 0 && <div className="ps-block__content">
                                                    <p>
                                                        You Have Not Set Up This
                                                        Type Of Address Yet.
                                                    </p>
                                                    <Link href="/account/edit-address">
                                                        <a>Edit</a>
                                                    </Link>
                                                </div>}
                                            </figure>
                                        </div>
                                        {/*<div className="col-md-6 col-12">
                                            <figure className="ps-block--address">
                                                <figcaption>
                                                    Shipping address
                                                </figcaption>
												{this.state.detail && this.state.detail.isshipping ? <div className="ps-block__content">
                                                    <p>
                                                        {detail.fname+' '+detail.lname},<br/>
														Phone: {detail.phone},<br/>
														Email: {detail.email},<br/>
														Address: {detail.add1+' '+detail.add12},<br/>
														{detail.state+', '+detail.country+', '+detail.postal}
                                                    </p>
                                                </div> :
                                                <div className="ps-block__content">
                                                    <p>
                                                        You Have Not Set Up This
                                                        Type Of Address Yet.
                                                    </p>
                                                    <Link href="/account/edit-address">
                                                        <a>Edit</a>
                                                    </Link>
                                                </div>}
                                            </figure>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
							<p />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return state.users;
};
export default connect(mapStateToProps)(Addresses);
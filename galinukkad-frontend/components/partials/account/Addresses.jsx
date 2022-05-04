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
            // {
            //     text: 'Inbox',
            //     url: '/account/user-inbox',
            //     icon: 'icon-user',
            //     active: false
            // },
            {
                text: 'Orders',
                url: '/account/orders',
                icon: 'icon-papers',
            },
            {
                text: 'My Coupons',
                url: '/account/my-coupons',
                icon: 'icon-papers',
                active: false,
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
            {
                text: 'Support',
                url: '/account/support',
                icon: 'icon-papers',
                active: false
            },
        ];
        return (
            <section className="ps-my-account ps-page--account">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ps-page__left" style={{height:'auto'}}>
								<AccountMenuSidebar data={accountLinks} />
                            </div>
                        </div>

                        <hr/>
                        <div className="col-lg-8">
                            <div className="ps-section--account-setting">
                                <div className="ps-section__content">
                                    <div className="row">
                                        <div className="col-md-12 col-12">
                                            <figure className="ps-block--address">
                                                <figcaption>
                                                    My Address
													
													<Link href="/account/edit-address" >
                                                        <a style={{float:'right'}}>
                                                        <span className="d-none d-sm-block">Add New</span>
                                    <span className="d-block d-sm-none"></span>


                                                        </a>
                                                    </Link>
                                                </figcaption>
												{detail.map((item,index)=>{
													return <div className="ps-block__content" key={index}>
														<div>
															<div style={{float:'right'}}>
                                                            <Link href={"/account/edit-address?id="+item._id}>
																	<a>Edit</a>
																</Link>


                                                                <span className="address_divider">|</span>
																{ <Popconfirm title="Are you sure delete this address?" onConfirm={()=>this.deleteFun(item._id)} okText="Yes" cancelText="No" >
																	<a className="text-danger" >Delete</a>
																</Popconfirm>}
																&nbsp;
															</div>
															{item.isdefault && <i className="icon-circle" style={{background: 'green', color: '#fff', borderRadius: 13}}/>} 
                                                            <b>
                                                                <h5 className="text-capitalize un_position">
                                                                    {item.fname+' '+item.lname}<br/>
                                                                </h5>
                                                            </b>
															<span className="font-weight-bold text-secondary">Phone: </span> {item.phone}<br/>
															<span className="font-weight-bold text-secondary">Email: </span>  {item.email}<br/>
															<span className="font-weight-bold text-secondary">Address: </span>  {item.add1+' '+item.add2}<br/>
															{item.state+', '+item.country+', '+'('+item.postal+')'}
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
                                <span className="d-block d-sm-none"> <div className="cust-address">
                                <Link href="/account/edit-address" >
  <a
   
    className="add-more-add"
    onclick="Shopify.CustomerAddress.toggleNewForm(); return false;"
  >
    <i class="fa fa-plus-circle" aria-hidden="true"></i>

    <span>Add a New Address</span>
  </a>
  </Link>
</div></span>
                               



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
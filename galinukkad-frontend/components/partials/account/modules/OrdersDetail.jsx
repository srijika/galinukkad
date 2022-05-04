import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import Link from 'next/link';
import { Button } from 'antd';
import Moment from 'react-moment';
import { baseUrl } from '../../../../repositories/Repository';

class OrderDetails extends Component {


    getOrderStatus(status) {
        /*
        // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
        */
        let statusReturned = null;
        switch (status) {
            case 0:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'green' }}>Placed</span>
                break;
            case 1:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'green' }}>Delivered</span>
                break;
            case 2:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Cancelled</span>
                break;
            case 3:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'red' }}>Returned</span>
                break;
            case 4:
                statusReturned = <span style={{ 'textAlign': 'center', 'color': 'blue' }}>Refunded</span>
                break;
            default:
                statusReturned = <span style={{ 'textAlign': 'center' }}>-</span>
                break;
        }

        return statusReturned;
    }

    render() {
        const { orders } = this.props;
        return (
            <>
                {orders? orders.map((order, index) => {
                    return (
                        <>
                            <div className="order-wrapper">

                                <div className="d-flex top-divider">
                                    <table className="table-responsive w-100">
                                        <tr>
                                            <td className="w-25">
                                                <h5>Order placed</h5>
                                                <p></p>
                                            </td>
                                            <td className="w-25">
                                                <h5>Total</h5>
                                                <p>₹ {order.amount}</p>
                                            </td>
                                            <td className="w-25">
                                                <h5>Ship to</h5>
                                                <p>{order.address.email}</p>
                                            </td>
                                            <td className="w-25">
                                                <h5><a href="#">Order Detailss</a></h5>
                                            </td>
                                            <td className="w-25">
                                                <h5><a href="#">Invoice</a></h5>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="inner-order-content-left">
                                   
                                            <div className="w-100">
                                                <h4>Delivered {order && order.delivery_date?<Moment format="MM-
                                                                DD-YYYY" >{order.delivery_date}</Moment>:'-'}</h4>
                                                <p>Package was handled directly to the customer</p>
                                                {order.products ? order.products.map((product, index) => {
                                                 return (
                                                     <>
                                                        <table className="w-100">
                                                            <tr>
                                                                <td>
                                                                    <img src={`${baseUrl}/${product.images && product.images.file ? product.images.file: ''}`} height="150px" width="150px" alt="galinukkad-Image" />
                                                                    {/* <img src="  " alt="galinukkad-Image" /> */}
                                                                </td>
                                                                <td className="pl-3">
                                                                    <p>{product.title}</p>
                                                                    <p>Sold By: {product.vendor}</p>
                                                                    <p>Return eligible within 12 days</p>
                                                                    <p>₹ {product.price}</p>
                                                                   
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <hr/>
                                                        </>
                                                        )
                                                }) : <p>No Product found</p>}
                                                 <a
                                                    className="ps-btn"
                                                    href="#">
                                                    Buy it again </a>
                                            </div>
                                      

                                    <div className="inner-order-content-right">
                                        <a
                                            className="ps-btn ps-btn--black color-white"
                                            href="/account/refund-orders">
                                            Retrun or Replace items</a>
                                    </div>
                                </div>
                            </div>

                        </>
                    )
                }): ''}

            </>
        );
    }
}

export default OrderDetails;

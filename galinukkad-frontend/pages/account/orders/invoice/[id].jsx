import React, { Component } from 'react';
import {
    Table,
    Card,
    Col,
    Row,
    Modal,
    Checkbox,
    notification,
    Divider,
    Tag,
} from 'antd';
import Link from 'next/link';
import { Button } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import Moment from 'react-moment';
import moment from 'moment';
import { baseUrl } from '../../../../repositories/Repository';
import Repository from '../../../../repositories/Repository';
import Router from 'next/router';
import { connect } from 'react-redux';
import { getOrderDetails } from '../../../../store/order/action';
import Newsletters from '../../../../components/partials/commons/Newletters';
import FooterDefault from '../../../../components/shared/footers/FooterDefault';
import HeaderDefault from '../../../../components/shared/headers/HeaderDefault';
import BreadCrumb from '../../../../components/elements/BreadCrumb';
import Orders from '../../../../components/partials/account/Orders';
import HeaderMobile from '../../../../components/shared/headers/HeaderMobile';
import NavigationList from '../../../../components/shared/navigation/NavigationList';
import './account-return.css';
import Item from 'antd/lib/list/Item';
import axios from 'axios';
import { Spin, Space } from 'antd';
import 'antd/dist/antd.css';
var converter = require('number-to-words');

class OrderDetails extends Component {
    static async getInitialProps(ctx) {
        return { query: ctx.query };
    }

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            printModel: false,
            loading : false
        };
    }

    getOrderStatus(status) {
        /*
        // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
        */
        let statusReturned = null;
        switch (status) {
            case 0:
                statusReturned = (
                    <span style={{ textAlign: 'center', color: 'green' }}>
                        Placed
                    </span>
                );
                break;
            case 1:
                statusReturned = (
                    <span style={{ textAlign: 'center', color: 'green' }}>
                        Delivered
                    </span>
                );
                break;
            case 2:
                statusReturned = (
                    <span style={{ textAlign: 'center', color: 'red' }}>
                        Cancelled
                    </span>
                );
                break;
            case 3:
                statusReturned = (
                    <span style={{ textAlign: 'center', color: 'red' }}>
                        Returned
                    </span>
                );
                break;
            case 4:
                statusReturned = (
                    <span style={{ textAlign: 'center', color: 'blue' }}>
                        Refunded
                    </span>
                );
                break;
            default:
                statusReturned = <span style={{ textAlign: 'center' }}>-</span>;
                break;
        }

        return statusReturned;
    }

    componentDidMount() {
        const orderId = this.props.query.id;
        this.props.dispatch(getOrderDetails({ order_id: orderId }));
        // const { order } = this.props;
        // console.log("order : ", this.props);
    }

    print() {
        window.print();
        document.location = '/account/orders/';
    }

    async download(orderId , product) {

            this.setState({ loading: true }
                );
  

        const res = await axios.post(
            `${baseUrl}/order-invoice-for-user-by-order-id`,
            { _id: orderId , product: product } 
        );


        if (res.data.status === true) {
            window.open(res.data.result, '_blank');
            this.setState({ printModel: false });
           this.setState({ loading: false });

        }
    }

    render() {
        const breadCrumb = [
            {
                text: 'Home',
                url: '/',
            },
            {
                text: 'Orders',
                url: '/account/orders',
            },
            {
                text: 'return',
            },
        ];

        const { order } = this.props;
        let totalAmount;


        if (order !== undefined) {
            totalAmount = 11;
             totalAmount = converter.toWords(Number(order.totalAmount))
            console.log('payemet : ', totalAmount);
        }

        const columns = [
            {
                title: (
                    <strong className="primary-text cursor">
                        Product Name
                    </strong>
                ),
                dataIndex: 'detail',
                render: (val, data) => (
                    <div className={data.isActive ? '' : 'danger-text'}>
                        {data?.product?.title}
                    </div>
                ),
            },
            {
                title: <strong>Price</strong>,
                dataIndex: 'price',
                render: (val, data) => <div>{data?.product?.price + ' ₹'}</div>,
            },
            {
                title: <strong>Quantity</strong>,
                width: 100,
                dataIndex: 'quantity',
            },
        ];

        return (
            
           
            <div className="site-content">
                <HeaderDefault />
                {/* <HeaderMobile /> */}
                <NavigationList />
                <div className="ps-page--my-account">
                    <BreadCrumb breacrumb={breadCrumb} />
                    {/* {this.state.loading === true ?   <div className="lds-roller h-100">
<div />
  <div />
  <div />
  <div />
  <div />
  <div />
  <div />
  <div />
</div>
 : ''} */}
                    <section className="ps-my-account ps-page--account">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="ps-page__content">
                                        <div className="ps-section--account-setting">
                                            <div className="ps-section__header d-flex justify-content-between">
                                                <h3>Order Details</h3>
                                                <button className="button-warning buttonloader"  onClick={() => {
                                                        this.download(
                                                            order?._id ,
                                                            order?.product
                                                        );
                                                    }} disabled={this.state.loading}>
          {this.state.loading && (
            <i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />
          )}
            {!this.state.loading && (
            <i
              className="fa fa-download"
              style={{ marginRight: "5px" , }}
            />
          )}
          {this.state.loading && <span>Downloading...</span>}
          {!this.state.loading && <span>Download Invoice</span>}
        </button>

                                                {/* <Button
                                                    type="primary"
                                                    className
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => {
                                                        this.download(
                                                            order?._id ,
                                                            order?.product
                                                        );
                                                    }}
                                                    style={{
                                                        background: '#fcb800',
                                                        color: '#000000',
                                                        borderColor: 'yellow',
                                                    }}>
                                                    Download Invoice
                                                </Button> */}
                                            </div>
                                            {/* <Button type="primary" onClick={() => this.setState({ printModel: true })} className="btn-w25 btn-primary-light">Veiw Invoice</Button>  */}
                                        </div>
                                        <section>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="invoice_logo_box">
                                                        <img
                                                            src="https://galinukkad.com/static/img/index.png"
                                                            alt="gallinukkad-logo"
                                                            className="img-fluid"
                                                            width={70}
                                                            height={30}
                                                        />
                                                        
                                                        <span>Gallinukkad</span>
                                                        {order && order.payment_status === "Paid" ?  <img
                                                            src="/static/img/stamp/paid.png"
                                                            alt="paid-image"
                                                            className="img-fluid float-right paid_mobile_img "
                                                        /> : <img
                                                        src="/static/img/stamp/not-paid.png"
                                                        alt="paid-image"
                                                        className="img-fluid float-right"
                                                    />}
                                                       
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <h3 className="invoice_title">
                                                        invoice
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="container">
                                                <hr className="underline" />
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="invoice_left">
                                                            <h5>
                                                                {' '}
                                                                <b> Invoice:</b>
                                                            </h5>
                                                            <ul className="ml-0 pl-0">
                                                                <li>
                                                                    <b>
                                                                        Order
                                                                        Number:
                                                                    </b>{' '}
                                                                    {order?._id}
                                                                </li>
                                                                <li>
                                                                    <b>
                                                                        Order
                                                                        Date:
                                                                    </b>{' '}
                                                                    {order &&
                                                                    order.create
                                                                        ? moment(
                                                                              order.create
                                                                          ).format(
                                                                              'DD MMMM YYYY'
                                                                          )
                                                                        : '-'}
                                                                </li>
                                                                {/* <li>
                                                                    <b>
                                                                    Fullfillment:
                                                                    </b>
                                                                    {order &&
                                                                        order.delivered_date}
                                                                </li> */}
                                                                <li>
                                                                    <b>
                                                                    Shipping
                                                                        service:
                                                                    </b>{' '}
                                                                     {order &&
                                                                    order.create
                                                                        ? moment(
                                                                              order.create
                                                                          ).format(
                                                                              'DD MMMM YYYY'
                                                                          )   
                                                                        : '-'}
                                                                      {`  `}to {`  `}
                                                                    {order &&
                                                                    order.delivered_date
                                                                        ? moment(
                                                                              order.delivered_date
                                                                          ).format(
                                                                              'DD MMMM YYYY'
                                                                          )
                                                                        : '-'}
                                                                </li>
                                                                {/* <li>
              <b>Invoice Date:</b> 21-08-2021
            </li> */}
                                                                <li>
                                                                    <b>
                                                                        Payment
                                                                        Method:
                                                                    </b>{' '}
                                                                    {order
                                                                        ? order.payment_method
                                                                        : '-'}
                                                                </li>
                                                                <li>
                                                                    <b>
                                                                        Payment
                                                                        Status:
                                                                    </b>
                                                                    {order ? (
                                                                        order.payment_status === "Paid" ? (
                                                                            <span
                                                                                style={{
                                                                                    color: 'green',
                                                                                }}>
                                                                                PAID
                                                                            </span>
                                                                        ) : (
                                                                            <span
                                                                                style={{
                                                                                    color: 'red',
                                                                                }}>
                                                                                UNPAID
                                                                            </span>
                                                                        )
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="invoice_ryt">
                                                            <h5>
                                                                {' '}
                                                                <b>
                                                                    {' '}
                                                                    Shipping
                                                                    Address:
                                                                </b>
                                                            </h5>
                                                            <address>
                                                                {order &&
                                                                order.address ? (
                                                                    <div>
                                                                        {
                                                                            order
                                                                                .address
                                                                                .fname
                                                                        }{' '}
                                                                        {
                                                                            order
                                                                                .address
                                                                                .lname
                                                                        }{' '}
                                                                    </div>
                                                                ) : null}
                                                                {/* <br /> */}
                                                                {order &&
                                                                    order
                                                                        .address
                                                                        .add1}
                                                                <br />
                                                                {order &&
                                                                    order
                                                                        .address
                                                                        .postal}{' '}
                                                                ,{' '}
                                                                {order &&
                                                                    order
                                                                        .address
                                                                        .state}
                                                                <br />
                                                                {order &&
                                                                order.address
                                                                    ? order
                                                                          .address
                                                                          .country
                                                                    : null}
                                                            </address>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="invoice_table_box">
                                                        <table className="table-responsive w-100">
                                                            <tbody>
                                                                <tr className="tx_text" >
                                                                    <th>
                                                                        S.no.
                                                                    </th>
                                                                    <th>
                                                                        Description
                                                                    </th>
                                                                    <th>
                                                                        Unity
                                                                        Price
                                                                    </th>
                                                                    <th>Qty</th>
                                                                    <th>
                                                                        Net
                                                                        Amount
                                                                    </th>
                                                                    <th>
                                                                        Tax Rate
                                                                    </th>
                                                                    <th>
                                                                        Tax Type
                                                                    </th>
                                                                    <th>
                                                                        Tax
                                                                        Amount
                                                                    </th>
                                                                    <th>
                                                                        Total
                                                                        Amount
                                                                    </th>
                                                                </tr>
                                                                {order &&
                                                                    order.product.map(
                                                                        (
                                                                            val,
                                                                            index
                                                                        ) => {

                                                                            
                                                                            return (
                                                                                <tr className="tx_text">
                                                                                    <td>
                                                                                        {index + 1}
                                                                                    </td>
                                                                                    <td>
                                                                                        {val.product &&
                                                                                            val.product.title}
                                                                                    </td>
                                                                                    <td>
                                                                                        <i className="fas fa-rupee-sign" />
                                                                                       
                                                                                        {val &&
                                                                                            val.price}
                                                                                    </td>
                                                                                    <td>
                                                                                        {val &&
                                                                                            val.quantity}
                                                                                    </td>
                                                                                    <td>
                                                                                        <i className="fas fa-rupee-sign" />
                                                                                       

                                                                                        -
                                                                                    </td>
                                                                                    <td>
                                                                                        -
                                                                                    </td>
                                                                                    <td>
                                                                                        -
                                                                                    </td>
                                                                                    <td>
                                                                                        <i className="fas fa-rupee-sign" />
                                                                                       

                                                                                        -
                                                                                    </td>
                                                                                    <td>
                                                                                        <i className="fas fa-rupee-sign" />
                                                                                       
                                                                                        {/* {val &&
                                                                                            val.totalAmount} */}
                                                                                            {val &&
                                                                                            eval(Number(val.product.price) * Number(val.quantity))}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                {/* <tr>
              <td>1</td>
              <td>
              {order && order.product[0].product.title}
              </td>
              <td>
                <i className="fas fa-rupee-sign" />
                <i className="fa fa-inr" aria-hidden="true" />
                {order && order.product[0].price}
              </td>
              <td>{order && order.product[0].quantity}</td>
              <td>
                <i className="fas fa-rupee-sign" />
                <i className="fa fa-inr" aria-hidden="true" />
              -
              </td>
              <td>-</td>
              <td>-</td>
              <td>
                <i className="fas fa-rupee-sign" />
                <i className="fa fa-inr" aria-hidden="true" />
                -
              </td>
              <td>
                <i className="fas fa-rupee-sign" />
                <i className="fa fa-inr" aria-hidden="true" />
                {order && order.totalAmount}
              </td>
            </tr> */}
                                                                <tr className="table_row">
                                                                    <td
                                                                        colSpan={
                                                                            8
                                                                        }>
                                                                        <b>
                                                                            Total
                                                                            Amount
                                                                        </b>
                                                                    </td>
                                                                    <td>
                                                                        <i className="fas fa-rupee-sign" />
                                                                        
                                                                        {order &&
                                                                            order.totalAmount}
                                                                    </td>
                                                                </tr>
                                                                <tr className="table_row2">
                                                                    <td
                                                                        colSpan={
                                                                            9
                                                                        }>
                                                                        <h4>
                                                                            <span className="mobile_amt">
                                                                                Amount
                                                                                in
                                                                                words:
                                                                            </span>
                                                                            <br />
                                                                            <h2 className="text-capitalize mobile_amt_word_">
                                                                                {' '}
                                                                                {
                                                                                    `${totalAmount} Rupees Only`
                                                                                }
                                                                                 
                                                                            </h2>
                                                                        </h4>
                                                                    </td>
                                                                </tr>
                                                                <tr className="table_row3">
                                                                    <td
                                                                        colSpan={
                                                                            9
                                                                        }>
                                                                        <p>
                                                                            For
                                                                            Cloudtail
                                                                            India
                                                                            Private
                                                                            Limited:
                                                                        </p>
                                                                        <p>
                                                                            <img
                                                                                src="/static/img/stamp/stamp.jpg"
                                                                                alt="stamp"
                                                                                className="img-fluid"
                                                                            />
                                                                        </p>
                                                                        <p>
                                                                            Authorized
                                                                            Signatory
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* section 2 */}

                                        {/* <div id="ps-invoice-print">
                                            <Row key={0} gutter={5} style={{ marginBottom: '0.625rem' }}>
                                                <Col span={14}>
                                                    <Card title="Order summary" bordered={false}>
                                                        <Row key={11} gutter={10}>
                                                            <Col span={24} >
                                                                <div>
                                                                <label className="order-detail-bold" >Order ID:</label>&nbsp;&nbsp;<span className="order-detail-light">{order?._id}</span><br />
                                                                    <label className="order-detail-bold" >Order date:</label>&nbsp;&nbsp;<span className="order-detail-light">{order && order.create ? moment(order.create).format("DD MMMM YYYY")  : '-'}</span><br />
                                                                    <label className="order-detail-bold" >Shipping service:</label>&nbsp;<span className="order-detail-light">{order && order.delivered_date}</span><br />
                                                                    <label className="order-detail-bold" >Fullfillment:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">
                                                                        {order && order.create ? moment(order.create).format("DD MMMM YYYY") : '-'} 
                                                                        to  
                                                                        {order && order.delivered_date ? moment(order.delivered_date).format("DD MMMM YYYY") : '-'}</span><br />
                                                                    <label className="order-detail-bold" >Payment Method:</label>&nbsp;&nbsp;<span className="order-detail-light">{order ? order.payment_method : '-'}</span><br />
                                                                    <label className="order-detail-bold" >Payment Status:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">{order ? (order.status ? <span style={{ color: 'green' }}>PAID</span> : <span style={{ color: 'red' }}>UNPAID</span>) : '-'}</span><br />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>



                                                
                                                <Col span={10}>
                                                    <Card title="Ship to" bordered={false}  className="pb-2">
                                                        {order && order.address ? <div>{order.address.fname} {order.address.lname} </div> : null}

                                                        {order && order.address ? <div>{order.address.add1} </div> : null}
                                                        {order && order.address ? <span>{order.address.postal} </span> : null} {order && order.address ? <span>, {order.address.state} <br /></span> : null}
                                                        {order && order.address ? order.address.country : null}

                                                        {order && order.address ? <div className="text-white">. </div> : null}
                                                        {order && order.address ? <div className="text-white">. </div> : null}
                                                        {order && order.address ? <div className="text-white">. </div> : null}


                                                        {order && !order.address ? 'No address Found' : null}
                                                    </Card>
                                                </Col>
                                                
                                            </Row>

                                            <Table
                                                style={{ marginBottom: "0.625rem" }}
                                                columns={columns}
                                                dataSource={order && order.product}
                                                rowKey={record => record.id}
                                            />
                                            
                                        </div>
                                    */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal
                            visible={this.state.printModel}
                            title={'Order Invoice'}
                            onCancel={() =>
                                this.setState({ printModel: false })
                            }
                            footer={
                                <>
                                    <Button
                                        onClick={() =>
                                            this.setState({ printModel: false })
                                        }>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        onClick={() => {
                                            this.download(order?._id , order?.product );
                                        }}
                                        style={{
                                            background: '#fcb800',
                                            color: '#000000',
                                            borderColor: 'yellow',
                                        }}>
                                        Download Invoice
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={this.print.bind(order?._id)}
                                        className="btn-w25 btn-primary-light">
                                        Print Invoice
                                    </Button>
                                </>
                            }>
                            <div>
                                <Row
                                    key={0}
                                    gutter={5}
                                    style={{ marginBottom: '0.625rem' }}>
                                    <Col span={14}>
                                        <Card
                                            title="Order summary"
                                            bordered={false}>
                                            <Row key={11} gutter={10}>
                                                <Col span={24}>
                                                    <div>
                                                        <label className="order-detail-bold">
                                                            Order ID:
                                                        </label>
                                                        &nbsp;&nbsp;
                                                        <span className="order-detail-light">
                                                            {order?._id}
                                                        </span>
                                                        <br />
                                                        <label className="order-detail-bold">
                                                            Order date:
                                                        </label>
                                                        &nbsp;&nbsp;
                                                        <span className="order-detail-light">
                                                            {order &&
                                                            order.create
                                                                ? moment(
                                                                      order.create
                                                                  ).format(
                                                                      'DD MMMM YYYY'
                                                                  )
                                                                : '-'}
                                                        </span>
                                                        <br />
                                                        <label className="order-detail-bold">
                                                            Shipping services:
                                                        </label>
                                                        &nbsp;
                                                        <span className="order-detail-light">
                                                            {order &&
                                                                order.delivered_date}
                                                        </span>
                                                        <br />
                                                        <label className="order-detail-bold">
                                                            Fullfillment:
                                                        </label>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className="order-detail-light">
                                                            {order &&
                                                            order.create
                                                                ? moment(
                                                                      order.create
                                                                  ).format(
                                                                      'DD MMMM YYYY'
                                                                  )
                                                                : '-'}
                                                            to
                                                            {order &&
                                                            order.delivered_date
                                                                ? moment(
                                                                      order.delivered_date
                                                                  ).format(
                                                                      'DD MMMM YYYY'
                                                                  )
                                                                : '-'}
                                                        </span>
                                                        <br />
                                                        <label className="order-detail-bold">
                                                            Payment Method:
                                                        </label>
                                                        &nbsp;&nbsp;
                                                        <span className="order-detail-light">
                                                            {order
                                                                ? order.payment_method
                                                                : '-'}
                                                        </span>
                                                        <br />
                                                        <label className="order-detail-bold">
                                                            Payment Status:
                                                        </label>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className="order-detail-light">
                                                            {order ? (
                                                                order.status ? (
                                                                    <span
                                                                        style={{
                                                                            color: 'green',
                                                                        }}>
                                                                        PAID
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: 'red',
                                                                        }}>
                                                                        UNPAID
                                                                    </span>
                                                                )
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </span>
                                                        <br />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    <Col span={10}>
                                        <Card title="Ship to" bordered={false}>
                                            {order && order.address ? (
                                                <div>
                                                    {order.address.add1},{' '}
                                                </div>
                                            ) : null}
                                            {order && order.address ? (
                                                <div>
                                                    {order.address.add2},{' '}
                                                </div>
                                            ) : null}
                                            {order && order.address ? (
                                                <span>
                                                    {order.address.postal},{' '}
                                                </span>
                                            ) : null}{' '}
                                            {order && order.address ? (
                                                <span>
                                                    {order.address.state},{' '}
                                                    <br />
                                                </span>
                                            ) : null}
                                            {order && order.address
                                                ? order.address.country
                                                : null}
                                            {order && !order.address
                                                ? 'No address Found'
                                                : null}
                                        </Card>
                                    </Col>
                                </Row>

                                <Table
                                    style={{ marginBottom: '0.625rem' }}
                                    columns={columns}
                                    dataSource={order && order.product}
                                    rowKey={(record) => record.id}
                                />
                            </div>
                        </Modal>
                    </section>
                </div>
                <Newsletters layout="container" />
                <FooterDefault />
            </div>
        );
    }
}

const mapToProps = (state) => {
    return {
        order: state.order.orderDetails,
    };
};
export default connect(mapToProps)(OrderDetails);

import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import Link from 'next/link';
import { Button } from 'antd';
import Moment from 'react-moment';
import Router from 'next/router'


class TableInvoices extends Component {


    getOrderStatus(status) {
        let statusReturned = null;
        switch(status) {
            case 0:
                statusReturned = <span style={{'textAlign':'center','color':'green'}}>Placed</span>
            break;
            case 1:
                statusReturned = <span style={{'textAlign':'center','color':'green'}}>Delivered</span>
            break;
            case 2:
                statusReturned = <span style={{'textAlign':'center','color':'red'}}>Cancelled</span>
            break;
            case 3:
                statusReturned = <span style={{'textAlign':'center','color':'red'}}>Returned</span>
            break;
            case 4:
                statusReturned = <span style={{'textAlign':'center','color':'blue'}}>Refunded</span>
            break;
            default:
                statusReturned = <span style={{'textAlign':'center'}}>-</span>
            break;
        }

        return statusReturned;
    }

    render() {
       
        const { orders } = this.props;
        let tableData = [];
        let tableColumn = [];


        if(orders) {
            tableColumn = [
                {
                    title: 'Order ID',
                    dataIndex: 'number',
                    rowKey: 'number',
                    key: 'number',
                    width: '80px',
                },
                {
                    title: 'Delivery Date',
                    dataIndex: 'delivery_date',
                    rowKey: 'delivery_date',
                    key: 'delivery_date', 
                    width:150,
                    render: (value,data) => {
                        return <Moment format="DD MMM YY">{value}</Moment>
                    }
                },
                {
                    title: 'Amount',
                    dataIndex: 'amount',
                    rowKey: 'amount',
                    key: 'amount',
                    render: (value,data) => {
                        return <div>₹ {value}</div>
                    }
                },
                {
                    title: 'Payment Status',
                    dataIndex: 'payment_status',
                    rowKey: 'payment_status',
                    key: 'payment_status',
                    render: (text, record) => (
                        <span className="text-center"
                        style={{
                            color:record.payment_status === 1?'green':'red'
                        }}
                        >{record.payment_status === 1?'Paid':'Pending'}</span>
                    ),
                },
                {
                    title: 'Order Status',
                    dataIndex: 'status',
                    rowKey: 'status',
                    key: 'status',
                    render: (text, record) => this.getOrderStatus(text)
                },
                {
                    title: 'Order Date',
                    dataIndex: 'create',
                    rowKey: 'create',
                    key: 'create',
                    width: 150,
                    render: (text, record) => (
                        <span className="text-center">
                            <Moment format="DD MMM YY">{text}</Moment>
                        </span>
                    ),
                    
                },
                {
                    title: 'Actions',
                    dataIndex: 'action',
                    rowKey: 'action',
                    key: 'action',
                    width:'100px',
                    render: (text, record) => {
                        return <div>
                        <Button style={{marginTop: '0.625rem'}} block onClick={() => this.props.onOrderSelect(record._id) }type="default" > Details </Button>
                        <Button style={{marginTop: '0.625rem'}} block onClick={() => this.props.onOrderRefund(record)} type="danger" danger >
                                Refund Order
                        </Button>
                        <Button style={{marginTop: '0.625rem'}} block onClick={() => Ro.push('/return-order-' + record._id)} type="danger" danger >
                                Return Order
                        </Button>
                        </div>;
                    },
                    width: '120px',
                }
            ]
            tableData = [...orders];
        }
        return (
            <div style={{overflow:"scroll"}} >
            <Table
                columns={tableColumn}
                dataSource={tableData}
                rowKey={record => record.id}
            />
            </div>
        );
    }
}

export default TableInvoices;



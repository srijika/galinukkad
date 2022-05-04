import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import Link from 'next/link';
import { relativeTimeRounding } from 'moment';
import { Button } from 'antd';
class TableRefundOrders extends Component {
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
                    title: 'Products',
                    dataIndex: 'product_id',
                    rowKey: 'product_id',
                    width: '80px',
                    render: (text, record) => {
                        let productsDetails = '-'; 
                            if(record.product) {
                                const { product } = record;
                                productsDetails = (
                                    <div>
                                        {product.title} - {product.price}₹
                                    </div>
                                    );
                                } 
                        return productsDetails;
                        }
                    },
                {
                    title: 'Address',
                    dataIndex: 'address_id',
                    rowKey: 'address_id',
                    width: '150px',
                    render: (text, record) => {
                    let fullAddress = '-'; 
                        if(record.address) {
                            fullAddress = (
                                <div>
                            {record.address.fname+" "+record.address.lname}<br/> {record.address.companyname}<br/>
                            Address 1: {record.address.add1}<br/>
                            Address 2: {record.address.add2}<br/>
                            State: {record.address.state}<br/>
                            Country: {record.address.country}<br/>
                            Zipcode: {record.address.postal}<br/>
                            phone: {record.address.phone}
                                </div>
                                );
                    } 
                    return fullAddress;
                    }
                },
                {
                    title: 'Payment Method',
                    dataIndex: 'payment_method',
                    rowKey: 'payment_method',
                    key: 'payment_method',
                },
                {
                    title: 'Amount',
                    dataIndex: 'amount',
                    rowKey: 'amount',
                    key: 'amount',
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
                        >{record.payment_status === 1?'PAID':'PENDING'}</span>
                    ),
                },
                {
                    title: 'Order Date',
                    dataIndex: 'create',
                    rowKey: 'create',
                    key: 'create',
                    render: (text, record) => (
                        <span className="text-center">
                            {new Date(record.create).toDateString()}
                        </span>
                    ),
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

export default TableRefundOrders;

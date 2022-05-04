import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import Link from 'next/link';
import { relativeTimeRounding } from 'moment';
import { Button } from 'antd';
class TableInbox extends Component {
    render() {
        /*
            You can change data by API
            example: https://ant.design/components/table/
        */
       
       
        let tableData = [];
        let tableColumn = [];


    
            tableColumn = [
                {
                    title: 'From',
                    dataIndex: 'From',
                    rowKey: 'From',
                    key: 'From',
                    width: '180px',
                },
                {
                    title: 'Subject',
                    dataIndex: 'Contact Name',
                    rowKey: 'Contact Name',
                    width: '80px',
                },
                {
                    title: 'Type',
                    dataIndex: 'address_id',
                    rowKey: 'address_id',
                    width: '150px'
                },
                {
                    title: 'Date',
                    dataIndex: 'payment_method',
                    rowKey: 'payment_method',
                    key: 'payment_method',
                },
                {
                    title: 'Actions',
                    dataIndex: 'action',
                    rowKey: 'action',
                    key: 'action',
                    render: (text, record) => {
                        return (
                            <Button type="primary" >
                                View
                            </Button>
                        );
                    },
                    width: '120px',
                }
            ]
            tableData = [];
      
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

export default TableInbox;

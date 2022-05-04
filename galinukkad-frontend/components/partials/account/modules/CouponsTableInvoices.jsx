import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';

class CouponsTableNotifications extends Component {

    render() {
        /* 
            You can change data by API
            example: https://ant.design/components/table/
        */
       const { notifications, markAs , deleteNotification } = this.props;

        
        const tableColumn = [
            {
                title: 'Sr No.',
                dataIndex: 'srno',
                key: 'srno',
                width: '100px'
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Discount',
                dataIndex: 'description',
                key: 'description'
            },
        ];
        return <Table className="table-responsive" columns={tableColumn} dataSource={notifications} />;
    }
}

export default CouponsTableNotifications;

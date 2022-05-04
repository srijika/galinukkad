import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';

class TableNotifications extends Component {

    render() {
       const { notifications, markAs , deleteNotification } = this.props;
        console.log(notifications,);
        
        const tableColumn = [
            {
                title: 'Date Create',
                dataIndex: 'create'
            },
            {
                title: 'Message',
                dataIndex: 'message'
            },
            {
                title: 'Notification Type',
                dataIndex: 'notification_type'
            },
            // {
            //     title: 'Status',
            //     dataIndex: 'status',
            //     render: (text, record) => {
            //         return (
            //         <span className="text-center"
            //         style={{
            //             color:record.status === 1?'green':'red'
            //         }}
            //         >{record.status === 1?'Read':'Unread'} </span>);
            //     },
            //     key: 'status'
            // },
            // {
            //     title: 'Action',
            //     key: 'action',
            //     width: '200px',
            //     render: (text, record) => {
            //         return (
            //             <span>
            //                 <a onClick={() => markAs(record._id, record.status)} >Mark as {record.status == 0?"Read":"Unread" } </a>
            //                 <Divider type="vertical" />
            //                 <a onClick={() => deleteNotification(record._id)} >Delete</a>
            //             </span>
            //         );
            //     },
            // },
        ];
        return <Table columns={tableColumn} dataSource={notifications} />;
    }
}

export default TableNotifications;

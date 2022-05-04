import React, { Component } from 'react';
import { Table, Divider, Tag, notification } from 'antd';
import Link from 'next/link';
import { relativeTimeRounding } from 'moment';
import { Button } from 'antd';
import  Repository from '../../../../repositories/Repository';
import jwt from 'jwt-decode'
import { ToastContainer, toast , Flip } from 'react-toastify';


class TableTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData:[]
        };
    }

    componentDidMount() {
        this.getMyTicket();
    }

    getMyTicket = async () =>{
        const user = jwt(localStorage.getItem('accessToken'));
        let val = {
            seller_id: user._id,
            limit: 10,
            page: 0
        }
        await Repository.post('/get/seller/manage-caselog', val).then((response) => {
            if (response.data.status) {
                this.setState({ tableData: response.data.ManageCaselog });
            }else{
                notification['warning']({message: '', description: response.data.msg || response.data.message || response.data.err })
            }
        }).catch((err) => {
            // notification.error({ message: 'Ticket Create Failed' });
    toast.error('Ticket Create Failed');

        });
    }


    render() {
        let tableColumn = [];

            tableColumn = [
                {
                    title: 'Ticket ID',
                    dataIndex: '_id',
                    width: '80px',
                },
                {
                    title: 'Title',
                    dataIndex: 'title',
                    width: '120px',
                },
                // {
                //     title: 'Replay',
                //     dataIndex: 'replay',
                //     width: '120px',
                //     render: (val, data) => {
                //         return data.replay == '' ? '-' : data.replay;
                //     }
                // },
                {
                    title: 'Status',
                    width: 200,

                    dataIndex: 'status',
                    render: (val, data) => {
                        return data.status ? <span style={{ color: "green" }}>open</span> : <span style={{ color: "red" }}>closed</span>;
                    }
                    
                }

                ,  {
                    title: <strong>Action</strong>,
                    width: 200,
                    render: (val, data) => {
                      return (
                      
                       
                             <Link href="/support/[pid]" as={`/support/${data._id}`}>
                        <a className="btn_box">
                          <div className="btn btn-secondary btn-lg text-white">
                            Ticket Query
                          </div>
                        </a>
                        </Link>

                      );
                    }
                  },
            ]
      
        return (
            <div style={{overflow:"scroll"}} >
            <Table
                columns={tableColumn}
                dataSource={this.state.tableData}
                rowKey={record => record.id}
            />
            </div>
        );
    }
}

export default TableTicket;

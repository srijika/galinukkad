import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import { Select } from 'antd';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm, notification, message, Upload} from 'antd';
import {CheckOutlined, DeleteOutlined, FileDoneOutlined , EyeOutlined , CommentOutlined} from '@ant-design/icons';
//import styles from './login.less';
import UploadFile from './action/uploadFile'

import axios from 'axios'
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const baseUrl = process.env.REACT_APP_ApiUrl;


class SellerIndex extends React.Component {
   constructor(props) {
    super(props);
	this.state = { limit:25, current:1, sortBy:'asc', addModel:false, inactive:false, searchText:'', loader:false, detail:'', count:0, Addcount: 0, listData: []}
	setTimeout(()=>document.title = 'Seller List', 100);
  }
	componentDidMount(){
		this.ListFun();
	}
	
	ListFun=()=>{
		let search = 'page='+(this.state.current-1)+"&limit="+this.state.limit+"&inactive="+this.state.inactive+"&searchText="+this.state.searchText+"&sortBy="+this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))
		
		//let searchval = {page:this.state.current-1, limit:this.state.limit, inactive:this.state.inactive, searchText:this.state.searchText, sortBy:this.state.sortBy, role:"CUSTOMER"}
		let searchval = {limit:this.state.limit, page:this.state.current - 1, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy, role:"SELLER"}
		//this.setState({loader:true})
		this.props.dispatch({type: 'seller/getList',  payload: searchval,});
	  }
  
	ShowSizeChange=(current, size)  => this.setState({limit:size},()=>this.ListFun());
	switchFun=(val)  => this.setState({inactive:val},()=>this.ListFun());	
	ChangeOrder=(val)  =>this.setState({sortBy: this.state.sortBy === 'asc' ? 'desc':'asc'},()=>this.ListFun());
	paginationFun=(val)=> this.setState({current: val.current},()=>this.ListFun());
	
	searchVal=(val)=>{
		this.state.searchText = val
		const resultAutos = this.props.seller.list.data.filter((auto) => auto.username.toLowerCase().includes(val.toLowerCase()) || auto.email.toLowerCase().includes(val.toLowerCase()))
		this.setState ({ listData: resultAutos })
	}
	
	createCat=(val)=>{
		console.log(val);
	}
	
	deleteItem=(id)=>{
		console.log(id);
		let val = {_id:id}
		this.props.dispatch({type: 'seller/deleteItem', payload: val});
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		let del = this.props.seller.del;
        if ( del.count > this.state.count && del.status) {
            this.setState({count:del.count, btndis:false})
			return true
        }else if ( del.count > this.state.count && !del.status) {
			this.setState({count:del.count, btndis:false})
		}
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.ListFun();
        }
    }	
	

	handleDeactiveSeller = async (data) => {
		let list = this.state.listData;
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.deactive = !item.deactive;
			}
			return item;
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/user/status`, {id: data});
	}

	handleMaintenanceMode = async (data) => {
		let list = this.state.listData;
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.maintenance_mode_for_user = !item.maintenance_mode_for_user;
			}
			return item;
		})
		this.setState({ listData: list_update })

		await axios.post(`${baseUrl}/maintenance-mode`, {id: data});
	}
	
	// upload excel file for upload users------------------------

	SelectedFile = (val) => {
		// console.log(val.file.originFileObj);
		const formData = new FormData();
		formData.append('file', val.file.originFileObj);
		//this.props.dispatch({type: 'product/uploadExcelFile',  payload: val.file.originFileObj,});
		fetch(baseUrl + '/import-users', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				Accept: 'application/json'
			},
			body: formData
		}).then(async (res) => {
			console.log("file uploaded")
			const data = await res.json();
			console.log(data)
			if (data.status) {
				message.success("Users Uploaded Successfully")
				this.ListFun();
			}
			else {
				message.error(data.message)
			}
			this.setState({ fileModel: false });
		})
			.catch(function () {
				console.log("error upload");
			});
	}

	// upload excel file for upload users------------------------

	// download existing user from Db into Excel format----------------------

	downloadFile = () => {
		fetch(baseUrl + '/getallusersExport', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				Accept: 'application/json'
			}
		}).then(async (res) => {
			const data = await res.json();
			//console.log('my daa',data);
			var file_path = 'sellers.xlsx';
			var a = document.createElement('A');
			a.href = data.data.fileUrl;
			a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	// download existing user from Db into Excel format----------------------
	

	render(){
	console.log(this.props)
	const {inactive, limit, searchText, addModel, detail, fileModel} = this.state;
	const {seller} = this.props;
	if(this.state.searchText == '') {
		 this.state.listData = seller.list ? seller.list.data:[];
	}
	const total = seller.list //? seller.list.total:0;
	const totalActive = 0 //list ?  list.totalActive : 0;
	const columns = [
	  {
		title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Seller Name <i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
		dataIndex: 'username',
		render:(val,data)=> <div className={data.isActive ?"":'danger-text'}>{val}</div>
	  },
	  { title:<strong>Email</strong>, dataIndex: 'email',},
	  { title:<strong>Business Verified</strong>, dataIndex: 'isBussinessVerified', render:(val,data)=> val?'Yes':'No'},
	  { title:<strong> Status </strong>, dataIndex: 'deactive', render:(val,data)=> 
	  <div>
		 <Popconfirm title={`Are you sure you want to ${data.deactive ? "activate" : "deactivate"} this seller?`} onConfirm={e=> {this.handleDeactiveSeller(data._id)}} okText="Yes" cancelText="No" >
			 <Button type="primary" > {data.deactive ? "Activate" : "Deactivate"}  </Button>
		 </Popconfirm>
	  </div>
 },

 { title:<strong> Maintenance Mode </strong>, dataIndex: 'maintenance_mode_for_user', render:(val,data)=> 
	  <div>
		  
		  {console.log('data.maintenance_mode_for_user')}
		  {console.log(data.maintenance_mode_for_user)}
		 <Popconfirm title={`Are you sure you want to ${data.maintenance_mode_for_user ? 'remove' : 'add'} maintenance mode to this seller?`} onConfirm={e=> {this.handleMaintenanceMode(data._id)}} okText="Yes" cancelText="No" >
			 <Button type="primary" > {data.maintenance_mode_for_user ? 'False' : 'True'}  </Button>
		 </Popconfirm>
	  </div>
 },

	  { title:<strong>Action</strong>, width:250, 
		render:(val,data)=> 
		<div>
			<Button title="Ticket Query" onClick={() => { 
				
                this.props.history.push(`/seller/${data._id}/queries`) }}
               className="mr-2 mb-2 mobile-btn"><CommentOutlined /></Button>
			<Button className="mr-2 mb-2 mobile-btn  mobile-btn" type="ghost" onClick={() => this.props.history.push('/transaction/seller/' + data._id) }><FileDoneOutlined /></Button>&nbsp;
			<Button type="primary" title="View Seller Details" onClick={()=>this.props.history.push('/seller/edit/'+data._id)}><EyeOutlined /></Button>&nbsp;
			<Popconfirm title="Are you sure delete this seller?" onConfirm={e=> {this.deleteItem(data._id)}} okText="Yes" cancelText="No" >
				<Button title="Are you sure delete this seller" type="danger" ><DeleteOutlined /></Button>
	  		</Popconfirm>
	  </div>
	  },
	];
  return (
	<div>
		<Apploader show={this.props.loading.global}/>
		<Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
			<Col>
				<Search placeholder="Search..." onChange={(e)=>this.searchVal(e.target.value)} value={this.state.searchText}
				loading={this.props.submitting}	/>
			</Col>
			<Col>
				<Button type="primary" onClick={() => this.downloadFile()}>Download Excel</Button>&nbsp;
				<Button type="primary" onClick={() => this.setState({ fileModel: true })}>Upload Excel</Button>&nbsp;
				{/* <Button type="primary" onClick={() => this.props.history.push('/users/add')}>Add</Button> */}
			</Col>
		</Row>
		
		<div className="innerContainer">
				<Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
				  <Table columns={columns} dataSource={this.state.listData} 
					onChange={this.paginationFun}
					rowKey={record => record._id}
					pagination={{position: ['bottomLeft'], 
						showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
						responsive:true,
						onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
						pageSizeOptions:['10','25','50','100','250','500'],
					}}
				  />
				</Card>
			</div>
						<UploadFile visible={fileModel} returnData={this.SelectedFile} closeModel={() => this.setState({ fileModel: false })} />

	</div>
  );
	}
};
export default connect(({seller, loading}) => ({
	seller, loading
}))(SellerIndex);
import React, {useState, useEffect} from 'react'
import { Card, Typography, Input, Button, Table, Row, Col, Avatar, message, Modal, Popconfirm } from 'antd';
import axios from 'axios'
import { EyeOutlined, QuestionOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit'
const { Text } = Typography;
const { Search } = Input;
const baseUrl = process.env.REACT_APP_ApiUrl
const { confirm } = Modal;

export default function AttributeList(props) {

	const [attribute, setAttribute] = useState([]);
  const [addModel, setAddModel] = useState(false);
  const [detail, setDetail] = useState("");
  const [searchText, setsearchText] = useState("");



  const searchVals = (val) => {
	getattribute();
	setsearchText(val)

	const resultAutos = attribute.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()))
	console.log("resultAutos______" , resultAutos)
	if(resultAutos.length === 0){
		getattribute();

	}
	if(val === '' ){
		getattribute();

	}

	setAttribute(resultAutos);

	// this.state.searchText = val
	
	// const resultAutos = this.props.subcategory.list.data.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()) || auto.slug.toLowerCase().includes(val.toLowerCase()))
	
	// this.setState({ listData: resultAutos })

}

const searchVal = (val) => {
	setsearchText(val)
    const resultAutos = attribute.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()))
	if(resultAutos.length === 0){
		getattribute();

	}
	if(val === '' ){
		getattribute();

	}

	setAttribute(resultAutos);



}



	useEffect(() => {
		getattribute();
		setTimeout(() => document.title = 'Attribute List', 100,);

	}, [])

	const getattribute = async () => {
		const res = await axios.post(`${baseUrl}/list/attribute`);
    let attribute =  res.data.attribute;
    console.log('attribute datasik ');
    console.log(res.data);
		setAttribute(attribute);
	}

	const handleDelete = async (id) => {
		confirm({
			title: 'Are you sure you want to delete this item?',
			icon: <ExclamationCircleOutlined />,
			//content: 'Some descriptions',
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return deleteItemFun(id) },
			onCancel() { console.log('Cancel'); },
		});
	}

	const deleteItemFun = async (id) => {
		let attributeData = attribute.filter((data) => {
			return data._id !== id
		});
		setAttribute(attributeData);
		const res = await axios.post(`${baseUrl}/delete/${id}/attribute`);
	}
	const deleteCat = async id => {
		let attributeData = attribute.filter((data) => {
			return data._id !== id
		});
		setAttribute(attributeData);
		const res = await axios.post(`${baseUrl}/delete/${id}/attribute`);
		console.log("res" , res)
		console.log("res" , res.status)
		if(res.status === 200) {
			message.success("Attribute deleted!", 5);
		}

	}


	const EditDataFun = (data) => {
	
		setDetail(data)
		setAddModel(true);
	}


	const AddModelDataFun = () => {
	
		setDetail('')
		setAddModel(true);
	}
	
  
	const columns = [
		
		{ title: <strong>Attribute Name</strong>, width: 100, dataIndex: 'name' },
		{ title: <strong>Action</strong>, width: 100, render: (val, data) => 
					<div>
						<Button type="primary" className="ant-btn-sm" title="Edit" onClick={() => EditDataFun(data)} ><EyeOutlined  /></Button>&nbsp;

						<Popconfirm title="Are you sure delete this attribute?" onConfirm={e => { deleteCat(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" className="ant-btn-sm"  ><DeleteOutlined /></Button>
					
					</Popconfirm>
						{/* <Button type="danger" className="ant-btn-sm" title="Delete" onClick={() => { handleDelete(data._id) } }><DeleteOutlined  /></Button> */}
				</div>
		},
  ];


  const updateDataToChild = (res) => {

	console.log(res);
  }

	return (
		<div>
      

		
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
					<Search placeholder="Search..." onChange={(e) =>  {
						searchVal(e.target.value)
						}
						} value={searchText}
						 	/>
					</Col>
					<Col>
						{/*<span style={{color:"lightgrey",marginRight:"17px"}}>Show Inactive</span>
				<Switch className={styles.switchBtn} onChange={this.switchFun} checked={inactive} /> */}
					  <Button type="primary" onClick={() => AddModelDataFun()}>Add</Button>
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns}  
							dataSource={attribute}
							// onChange={this.paginationFun} 
							rowKey={record => record._id}
							onRow={ (record) => {
								return {
									// onClick: () => this.props.history.push('/products/edit/' + record._id)
								};
							}}
							pagination={{
								position: ['bottomLeft'],
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['10','25','50','100','250','500'],
							}}
						/>
					</Card>
					
				</div>
				<AddEdit visible={addModel} closeModel={() => setAddModel(false) } detail={detail} updateDataToChild={updateDataToChild} />
				
		</div>
	)
}

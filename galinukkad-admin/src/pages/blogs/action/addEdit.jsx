import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Checkbox, Button, Select } from 'antd';
import { LeftOutlined} from '@ant-design/icons';
import TextEditor from '../../../components/sharing/text-editor'
import { connect } from 'dva'; 
import HTMLDecoderEncoder from 'html-encoder-decoder';

const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl
const AddEditPages = props => {
	const [form] = Form.useForm();
	let idAdd = props.match.params.id === undefined ? true : false

	const { dispatch, blogsCategory } = props;
	const [Inquiry, setInquiry] = useState('');
	const [PageId, setPageId] = useState('');
	const [errorDes, seterrorDes] = useState('');
	const [errorDesLength, seterrorDesLength] = useState('');

	const [errorImg, seterrorImg] = useState('');



	// const catlist = ["Life Style" , "Technology" , "Entertaiment" , "Business"]
	const [image, setImage] = useState()
	const [showImage, setShowImage] = useState()

	let catlist = [];
	if(props.blogsCategory.list !== undefined){
		let data = props.blogsCategory.list.result
		catlist = data
	}
	

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		props.dispatch({ type: 'blogsCategory/blogsCategoryList' });
		// props.dispatch({ type: 'category/categoryList' });
		
		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])



	










	
	const DetailFun = (id) => {
		props.dispatch({ type: 'blogs/blogsDetail', payload: id });
	}


	const imageFun = (e) => {
		setImage(e.target.files[0])
		setShowImage(URL.createObjectURL(e.target.files[0]));
	}

	

	useEffect(() => {
		let unmounted = false;

		// if(props.blogs.add){
		// 	dispatch({ type: 'blogs/clearAction'});
		// 	props.history.push('/blogs');
		// }
		
		// if(props.blogs.edit){
		// 	dispatch({ type: 'blogs/clearAction'});
		// 	props.history.push('/blogs');
		// }

		
		if(props.blogs.add){
			dispatch({ type: 'blogs/clearAction'});
			console.log(props.blogs.add.message)
			if(props.blogs.add.message){
				props.history.push('/blogs');
			
			}else{
				setShowImage('')
				setInquiry('')
				setImage('')
				
			}
		}
		
		if(props.blogs.edit){
			dispatch({ type: 'blogs/clearAction'});
			console.log("props")
			console.log("props.blog",props.blogs.edit)
			if(props.blogs.edit.message === false){
				setShowImage('')
				setInquiry('')
				setImage('')
				alert('hy')
			
			}

if(props.blogs.edit.message){
	props.history.push('/blogs');

}
else{
	setShowImage('')
	setInquiry('')
	setImage('')


}

		}


		if(props.blogs && props.blogs.detail && props.blogs.detail.status){
			let data = props.blogs.detail.data[0];
console.log('data' , data);

			console.log("props.blogs_________" ,props.blogs)

			setPageId(data._id)
			setInquiry(HTMLDecoderEncoder.decode(data.html));
			console.log(data.html)
			form.setFieldsValue({
				['title']: data.title, 
				['category_id']: data.category_id,
				['meta_title']: data.meta_title,
				['meta_description']: data.meta_description,
				['isActive']: data.status === "true" ? true : false,
			})
			setShowImage(`${baseUrl}/blogs/${data.image}`);
		}else {
			form.resetFields();
		}

		return () => { unmounted = true; }
	}, [props.blogs])

	const cancelFun = () => {
		form.resetFields();
		props.history.push('/blogs');
	}

	const onFinish = val => {



		if(HTMLDecoderEncoder.encode(Inquiry) === '' || HTMLDecoderEncoder.encode(Inquiry) === '&#x3C;p&#x3E;&#x3C;/p&#x3E;'){
			seterrorDes('Description is required')
			if(image != undefined && image != "" && image != null || !idAdd) {
				val['image'] = image;
				seterrorImg('')
	
			}else{
				seterrorImg('Image is required')
				return
				
			}

			if(errorDesLength > 1000){
				return;
			}
			return;
		}else{
			if(image != undefined && image != "" && image != null || !idAdd) {
				val['image'] = image;
				seterrorImg('')
	
			}else{
				seterrorImg('Image is required')
				return
				
			}
			seterrorDes('')

		}


		if(image != undefined && image != "" && image != null) {
			val['image'] = image;
			seterrorImg('')

		}

		if(errorDesLength > 1000){
			return;
		}



		val.html = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);



		
		const formData = new FormData();
		formData.append('title', val.title);
		formData.append('category_id', val.category_id);
		formData.append('html', val.html);
		formData.append('meta_description', val.meta_description);
		formData.append('meta_title', val.meta_title);
		formData.append('isActive', val.isActive);
		if(image != undefined && image != "" && image != null) { 
		formData.append('image', val.image);
		}

		if (props.match.params.id) {
			formData.append('_id', PageId);
			dispatch({ type: 'blogs/EditBlogs', payload: formData });
		}else {
			console.log('val' , val)
			dispatch({ type: 'blogs/AddBlogs', payload: formData });
		}
	}

	const convertUndefinedObjectKeysToEmptyString = (object) => {
		var output = {};
		for(let i in object) {
			if(!object[i]) {
				output[i] = "";
			} else {
				output[i] = object[i];
			}	
		}
		return output;
	}

	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/blogs')} /> 
			{ idAdd ? 'Add Blog' : 'Edit Blog'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			
			<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Field required!' },{ max: 50, message: 'Title must not be greater than 50 characters.' }]}  >
							<Input placeholder="Title" />
						</Form.Item>
					</Col>	

					<Col sm={24} md={12}>
						<Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'This field is required!' }]}>
							<Select placeholder="Category">
								{catlist.map((item, index) => <Select.Option key={index} value={item._id}>{item.category_name}</Select.Option>)}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				

				
				<Row gutter={15}>
					<Col sm={24} md={24}>
						<Form.Item name="html"  
						// label="html"  
						label={<>	<label for="loc_info_title" class="ant-form-item-required required_filed" title="Title">Description</label> </>} 
						// rules={[{ required: false, message: 'This field is required!' }]} 
						>
							<TextEditor returnVal={val =>{ 
								if(HTMLDecoderEncoder.encode(val) === '' || HTMLDecoderEncoder.encode(val) === '&#x3C;p&#x3E;&#x3C;/p&#x3E;'){
									seterrorDes('Description is required')

								}else{
									seterrorDes('')

								}

								seterrorDesLength(val.length)
						
								setInquiry(val)}} data={Inquiry}/>
							<div class="ant-form-item-explain ant-form-item-explain-error"><div role="alert">

{errorDesLength > 1000 && 'you cross the limit of description'}

							{errorDes}
							
							</div></div>
						</Form.Item>
					</Col>
				</Row>


				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="meta_description"
						//  label="Meta Description" 
						 label={<><span> Meta Description </span> 	</>} 
						 rules={[{ required: false },{ max: 100, message: 'Meta Description must not be greater than 100 characters.' }]}
						 >
							<Input placeholder="Meta Description" />
						</Form.Item>
					</Col>

					<Col sm={24} md={12}>
						<Form.Item name="meta_title"
						 rules={[{ required: false },{ max: 100, message: 'Meta Title must not be greater than 100 characters.' }]} label={<><span> Meta Title </span> 	</>} 
						>
						
							<Input placeholder="Meta Title" />
						</Form.Item>
					</Col>
				</Row>

				<Col sm={24} md={12}>
						<Form.Item   
							label={<>	<label for="loc_info_title" class="ant-form-item-required required_filed" title="Title">Image</label> </>} 
						>
						<input type="file" name="image" onChange={(e) => { 

if(e.target.files.length !== 0){
	seterrorImg('')
}else{
	seterrorImg('Image is required')
}

							imageFun(e) 
							}}  />
					<img src={showImage} style={{ height: '60px', width: "60px" }} />
					<div class="ant-form-item-explain ant-form-item-explain-error"><div role="alert">
{errorImg}
</div></div> 
						</Form.Item>
					</Col>
				

				{/* <div style={{ marginTop: "10px" }}>
					<input type="file" name="image" onChange={(e) => { imageFun(e) }}  />
					<img src={showImage} style={{ height: '60px', width: "60px" }} />
				</div> */}


				<Form.Item  name="isActive" valuePropName="checked" >
                  <Checkbox>isActive</Checkbox>
              </Form.Item>



				<Form.Item className="mb-0">
					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
					<Button type="primary" className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
				</Form.Item>
		
				
			</Form>

		</Card>
	)
};

// export default connect(({ blogs, global, loading }) => ({
// 	blogs: blogs,
// 	global: global
// }))(AddEditPages);


export default connect(({ blogs, global,blogsCategory, loading }) => ({
	blogs: blogs,
	global: global ,
	blogsCategory: blogsCategory

}))(AddEditPages);














// import React, { useState, useEffect, useRef, Fragment } from 'react';
// import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
// import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
// import UploadImages from '../../../components/sharing/upload-images'
// import CropImage from '../../../components/sharing/crop-image'
// import TextEditor from '../../../components/sharing/text-editor'
// import moment from 'moment';
// import { connect } from 'dva'; 
// import styles from './style.less'; 
// import { getSubCatbyCategory } from '../../../services/api'
// // import { RMIUploader } from "react-multiple-image-uploader";
// import MultiImageInput from 'react-multiple-image-input';
// import HTMLDecoderEncoder from 'html-encoder-decoder';

// const { Text } = Typography;
// const { TextArea } = Input;
// const timestemp = (new Date()).getTime();
// const { RangePicker } = DatePicker;
// const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
// const baseUrl = process.env.REACT_APP_ApiUrl
// const AddEditPages = props => {
// 	const [form] = Form.useForm();
// 	const { dispatch , blogsCategory} = props;
// 	const [Inquiry, setInquiry] = useState('');
// 	const [PageId, setPageId] = useState('');
// 	const [count, setCount] = useState(0);
// 	const [blogcate, setBlogCate] = useState({})
	



// 	// const catlist = ["Life Style" , "Technology" , "Entertaiment" , "Business"];
// 	let catlist = [];
// 	if(props.blogsCategory.list !== undefined){
// 		let data = props.blogsCategory.list.result
// 		catlist = data
// 	}
	

// 	useEffect(() => {
// 		let unmounted = false;
// 		window.scroll(0, 0);
// 		props.dispatch({ type: 'blogsCategory/blogsCategoryList' });
	
	
		
// 		if (props.match.params.id) {
// 			DetailFun(props.match.params.id)
// 		} else {
// 			form.resetFields();
// 		}
// 		return () => { unmounted = true; }
// 	}, [dispatch])
	
// 	const DetailFun = (id) => {
// 		props.dispatch({ type: 'blogs/blogsDetail', payload: id });
		
// 	}

// 	useEffect(() => {
// 		let unmounted = false;

// 		if(props.blogs.add){
// 			dispatch({ type: 'blogs/clearAction'});
// 			console.log(props.blogs.add.message)
// 			if(props.blogs.add.message){
// 				props.history.push('/blogs');
			
// 			}
// 		}
		
// 		if(props.blogs.edit){
// 			dispatch({ type: 'blogs/clearAction'});
// 			console.log("props")
// 			console.log(props.blogs.edit.message)

// 			console.log(props)
// if(props.blogs.edit.message){
// 	props.history.push('/blogs');

// }

// 		}
		
// 		if(props.blogs && props.blogs.detail && props.blogs.detail.status){
// 			let data = props.blogs.detail.data[0];
// console.log(data)

// 			setPageId(data._id)
// 			setInquiry(HTMLDecoderEncoder.decode(data.html));
// 			console.log(data.html)
// 			form.setFieldsValue({
// 				['title']: data.title, 
// 				['category']: data.category,
// 				['meta_title']: data.meta_title,
// 				['meta_description']: data.meta_description,

// 				['isActive']: data.status === "true" ? true : false,

// 			})
// 		}

	

// 		return () => { unmounted = true; }
// 	}, [props.blogs])

// 	const cancelFun = () => {
// 		form.resetFields();
// 		props.history.push('/blogs');
// 	}

// 	const onFinish = val => {
// 		val.html = HTMLDecoderEncoder.encode(Inquiry);
// 		val = convertUndefinedObjectKeysToEmptyString(val);
// 		console.log(val)





// 		if (props.match.params.id) {
// 			val._id = PageId;
	
// 			dispatch({ type: 'blogs/EditBlogs', payload: val });
// 		}else {
// 			dispatch({ type: 'blogs/AddBlogs', payload: val });
// 		}
// 	}

// 	const convertUndefinedObjectKeysToEmptyString = (object) => {
// 		var output = {};
// 		for(let i in object) {
// 			if(!object[i]) {
// 				output[i] = "";
// 			} else {
// 				output[i] = object[i];
// 			}	
// 		}
// 		return output;
// 	}

// 	return (
// 		<Card title={<span><LeftOutlined onClick={() => props.history.push('/blogs')} /> 
// 			{ props.blogs.detail ? 'Edit Blog' : 'Add Blog'}</span>} style={{ marginTop: "0" }}>

// 			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			
// 				<Row gutter={15}>
// 					<Col sm={24} md={12}>
// 						<Form.Item name="title" label="Title" rules={[{ required: false, message: 'Field required!' },]}  >
// 							<Input placeholder="Title" />
// 						</Form.Item>
// 					</Col>

// 					<Col sm={24} md={12}>
// 								<Form.Item name="category" label="Category" rules={[{ required: false, message: 'This field is required!' }]}>

// 									<Select placeholder="Category">
// 										{catlist.map((item, index) => <Select.Option key={index} value={item.category_name}>{item.category_name}</Select.Option>)}
// 									</Select>

// 								</Form.Item>
// 							</Col>
// 				</Row>

				

				
// 				<Row gutter={15}>
// 					<Col sm={24} md={24}>
// 						<Form.Item name="html" label="html"  >
// 							<TextEditor returnVal={val => setInquiry(val)} data={Inquiry}/>
// 						</Form.Item>
// 					</Col>
// 				</Row>


// 				<Row gutter={15}>
// 					<Col sm={24} md={12}>
// 						<Form.Item name="meta_description" label="Meta Description"  >
// 							<Input placeholder="Meta Description" />
// 						</Form.Item>
// 					</Col>

// 					<Col sm={24} md={12}>
// 						<Form.Item name="meta_title" label="Meta Title"  >
// 							<Input placeholder="Meta Title" />
// 						</Form.Item>
// 					</Col>
// 				</Row>

// 				<Form.Item  name="isActive" valuePropName="checked" rules={[{ required: false }]}>
//                   <Checkbox>isActive</Checkbox>
//               </Form.Item>

// 				<Form.Item className="mb-0">
// 					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
// 					<Button type="primary" className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
// 				</Form.Item>
			
		

				
// 			</Form>

// 		</Card>
// 	)
// };

// export default connect(({ blogs, global,blogsCategory, loading }) => ({
// 	blogs: blogs,
// 	global: global ,
// 	blogsCategory: blogsCategory

// }))(AddEditPages);





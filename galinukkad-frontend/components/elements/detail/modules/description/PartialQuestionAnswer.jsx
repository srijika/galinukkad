import React, {Component} from 'react';
import './css/PartialSellerReview.css';
import { Row, Col, Form, Input , notification } from 'antd';
import  Repository from '../../../../../repositories/Repository.js';
import jwt from 'jwt-decode'
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class PartialQuestionAnswer extends  Component {
		formRef = React.createRef();		
    
    state = {
        QAnss:[],
        Questions:'',
        total : 0,
        limit: 10,

    }

    componentDidMount() {
        this.fetchReviews();
    }

    fetchReviews(pageNo=0) {
        const {productId} = this.props;
        Repository.get('get-product-ques-ans-by-product-id?product_id='+productId )
        .then((res) => {
            if(res.data.status) {
                const data = res.data.data;
                this.setState({ QAnss: [...data.quesAns]})
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    updateQuestions = (event) => {
        this.setState({ Questions: event.target.value})
    }

    submitQAns = () =>{
        const {productId} = this.props;

        if(this.state.Questions.length > 0){
            let user = null;
             try{
                 user = localStorage.getItem('accessToken');
                
             }catch(err){
                console.log(err);
             } 
            if(user){
                user = jwt(user);
            
                let val = {
                    "question": this.state.Questions,
                    "answer": "",
                    "user_id": user._id,
                    "product_id": productId
                };
    
                Repository.post('create-product-ques-ans', val )
                .then((res) => {
                    if(res.data.status) {
                        this.fetchReviews();
                        this.setState({ Questions: ""})
                        toast.success('Question send successfully!');
                    }
                }).catch((error) => {
                    console.log(error);
                  
                })
            }else{
                toast.error('Please Login First!');
            }

		this.formRef.current.resetFields();


        }else{
            // notification['warning']({message: 'Error', description: 'Please write question first!' });
    toast.error('Please write question first!');

        }
    }


    
    render() {
    return (
        <div>
			<Form ref={this.formRef} className="ps-form--account-setting ps-form--edit-address" layout="vertical" onFinish={this.submitQAns}>

            <Row>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  ">
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input your Question!' },{ max: 50, message: 'Question must not be greater than 50 characters.' },]} >
                            <Input defaultValue={this.state.name} placeholder="Your Question" onChange={(e)=>{ this.updateQuestions(e) }} />
                    </Form.Item>
                    <div className="form-group submit">
                        <button className="ps-btn" type="submit">Submit</button>
                    </div>
                </div>
            </Row>

            </Form>
            <Row>
                {this.state.QAnss && this.state.QAnss.length > 0 ? this.state.QAnss.map((QAns, index) => (
                    <Col span="24" key={index}>
                        <div className="app-review-card">
                            <strong>Q. {QAns.question} </strong><br/>
                            <span>A. {QAns.answer}</span>
                        </div>
                    </Col>
                )):<p>No Questions Available</p>}
            </Row>
        </div>
    );
    }
}

export default PartialQuestionAnswer;

import React from 'react';
import { connect } from 'react-redux';
import { submitFormDetails } from '../../../store/contact/action';
import { Form, Input } from 'antd';

class ContactVendorForm extends React.Component {
    constructor(props) {
        super(props);
		this.formRef = React.createRef();
    }

    handleSubmit = values => {
        this.props.dispatch(submitFormDetails({ ...values }));
        setTimeout(() => {
            this.formRef.current.setFieldsValue({['name']: '', ['email']: '', ['message']: '', ['subject']: ''});
        }, 800);        
    };

    render() {

        return (
            <div className="ps-contact-form">
                <div className="container">
                    <Form ref={this.formRef} className="ps-form--contact-us" onFinish={this.handleSubmit.bind(this)}>
                        <h3>Still have more questions? Feel free to contact us.</h3>
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                                <div className="form-group">
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your name!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Name *"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                                <div className="form-group">
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Email!',
                                            },
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Email *"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                                <div className="form-group">
                                    <Form.Item
                                        name="subject"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Subject!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Subject *"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                                <div className="form-group">
                                    <Form.Item
                                        name="message"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Message!',
                                            },
                                        ]}>
                                        <Input.TextArea
                                            className="form-control"
                                            type="text"
                                            placeholder="Message *"
                                            row={5}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="form-group submit">
                            <button className="ps-btn">Send message</button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.contact;
};

export default connect(mapStateToProps)(ContactVendorForm);

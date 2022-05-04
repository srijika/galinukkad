import React from 'react';
import { Form } from 'antd';

const ContactVendorForm = () => (
    <div className="ps-contact-form">
        <div className="container">
            <Form className="ps-form--contact-us" onFinish={() => console.log('')}>
                <h3>Still have more questions? Feel free to contact us.</h3>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Name *"
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ">
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Email *"
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Subject *"
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Message"></textarea>
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

export default ContactVendorForm;

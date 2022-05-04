import React, { Component } from 'react';
import validator from 'validator';
import { notification } from 'antd';
import Repository from '../../repositories/Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';


class SubscribePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubscribeShow: true,
            email: ""
        };
    }

    handleCloseSubscribePopup(e) {
        e.preventDefault();
        this.setState({ isSubscribeShow: false });
    }

     handleSubscribeNewsletters (){
        const isEmail = validator.isEmail(this.state.email);

        if(this.state.email !== ""){
        if (isEmail) {
            Repository.post('/newsletter/subscribe',{email:this.state.email})
            .then((res) => {
                console.log("res.data.status" , res.data.status)
                
                if(res.data.status) {
                    this.setState({ isSubscribeShow: false });
                    setTimeout(() =>{
                        toast.success(res.data.message);

                    } , 100)

                } else {

                    // notification.error({message: res.data.message});
    toast.error(res.data.message);

                }
                
            })
            .catch((res) => {
                // notification.error({message:"Some thing went wrong."});
    toast.error("Some thing went wrong.");

            })
        } else {
            // notification.error({message:"Please enter valid email."});
    toast.error("Please enter valid email.");

        }}else{
            // notification.error({message:"Please enter your email."});
    toast.error("Please enter your email.");

            
        }
    }

    handleInputChange = (e) => {
        const email = e.target.value;
        console.log(email)

        this.setState({email:email});
    }

    render() {
        const { isSubscribeShow } = this.state;
        const { active } = this.props;

        if (isSubscribeShow) {
            return (
                <div
                    className={`ps-popup ${active ? 'active' : ''}`}
                    id="subscribe">
                    <div
                        className="ps-popup__content bg--cover"
                        style={{
                            backgroundImage:
                                "url('/static/img/bg/subscribe.jpg')",
                        }}>
                        <a
                            className="ps-popup__close"
                            href="#"
                            onClick={e => this.handleCloseSubscribePopup(e)}>
                            <i className="icon-cross"></i>
                        </a>
                        <form
                            className="ps-form--subscribe-popup"
                            action="/"
                            method="get">
                            <div className="ps-form__content">
                                <h4>
                                    Get <strong>10%</strong> Discount
                                </h4>
                                <p>
                                    Subscribe to the Galinukkad mailing list{' '}
                                    <br /> to receive updates on new arrivals,
                                    special offers
                                    <br /> and our promotions.
                                </p>
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Email Address"
                                        onChange={this.handleInputChange}
                                    />
                                    <button className="ps-btn" onClick={(event) => {event.preventDefault();this.handleSubscribeNewsletters()}}>
                                        Subscribe
                                    </button>
                                </div>
                                <div className="ps-checkbox">
                                    <input
                                        className="form-control"
                                        type="checkbox"
                                        id="not-show"
                                        name="not-show"
                                        
                                    />
                                    {/* <label htmlFor="not-show">
                                        Don't show this popup again
                                    </label> */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
        } else {
            return '';
        }
    }
}

export default SubscribePopup;

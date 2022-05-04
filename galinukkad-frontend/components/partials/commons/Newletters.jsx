import React , { useState } from 'react';
import validator from 'validator';
import { notification } from 'antd';
import Repository from '../../../repositories/Repository';
import { ToastContainer, toast , Flip } from 'react-toastify';


const Newsletters = ({ layout }) => {
     const [state,setState] = useState({
         email:''
     });
    
     const handleSubscribeNewsletters = () => {
        const isEmail = validator.isEmail(state.email);

        if(state.email !== ""){
        if (isEmail) {
            Repository.post('/newsletter/subscribe',{email:state.email})
            .then((res) => {
                
                if(res.data.status) {
                    // notification.success({message:res.data.msg || res.data.message});
    toast.success({message:res.data.msg || res.data.message});

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

    const handleInputChange = (e) => {
        const email = e.target.value;
        setState({email:email});
    }
    return (<section className="ps-newsletter">
        <div className={layout && layout === 'container' ? ' container' : 'ps-container'}>
            <form className="ps-form--newsletter my-4" action="do_action" method="post">
                <div className="row">
                    <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="ps-form__left">
                            <h3>Newsletter</h3> 
                            <p>Subscribe to get information about products and coupons</p>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <div className="ps-form__right">
                            <div className="form-group--nest">
                                <input
                                    className="ant-input form-control"
                                    type="email"
                                    placeholder="Email address"
                                    value={state.email}
                                    onChange={handleInputChange}
                                />
                               
                                <button className="ps-btn d-none d-sm-block" onClick={(event) => {event.preventDefault();handleSubscribeNewsletters()}} >
                                Subscribe
                                </button>
                                <button className="ps-btn d-block d-sm-none" onClick={(event) => {event.preventDefault();handleSubscribeNewsletters()}} >
                                <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                                </button>
                                  
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </section>);
};

export default Newsletters;

import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
import validator from 'validator';



const Newsletters = ({ layout }) => 
   {
    const [state,setState] = React.useState({
        email:''
    });

    const handleSubscribeNewsletters = () => {


        const isEmail = validator.isEmail(state.email);
        if (isEmail) {
            axios.post('/newsletter/subscribe',{email:state.email})
            .then((res) => {
                if(res.data.status) {
                    notification.success({message:res.data.msg || res.data.message});
                } else {
                    notification.error({message:res.data.err});
                }
            })
            .catch((res) => {
                notification.success({message:"Some thing went wrong."});
            })
        } else {
            notification.error({message:"Please enter email."});
        }
    }

    const handleInputChange = (e) => {
        const email = e.target.value;
        setState({email:email});
    }

return (<>
<section className="ps-newsletter">
        <div className={layout && layout === 'container' ? ' container' : 'ps-container'}>
            <form className="ps-form--newsletter" action="do_action" method="post">
                <div className="row">
                    <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <div className="ps-form__left">
                            <h3>Newsletter</h3>
                            <p>Subcribe to get information about products and coupons</p>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <div className="ps-form__right">
                            <div className="form-group--nest">
                                <input
                                    className="form-control"
                                    type="email"
                                    placeholder="Email address"
                                    value={state.email}
                                    onChange={handleInputChange}
                                />
                                <button className="ps-btn"  onClick={(event) => {event.preventDefault();handleSubscribeNewsletters()}} >
                                <span className="d-none d-sm-block">Subscribe</span>
                                    <span className="d-block d-sm-none"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></span>
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </section>
</>
)

   }


export default Newsletters;

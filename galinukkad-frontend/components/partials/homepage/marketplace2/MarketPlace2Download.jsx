import React from 'react';

const MarketPlace2Download = () => (
    <div className="ps-download-app">
        <div className="container">
            <div className="ps-block--download-app">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
                        <div className="ps-block__thumbnail">
                            <img src="/static/img/app.png" alt="Galinukkad" />
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
                        <div className="ps-block__content">
                            <h3>Download Galinukkad App Now!</h3>
                            <p>
                                Shopping fastly and easily more with our app. Get a link to download
                                the app on your phone
                            </p>
                            <form
                                className="ps-form--download-app"
                                action="do_action"
                                method="post">
                                <div className="form-group--nest">
                                    <input
                                        className="ant-input form-control"
                                        type="Email"
                                        placeholder="Email Address"
                                    />
                                    <button className="ps-btn">Subscribe</button>
                                </div>
                            </form>
                            <p className="download-link">
                                <a href="#">
                                    <img src="/static/img/google-play.png" alt="Galinukkad" />
                                </a>
                                <a href="#">
                                    <img src="/static/img/app-store.png" alt="Galinukkad" />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default MarketPlace2Download;

import React from 'react';
import Link from 'next/link';
const VendorBanner = () => (
    <div
        className="ps-vendor-banner bg--cover"
    //style={{ backgroundImage: "url('/static/img/users/3.png')" }}
    >
        <div className="leftSideBoxImg">
            <div className="relative-img"><img src="/static/img/users/3.png" /></div>
        </div>
        <div className="ps-vendor-banner">
            {/* <div className="container">
                <div className="row"> */}
            <div className="col-md-6"></div>
            <h2>
                " Galinukkad" Perhaps one of the promising platform to do the business for an young entrepreneur like me, Am seeing the desired response and result."
                        </h2>
            <a target="_blank" className="ps-btn1 ps-btn--lg" href="http://15.207.135.132/#/register">
                Register Now
                        </a>
        </div>
    </div>
);

export default VendorBanner;
/*/vendor/store-list*/
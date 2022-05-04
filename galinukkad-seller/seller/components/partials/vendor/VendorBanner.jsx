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
                <h1>
                    Dhanush- <span>CaffeeMocha</span>
                </h1>
                <p>
                    A complete financial freedom with work life balance made me sail smooth with Galinukkad making me a self-made entrepreneur
                </p>
                <p>
                    I was able to move back to my beloved Chikmagalur and conduct business sitting at home, in front of a computer. As orders keep pouring in, I have now a team of 7 employees and 4 warehouses to store my coffee spice business called CaffeeMocha
                </p>
            </h2>
            <a className="ps-btn1 ps-btn--lg" href="https://seller.galinukkad.com/portal/#/register">
                Register Now
                        </a>
        </div>
    </div>
);

export default VendorBanner;
/*/vendor/store-list*/
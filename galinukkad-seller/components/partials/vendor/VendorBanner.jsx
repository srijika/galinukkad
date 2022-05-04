import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import "./announcement.scss";
const VendorBanner = () => {
  const [announcement, setAnnouncement] = useState();

  useEffect(() => {
    getAnnouncement();
  }, []);

  const getAnnouncement = async () => {
    const res = await axios.post("/get/announcement/for/seller");
    if(res.data.announcement != undefined && res.data.announcement != null) {
      let message = res.data.announcement.message;
      setAnnouncement(message);
    }

  };

  return (
    <>
      {announcement != undefined ? (
        <div style={{ height: "50px", background: "white" }}>
          <section class="section_my">
            <p class="marquee text-styling text_glowing" style={{ color: "black"  }}>
              {announcement}
            </p>
          </section>
        </div>
      ) : (
        ""
      )}

      <div
        className="ps-vendor-banner bg--cover"
        //style={{ backgroundImage: "url('/static/img/users/3.png')" }}
      >
        <div className="leftSideBoxImg">
          <div className="relative-img">
            <img src="/static/img/users/3.png" />
          </div>
        </div>
        <div className="ps-vendor-banner">
          {/* <div className="container">
                <div className="row"> */}
          <div className="col-md-6"></div>
          <h2>
            <h1>
              Dhanush- <span>CaffeeMochas</span>
            </h1>
            <p>
              A complete financial freedom with work life balance made me sail
              smooth with Galinukkad making me a self-made entrepreneur
            </p>
            <p>
              I was able to move back to my beloved Chikmagalur and conduct
              business sitting at home, in front of a computer. As orders keep
              pouring in, I have now a team of 7 employees and 4 warehouses to
              store my coffee spice business called CaffeeMocha
            </p>
          </h2>
          <a
            className="ps-btn1 ps-btn--lg"
            href="https://seller.galinukkad.com/portal/#/register"
          >
            Register Now
          </a>
        </div>
      </div>
    </>
  );
};

export default VendorBanner;
/*/vendor/store-list*/

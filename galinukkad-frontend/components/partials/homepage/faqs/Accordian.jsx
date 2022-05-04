import React, { useState } from 'react';
import './faq.css';

const Accordion = ({ title, content, index }) => {
  const [isActive, setIsActive] = useState(false);

  return (
                        
<div className="card">

            <div className="card-header" id="faqHeading-1">
              <div className="mb-0">
                <h5 className={`faq-title`} data-toggle="collapse" data-target="#faqCollapse-1" data-aria-expanded="true" data-aria-controls="faqCollapse-1" onClick={() => setIsActive(!isActive)}>
                  <span className="badge"> {index + 1} </span>
                  {title}
                </h5>
              </div>
            </div>
            {isActive ? 
                 <div id="faqCollapse-1"   aria-labelledby="faqHeading-1" data-parent="#accordion">
              <div className="card-body">
                <p> {content} </p>
              </div>
            </div>
            : ""
}
          </div>



  );
};

export default Accordion;
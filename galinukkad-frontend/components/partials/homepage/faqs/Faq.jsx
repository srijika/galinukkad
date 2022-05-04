
import React, { useState, useRef, useEffect } from "react";
import Accordion from "./Accordian";
import './faq.css';
import axios from 'axios';
export default function Faq() {


  const [isActive, setIsActive] = useState(false);
  const [faqsData, setFaqsData] = useState([]);
  const [indexData, setIndexData] = useState("");



  useEffect(() => {

    getFaqs();
  }, [])

  const getFaqs = async () => {

    try {

      const res = await axios.post('/get/faqs');
      let status = res.data.status;
      if(![undefined, '', null].includes(status)) {
        let faqs = res.data.faqs;
        setFaqsData(faqs);
      }
    }catch(e) {
      console.log(e);
    }
  }


  const accordionData = [
    {
      title: 'Section 1',
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`
    },
    {
      title: 'Section 2',
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!`
    },
    {
      title: 'Section 3',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
      quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
      dolor ut sequi minus iste? Quas?`
    }
  ]

  const myFun = (index) => {
    setIsActive(!isActive) 
    setIndexData(index)
  }

    return (
        <>

        {  faqsData && faqsData.length > 0 
           ? 

<section className="faq-section">
  <div className="container">
    <div className="row">
      {/* ***** FAQ Start ***** */}
      <div className="col-md-6 offset-md-3">
        <div className="faq-title text-center pb-3">
          <h2>FAQ</h2>
        </div>
      </div>
      <div className="col-md-8 offset-md-2">
        <div className="faq" id="accordion">

        {
          faqsData && faqsData.map((item, index) => {
            return (
                        
              <div className="card">
              
                          <div className="card-header" id="faqHeading-1">
                            <div className="mb-0">
                              <h5 className={`faq-title`} data-toggle="collapse" data-target="#faqCollapse-1" data-aria-expanded="true" data-aria-controls="faqCollapse-1" onClick={() => myFun(index) }>
                                <span className="badge"> {index + 1} </span>
                                {item.questions}
                              </h5>
                            </div>
                          </div>
                          {isActive && indexData === index ? 
                               <div id="faqCollapse-1"   aria-labelledby="faqHeading-1" data-parent="#accordion">
                            <div className="card-body">
                              <p> {item.answers} </p>
                            </div>
                          </div>
                          : ""
                         }
              </div>
                );
          })
        }

        {/* {accordionData.map( (item, key) => (
          <Accordion title={item.title} content={item.content} index={key} />
        ))}
           */}

       
        </div>
      </div>
    </div>
  </div>
</section>

: ""
}
        </>
    )
}

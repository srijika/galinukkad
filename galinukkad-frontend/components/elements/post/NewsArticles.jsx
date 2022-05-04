import React from 'react';
import Link from 'next/link';
import moment from 'moment'
import { baseUrl } from '../../../repositories/Repository';

const NewsArticles = ({ data }) => {

    const date = moment(data.created_at);    
    return (
        // <article className="ps-post">
        //     <div className="ps-post__thumbnail">
        //         <Link href="/post/[pid]" as={`/post/${data.id}`}>
        //             <a className="ps-post__overlay"></a>
        //         </Link>
        //         {console.log(data)}
        //         <img src={`${baseUrl}/${data.images[0].file}`} style={{ height: "300px" }} alt="Galinukkad" />

        //         {/* <div className="ps-post__badge">
        //             <i className={data.category}></i>
        //         </div> */}

        //         {/* {data && data.category ? (
        //             <div className="ps-post__badge">
        //                 <i className={data.category}></i>
        //             </div>
        //         ) : (
        //             ''
        //         )} */}
        //     </div>
        //     <div className="ps-post__content">
        //         <div className="ps-post__meta">
        //             {/* {data.categories.map(category => (
        //                 <Link href="/shop" key={category.id + category.text}>
        //                     <a>{category.text}</a>
        //                 </Link>
        //             ))} */}
        //         </div>
        //         <Link href="/post/[pid]" as={`/post/${data.id}`}>
        //             <a className="ps-post__title" style={{ textTransform: "capitalize" }}>{data.title}</a>
        //         </Link>
        //         <p>
        //             {/* December 17, 2019  */}
        //             {date.format('MMMM DD, YYYY')}
        //         </p>
        //     </div>
        // </article>

          <section className="recent_news_sec">
  <div className="container-fluid">
    <h1>Recent News</h1>
    <div className="row">
 <div className="col-md-3">
        <div className="card">
          <a href="#">
            <img
              src={`${baseUrl}/${data.images[0].file}`}
              width="308px"
              height="157px"
              className="img-fluid"
              alt="blog-img"
            />
          </a>
          <div className="card_body">
            <div className="news_content">
              <span>
               <i class="fa fa-calendar-o mr-1" aria-hidden="true"></i>
                28 Sep 2021
              </span>
              <a href="#" className="float-right">
                <i class="fa fa-commenting-o mr-1" aria-hidden="true"></i>
                12 comments
              </a>
            </div>
            <h5 className="card_title">lorem ipsum</h5>
            <p className="card_text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="go_btn">
              Read More
             <i class="fa fa-long-arrow-right ml-1" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="btn_box">
      <a href="#" className="btn-style1">
        View all
      </a>
    </div>
  </div>
</section>











        
    );
};

export default NewsArticles;

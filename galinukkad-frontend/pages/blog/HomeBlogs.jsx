import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostGrid from '../../components/elements/post/PostGrid';
import NewsArticles from '../../components/elements/post/NewsArticles';
import { baseUrl } from '../../repositories/Repository';
import moment from 'moment'
import Link from 'next/link';
import Parser from 'html-react-parser';
// const  convert  = require('html-to-text'); 




function HomeBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);
    // const date = moment(data.created_at);    

console.log("newsArticles" ,newsArticles)
    useEffect(() => {
        getBlogsHome();
    }, []);

    const getBlogsHome = async () => {
        const res = await axios.post(`/get/blogs-and-news-articles`);

        let blogs = res.data.blogs;
        let newsArticles = res.data.newsArticles;
        setNewsArticles(newsArticles);
        setBlogs(blogs);
    };

    const getParserData = (html) => {

        let data = html.substr(0, 250)
        
        let datas = Parser(data)
        var strippedHtml = datas.replace(/<[^>]+>/g, '');
        
        return strippedHtml;
    }

    return (
        <>
            <hr width="100%" />

            <section className="article_section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="article_section_heading_box">
                                <h1 className="blogs_align">Popular Blogs </h1>

                            </div>
                        </div>
                    </div>

                    <div className="row article_section_row2">
                        {blogs.length > 0 &&
                            blogs.map((post, key) => {
                                if (key < 3) {
                                    return (
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card article_section__card">
                                            <Link className="read_mre_btn" href="/post/[pid]" as={`/post/${post.id}`}>
                                                <img
                                                    src={`${baseUrl}/blogs/${post.image}`}
                                                    className="card-img-top img-fluid"
                                                    alt="article"
                                                />
                                                  </Link>
                                                <div className="card-body">
                                                    <div className="content_body">
                                                        <a href="javascript:void(0)" className="blog-title">
                                                            <Link
                                                                href="/post/[pid]" as={`/post/${post.id}`}
                                                                className="card-title article_section__card_title" >
                                                                {post.title.substr(0,40)}
                                                            </Link>
                                                            <span>...</span>

                                                        </a>
                                                        <p className="card-text article_section__card_text">
                                                            {/* Duis aute irure
                                                            dolor in
                                                            reprehenderit in
                                                            voluptate velit esse
                                                            cillum... */}
                                                            {getParserData(post.html)}
                                                        </p>
                                                        <div className="blog_button_box">
                                                            <Link className="read_mre_btn" href="/post/[pid]" as={`/post/${post.id}`}>
                                                                Read More
                                                            </Link>
                                                            <a
                                                                href="#"
                                                                className="float-right">
                                                                {/* 28 Sep 2021 */}
                                                    {moment(post.created_at).format('MMMM DD, YYYY')}

                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>

                    <div className="row d-flex justify-content-center">
                    <Link href="/blog">
    <div className="btn_box">
      <a className="btn-style1">
        View Blogs
      </a>
    </div>
    </Link>
                    </div>
                </div>
            </section>

                          <hr width="100%" />
                        <section className="recent_news_sec article_section">
   

  <div className="container">
    
    <div className="row">
    <div className="col-md-12">
                        <div className="article_section_heading_box article_section_heading_box">
                                <h1 className="blogs_align">New Article </h1>

                            </div>
                        </div>

    {newsArticles.length > 0 &&
                        newsArticles.map((post, key) => {
                            if(key < 4) {
                                    return (
                <div className="col-md-6 col-lg-3">
        <div className="card mb-5">
        <Link href="/post/[pid]" as={`/post/${post._id}`} >
            <img src={`${baseUrl}/${post.images[0].file}`}
              width="308px" style={{ height: '240px' }} className="img-fluid " alt="blog-img" />
         </Link>
          <div className="card_body">
            <div className="news_content">
              <span>
               <i className="fa fa-calendar-o mr-1" aria-hidden="true"></i>
               {post.created_at.substr(0, 10)}
              </span>
              {/* <a href="#" className="float-right">
                <i className="fa fa-commenting-o mr-1" aria-hidden="true"></i>
                12 comments
              </a> */}
            </div>
            <h5 className="card_title">
            {post.title && post.title.substr(0, 30)}...
            </h5>
            <p className="card_text" >
             {post.description && post.description.substr(0, 60)}...
            </p>
            <Link href="/post/[pid]" as={`/post/${post._id}`}  >
            <a href="#" className="go_btn" >
              Read More
             <i className="fa fa-long-arrow-right ml-1" aria-hidden="true"></i>
            </a>
            </Link>
          
          </div>
          <div style={{ borderBottom : "1px solid #ddc9d3" }}>

</div>
        </div>
      </div>
            );
                            }
                        })}
    </div>
    <Link href="/news-article">
    <div className="btn_box">
      <a className="btn-style1">
        View Articles
      </a>
    </div>
    </Link>
  </div>
</section>


                                        
        </>
    );
}

export default HomeBlogs;

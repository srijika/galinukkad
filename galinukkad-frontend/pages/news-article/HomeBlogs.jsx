import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostGrid from '../../components/elements/post/PostGrid';
import NewsArticles from '../../components/elements/post/NewsArticles';
import { baseUrl } from '../../repositories/Repository';
import moment from 'moment'
import Link from 'next/link';
import Parser from 'html-react-parser';


function HomeBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);

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

    return (
        <>
            <hr width="100%" />

            <section class="article_section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="article_section_heading_box">
                                <h1>Popular Blogs</h1>
                            </div>
                        </div>
                    </div>

                    <div class="row article_section_row2">
                        {blogs.length > 0 &&
                            blogs.map((post, key) => {
                                if (key < 3) {
                                    return (
                                        <div class="col-md-4">
                                            <div class="card article_section__card">
                                                <img
                                                    src={`${baseUrl}/blogs/${post.image}`}
                                                    class="card-img-top img-fluid"  
                                                    alt="article"
                                                    style={{ height: "200px" }}
                                                />
                                                <div class="card-body">
                                                    <div class="content_body">
                                                        <a href="javascript:void(0)">
                                                            <Link
                                                                href="/post/[pid]" as={`/post/${post.id}`}
                                                                class="card-title article_section__card_title">
                                                                {post.title}
                                                            </Link>
                                                        </a>
                                                        <p class="card-text article_section__card_text">
                                                            {/* Duis aute irure
                                                            dolor in
                                                            reprehenderit in
                                                            voluptate velit esse
                                                            cillum... */}
                                                            {post.html.substr(30, 150)   }
                                                        </p>
                                                        <div className="btn_box">
                                                            <Link className="read_mre_btn" href="/post/[pid]" as={`/post/${post.id}`}>
                                                                Read More
                                                            </Link>
                                                            <a
                                                                href="#"
                                                                class="float-right">
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

                    <div class="row d-flex justify-content-center">
                        <div class="all_blog_btn_box">
                        <Link href="/blog">

                            <a
                              
                                class="text-uppercase text-decoration-none all_blog_btn"
                                id="contact_us">
                                See All  
                            </a>
                            </Link>

                        </div>
                    </div>
                </div>
            </section>

            {/* <div style={{ padding: "10px 20px" }}>
            <div className="ps-section__header" style={{ textAlign: 'center' }}>
                <h3>Blogs</h3>
            </div>
            <div className="ps-blog__content" style={{ marginTop: "20px" }}>
                <div className="row">
                    {blogs.length > 0 &&
                        blogs.map((post, key) => {
                            if(key < 3) {
                                    return (
                                        <div
                                        className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                                        key={key}>
                                        <PostGrid data={post} />
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>  */}

             <hr width="100%" />  
        <div style={{ padding: "10px 20px" }}>
            <div class="article_section_heading_box">
                                <h1>Popular Blogss</h1>
                            </div>
            <div className="ps-blog__content" style={{ marginTop: "20px" }}>
                <div className="row">
                    {newsArticles.length > 0 &&
                        newsArticles.map((post, key) => {
                            if(key < 3) {
                                    return (
                                        <div
                                            className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                                            key={key} >
                                        <NewsArticles data={post} />
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div> 
        </>
    );
}

export default HomeBlogs;

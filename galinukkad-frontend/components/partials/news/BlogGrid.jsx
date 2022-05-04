import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPosts } from '../../../store/post/action';
import PostGrid from '../../elements/post/NewsGrid';
import Link from 'next/link';
import axios from 'axios';

class BlogGrid extends Component {
    state = {
        filterResult: null,
        blogs: [], 
        blogCategories: []
    };
    async componentDidMount() {
        const res = await axios.post(`/get/blogs`);
        const res1 = await axios.post(`/get/news`);

       
        let blogs = res1.data.blogs;
        let blogCategoriesData = res1.data.blogCategories;

        this.setState({
            blogs : blogs, 
            blogCategories: blogCategoriesData, 
            setBlogCategory: '',
        })
    }

    

    render() {
        const { posts } = this.props;
        const { blogs,blogCategories  } = this.state;

        console.log();
        return (
            <div className="ps-blog">
                <div className="ps-blog__header">
                    <ul className="ps-list--blog-links">
                        <li className="active">
                            <a href="javascript:void(0)" onClick={ () => {  this.setState({ setBlogCategory: "" }) } }  >
                                <a>All</a>
                            </a>
                        </li>

                        {blogCategories.map((item, key) => {
                            return (
                            <li>
                                <a href="javascript:void(0)" key={key} onClick={ () => {  this.setState({ setBlogCategory: item._id }) } } >
                                    <a>{item.category_name}   </a>
                                </a>
                            </li>
                            )
                        })}

                        {/* <li>
                            <Link href="/blog">
                                <a>Life Style</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a>Technology</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a>Entertaiments</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a>Business</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a>Others</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a>Fashion</a>
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="ps-blog__content">
                    <div className="row">
                        {/* {posts.length > 0 &&
                            posts.map(post => {
                                return (
                                    <div
                                        className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                                        key={post.id}>
                                        <PostGrid data={post} />
                                    </div>
                                );
                            })} */}


                            {blogs.length > 0 &&
                            blogs.map((post, key) => {
                                if(post.category_id === this.state.setBlogCategory || this.state.setBlogCategory == '') {
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
                    {/* <div className="ps-pagination">
                        <ul className="pagination">
                            <li className="active">
                                <a href="#">1</a>
                            </li>
                            <li>
                                <a href="#">2</a>
                            </li>
                            <li>
                                <a href="#">3</a>
                            </li>
                            <li>
                                <a href="#">
                                    Next Page
                                    <i className="icon-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </div> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.post;
};
export default connect(mapStateToProps)(BlogGrid);

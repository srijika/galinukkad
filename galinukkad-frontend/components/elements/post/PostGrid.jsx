import React from 'react';
import Link from 'next/link';
import moment from 'moment'
import { baseUrl } from '../../../repositories/Repository';

const PostGrid = ({ data }) => {

    const date = moment(data.created_at);    
    return (
        <article className="ps-post">
            <div className="ps-post__thumbnail">
                <Link href="/post/[pid]" as={`/post/${data.id}`}>
                    <a className="ps-post__overlay"></a>
                </Link>
                <img src={`${baseUrl}/blogs/${data.image}`} alt="Galinukkad" />

                {/* <div className="ps-post__badge">
                    <i className={data.category}></i>
                </div> */}

                {/* {data && data.category ? (
                    <div className="ps-post__badge">
                        <i className={data.category}></i>
                    </div>
                ) : (
                    ''
                )} */}
            </div>
            <div className="ps-post__content">
                <div className="ps-post__meta">
                    {/* {data.categories.map(category => (
                        <Link href="/shop" key={category.id + category.text}>
                            <a>{category.text}</a>
                        </Link>
                    ))} */}
                </div>
                <Link href="/post/[pid]" as={`/post/${data.id}`}>
                    <a className="ps-post__title" style={{ textTransform: "capitalize" }}>{data.title}</a>
                </Link>
                <p>
                   <i class="fa fa-calendar-o mr-1" aria-hidden="true"></i>
                    {date.format('MMMM DD, YYYY')}
                </p>
            </div>
        </article>
    );
};

export default PostGrid;

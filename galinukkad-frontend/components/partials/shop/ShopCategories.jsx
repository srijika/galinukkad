import React , { useEffect, useState }from 'react';
import Link from 'next/link';
import Repository from '../../../repositories/Repository.js';
import {Spin} from 'antd';
import Router, {withRouter,useRouter} from 'next/router';
import { getTitleImage} from '../../../utilities/functions-helper';
// import { categories } from '../../../public/static/data/shopCategories';

const ShopCategories = (props) => {
    
   
    const [state,setState]  = useState({categories:[]});
    useEffect(() => {
        Repository.post('/getallcategries',{})
        .then((res) => {
            let {data} = res.data ;
            data = data.map((category,i) => {
                return   {
                    id: category._id,
                    thumbnail: "/static/img/categories/shop/"+((i%8)+1)+".jpg",
                    title:  category.name,
                    links: category.subcategory
                }   
            });
            setState({ categories:data });
        })
        .catch((err) => {
            console.log('err:' , err);
        });
    },[]);

    const { categories } = state;
    return (<div className="ps-shop-categories">
        <div className="row align-content-lg-stretch">
        {!categories || categories.length == 0?
                            <div style={{ display:"flex", justifyContent:"center", padding:'1rem', flex:'1 1'}}>
                                <Spin />
                            </div>
                            :null
        }
            {categories &&
                categories.map(category => (
                    <div
                        className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 "
                        key={category.id}>
                        <div
                            className="ps-block--category-2"
                            data-mh="categories">
                            <div className="ps-block__thumbnail">
                                <img src={category.thumbnail} alt="Galinukkad" />
                            </div>
                            <div className="ps-block__content">
                                <h4><a href="javascript:void(0)" 
                                  onClick={() => { Router.push({ pathname:'/shop' , query: { ...Router.query, category:category.id} })} }
                                pathname="/shop" query={{...Router.query,category:category.id}} >{getTitleImage(category.title)}</a></h4>
                                {/* <ul>
                                    {category.links &&
                                        category.links.map(link => (
                                            <li key={link}>
                                                    <a href="javascript:void(0)"
                                                        onClick={() => { Router.push({ pathname:'/shop' , query: { ...Router.query, category:link} })} }
                                                    >{link}</a>
                                            </li>
                                        ))}
                                </ul> */}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    </div>)
};

export default withRouter(ShopCategories);

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Repository from '../../../../repositories/Repository';
import { getTitleImage } from '../../../../utilities/functions-helper';
import { baseUrl } from '../../../../repositories/Repository';


const HomeDefaultTopCategories = () => {
    const [state, setState] = useState({ productCategories: [] });
    useEffect(() => {
        Repository.post('/getsubcatbycategories', {})
            .then((res) => {
                const { data } = res.data;
                localStorage.setItem('categoryDetails', JSON.stringify(data));
                setState({ productCategories: data });
            })
            .catch((err) => {
                console.log('err:', err);
            }); 
  
    }, []);
    return (
        <div className="ps-top-categories ">
            <div className="ps-container">
                {/* <h3>Top categories of the month</h3> */}
                <h3>Shop by Category</h3>

                <div className="row">
                    { state.productCategories != undefined &&
                    state.productCategories.length > 0
                        ? state.productCategories.map((cat, index) => {
                              return (
                                  <div
                                      className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 "
                                      key={cat._id}>
                                      <div className="ps-block--category">
                                          <Link
                                              href={
                                                  '/shop?category=' + cat._id
                                              }>
                                              <a className="ps-block__overlay"></a>
                                          </Link>

                                              {
                                                (cat.image)   ? 
                                                <img src={`${baseUrl}/categories/${cat.image}`} className="home_category_img"  alt=""/>
                                                : 
                                                <img
                                                src={
                                                    '/static/img/categories/' +
                                                    parseInt(
                                                        (index % 8) + 1,
                                                        10
                                                    ) +
                                                    '.jpg'
                                                }

                                                className="home_category_img" 
                                                alt="Galinukkad"
                                            /> 
                                              }

                                          {/* <img
                                              src={
                                                  '/static/img/categories/' +
                                                  parseInt(
                                                      (index % 8) + 1,
                                                      10
                                                  ) +
                                                  '.jpg'
                                              }
                                              alt="Galinukkad"
                                          /> */}
                                          <p>{getTitleImage(cat.name)} </p>

                                      </div>
                                  </div>
                              );
                          })
                        : ""}
                </div>
            </div>
        </div>
    );
};

export default HomeDefaultTopCategories;

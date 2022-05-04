import React from 'react';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';
import { isStaticData } from '../../../utilities/app-settings';
import { baseUrl } from '../../../repositories/Repository';
import { getImageName } from '../../../utilities/functions-helper';
const ProductCart = ({ product }) => {
    return (
        <div className="ps-product--cart">
            <div className="ps-product__thumbnail">
                <Link href="/product/[pid]" as={`/product/${product._id}`}>
                    <a>
                        <LazyLoad>
                            <img
                                src={
                                    isStaticData === false
                                        ? `${baseUrl}/`+getImageName(product.images.file)
                                        : product.thumbnail.url
                                }
className="img-size"

                                alt="Galinukkad"
                            />
                        </LazyLoad>
                    </a>
                </Link>
            </div>
            <div className="ps-product__content">
                
                <Link href="/product/[pid]" as={`/product/${product._id}`}>
                    
                    <a className="ps-product__title">
                        {product.title}
                        {/* backpack */}
                        
                        </a>
                </Link>
            </div>
        </div>
    );
};

export default ProductCart;

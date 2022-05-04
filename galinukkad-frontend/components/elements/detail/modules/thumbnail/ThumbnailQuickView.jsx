import React, { Component } from 'react';
import Slider from 'react-slick';
import NextArrow from '../../../carousel/NextArrow';
import PrevArrow from '../../../carousel/PrevArrow';
import { baseUrl } from '../../../../../repositories/Repository';
import ThumbnailImage from '../elements/ThumbnailImage';
import StaticThumbnailImage from '../elements/StaticThumbnailImage';
import Lightbox from 'react-image-lightbox';
import {getImageName} from '../../../../../utilities/functions-helper';


class ThumbnailQuickView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            galleryCarousel: null,
            variantCarousel: null,
            isOpen: false,
            photoIndex: 0
        };
    }

    componentDidMount() {
        this.setState({
            galleryCarousel: this.slider1,
            variantCarousel: this.slider2,
        });
    }

    handleOpenLightbox = (e, imageIndex) => {
        e.preventDefault();
        this.setState({ photoIndex: imageIndex, isOpen: true });
    };


    render() {
        const gallerySetting = {
            dots: false,
            infinite: true,
            speed: 400,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
        };
        const { product } = this.props;
        const productImages = [];
        const {photoIndex, isOpen} = this.state;
        // product.images.file.map(variant => {
                productImages.push( product.images.file);
        // });
        return (
            <div className="ps-product__thumbnail" data-vertical="false">
                <figure>
                    <div className="ps-wrapper">
                        <Slider
                            {...gallerySetting}
                            className="ps-product__gallery ps-carousel inside">
                            {/* {product.images.map((variant,i) => ( */}
                                <div className="item">
                                    {/* <a  href="#"
                                        onClick={e => {
                                            this.handleOpenLightbox(e, i)
                                        }
                                        }> */}

                                        {/* <ThumbnailImage url={productImages} /> */}
                                        <img src={`${baseUrl}/`+ productImages} alt="galinukkad.com"/>
                                    {/* </a> */}
                                </div>
                            {/* ))} */}
                        </Slider>
                        

                        {isOpen && (
                    <Lightbox
                        mainSrc={`${baseUrl}/`+getImageName(productImages[photoIndex])}
                        nextSrc={
                            productImages[
                                (photoIndex + 1) % productImages.length
                            ]
                        }
                        prevSrc={
                            productImages[
                                (photoIndex + productImages.length - 1) %
                                    productImages.length
                            ]
                        }
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex:
                                    (photoIndex + productImages.length - 1) %
                                    productImages.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex:
                                    (photoIndex + 1) % productImages.length,
                            })
                        }
                    />
                )}
                    </div>
                </figure>
            </div>
        );
    }
}

export default ThumbnailQuickView;

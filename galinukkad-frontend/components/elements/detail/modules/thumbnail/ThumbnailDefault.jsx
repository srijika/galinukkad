import React, { Component } from 'react';
import Slider from 'react-slick';
import NextArrow from '../../../carousel/NextArrow';
import PrevArrow from '../../../carousel/PrevArrow';
import Lightbox from 'react-image-lightbox';
import { baseUrl } from '../../../../../repositories/Repository';
import { isStaticData } from '../../../../../utilities/app-settings';
import ThumbnailImage from '../elements/ThumbnailImage';
import {getImageName} from '../../../../../utilities/functions-helper';
import "./ThumbnailDefault.scss";
class ThumbnailDefault extends Component {
    constructor(props) {
        super(props);
        this.state = {
            galleryCarousel: null,
            variantCarousel: null,
            photoIndex: 0,
            isOpen: false,
        };
    }

    handleOpenLightbox = (e, imageIndex) => {
        e.preventDefault();
        this.setState({ photoIndex: imageIndex, isOpen: true });
    };

    componentDidMount() {
        this.setState({
            galleryCarousel: this.slider1,
            variantCarousel: this.slider2,
        });


    }

    render() {
        const gallerySetting = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
        };

        const variantSetting = {
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        dots: false,
                        arrows: false,
                        vertical: false,
                        infinite: false,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4,
                        dots: false,
                        arrows: false,
                        vertical: false,
                        infinite: false,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 4,
                        dots: false,
                        arrows: false,
                        vertical: false,
                        infinite: false,
                    },
                },
            ],
        };
        const { product } = this.props;
        const { photoIndex, isOpen } = this.state;
        const productImages = [];



        product.gallary_images.map(variant => {
            productImages.push(variant.file);
        }); 

        

        return (
            <div className="ps-product__thumbnail" data-vertical="true">
            

                <figure>
                    <div className="ps-wrapper">

                    


                        <Slider
                            {...gallerySetting}
                            ref={slider => (this.slider1 = slider)}
                            asNavFor={this.state.variantCarousel}
                            className="ps-product__gallery ps-carousel inside">
                            {product.gallary_images.map((variant, index) => (
                                <div className="item" key={index}>
                                    <a
                                       
                                        onClick={e =>
                                            this.handleOpenLightbox(e, index)
                                        }>
                                        <ThumbnailImage url={'/'+getImageName(variant.file)}  />
                                    </a>
                                </div>
                            ))}

                                        
                                        
                        <div className="item" >
                        {product?.video && !['', undefined, null].includes(product.video.file)  && (
                            <video
                                className="VideoInput_video"
                                width="100%"
                                height="300px"
                                controls
                                src={`${baseUrl}/${product.video.file}`}
                            />
                        )}
                        </div>  
                            
                        </Slider>
                  
                    </div>
                </figure>
                                        
                


                    <Slider
                    asNavFor={this.state.galleryCarousel}
                    ref={slider => (this.slider2 = slider)}
                    swipeToSlide={true}
                    arrows={false}
                    slidesToShow={10}
                    vertical={true}
                    focusOnSelect={true}
                    {...variantSetting}
                    className="ps-product__variants">
                    {product.gallary_images.map(variant => (
                        <div className="item app-main-slider" key={product._id}>
                            <ThumbnailImage url={'/'+getImageName(variant.file)}  />
                        </div>
                    ))}

                    {product?.video && !['', undefined, null].includes(product.video.file)  && (
                        <div className="item app-main-slider" >
                            <img src="/static/img/video-icon.png" 
                            height="30px" width="30px"  
                            className="check_img"
                     />
                             {/* <video
                             poster="/static/img/video-icon2.png"
                                className="VideoInput_video"
                                style={{ height: "100%", width : "100%" }}
                                src={`${baseUrl}/${product.video.file}`}
                            /> */}
                        </div>
					)}     

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
        );
    }
}

export default ThumbnailDefault;

import React, { Component } from 'react';
import Slider from 'react-slick';
import NextArrow from '../../../elements/carousel/NextArrow';
import PrevArrow from '../../../elements/carousel/PrevArrow';
import Link from 'next/link';
import { baseUrl } from '../../../../repositories/Repository';
import  Repository from '../../../../repositories/Repository';
import HomeAdsColumns from '../../../../components/partials/homepage/home-default/HomeAdsColumns';
import SiteFeatures2 from '../../../../components/partials/homepage/home-default/SiteFeatures2';



class HomeBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bigBanner: [],
            smallBanner:[]
        };
    }

    componentDidMount = () =>{
        this.getBannerData();
    }

    getBannerData = async () => {		
        await Repository.get('/getAll-home-page-banner').then((response) => {
            if (response.data.status) {
                let bigBanner = this.shuffle(response.data.data.filter((item) => { return item.banner_size == 'Large' })).slice(0, 5)
                let smallBanner = this.shuffle(response.data.data.filter((item) => { return item.banner_size == 'Small' })).slice(1, 3)
                this.setState({bigBanner:bigBanner, smallBanner:smallBanner});
            }
        }).catch((err) => {
            console.log(err);
        });
    };
    
    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
    }

    render() {
        const carouselSetting = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
        };
        return (
            <div className="ps-home-banner ps-home-banner--1">
                <div className="container-fluid p-0">
                    <div className="ps-section__left banner_over_text">
                        { this.state.bigBanner.length > 0 ?
                        <Slider {...carouselSetting} className="ps-carousel">
                            {this.state.bigBanner.map((item,index) =>{
                               return ( <div className="ps-banner" key={index}>
                                   {item.description === undefined || item.description === "undefined" || item.description === "" ?
                                        <img src={baseUrl+'/'+item.image.file} alt={item.title} />
                                    :
                                    
                                        <Link href={item.description}>
                                            <img src={baseUrl+'/'+item.image.file} alt={item.title}  style={{ cursor: "pointer" }} />
                                        </Link>
                                    }
                                </div> )
                            })}
                        </Slider>
                        :
                        '' }
<div>
                         <div className="over_text">
                         <HomeAdsColumns />
                         </div>
                         <div className="over_features">
                         <SiteFeatures2 />
                         </div>
                         </div>
                    </div>
                    <div className="ps-section__right mr-2">
                    {/* {this.state.smallBanner.map((item,index) =>{
                        

                        return (
                            <div key={index}> 
                            
                                {item.description === undefined || item.description === "undefined" || item.description === "" ? 
                                        <img
                                        src={baseUrl+'/'+item.image.file}
                                        alt={item.title} style={{maxHeight:'165px'}}/>
                                    : 
                                    <Link href={item.description ? item.description : "#"   } key={index}>
                                    <a className="ps-collection">
                                        <img
                                            src={baseUrl+'/'+item.image.file}
                                            alt={item.title} style={{maxHeight:'165px'}}/>
                                    </a>
                                </Link>
                                    }

                            </div>
                        )
                    })} */}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeBanner;

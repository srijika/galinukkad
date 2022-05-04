import React, { Component } from 'react';
import Link from 'next/link';
import { baseUrl } from '../../../../repositories/Repository';
import  Repository from '../../../../repositories/Repository';

class HomeAds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smallBanner:[]
        };
    }

    componentDidMount = () =>{
        this.getBannerData();
    }

    getBannerData = async () => {		
        await Repository.get('/getAll-home-page-banner').then((response) => {
            if (response.data.status) {
                let smallBanner = this.shuffle(response.data.data.filter((item) => { return item.banner_size == 'Small' })).slice(0, 3)
                this.setState({smallBanner:smallBanner});
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
        return (
            <div className="ps-home-ads">
                <div className="ps-container ads-res-mobile">
                    <div className="row">
                    {this.state.smallBanner.map((item,index) =>{
                        return ( <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 " key={index}>
                            <Link href={item.description}>
                                <a className="ps-collection">
                                    <img
                                       src={baseUrl+'/'+item.image.file}
                                       alt={item.title} 
                                       className="homeads_res"
                                       
                                    />
                                </a>
                            </Link>
                        </div> )
                    })}
                        
                            {/* <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 ">
                                <Link href="/shop">
                                    <a className="ps-collection">
                                        <img
                                            src="/static/img/collection/home-1/2.jpg"
                                            alt="Galinukkad"
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 ">
                                <Link href="/shop">
                                    <a className="ps-collection">
                                        <img
                                            src="/static/img/collection/home-1/3.jpg"
                                            alt="Galinukkad"
                                        />
                                    </a>
                                </Link>
                            </div> */}
                    </div>
                </div>
            </div>
        );
    }

}

export default HomeAds;

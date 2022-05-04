import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { getColletionBySlug } from '../../../utilities/product-helper';

import { baseUrl } from '../../../repositories/Repository';
import  Repository from '../../../repositories/Repository';

class ProductWidgets extends Component{

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
                let smallBanner = this.shuffle(response.data.data.filter((item) => { return item.banner_size == 'Small' })).slice(0, 2)
                console.log('response.data.data isisi');
                console.log(response.data.data);
                this.setState({ smallBanner:smallBanner});
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
        const { collections, collectionSlug } = this.props;
        const products = getColletionBySlug(collections, collectionSlug);
        return (
            <section>
                <aside className="widget widget_product widget_features">
                    <p>
                        <i className="icon-network"></i> Shipping worldwide
                    </p>
                    <p>
                        <i className="icon-3d-rotate"></i> Free 7-day return if
                        eligible, so easy
                    </p>
                    <p>
                        <i className="icon-receipt"></i> Supplier give bills for this
                        product.
                    </p>
                    <p>
                        <i className="icon-credit-card"></i> Pay online or when
                        receiving goods
                    </p>
                </aside>
                <aside className="widget widget_sell-on-site">
                    <p>
                        <i className="icon-store"></i> Sell on Galinukkad?
                        <Link href="https://seller.galinukkad.com/vendor/become-a-vendor">
                            <a> Register Now !</a>
                        </Link>
                    </p>
                </aside>
                {this.state.smallBanner && this.state.smallBanner.map((item) => {
                    return (


                    
                <aside className="widget widget_ads">
                    {/* <Link href="/shop">
                        <a>
                            <img src="/static/img/ads/product-ads.png" alt="Galinukkad" />
                        </a>
                    </Link> */}


                    
                                   {item.description === undefined || item.description === "undefined" || item.description === "" ?
                                        <img src={baseUrl+'/'+item.image.file} alt={item.title} />
                                    :
                                    
                                        <Link href={item.description}>
                                            <img src={baseUrl+'/'+item.image.file} alt={item.title}  style={{ cursor: "pointer" }} />
                                        </Link>
                                    }
                                


                </aside>
)
})}
                
                {/* <aside className="widget widget_same-brand">
                    <h3>Same Brand asd1</h3>
                    <div className="widget__content">
                        {products &&
                        products.map(product => (
                            <Product product={product} key={product.id} />
                        ))}
                    </div>
                </aside> */}
            </section>
        );
    }

}

export default connect(state=>state.collection)(ProductWidgets);

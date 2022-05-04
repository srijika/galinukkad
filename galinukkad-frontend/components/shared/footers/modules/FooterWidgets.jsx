import React, {Component} from 'react';
import Link from 'next/link';
import  Repository from '../../../../repositories/Repository.js';
import {getSingleSettingData} from '../../../../helper/helpers'
import { connect } from 'react-redux';
import { logOut } from '../../../../store/auth/action';
import { ToastContainer, toast , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Router from 'next/router';


class FooterWidgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPages:[],
            rightPages:[],
            total : 0,
            limit: 50, 
            settings: []
        }
    }

    componentDidMount() {
        this.fetchAllHtmlPages();

        let data = JSON.parse(localStorage.getItem('site_settings'));
        this.setState({settings: data });

    }
    
    fetchAllHtmlPages = () => {

        let _id  = localStorage.getItem('LoginId');
        let status ;
        let data = {
             page:0, 
                limit: this.state.limit ,
                _id: _id}
        
   
        Repository.post('getAll-html-pages',data)
        .then((res) => {
            if(res.data.status) {
                let data = (res.data.data).reverse();
                let count = res.data.count;
                // status = ;
console.log("res.data.user_status" , res.data.user_status)
    if(res.data.user_status){
                toast.error('Your Account is Deactived!');
          

            setTimeout(() => {
                  window.location.reload();
            localStorage.clear();
              Router.push(`/account/login`);
                
            }, 2000);



      }

                this.setState({ leftPages:data.slice(0,(count/2)+1), rightPages:data.slice((count/2)+1)})
            }
        })

                // console.log(res.data.user_status , "status")


        // console.log(status , "status")
    
      
    }

    
    render() {

        let {settings} = this.state;

        return (
            <div className="ps-footer__widgets">
                <aside className="widget widget_footer">
                    <h4 className="widget-title">Quick links</h4>
                    <ul className="ps-list--link">

                        {this.state.leftPages.map((pages, index) =>
                            <li key={index}>
                                <Link href="/page/[pid]" as={`/page/${pages.slug}`}>
                                    <a>{pages.title}</a>
                                </Link>
                            </li>
                        )}

                    </ul>
                </aside>
                <aside className="widget widget_footer">
                    <h4 className="widget-title">Policy</h4>
                    <ul className="ps-list--link">

                        {this.state.leftPages.map((pages, index) =>
                            <li key={index}>
                                <Link href="/page/[pid]" as={`/page/${pages.slug}`}>
                                    <a>{pages.title}</a>
                                </Link>
                            </li>
                        )}

                    </ul>
                </aside>
                <aside className="widget widget_footer">
                    <h4 className="widget-title">Help</h4>
                    <ul className="ps-list--link">

                        {this.state.leftPages.map((pages, index) =>
                            <li key={index}>
                                <Link href="/page/[pid]" as={`/page/${pages.slug}`}>
                                    <a>{pages.title}</a>
                                </Link>
                            </li>
                        )}

                    </ul>
                </aside>
                {/* <aside className="widget widget_footer">
                    <h4 className="widget-title"></h4>
                    <ul className="ps-list--link">
                        {this.state.rightPages.map((pages, index) =>
                            <li key={index}>
                                <Link href="/page/[pid]" as={`/page/${pages.slug}`}>
                                    <a>{pages.title}</a>
                                </Link>
                            </li>
                        )}
                    </ul>
                </aside> */}
                <aside className="widget widget_footer">
                    <h4 className="widget-title">Contact Us </h4>
                    <address>
                      
                        {/* {settings && getSingleSettingData(settings, 'ADDRESS')} */}
                    </address>
                    <ul className="ps-list--social">
                        <li>
                            { getSingleSettingData(settings, 'MAIL') }
                        </li>
                        <ul className="ps-list--social">
                            <li>
                                <a className="facebook" target="_blank" href={getSingleSettingData(settings, 'FACEBOOK')}>
                                    <i className="fa fa-facebook"></i>
                                </a>
                            </li>
                            <li>
                                <a className="twitter"  target="_blank" href={getSingleSettingData(settings, 'TWITTER')}>
                                    <i className="fa fa-twitter"></i>
                                </a>
                            </li>
                            {/* <li>
                                <a className="google-plus"  target="_blank" href={getSingleSettingData(settings, 'GOOGLE_PLUS')}>
                                    <i className="fa fa-google-plus"></i>
                                </a>
                            </li> */}
                            <li>
                                <a className="instagram"  target="_blank" href={getSingleSettingData(settings, 'INSTAGRAM')}>
                                    <i className="fa fa-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a className="whatsapp"  target="_blank" href={getSingleSettingData(settings, 'WHATSAPP')}>
                                    <i className="fa fa-whatsapp"></i>
                                </a>
                            </li>
                        </ul>
                     </ul>

                </aside>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
};

export default connect(mapStateToProps)(FooterWidgets);


// export default FooterWidgets;

import React, {Component} from 'react';
import Link from 'next/link';
import  Repository from '../../../../repositories/Repository.js';

class FooterWidgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPages:[],
            rightPages:[],
            total : 0,
            limit: 50
        }
    }

    componentDidMount() {
        this.fetchAllHtmlPages();
    }
    
    fetchAllHtmlPages = () => {
        Repository.post('getAll-html-pages',{ page:0, limit: this.state.limit})
        .then((res) => {
            if(res.data.status) {
                let data = (res.data.data).reverse();
                let count = res.data.count;
                this.setState({ leftPages:data.slice(0,(count/2)+1), rightPages:data.slice((count/2)+1)})
            }
        })
    }

    
    render() {
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
                </aside>
                <aside className="widget widget_footer">
                    <h4 className="widget-title">Contact Us</h4>
                    <ul className="ps-list--social">
                        <li>
                            <a>info@galinukkad.com</a>
                        </li>
                            <ul className="ps-list--social">
                                <li>
                                    <a className="facebook" href="#">
                                        <i className="fa fa-facebook"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="twitter" href="#">
                                        <i className="fa fa-twitter"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="google-plus" href="#">
                                        <i className="fa fa-google-plus"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="instagram" href="#">
                                        <i className="fa fa-instagram"></i>
                                    </a>
                                </li>
                                <li>
                                    <a className="whatsapp" href="#">
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

export default FooterWidgets;

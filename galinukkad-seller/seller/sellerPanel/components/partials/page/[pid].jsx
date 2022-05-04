import React, {Component} from 'react';
import Parser from 'html-react-parser';
import  Repository from '../../../repositories/Repository.js';

class BlankContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid:'',
            PageData:[],
            lastUpdate:false
        }
    }

    componentDidMount() {
        const url = window.location.href;
        const pid = url.substring(url.lastIndexOf('/') + 1);
        this.setState({ pid:pid})
        this.fetchHtmlPagesData(pid);
    }

    componentDidUpdate(){
        const url = window.location.href;
        const pid = url.substring(url.lastIndexOf('/') + 1);

        if(pid !== this.state.pid){
            this.fetchHtmlPagesData(pid);
            this.setState({ pid:pid})
        }
    }

    fetchHtmlPagesData = (pid) =>{
        Repository.get('get-html-pages?slug='+pid)
        .then((res) => {
            if(res.data.status) {
                let data = res.data.data[0]
                this.setState({ PageData:data})
            }
        })
    }

    render() {
        let description = this.state.PageData.html;
        return (
            <div className="ps-section--custom">
                <div className="container">
                    <div className="ps-section__header">
                        <h1>{this.state.PageData.title}</h1>
                    </div>
                    <div className="ps-section__content">
                        <div className="content" dangerouslySetInnerHTML={{ __html: description? Parser(description) : '<p>No description found.</p>' }}  ></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BlankContent;

import React, { Component } from 'react';
import Repository from '../../../../../repositories/Repository.js';
import {Rate , Row, Col, Descriptions} from 'antd';


class PartialVendor extends Component {

    state = {
        vendorDetails: {},
        sellerAddress: {},
        total: 0,
        limit: 10
    }
    componentDidMount() {
        this.fetchCommunications();
    }

    fetchCommunications = () => {
        const { productId } = this.props;
        const { sellerAddress } = this.props;
        if (productId ) { 
          const data =  productId;
            this.setState({ vendorDetails: data })
            this.setState({ sellerAddress: sellerAddress })
        }
      
        // Repository.post('get/communication/productid', { product_id: productId })
        //     .then((res) => {
        //         if (res.data.status) {
        //             const data = res.data.result;
        //             this.setState({ vendorDetails: [...data] })
        //         }
        //     })
    }


    render() {
        let Address = '';
        const isAddr = this.state.sellerAddress;
        if(isAddr !== '' && isAddr !== undefined){
            Address =  this.state.sellerAddress.add1+','+this.state.sellerAddress.add2+','+this.state.sellerAddress.city+','+this.state.sellerAddress.postal+','+this.state.sellerAddress.state;
        }
        const addr =  isAddr !== '' && isAddr !== undefined ? 
                <Descriptions label="Full Address">{Address}</Descriptions>
            :   <Descriptions > </Descriptions>;
        return (
            <section>
                {
                this.state.vendorDetails !== null ?
                    <Col span="24">
                        <div className="app-review-card">
                            <Descriptions title="Vendor Details" column={1}  bordered>
                                <Descriptions label="Name">{this.state.vendorDetails.username}</Descriptions>
                                <Descriptions label="Phone Number">{this.state.vendorDetails.mobile_number}</Descriptions>
                                <Descriptions label="Email">{this.state.vendorDetails.email}</Descriptions>
                             </Descriptions>
                                <Descriptions  column={1} bordered >
                                {addr}
                                </Descriptions>
                           
                        </div>
                    </Col>
                
                    : 
                     'No Vendor Details Found'
                }
            </section>
        )
    }
};

export default PartialVendor;

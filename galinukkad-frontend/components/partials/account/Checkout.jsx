import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCart , updateCartAmount} from '../../../store/cart/action';


import FormCheckoutInformation from './modules/FormCheckoutInformation';

class Checkout extends Component {
    constructor(props) {
        super(props);
    }

    
    componentDidMount() {
        this.getCartData()}

    getCartData = () => {
        this.props.dispatch(getCart());
        setTimeout(() =>{
            console.log("totalAmt" , this.props.cartItems)
            let totalAmt ;
            if(this.props.cartItems.length === 0){
                totalAmt = 0;
            }else{
                totalAmt= this.props.cartItems && this.props.cartItems.map((item)=> {
                    return (item.price * item.quantity)
        
                }).reduce((acc , totalAmt) => {
                    return acc += totalAmt
                })
            }
  

     
        console.log("totalAmt" , totalAmt)
        
        this.props.dispatch(updateCartAmount(totalAmt));

        }, 10)


    }


    render() {
        const { amount, cartTotal, cartItems } = this.props;
        return (
            <div className="ps-checkout ps-section--shopping">
                <div className="container">
                    <div className="ps-section__header">
                        <h1>Checkout Information</h1>
                    </div>
                    <div className="ps-section__content">
                        <FormCheckoutInformation
                            amount={amount}
                            cartTotal={cartTotal}
                            cartItems={cartItems}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.cart;
};
export default connect(mapStateToProps)(Checkout);

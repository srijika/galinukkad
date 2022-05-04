import React, { Component } from 'react';
import Link from 'next/link';

class MenuFlip extends Component {

    render() {
        return (
            <div>
                <ul className="navigation__extr">
                    <li><a href="https://seller.galinukkad.com/portal/#/register">Services</a></li>
                    <li><a href="https://seller.galinukkad.com/portal/#/register">Resources</a></li>
                    <li><a href="https://seller.galinukkad.com/portal/#/register">FAQs</a></li>
                </ul>
            </div>
        );
    }
}


export default MenuFlip;

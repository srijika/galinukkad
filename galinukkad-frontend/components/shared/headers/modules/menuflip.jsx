import React, { Component } from 'react';
import Link from 'next/link';

class MenuFlip extends Component {

    render() {
        return (
            <div>
                <ul className="navigation__extr">
                    <li><a target="_blank" href="http://15.207.135.132/#/register">Services</a></li>
                    <li><a target="_blank" href="http://15.207.135.132/#/register">Resources</a></li>
                    <li><a target="_blank" href="http://15.207.135.132/#/register">FAQs</a></li>
                </ul>
            </div>
        );
    }
}


export default MenuFlip;

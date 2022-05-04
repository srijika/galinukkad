import React from 'react';

const Rating = ({rating}) => {
    return (<span className="ps-rating">
        <i className={['fa',rating && rating >= 1?'fa-star':'fa-star-o'].join(' ')}></i>
        <i className={['fa',rating && rating >= 2?'fa-star':'fa-star-o'].join(' ')}></i>
        <i className={['fa',rating && rating >= 3?'fa-star':'fa-star-o'].join(' ')}></i>
        <i className={['fa',rating && rating >= 4?'fa-star':'fa-star-o'].join(' ')}></i>
        <i className={['fa',rating && rating >= 5?'fa-star':'fa-star-o'].join(' ')}></i>
    </span>)
};

export default Rating;
import React from 'react';
import { useEffect, useState } from 'react'
import menuData from '../../../../public/static/data/menu';
import Menu from '../../../elements/menu/Menu';
const MenuCategories = () => {
   
    return (<Menu data={menuData.productCategories} className="menu--dropdown" />);
};

export default MenuCategories;

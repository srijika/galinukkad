import React from 'react';
import Link from 'next/link';

import MegaMenu from './MegaMenu';
import MenuDropdown from './MenuDropdown';
import { getTitleImage } from '../../../utilities/functions-helper';
const Menu = ({ data, className }) => (
    <ul className={className}>
        {data &&
            data.map(item => {
                if (item.subMenu) {
                    return <MenuDropdown menuData={item} key={item.text} />;
                } else if (item.megaContent) {
                    return <MegaMenu menuData={item} key={item.text} />;
                } else {
                    return (
                        <li key={item.text}>
                            {item.type === 'dynamic' ? (
                                <Link href={`${item.url}/[pid]`} as={`${item.url}/${item.endPoint}`}>
                                    <a>{getTitleImage(item.text)}</a>
                                </Link>
                            ) : (
                                <Link href={item.url} as={item.alias}>
                                    <a>{getTitleImage(item.text)}</a>
                                </Link>
                            )}
                        </li>
                    );
                }
            })}
    </ul>
);

export default Menu;

import React, {useState, useEffect} from 'react';
import {getSingleSettingData} from '../../../../helper/helpers'

const FooterCopyright = () =>  {

    const [settings, setSettings] = useState([]);
    
    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('site_settings'));
        setSettings(data);
    }, []);


    return (


    <div className="ps-footer__copyright">
        <p>
            {/* <img className="company-logo"
                src="/static/img/index.png"
                alt="Galinukkad"
            /> */}
            {/* © 2020 Company. All Rights Reserved  */}
            {settings && getSingleSettingData(settings, 'COPYRIGHT')}
            </p>
        <p>
        </p>
    </div>
) };

export default FooterCopyright;

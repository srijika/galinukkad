import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import createStore from '../store/store';
import DefaultLayout from '../components/layouts/DefaultLayout';
import '../scss/style.scss';
import { Router } from 'next/router';
import * as gtag from '../lib/gtag';
import onMessageListener, { getToken } from './firebase';
import { notification } from 'antd';




class MyApp extends App {
    constructor(props) {
        super(props);
        this.persistor = persistStore(props.store);
    }

    componentDidMount() {
        
        setTimeout(function () {
            document.getElementById('__next').classList.add('loaded');
        }, 100);

        Router.events.on('routeChangeComplete', this.handleRouteChange);
        this.setState({ open: true });

        // SAFARI AND FIREFOX INCOGNITO NOT WORKING CODE
        if (getToken.length > 0) {
            getToken().then(() => {
                this.checkMessage();
            });
        }

        // this.getSiteSettingData();

        window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
    }

    checkMessage = () => {
        onMessageListener().then((payload) => {
            this.openNotification(payload);
        });
    };
    openNotification = (payload) => {
        notification.open({
            message: payload.notification.title,
            description: payload.notification.body,
            duration: 500,
        });
        this.checkMessage();
    };

    componentWillUnmount() {
        Router.events.off('routeChangeComplete', this.handleRouteChange);
        window.removeEventListener(
            'beforeunload',
            this.handleWindowBeforeUnload
        );
    }

    // componentDidUpdate() {}

    handleWindowBeforeUnload = () => {
        let persistance = JSON.parse(localStorage.getItem('persist:eStore'));
        let localCompare = JSON.parse(persistance.compare);
        localCompare.compareItems = [];
        localCompare.compareTotal = 0;
        persistance.compare = JSON.stringify(localCompare);
        localStorage.setItem('persist:eStore', JSON.stringify(persistance));
    };

    handleRouteChange = (url) => {
        gtag.pageview(url);
    };

    // getSiteSettingData = async () => {
    //     try {
    //         let _id = localStorage.getItem('LoginId');
    //         const res = await axios.post('/list/setting', { _id: _id });
    //         let settings = res?.data?.settings;
            
    //         let userStatus = getSingleSettingData(settings, 'userStatus');
    //         let maintenanceMode = getSingleSettingData(settings, 'PUBLIC_WEB_UNDER_MAINTENANCE');

    //         if(maintenanceMode === "yes" || maintenanceMode === "Yes") {
    //             this.setState({ maintenanceModeModal: true })
    //         }else {
    //             this.setState({ maintenanceModeModal: false })
    //         }

    //         if (userStatus) {
    //             localStorage.clear();
    //             window.location.reload();
    //         }

    //         if (!['', undefined, null].includes(settings)) {
    //             localStorage.setItem('site_settings', JSON.stringify(settings));
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    render() {
        const { Component, pageProps, store } = this.props;
        const getLayout =
            Component.getLayout ||
            ((page) => <DefaultLayout children={page} />);
        return getLayout(
            <Provider store={store}>

                {/* <Modal
                    centered
                    footer={null}
                    width={800}
                    closable={false}
                    visible={this.state.maintenanceModeModal}
                >
                        <img style={{  width: "100%", height: "80vh" }}  src="/static/img/under-maintenance.jpg" alt="Galinukkad" />
                </Modal> */}
                <PersistGate
                    loading={<Component {...pageProps} />}
                    persistor={this.persistor}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        );
    }
}

export default withRedux(createStore)(withReduxSaga(MyApp));

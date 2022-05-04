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

class MyApp extends App {
    constructor(props) {
        super(props);
        this.persistor = persistStore(props.store);
    }

    componentDidMount() {
        setTimeout(function() {
            document.getElementById('__next').classList.add('loaded');
        }, 100);

        this.setState({ open: true });

    let path_url = window.location.href;
    let path_data = path_url.slice(-2);
    

    if(path_data === "//") {
      window.location.href = "https://seller.galinukkad.com/";
    }
    

    }
    render() {
        const { Component, pageProps, store } = this.props;
        const getLayout =
            Component.getLayout || (page => <DefaultLayout children={page} />);
        return getLayout(
            <Provider store={store}>
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

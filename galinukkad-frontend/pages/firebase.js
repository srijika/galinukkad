import React from 'react';
import 'firebase/messaging';
import firebase from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyByfntzyR4-KoG-zFAa2h5HnnMfQo6QoMc",
    authDomain: "galinukkad.firebaseapp.com",
    projectId: "galinukkad",
    storageBucket: "galinukkad.appspot.com",
    messagingSenderId: "597367167767",
    appId: "1:597367167767:web:af817b9759f6db3abcb552",
    measurementId: "G-JBNYKM5FGG"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
let messaging;
if (process.browser) {

    
    if (firebase.messaging.isSupported()) {
        messaging = firebase.messaging();
    }

}
    
    export const getToken = () => {

        // SAFARI AND FIREFOX INCOGNITO NOT WORKING CODE
        if(messaging != undefined) {

            return messaging.getToken({ vapidKey: 'BCInRUh6FDTUvvWAOYgddD3gTH6aizXcEhJ4JCvKDLX_m0TVrR0MFUdBmUK-pCiwCDn2u53s5EqRrsl50mOMEAE' }).then((currentToken) => {
                if (currentToken) {
                    localStorage.setItem('firebase-Token', currentToken);
                } else {
                }
            }).catch((err) => {
            });
        }

        return {}; 
    }
    


const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });

export default onMessageListener


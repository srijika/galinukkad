// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyByfntzyR4-KoG-zFAa2h5HnnMfQo6QoMc",
  authDomain: "galinukkad.firebaseapp.com",
  projectId: "galinukkad",
  storageBucket: "galinukkad.appspot.com",
  messagingSenderId: "597367167767",
  appId: "1:597367167767:web:af817b9759f6db3abcb552"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
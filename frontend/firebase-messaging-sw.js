
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyAjTVNN54EqebjhRxDGzN2yCHrOhdNDyAI",
  authDomain: "js-pwa-70a4e.firebaseapp.com",
  projectId: "js-pwa-70a4e",
  storageBucket: "js-pwa-70a4e.appspot.com",
  messagingSenderId: "211178030459",
  appId: "1:211178030459:web:67de56b1cf51d0109629de",
  measurementId: "G-XPRF4D86EE",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption = {
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});

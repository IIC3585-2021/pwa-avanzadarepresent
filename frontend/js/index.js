
window.onload = () => {
  "use strict";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
  // firebase.messaging().getToken({vapidKey: 'BFT2TPFfJf2AEvALQHZmSB21RpvacCYLU9f020E8oK3pCGgxV-nqICnZU0H3Qr2swKv-AfTi-WX4jCeTuvf0tGk'}).then(response => console.log(response));
};

const submitButton = document.getElementById("submit-button");
submitButton.onclick = () => {callFirebaseAuth()};

const refreshAuth = document.getElementById("refersh-auth");
refreshAuth.onclick = () => {
  const elem = document.getElementById("is-auth");

  var user = firebase.auth().currentUser;

  if (user) {
    elem.innerHTML = `Estoy loggeado con ${user.email}`
  } 
}


function callFirebaseAuth() {

  const firestore = firebase.firestore()
  firestore
      .collection("posts")
      .get()
      .then(response => {console.log(response)})

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

}

// function signOut(){
//   firebase.auth().signOut().then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });
// }


// function getToken() {
//   const messaging = firebase.messaging();
//   // [START messaging_get_token]
//   // Get registration token. Initially this makes a network call, once retrieved
//   // subsequent calls to getToken will return from cache.
//   messaging.getToken({ vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//     } else {
//       // Show permission request UI
//       console.log('No registration token available. Request permission to generate one.');
//       // ...
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
//   });
//   // [END messaging_get_token]
// }

function requestPermission() {
  // [START messaging_request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve a registration token for use with FCM.
      // ...
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
  // [END messaging_request_permission]
}

function deleteToken() {
  const messaging = firebase.messaging();

  // [START messaging_delete_token]
  messaging.deleteToken().then(() => {
    console.log('Token deleted.');
    // ...
  }).catch((err) => {
    console.log('Unable to delete token. ', err);
  });
  // [END messaging_delete_token]
}
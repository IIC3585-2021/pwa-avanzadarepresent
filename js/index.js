window.onload = () => {
  "use strict";
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }  
};


window.addEventListener("load", function(){
  // Wait to load libraries  
  sleep(1000).then(() => {
    checkLogin()
  }
  )
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const loginButton = document.getElementById("login-button");
loginButton.onclick = callFirebaseAuth;
const logoutButton = document.getElementById("logout-button");
logoutButton.onclick = callFirebaseLogout;

function checkLogin() {
  const isLogged = firebase.auth().currentUser;
  const loginElement = document.getElementById("login-box");
  const loggedElement = document.getElementById("logged-box");
  if (isLogged) {
    setLoggedUserBlock();
    loggedElement.style.display = "block";
    loginElement.style.display = "none";
  } else {
    loggedElement.style.display = "none";
    loginElement.style.display = "block";
  }
}


function callFirebaseAuth() {
  const isLogged = firebase.auth().currentUser;
  console.log(`Estoy logeado? ${isLogged}`)
  const loginButton = document.getElementById("login-button");
  const loginLoading = document.getElementById("login-loading");
  loginButton.style.display = "none";
  loginLoading.style.display = "block";
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var userEmail = userCredential.user.email;
      loginButton.style.display = "block";
      loginLoading.style.display = "none";
      var tokenPromise = firebase.messaging().getToken();
      tokenPromise.then(response => {loginButton.style.display = "block";
      loginLoading.style.display = "none";
        console.log(`response token ${response}`)
      })
      console.log(`usuario ingresado: ${userEmail}`)
      checkLogin();
    })
    .catch((error) => {
      var errorMessage = error.message;
      loginButton.style.display = "block";
      loginLoading.style.display = "none";
      alert("Algo malo sucedió, intenta más tarde.")
      console.log(errorMessage);
    });
}

function setLoggedUserBlock() {
  const userEmail = firebase.auth().currentUser.email;
  const loggedContentHTML = document.getElementById("logged-content")
  loggedContentHTML.innerHTML = `Como ${userEmail}`
}

function callFirebaseLogout(){
  const logoutButton = document.getElementById("logout-button");
  const logoutLoading = document.getElementById("logout-loading");
  logoutButton.style.display = "none";
  logoutLoading.style.display = "block";
  firebase.auth().signOut().then(() => {
    logoutButton.style.display = "block";
    logoutLoading.style.display = "none";
    checkLogin()
  }).catch((error) => {
    logoutButton.style.display = "block";
    logoutLoading.style.display = "none";
    alert("Algo sucedió, prueba más tarde");
    console.log(`Error: ${error}`)
  });
}

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

  messaging.deleteToken().then(() => {
    console.log('Token deleted.');
    // ...
  }).catch((err) => {
    console.log('Unable to delete token. ', err);
  });
}
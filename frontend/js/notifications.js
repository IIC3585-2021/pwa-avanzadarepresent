// https://github.com/hackstarsj/FirebaseWebPushNotification/blob/master/firebase-messaging-sw.js

const messaging=firebase.messaging();

function IntitalizeFireBaseMessaging() {
          messaging
              .requestPermission()
              .then(function () {
                  console.log("Notification Permission");
                  return messaging.getToken();
              })
              .then(function (token) {
                  console.log(`Token : ${token}`);
              })
              .catch(function (reason) {
                  console.log(reason);
              });
      }

messaging.onMessage(function (payload) {
  beautifulNotification(payload.notification)

  const notificationOption = {
    body:payload.notification.body,
    icon:payload.notification.icon
  };

  if(Notification.permission==="granted"){
    var notification = new Notification(payload.notification.title,notificationOption);

    notification.onclick=function (ev) {
      ev.preventDefault();
      window.open(payload.notification.click_action,'_blank');
      notification.close();
    }
  }

});
messaging.onTokenRefresh(function () {
          messaging.getToken()
              .then(function (newtoken) {
                  console.log("New Token : "+ newtoken);
              })
              .catch(function (reason) {
                  console.log(reason);
              })
})
IntitalizeFireBaseMessaging();

const beautifulNotification = (notification) => {
    console.log(notification)
    var notificationDiv = document.getElementById("notification");
    var notificationHTML = `
    <div class="" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="header">
        <strong class="me-auto">${notification.title}</strong>
        <small>${new Date()}</small>
        <button type="button" class="btn-close" data-bs-dismiss="" aria-label="Close"></button>
      </div>
      <div class="body">${notification.body}</div>
    </div>
    `
    notificationDiv.innerHTML = notificationHTML;
}
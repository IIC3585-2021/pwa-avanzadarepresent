// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.;

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const functions = require("firebase-functions");

const cors = require('cors')({
  origin: true,
});

admin.initializeApp();
// [END import]

exports.postsFeed = functions.https.onRequest((request, response) => {

})

// [START addMessage]
exports.addPost = functions.https.onRequest(async function (req, res) {
  // Grab the text parameter.

  return cors(req, res, async() => {
    const original = req.query;
    // [START adminSdkAdd]
    // Push the new message into Firestore using the Firebase Admin SDK.
    console.log(original)
    const writeResult =  admin.firestore().collection('posts').add(original);
    // Send back a message that we've successfully written the message
    res.json({result: writeResult.id});
  })
  // [END adminSdkAdd]
});
// [END addMessage]


// [START getPosts]
exports.getPosts = functions.https.onRequest(async function (req, res) {
  
  return cors(req, res, async () => {
    const postsRef = admin.firestore().collection('posts');
    const snapshot = await postsRef.get();
    const data = {};
    snapshot.forEach(doc => {
      let datita = doc.data()
      data[doc.id] = {...datita};
    });
    res.json({result: data});
  })
  
});
// [END getPosts]


// [START sendLikeCloud]
exports.sendLikeCloud = functions.https.onRequest(async function (req, res) {
    // Grab the text parameter.
    return cors(req, res, async () => {
      // Atomically add a new region to the "regions" array field.
      admin.firestore().collection('posts').doc(req.body.data.postId).update({
        likes: admin.firestore.FieldValue.arrayUnion(req.body.data.email)
      });
      res.json({data: 200})
  })
});
// [END sendLikeCloud]

// // Initialize the FirebaseUI widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#firebaseui-auth-container', uiConfig);

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/8.6.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="/__/firebase/8.6.0/firebase-analytics.js"></script>

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>

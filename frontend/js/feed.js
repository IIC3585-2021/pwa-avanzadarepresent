window.onload = () => {
    "use strict";
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js");
    }  
    getFeed();
  };


window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
  
function updateStatus() {
  if (navigator.onLine){
    alert("Conexión reestablecida");
    getFeed();
  } else {
    alert("Se ha perdido su conexión, se mantendrán sus cambios en caché")
  }
}
  

firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      alert("Muchas pestañas abiertas, no se puede guardar caché")
    } else if (err.code == 'unimplemented') {
      alert("No podemos guardar cosas en caché debido a que tu navegador no lo soporta")
    }
  });

function addLike(postHTML) {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert("Necesitas ingresar para dar ❤️");
    return;
  }
  const postId = postHTML.id;
  postHTML.disabled = true;
  const firestore = firebase.firestore();
  var userEmail = user.email;
  firestore.collection("posts").doc(postId)
    .update({
      likes: firebase.firestore.FieldValue.arrayUnion(userEmail)
    }).then(() => {
      postHTML.disabled = false;
      getFeed();
    })
}

function removeLike(postHTML) {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert("Necesitas ingresar para quitar ❤️");
    return;
  }
  const postId = postHTML.id;
  postHTML.disabled = true;
  const firestore = firebase.firestore();
  var userEmail = user.currentUser.email;
  firestore.collection("posts").doc(postId)
    .update({
        likes: firebase.firestore.FieldValue.arrayRemove(userEmail)
    }).then(() => {
      postHTML.disabled = false;
      getFeed();
    })
}


function generateCardHTML(key, post) {
  const user = firebase.auth().currentUser;
  const userLikedPost = user ? post.likes.includes(user.email) : false;
  const buttonText = userLikedPost ? "Quitarle ❤️  a este post" : "Darle ❤️  a este post";
  const likeFunction = userLikedPost ? "removeLike" : "addLike"
  return `
    </br>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${post.author}</h6>
            <p class="card-text">${post.body}</p>
            <button id="${key}" onclick="${likeFunction}(this)" class="btn btn-primary">${buttonText}</button>
            <div class="card-footer text-muted">
                ${post.likes.length} ❤️  recibidos
            </div>
        </div>
    </div>
    `
}


function getFeed() {    
  let postsFeed = document.getElementById('posts-feed');
  postsFeed.innerHTML = "";
  const firestore = firebase.firestore();
  firestore.collection("posts").orderBy("created_at", "desc")
    .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const id = change.doc.id;
        generateAndInsertPost(id, data);
      });
    });
  if ( !navigator.onLine ) {
    alert("Te encuentras offline, por lo que no se pueden cargar nuevos posts")
  }
}

function createPost() {
    const titleField = document.getElementById('post-title');
    const bodyField = document.getElementById('post-body')
    let title = titleField.value;
    let body = bodyField.value;
    let user = firebase.auth().currentUser;
    const loadingButton = document.getElementById("create-post-loading");
    const createPostButton = document.getElementById("create-post");
    loadingButton.style.display = "block";
    createPostButton.style.display = "none";    
    if (user && title && body) {
      let now = new Date();
      let post = {title, body, author: user.email, likes: [], created_at: now};
      const firestore = firebase.firestore()
      firestore.collection('posts').add(post).then(() => {
            titleField.value = "";
            bodyField.value = "";
            getFeed();
            loadingButton.style.display = "none";
            createPostButton.style.display = "block";
      })
    } else if (!title || !body) {
        loadingButton.style.display = "none";
        createPostButton.style.display = "block";
        alert("No pueden haber campos vacíos");
    } else {
        alert("Debes iniciar sesión primero")
        loadingButton.style.display = "none";
        createPostButton.style.display = "block";
    }
}

function generateAndInsertPost(key, post) {
  let postsFeed = document.getElementById('posts-feed');
  let htmlText = generateCardHTML(key, post);
  postsFeed.insertAdjacentHTML('beforeend', htmlText);
}

const createPostFeed = document.getElementById("create-post");
createPostFeed.onclick = createPost;

const getPostsButton = document.getElementById("get-posts-feed");
getPostsButton.onclick = getFeed;

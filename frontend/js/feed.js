window.onload = () => {
    "use strict";
    console.log("Antes del sw")
    if ("serviceWorker" in navigator) {
      console.log("Dentro del sw")

      navigator.serviceWorker.register("./sw.js");
    }
    firebase.messaging().getToken({vapidKey: 'BFT2TPFfJf2AEvALQHZmSB21RpvacCYLU9f020E8oK3pCGgxV-nqICnZU0H3Qr2swKv-AfTi-WX4jCeTuvf0tGk'}).then(response => console.log(response));
  
    getFeed()
  };

const sendLikes = function(postId) {
    var user = firebase.auth().currentUser;
    // Add the public key generated from the console here.
    var sendLikeCloud = firebase.functions().httpsCallable('sendLikeCloud');
    sendLikeCloud({email: user.email, postId: postId}).catch(error => {
        console.log(error);
    })
}


const generateCardHTML = function(key, post) {

    return `
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${post.author}</h6>
            <p class="card-text">${post.body}</p>
            <button id="${key}" onclick="sendLikes('${key}')" class="btn btn-primary">Darle ❤️  a este post</button>
            <div class="card-footer text-muted">
                ${post.likes.length} ❤️  recibidos
            </div>
        </div>
    </div>
    `
}


const getFeed = function () {
    
    let postsFeed = document.getElementById('posts-feed');

    if (navigator.onLine) {
        var getPosts = firebase.functions().httpsCallable('getPosts');
        getPosts().then(response => {
            console.log(response)
            postsFeed.innerHTML = "";
            Object.entries(response.data).forEach((items) => {
                generateAndInsertPost(items[0], items[1]);
            });
        }).catch(error => {
            console.log(error);
        })     
    } else {
        postsFeed.innerHTML = `
        <div class="alert alert-light" role="alert">
            Te encuentras offline, por lo que no se pueden cargar los posts
        </div>
        `;
    }
}

const createPost = () => {
    let title = document.getElementById('post-title').value
    let body = document.getElementById('post-body').value
    let user = firebase.auth().currentUser
    let post = {title, body, author: user.email, likes: []}
    const firestore = firebase.firestore()
    firestore.collection('posts').add(post).then(() => {getFeed()})
}

const generateAndInsertPost = (key, post) => {
    let postsFeed = document.getElementById('posts-feed');
    let htmlText = generateCardHTML(key, post);
    postsFeed.insertAdjacentHTML('beforeend', htmlText);
}

const createPostFeed = document.getElementById("create-post");
createPostFeed.onclick = createPost;

const getPostsButton = document.getElementById("get-posts-feed");
getPostsButton.onclick = getFeed;

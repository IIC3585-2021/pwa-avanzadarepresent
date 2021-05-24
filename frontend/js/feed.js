window.onload = () => {
    "use strict";
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js");
    }  
    getFeed();
  };

const sendLikes = function(postId) {
    var user = firebase.auth().currentUser;
    // Add the public key generated from the console here.
    var sendLikeCloud = firebase.functions().httpsCallable('sendLikeCloud');
    sendLikeCloud({email: user.email, postId: postId}).catch(error => {
        console.log(error);
    })
}


function generateCardHTML(key, post) {

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


function getFeed() {
    
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
        let post = {title, body, author: user.email, likes: []};
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
        loadingButton.style.display = "none";
        createPostButton.style.display = "block";
        alert("Debes iniciar sesión primero")
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

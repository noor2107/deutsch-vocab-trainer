firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();

const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();


let currentUser = null;



auth.onAuthStateChanged(function(user){

    currentUser = user;

    updateAuthUI(user);

});



function updateAuthUI(user){


    const container =
    document.getElementById("auth-container");


    if(!container) return;



    if(user){

        container.innerHTML = `

        <div class="user-info">

            <img src="${user.photoURL || ''}"
                 alt=""
                 class="user-avatar">

            <span class="user-name">
            ${user.displayName || user.email}
            </span>

            <button onclick="logout()"
                    class="logout-btn">
            Logout
            </button>

        </div>

        `;

    }

    else{

        container.innerHTML = `

        <button onclick="login()"
                class="login-btn">
        Login with Google
        </button>

        `;

    }

}



function login(){

    auth.signInWithPopup(provider)

    .catch(function(error){

        console.error("Login error:", error);

        alert("Login failed. Please try again.");

    });

}



function logout(){

    auth.signOut()

    .catch(function(error){

        console.error("Logout error:", error);

    });

}



function waitForAuth(){

    return new Promise(function(resolve){

        const unsubscribe =
        auth.onAuthStateChanged(function(user){

            unsubscribe();

            resolve(user);

        });

    });

}

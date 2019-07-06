window.addEventListener('DOMContentLoaded', (event) => {
    const firebaseConfig = {
        apiKey: "AIzaSyCCYFTuG_u2Pl0khUh9xCZUNHM5tCk4ndk",
        authDomain: "foodplanner-984a5.firebaseapp.com",
        databaseURL: "https://foodplanner-984a5.firebaseio.com",
        projectId: "foodplanner-984a5",
        storageBucket: "",
        messagingSenderId: "669112832711",
        appId: "1:669112832711:web:5ac34b62953a811c"
    };

    firebase.initializeApp(firebaseConfig);

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
        'display': 'popup'
    });

    const auth = firebase.auth();
    auth.languageCode = 'it_IT';

    document.getElementById('login').onclick = function () {
        signIn(auth, provider);
    }
});

function signIn(auth, provider) {
    auth.signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;

        document.getElementById('login').classList.add("hidden");
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        console.error(error);

        alert("Couldn't Sign-In");
    });
}
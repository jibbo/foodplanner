"use strict";

window.addEventListener('DOMContentLoaded', (event) => {
    initFirebase();
    // TODO figure out how to do auth in this file for every js
});

function initFirebase() {
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
}
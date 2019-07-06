class Auth {

    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        this.provider.setCustomParameters({
            'display': 'popup'
        });

        this.auth = firebase.auth();
        this.auth.languageCode = 'it_IT';
    }

    signIn() {
        const myAuth = this;
        this.auth.signInWithPopup(this.provider).then(function (result) {
            var token = result.credential.accessToken;
            myAuth.user = result.user;

            document.getElementById('login').classList.add("hidden");
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            console.error(error);

            alert("Couldn't Sign-In");
        });

    }
}
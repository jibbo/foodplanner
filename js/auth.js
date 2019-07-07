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

    signIn(callback) {
        const myAuth = this;
        this.auth.signInWithPopup(this.provider).then(function (result) {
            var token = result.credential.accessToken;
            myAuth._user = result.user;
            callback();
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            console.error(error);

            alert("Couldn't Sign-In");
        });

    }

    get user() {
        return this._user;
    }
}
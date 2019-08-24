class Auth {

    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.setCustomParameters({
            'display': 'popup'
        });

        this.auth = firebase.auth();
        this.auth.languageCode = 'it_IT';

        this.auth.onAuthStateChanged(function (user) {
            if (user) {
                this._user = user;
            } else {
                this._user = null;
            }
        });
    }

    signIn(successListener, errorListener) {
        var myThis = this;
        this.auth.signInWithPopup(this.provider).then(function (result) {
            myThis._user = result.user;
            successListener(result.user);
        }).catch(function (error) {
            errorListener(error);
        });

    }

    get user() {
        return this._user;
    }
}
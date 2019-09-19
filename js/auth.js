class Auth {

    constructor(onAuthListener) {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.setCustomParameters({
            'display': 'popup'
        });

        this.auth = firebase.auth();
        this.auth.languageCode = 'it_IT';

        this._user = this.currentUser;

        this.auth.onAuthStateChanged(function (user) {
            if (user) {
                this._user = user;
            } else {
                this._user = null;
            }
            onAuthListener(this._user);
        });
    }

    signIn(successListener, errorListener) {
        var myThis = this;
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                return myThis.auth.signInWithPopup(this.provider)
                    .then(function (result) {
                        myThis._user = result.user;
                        successListener(result.user);
                    })
                    .catch(function (error) {
                        errorListener(error);
                    });
            }).catch(function (error) {
                errorListener(error);
            });;

    }

    get user() {
        return this._user;
    }
}
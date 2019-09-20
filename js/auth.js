class Auth {

    constructor(onAuthListener) {

        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.setCustomParameters({
            'display': 'popup'
        });

        this.auth = firebase.auth();
        this.auth.languageCode = 'it_IT';

        let myThis = this;
        this.auth.onAuthStateChanged((user) => {
            myThis._user = user
            onAuthListener(user);
        });
    }

    signIn(successListener, errorListener) {
        let myThis = this;
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
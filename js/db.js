class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        return this.storage.collection("plans").doc(user.uid).get();
    }

    save(user, plan) {
        this.storage.collection("plans").doc(user.uid).set(plan);
    }
}
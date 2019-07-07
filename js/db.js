class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        // TODO make usage of user
        // return this.storage.collection("plans").doc(user.uid).get();
        return this.storage.collection("plans").doc("plan").get();
    }

    save(user, plan) {
        // TODO make usage of user
        // this.storage.collection("plans").doc(user.uid).set(plan);
        this.storage.collection("plans").doc("plan").set(plan);
    }
}
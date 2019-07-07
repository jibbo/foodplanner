class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        this.storage.collection("plans").doc(user.uid);
    }

    save(user, plan) {
        plan.userId = user.uid;
        this.storage.collection("plans").doc(user.uid).set(plan);
    }
}
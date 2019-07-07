class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        this.storage.collection("plans").doc(user.id);
    }

    save(user, plan) {
        plan.userId = user.uid;
        this.storage.collection("plans").doc(plan.userId).set(plan);
    }
}
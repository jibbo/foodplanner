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
        plan["userId"] = user.uid;
        this.storage.collection("plans").doc("plan").set(plan);
    }
}
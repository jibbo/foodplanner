class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        this.storage.collection("plans").where("userId", "==", user.id + "");
    }

    save(user, plan) {
        plan.userId = user.uid;
        this.storage.collection("plans").add(plan);
    }
}
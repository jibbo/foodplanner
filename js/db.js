class Db {

    constructor() {
        this.storage = firebase.firestore();
    }

    read(user) {
        this.storage.collection("plans").where("userId", "==", user.id + "");
    }

    save(plan) {
        this.storage.collection("plans").add(plan);
    }
}
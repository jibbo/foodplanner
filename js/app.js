"use strict";

window.addEventListener('DOMContentLoaded', (event) => {
    const firebaseConfig = {
        apiKey: "AIzaSyCCYFTuG_u2Pl0khUh9xCZUNHM5tCk4ndk",
        authDomain: "foodplanner-984a5.firebaseapp.com",
        databaseURL: "https://foodplanner-984a5.firebaseio.com",
        projectId: "foodplanner-984a5",
        storageBucket: "",
        messagingSenderId: "669112832711",
        appId: "1:669112832711:web:5ac34b62953a811c"
    };

    firebase.initializeApp(firebaseConfig);

    const db = new Db();
    const auth = new Auth((user) => {
        //register all listeners
        if (auth.user == null) {
            foodPlanner.generatePlan();
            foodPlanner.showComputedSections();
        } else {
            console.log("logged as: " + user);
            $('#login').classList.add("hidden");
            cleanup();
            foodPlanner.importPlan(auth.user, db, () => {
                foodPlanner.showComputedSections();
            });
        }
    });
    const foodPlanner = new FoodPlanner();



    $('#login').onclick = function () {
        auth.signIn((user) => {
            console.log("logged as: " + user);
            $('#login').classList.add("hidden");
            cleanup();
            foodPlanner.importPlan(user, db, () => {
                foodPlanner.showComputedSections();
            });
        }, (error) => {
            console.error(error);
            alert("Couldn't Sign-In");
        });
    }

    $('#save').onclick = function () {
        const plan = foodPlanner.readPlanJSON();
        if (auth.user != null) {
            db.save(auth.user, plan)
            alert("saved");
        } else {
            const currentDietCSV = foodPlanner.readPlanCSV();
            this.href = "data:text/csv;charset=utf-8," + encodeURI(currentDietCSV);
            this.target = "_blank";
            this.download = new Date().toLocaleDateString() + ".csv"
        }
    }

    $('#import').onclick = function () {
        foodPlanner.importPlan(auth.user, db);
    }

    $('#print').onclick = function () {
        window.print();
    }

    $('#refresh').onclick = function () {
        cleanup();
        foodPlanner.generatePlan();
        foodPlanner.showComputedSections();
    }

    var cleanup = function () {
        $('#tableBody').innerHTML = ""
        $('#todayContent').innerHTML = ""
        $('#tomorrowContent').innerHTML = ""
    }
});
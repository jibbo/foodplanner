"use strict";

window.addEventListener('DOMContentLoaded', (event) => {
    const db = new Db();
    const auth = new Auth();
    const foodPlanner = new FoodPlanner();

    //register all listeners
    if (auth.user == null) {
        $('#login').onclick = function () {
            auth.signIn((user) => {
                console.log("logged as: " + user);
                $('#login').classList.add("hidden");
            }, (error) => {
                console.error(error);
                alert("Couldn't Sign-In");
            });
        }

        foodPlanner.generatePlan();
        foodPlanner.showComputedSections();
    } else {
        foodPlanner.importPlan(auth.user, db, () => {
            foodplanner.showComputedSections();
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
        $('#tableBody').innerHTML = ""
        $('#todayContent').innerHTML = ""
        $('#tomorrowContent').innerHTML = ""
        foodPlanner.generatePlan();
        foodPlanner.showComputedSections();
    }
});
window.addEventListener('DOMContentLoaded', (event) => {

    // move auth outside
    const auth = new Auth((user) => {
        //register all listeners
        if (auth.user == null) {
            foodPlanner.generatePlan();
            foodPlanner.showComputedSections();
        } else {
            console.log("logged as: " + user);
            $('#login').addClass("hidden");
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
            $('#login').addClass("hidden");
            cleanup();
            foodPlanner.importPlan(user, db, () => {
                foodPlanner.showComputedSections();
            });
        }, (error) => {
            console.error(error);
            snackbar("Couldn't Sign-In");
        });
    }

    $('#save').onclick = function () {
        const plan = foodPlanner.readPlanJSON();
        if (auth.user != null) {
            db.save(auth.user, plan)
            snackbar("Saved!", true);
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
});

function cleanup() {
    $('#tableBody').innerHTML = ""
    $('#todayContent').innerHTML = ""
    $('#tomorrowContent').innerHTML = ""
}
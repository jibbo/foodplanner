"use strict";

const DEBUG = window.location.href.indexOf("localhost") > 0;

var _user;

window.addEventListener('DOMContentLoaded', (event) => {
    const db = new Db();
    const auth = new Auth();

    // main
    importPlan(_user, db, () => {
        showComputedSections();
    });

    //register all listeners
    if (_user == null) {
        document.getElementById('login').onclick = function () {
            auth.signIn((user) => {
                _user = user
                console.log("logged as: " + _user);
                document.getElementById('login').classList.add("hidden");
            }, (error) => {
                console.error(error);
                alert("Couldn't Sign-In");
            });
        }
    }

    document.getElementById('save').onclick = function () {
        const plan = readPlanJSON();
        if (_user != null) {
            db.save(_user, plan)
            alert("saved");
        } else {
            const currentDietCSV = readPlanCSV();
            this.href = "data:text/csv;charset=utf-8," + encodeURI(currentDietCSV);
            this.target = "_blank";
            this.download = new Date().toLocaleDateString() + ".csv"
        }
    }

    document.getElementById('import').onclick = function () {
        importPlan(_user, db);
    }

    document.getElementById('print').onclick = function () {
        window.print();
    }

    document.getElementById('refresh').onclick = function () {
        document.getElementById('tableBody').innerHTML = ""
        generatePlan();
    }
});


var showComputedSections = function () {
    // Monday is the first day of the week
    var dayOfWeek = new Date().getDay();
    if (dayOfWeek == 0) {
        dayOfWeek = 6;
    } else {
        dayOfWeek -= 1;
    }

    computeDaySection(dayOfWeek, document.getElementById('todayContent'));
    computeDaySection(dayOfWeek + 1, document.getElementById('tomorrowContent'));
}

var computeDaySection = function (dayIndex, parentElement) {
    const foodTable = document.getElementById('foodTable');

    for (var i = 0; i < mealNames.length; i++) {
        // first row and col contain only names, they can be skipped
        const elem = foodTable.rows[i + 1].cells[dayIndex + 1].textContent;
        var divElement = document.createElement("div");
        divElement.classList.add("card");
        divElement.classList.add("card-fixed");
        // divElement.classList.add("left");
        var hElement = document.createElement("h3");
        var pElement = document.createElement("p");
        hElement.textContent = mealNames[i];
        pElement.innerHTML = elem.replace(/\+/g, "<br/ > ");
        divElement.appendChild(hElement);
        divElement.appendChild(pElement);
        parentElement.appendChild(divElement);
    }
}

var generatePlan = function () {
    // breakfast row
    generateRow(breakfast, mealNames[0], (elem) => elem);

    // lunch row
    generateRow(lunchProteins, mealNames[1], (elem) => {
        return mealBase[0] + ' + ' + lunchBase[0] + ' + ' + elem
    });

    // dinner row
    generateRow(dinnerProteins, mealNames[2], (elem) => {
        return mealBase[0] + ' + ' + arrRnd(dinnerCereals) + ' + ' + elem + ' + ' + dinnerBase;
    });
}

var generateRow = function (arr, name, compositionRule) {
    if (DEBUG) {
        console.log(name + " phase");
    }
    var trElement = document.createElement("tr");
    var thElement = document.createElement("th");
    thElement.textContent = name;
    trElement.appendChild(thElement);
    for (var i = 0; i < 7; i++) {
        var elem = compositionRule(arrRnd(arr));
        var tdElement = document.createElement("td");
        var pElement = document.createElement("small");
        pElement.textContent = elem;
        pElement.setAttribute("contenteditable", "true");

        trElement.appendChild(tdElement);
        tdElement.appendChild(pElement);
    }
    document.getElementById('tableBody').appendChild(trElement);
}

var arrRnd = function (arr) {
    const sumWeights = computeSumWeight(arr);
    const pivot = randomInt(sumWeights);
    var index = pivot;
    for (var i = 0; i < arr.length; i++) {
        index = index - arr[i]['weight'];
        if (index <= 0) {
            if (DEBUG) {
                console.log("Found: [" + i + "/" + arr.length + "](" + pivot + "/" + sumWeights + ")");
            }
            return arr[i]['name'];
        }
    }
    return "N/A";
};

var computeSumWeight = function (arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]['weight'];
    }
    return sum;
};

var randomInt = function (max) {
    return parseInt(Math.random() * max + 1);
};

var importPlan = function (user, db, callback) {
    document.getElementById('tableBody').innerHTML = ""
    db.read(user)
        .then(function (doc) {
            if (DEBUG) {
                console.log(doc);
            }
            // todo remove 3 with more appropiate stuff
            for (var i = 0; i < mealNames.length; i++) {
                var trElement = document.createElement("tr");
                var thElement = document.createElement("th");
                thElement.textContent = mealNames[i];
                trElement.appendChild(thElement);
                for (var j = 0; j < 7; j++) {
                    var elem = doc.data()[i][j];
                    var tdElement = document.createElement("td");
                    var pElement = document.createElement("small");
                    pElement.textContent = elem;
                    pElement.setAttribute("contenteditable", "true");
                    trElement.appendChild(tdElement);
                    tdElement.appendChild(pElement);
                }
                document.getElementById('tableBody').appendChild(trElement);
            }
            callback();
        })
        .catch(function (error) {
            console.error(error);
        });
}

var readPlanCSV = function () {
    var csv = "";
    var table = document.getElementById("foodTable");
    for (var i = 0; i < table.rows.length; i++) {
        // starts from one to skip the left column which contains useless stuff
        for (var j = 1; j < table.rows[i].cells.length; j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            var elem = table.rows[i].cells[j].textContent;
            csv += elem + ",";
        }
        csv += "\n";
    }
    return csv;
}

var readPlanJSON = function () {
    var json = {};
    var table = document.getElementById("foodTable");
    // starts from one to skip headers of table
    for (var i = 1; i < table.rows.length; i++) {
        json[i - 1] = {};
        for (var j = 1; j < table.rows[i].cells.length; j++) {
            var elem = table.rows[i].cells[j].textContent;
            json[i - 1][j - 1] = elem;
        }
    }
    return json;
}

const mealNames = ["Colazione", "Pranzo", "Cena"]

// TODO this should all be moved to DB
const breakfast = [
    { name: "200ml Latte vegetale + 1 yogurt greco 0% + 70 gr di pane ai cereali oppure 40 gr di fette biscottate di farro/kamut/cereali + 30 gr di frutta secca oleosa + 1 frutto fresco 150 gr", weight: 7 },
    { name: "100gr Chia pudding+ 200ml latte vegetale+ 40 gr di muesli oppure 40 gr di fette biscottate di farro / kamut / cereali + 1 frutto fresco 150 gr", weight: 7 },
    { name: "200ml Latte vegetale + 1 yogurt greco 0 % + torta allo yogurt 70 gr + 30 gr di frutta secca ammollata + 1 frutto fresco 150 gr", weight: 7 },
    { name: "150 ml di latte vegetale con calcio aggiunto + pancake + 3 biscotti biologici + 30 gr di frutta secca + frutta secca 30 gr + 1 frutto fresco 150 gr", weight: 7 },
    { name: "200ml Latte vegetale + frittata di 1 uovo e 2 albumi(70 gr) + 40 gr di fette biscottate di farro / kamut / cereali o 70 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 2 },
    { name: "200ml Latte vegetale + asiago 50 gr + 40 gr di fette biscottate di farro / kamut / cereali o 70 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 1 },
    { name: "200ml Latte vegetale + hummus 200 gr + 30 gr di fette biscottate di farro / kamut / cereali o 50 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 7 }
];

const mealBase = [
    "Verdure crude 50gr"
]

const lunchBase = [
    "80gr cereali conditi con 200gr di verdure + Pane 40gr"
];

const lunchProteins = [
    { name: "Legumi 200gr (secchi 70gr)", weight: 7 },
    { name: "Cecina 200gr", weight: 7 },
    { name: "Tempeh 90gr", weight: 2 },
    { name: "Seitan 70gr", weight: 1 },
    { name: "Parmiggiano 20gr", weight: 1 },
    { name: "Monte Veronese 50gr", weight: 1 },
    { name: "Mozzarella 100gr", weight: 1 },
    { name: "2 uova", weight: 2 },
    { name: "Pesce (salmone/ sgombro) 50gr", weight: 2 }
];

const dinnerBase = [
    "200gr verdure"
]

const dinnerCereals = [
    { name: "Pane cereali 80gr", weight: 7 },
    { name: "farro 80gr", weight: 7 },
    { name: "quinoa 50gr", weight: 7 }
];

const dinnerProteins = [
    { name: "200gr tofu", weight: 1 },
    { name: "200gr tempeh", weight: 2 },
    { name: "200gr pesce", weight: 2 },
    { name: "140 gr pasta lenticchie", weight: 7 },
    { name: "200 gr burger lupini", weight: 3 },
];
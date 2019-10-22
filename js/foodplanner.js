"use strict";

class FoodPlanner {

    // TODO cleanup dayOfTheWeek and tomorrow
    showComputedSections() {
        // Monday is the first day of the week
        let dayOfWeek = new Date().getDay();
        if (dayOfWeek == 0) {
            dayOfWeek = 6;
        } else {
            dayOfWeek -= 1;
        }

        this.computeDaySection(dayOfWeek, $('#todayContent'));
        let tomorrow = dayOfWeek + 1;
        if (tomorrow == 7) {
            tomorrow = 0;
        }
        this.computeDaySection(tomorrow, $('#tomorrowContent'));
    }

    computeDaySection(dayIndex, parentElement) {
        const foodTable = $('#foodTable');

        for (let i = 0; i < mealNames.length; i++) {
            // first row and col contain only names, they can be skipped
            const elem = foodTable.rows[i + 1].cells[dayIndex + 1].textContent;
            let divElement = document.createElement("div");
            divElement.classList.add("card");
            divElement.classList.add("card-fixed");
            let hElement = document.createElement("h3");
            let pElement = document.createElement("p");
            hElement.textContent = mealNames[i];
            pElement.textContent = elem;
            divElement.appendChild(hElement);
            divElement.appendChild(pElement);
            parentElement.appendChild(divElement);
        }
    }

    generatePlan() {
        // breakfast row
        this.generateRow(breakfast, mealNames[0], (elem) => elem);

        // lunch row
        this.generateRow(lunchProteins, mealNames[1], (elem) => {
            return mealBase[0] + ' + ' + lunchBase[0] + ' + ' + elem
        });

        // dinner row
        this.generateRow(dinnerProteins, mealNames[2], (elem) => {
            return mealBase[0] + ' + ' + this.arrRnd(dinnerCereals) + ' + ' + elem + ' + ' + dinnerBase;
        });
    }

    generateRow(arr, name, compositionRule) {
        console.log(name + " phase");
        let trElement = document.createElement("tr");
        let thElement = document.createElement("th");
        thElement.textContent = name;
        trElement.appendChild(thElement);
        for (let i = 0; i < 7; i++) {
            let elem = compositionRule(this.arrRnd(arr));
            let tdElement = document.createElement("td");
            let pElement = document.createElement("small");
            pElement.textContent = elem;
            pElement.setAttribute("contenteditable", "true");

            trElement.appendChild(tdElement);
            tdElement.appendChild(pElement);
        }
        $('#tableBody').appendChild(trElement);
    }

    arrRnd(arr) {
        const sumWeights = this.computeSumWeight(arr);
        const pivot = this.randomInt(sumWeights);
        let index = pivot;
        for (let i = 0; i < arr.length; i++) {
            index = index - arr[i]['weight'];
            if (index <= 0) {
                console.log("Found: [" + i + "/" + arr.length + "](" + pivot + "/" + sumWeights + ")");
                return arr[i]['name'];
            }
        }
        return "N/A";
    };

    computeSumWeight(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i]['weight'];
        }
        return sum;
    };

    randomInt(max) {
        return parseInt(Math.random() * max + 1);
    };

    importPlan(user, db, callback) {
        $('#tableBody').innerHTML = ""
        db.read(user)
            .then(function (doc) {
                console.log(doc);
                for (let i = 0; i < mealNames.length; i++) {
                    let trElement = document.createElement("tr");
                    let thElement = document.createElement("th");
                    thElement.textContent = mealNames[i];
                    trElement.appendChild(thElement);
                    for (let j = 0; j < 7; j++) {
                        let elem = doc.data()[i][j];
                        let tdElement = document.createElement("td");
                        let pElement = document.createElement("small");
                        pElement.textContent = elem;
                        pElement.setAttribute("contenteditable", "true");
                        trElement.appendChild(tdElement);
                        tdElement.appendChild(pElement);
                    }
                    $('#tableBody').appendChild(trElement);
                }
                callback();
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    readPlanCSV() {
        let csv = "";
        let table = document.getElementById("foodTable");
        for (let i = 0; i < table.rows.length; i++) {
            // starts from one to skip the left column which contains useless stuff
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                let elem = table.rows[i].cells[j].textContent;
                csv += elem + ",";
            }
            csv += "\n";
        }
        return csv;
    }

    readPlanJSON() {
        let json = {};
        let table = document.getElementById("foodTable");
        // starts from one to skip headers of table
        for (let i = 1; i < table.rows.length; i++) {
            json[i - 1] = {};
            for (let j = 1; j < table.rows[i].cells.length; j++) {
                let elem = table.rows[i].cells[j].textContent;
                json[i - 1][j - 1] = elem;
            }
        }
        return json;
    }
}


const mealNames = ["Breakfast", "Lunch", "Dinner"]

// TODO this should all be moved to DB
const breakfast = [
    { name: "1 vasetto yougurt greco 0%", weight: 7 },
    { name: "1 uovo + 2 albumi", weight: 2 }
];

const mealBase = [
    "Verdure crude 50gr"
]

const lunchBase = [
    "80gr cereali conditi con 200gr di verdure"
];

const lunchProteins = [
    { name: "Legumi 200gr (secchi 70gr)", weight: 7 },
    { name: "Mozzarella 100gr", weight: 1 },
    { name: "2 uova", weight: 2 },
    { name: "Pesce 200gr", weight: 2 },
    { name: "Pollo 200gr", weight: 2 }
];

const dinnerBase = [
    "200gr verdure"
]

const dinnerCereals = [
    { name: "Pane cereali 80gr", weight: 7 },
    { name: "cereali 80gr", weight: 7 },
];

const dinnerProteins = [
    { name: "150gr tempeh", weight: 2 },
    { name: "150gr pollo", weight: 3 },
    { name: "150gr coniglio", weight: 3 },
    { name: "150gr pesce bianco", weight: 3 },
];
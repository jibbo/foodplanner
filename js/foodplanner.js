"use strict";

class FoodPlanner {

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
        if (dayOfWeek == 7) {
            tomorrow == 0;
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
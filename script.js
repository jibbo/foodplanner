"use strict";

const DEBUG = false;

const breakfast = [
    { name: "Latte vegetale con calcio aggiunto 200 ml + 1 yogurt greco 0% + 70 gr di pane ai cereali oppure 40 gr di fette biscottate di farro/kamut/cereali + 30 gr di frutta secca oleosa + 1 frutto fresco 150 gr", weight: 7 },
    { name: "Chia pudding + latte vegetale con calcio aggiunto 200 ml + 40 gr di muesli oppure 40 gr di fette biscottate di farro / kamut / cereali + 1 frutto fresco 150 gr", weight: 7 },
    { name: "Latte vegetale con calcio aggiunto 200 ml + 1 yogurt greco 0 % + torta allo yogurt 70 gr + 30 gr di frutta secca ammollata + 1 frutto fresco 150 gr", weight: 7 },
    { name: "150 ml di latte vegetale con calcio aggiunto + pancake + 3 biscotti biologici + 30 gr di frutta secca + frutta secca 30 gr + 1 frutto fresco 150 gr", weight: 7 },
    { name: "Latte vegetale con calcio aggiunto 200 ml + frittata di 1 uovo e 2 albumi(70 gr) + 40 gr di fette biscottate di farro / kamut / cereali o 70 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 2 },
    { name: "Latte vegetale con calcio aggiunto 200 ml + asiago 50 gr + 40 gr di fette biscottate di farro / kamut / cereali o 70 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 1 },
    { name: "Latte vegetale con calcio aggiunto 200 ml + hummus 200 gr + 30 gr di fette biscottate di farro / kamut / cereali o 50 gr di pane ai cereali + verdura facoltativa q.b. + 30 gr di frutta secca ammollata + 1 frutto fresco 150", weight: 7 }
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
    "Pane cereali 80gr",
    "farro 80gr",
    "quinoa 50gr",
];

const dinnerProteins = [
    { name: "200gr tofu", weight: 1 },
    { name: "200gr tempeh", weight: 2 },
    { name: "200gr pesce", weight: 2 },
    { name: "140 gr pasta lenticchie", weight: 7 },
    { name: "200 gr burger lupini", weight: 3 },
];

// since bootstrap will be bundle jQuery, I could use it but I don't want to...

window.addEventListener('DOMContentLoaded', (event) => {
    // breakfast row
    var trElement = document.createElement("tr");
    var thElement = document.createElement("th");
    thElement.textContent = "Colazione";
    trElement.appendChild(thElement);
    for (var i = 0; i < 6; i++) {
        var tdElement = document.createElement("td");
        var pElement = document.createElement("small");
        pElement.textContent = arrRnd(breakfast);
        trElement.appendChild(tdElement);
        tdElement.appendChild(pElement);
    }
    document.getElementById('tableBody').appendChild(trElement);

    // lunch row
    trElement = document.createElement("tr");
    thElement = document.createElement("th");
    thElement.textContent = "Pranzo";
    trElement.appendChild(thElement);
    for (var i = 0; i < 6; i++) {
        var tdElement = document.createElement("td");
        var pElement = document.createElement("small");
        pElement.textContent = mealBase[0] + ' + ' + lunchBase[0] + ' + ' + arrRnd(lunchProteins);
        trElement.appendChild(tdElement);
        tdElement.appendChild(pElement);
    }
    document.getElementById('tableBody').appendChild(trElement);

    // dinner row
    trElement = document.createElement("tr");
    thElement = document.createElement("th");
    thElement.textContent = "Cena";
    trElement.appendChild(thElement);
    for (var i = 0; i < 6; i++) {
        var tdElement = document.createElement("td");
        var pElement = document.createElement("small");
        pElement.textContent = mealBase[0] + ' + ' + dinnerCereals[i % dinnerCereals.length] + ' + ' + arrRnd(dinnerProteins) + ' + ' + dinnerBase;
        trElement.appendChild(tdElement);
        tdElement.appendChild(pElement);
    }
    document.getElementById('tableBody').appendChild(trElement);

    //register all listeners
    document.getElementById('print').onclick = function () {
        window.print();
    }
});

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
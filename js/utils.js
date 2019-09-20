"use strict";

// This makes writing to the console only in debug
(function () {
    const DEBUG = window.location.href.indexOf("localhost") > 0 || window.location.href.startsWith("file://");

    var preservedConsoleLog = console.log;

    console.log = function () {
        if (DEBUG) {
            preservedConsoleLog.apply(console, arguments);
        }
    }
})();

function $(qualifier) {
    const prefix = qualifier.charAt(0);
    let elem = {}
    if (prefix == "#") {
        elem = document.getElementById(qualifier.substring(1));
    } else if (prefix == ".") {
        elem = document.getElementsByClassName(qualifier.substring(1));
    } else {
        throw "Element not found";
    }

    elem.addClass = function (className) {
        this.classList.add(className);
    }

    elem.removeClass = function (className) {
        this.classList.remove(className);
    }

    return elem;
}
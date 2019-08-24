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
    if (prefix == "#") {
        return document.getElementById(qualifier.substring(1));
    } else if (prefix == ".") {
        return document.getElementsByClassName(qualifier.substring(1));
    } else {
        return null;
    }
}
let socket = new WebSocket("ws://localhost:8000");
let mes = "";

console.log("Loaded");

function clearMessage() {
    const after = document.getElementById("chain");
    after.value = "";
}

function sendMessage() {
    const text1 = document.getElementById("name");
    const text2 = document.getElementById("message");
    const after = document.getElementById("chain");

    if (
        typeof text1 == "undefined" ||
        text1 == null ||
        typeof text2 == "undefined" ||
        text2 == null ||
        typeof after == "undefined" ||
        after == null
    ) {
        console.log("Error in searching text areas!");
        return;
    }
    name = text1.value;
    message = text2.value;
    if (name == "") {
        after.value += "Error in name, it's empty.\n";
        return;
    }
    if (message == "") {
        after.value += "Error in message, can't deliver empty message.\n";
        return;
    }
    let date = new Date();
    day = date.getDate();
    month = date.getMonth() + 1;
    hours = date.getHours();
    minutes = date.getMinutes();
    sec = date.getSeconds();
    if (day < 10) {
        day = "0" + day.toString();
    }
    if (month < 10) {
        month = "0" + month.toString();
    }
    if (hours < 10) {
        hours = "0" + hours.toString();
    }
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    }
    if (sec < 10) {
        sec = "0" + sec.toString();
    }
    socket.send(
        `[Delivered in ${day}.${month}.${date.getFullYear()} at time ${hours}:${minutes}:${sec}] by ${name}: ${message}\n`,
    );
}

function initializeCommunication() {
    socket.onmessage = (text) => {
        const after = document.getElementById("chain");
        after.value += text.data;
    };
}

initializeCommunication();

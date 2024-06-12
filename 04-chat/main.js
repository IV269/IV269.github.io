import http from "node:http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

let clients = new Set();

app.get("/", (req, res, next) => {
    next();
});

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    clients.add(ws);

    wss.on("message", (message) => {
        console.log(message.toString());
    });
    ws.onmessage = (mess) => {
        let p = mess.data;
        for (let client of clients) {
            client.send(p);
        }
    };
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}`);
});

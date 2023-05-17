const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = app.listen(3000);

const io = socketio(server);

io.on("connection", (socket) => {
    socket.on("message", (message) => {
        io.emit("message", message);
    });
});

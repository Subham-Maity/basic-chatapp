// server.js
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app1 = express();
const app2 = express();

const server1 = http.createServer(app1);
const server2 = http.createServer(app2);

const io1 = socketio(server1);
const io2 = socketio(server2);

let timerValue = null;
let intervalFunction = null;
const connectedClients = new Set();

io1.on("connection", (socket) => {
  console.log("A user connected to server1");

  socket.on("set timer", (duration) => {
    timerValue = duration;
    io1.emit("timer set", duration);
    io2.emit("timer set", duration);
    if (connectedClients.size === 2) {
      if (intervalFunction) {
        clearInterval(intervalFunction);
      }
      let currentTime = timerValue;
      intervalFunction = setInterval(() => {
        currentTime -= 1;
        io1.emit("timer update", currentTime);
        io2.emit("timer update", currentTime);
        if (currentTime === 0) {
          clearInterval(intervalFunction);
          io1.emit("conversation ended");
          io2.emit("conversation ended");
        }
      }, 1000);
    }
  });

  socket.on("join", () => {
    connectedClients.add(socket.id);
    if (connectedClients.size === 2 && timerValue !== null) {
      if (intervalFunction) {
        clearInterval(intervalFunction);
      }
      let currentTime = timerValue;
      intervalFunction = setInterval(() => {
        currentTime -= 1;
        io1.emit("timer update", currentTime);
        io2.emit("timer update", currentTime);
        if (currentTime === 0) {
          clearInterval(intervalFunction);
          io1.emit("conversation ended");
          io2.emit("conversation ended");
        }
      }, 1000);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected from server1");
    connectedClients.delete(socket.id);
    if (connectedClients.size < 2 && intervalFunction) {
      clearInterval(intervalFunction);
      intervalFunction = null;
      timerValue = null;
    }
  });
});

io2.on("connection", (socket) => {
  socket.on("join", () => {
    console.log("A user connected to server2");
  });

  socket.on("join", () => {
    console.log("A user connected to server2");
    if (timerValue !== null) {
      socket.emit("timer set", timerValue);
    }
  });
});

app1.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app2.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});

app1.use(express.static("public"));
app2.use(express.static("public"));

server1.listen(3000, () => {
  console.log("Server1 listening on port 3000");
});

server2.listen(3001, () => {
  console.log("Server2 listening on port 3001");
});

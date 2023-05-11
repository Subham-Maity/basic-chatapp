// server.js
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

// Create two express applications
const app1 = express();
const app2 = express();

// Create two http servers
const server1 = http.createServer(app1);
const server2 = http.createServer(app2);

// Create two socket.io instances
const io1 = socketio(server1);
const io2 = socketio(server2);

// Serve the index.html file for client1
app1.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Serve the index2.html file for client2
app2.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});

// Serve the static files from the public folder
app1.use(express.static("public"));
app2.use(express.static("public"));

// io1.on("connection")
io1.on("connection", (socket) => {
  console.log("A user connected to server1");

  // Keep track of the start time and end time for each conversation
  let startTime = null;
  let endTime = null;

  // Listen for chat messages on server1
  socket.on("chat message", (msg) => {
    console.log("Message from server1: " + msg);

    // If this is the first message of the conversation, set the start time
    if (startTime === null) {
      startTime = new Date().getTime();
      endTime = startTime + socket.duration * 60 * 1000;
    }

    // Check if conversation time has elapsed
    if (new Date().getTime() >= endTime) {
      // End the conversation
      io2.to(socket.id).emit("chat message", "Conversation has ended.");
      socket.disconnect();
    } else {
      // Broadcast the message to all other users on server2
      io2.emit("chat message", msg);
    }
  });

  // Listen for disconnections on server1
  socket.on("disconnect", () => {
    console.log("A user disconnected from server1");
  });
});

// io2.on("connection")
io2.on("connection", (socket) => {
  console.log("A user connected to server2");

  // Keep track of the start time and end time for each conversation
  let startTime = null;
  let endTime = null;

  // Listen for chat messages on server2
  socket.on("chat message", (msg) => {
    console.log("Message from server2: " + msg);

    // If this is the first message of the conversation, set the start time
    if (startTime === null) {
      startTime = new Date().getTime();
      endTime = startTime + socket.duration * 60 * 1000;
    }

    // Check if conversation time has elapsed
    if (new Date().getTime() >= endTime) {
      // End the conversation
      io1.to(socket.id).emit("chat message", "Conversation has ended.");
      socket.disconnect();
    } else {
      // Broadcast the message to all other users on server1
      io1.emit("chat message", msg);
    }
  });

  // Listen for disconnections on server2
  socket.on("disconnect", () => {
    console.log("A user disconnected from server2");
  });
});

// Start the servers on different ports
server1.listen(3000, () => {
  console.log("Server1 listening on port 3000");
});
server2.listen(3001, () => {
  console.log("Server2 listening on port 3001");
});

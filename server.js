// server.js
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

// Create a new express application
const app = express();

// Create a new http server
const server = http.createServer(app);

// Create a new socket.io instance
const io = socketio(server);

// Serve the static files from the public folder
app.use(express.static("public"));

// Listen for new connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log("Message: " + msg);

    // Broadcast the message to all other users
    socket.broadcast.emit("chat message", msg);
  });

  // Listen for disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

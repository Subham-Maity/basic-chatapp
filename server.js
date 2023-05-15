// server.js
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
// Create two express applications
const app1 = express();
const app2 = express();
// Create a third express application
const app3 = express();

// Create two http servers
const server1 = http.createServer(app1);
const server2 = http.createServer(app2);
// Create a third http server
const server3 = http.createServer(app3);

// Create two socket.io instances
const io1 = socketio(server1);
const io2 = socketio(server2);
// Create a third socket.io instance
const io3 = socketio(server3);

// Access the admin namespace
const adminNamespace = io3.of("/admin");
// Serve the index.html file for client1
app1.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Serve the index2.html file for client2
app2.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});

// Serve the index2.html file for client2
app2.get("/", (req, res) => {
  res.sendFile(__dirname + "/admin/index.html");
});

// Serve the static files from the public folder
app1.use(express.static("public"));
app2.use(express.static("public"));
app2.use(express.static("admin"));
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
  socket.on("join", (username) => {
    socket.username = username || "Client";
    console.log(`User '${socket.username}' connected to server2`);
  });

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
  // Access the admin namespace
  const adminNamespace = io3.of("/admin");

  // Listen for connections on admin namespace
  adminNamespace.on("connection", (socket) => {
    console.log("A user connected to admin namespace");

    // Listen for join room event on admin namespace
    socket.on("join room", (room) => {
      console.log(`Admin joined room ${room}`);
      // Join the specified room on both io1 and io2 instances
      io1.of("/").adapter.remoteJoin(socket.id, room, () => {});
      io2.of("/").adapter.remoteJoin(socket.id, room, () => {});
    });

    // Listen for leave room event on admin namespace
    socket.on("leave room", () => {
      console.log(`Admin left room`);
      // Leave all rooms on both io1 and io2 instances
      io1.of("/").adapter.remoteLeave(socket.id, () => {});
      io2.of("/").adapter.remoteLeave(socket.id, () => {});
    });

    // Listen for kick user event on admin namespace
    socket.on("kick user", (user) => {
      console.log(`Admin kicked user ${user}`);
      // Disconnect the specified user from both io1 and io2 instances
      io1.of("/").adapter.remoteDisconnect(user, true, () => {});
      io2.of("/").adapter.remoteDisconnect(user, true, () => {});
    });

    socket.on("disconnect", () => {
      console.log(`User '${socket.username}' disconnected from server2`);
    });
  });

  // Listen for approve user event on admin namespace
  socket.on("approve user", (user) => {
    console.log(`Admin approved user ${user}`);
    // Emit an event to the specified user to notify them of the approval
    io1.of("/").to(user).emit("user approved");
    io2.of("/").to(user).emit("user approved");
  });

  // Listen for deny user event on admin namespace
  socket.on("deny user", (user) => {
    console.log(`Admin denied user ${user}`);
    // Emit an event to the specified user to notify them of the denial
    io1.of("/").to(user).emit("user denied");
    io2.of("/").to(user).emit("user denied");
  });

  // Listen for set timer event on admin namespace
  socket.on("set timer", (timer) => {
    console.log(`Admin set timer to ${timer} minutes`);
    // Set the duration property on the socket object to store the timer value
    socket.duration = timer;
  });
});

// Invoke the instrument method on io3 and pass the options you want
instrument(io3, {
  auth: false,
  mode: "development",
});

// Start the servers on different ports
server1.listen(3000, () => {
  console.log("Server1 listening on port 3000");
});
server2.listen(3001, () => {
  console.log("Server2 listening on port 3001");
});
// Start the third server on port 3002
server3.listen(3002, () => {
  console.log("Server3 listening on port 3002");
});

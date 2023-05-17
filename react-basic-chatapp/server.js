// Import dependencies
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const next = require("next");

// Create an Express app and a Next app
const app = express();
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const nextHandler = nextApp.getRequestHandler();

// Create an HTTP server and a Socket.io server
const server = http.createServer(app);
const io = socketIO(server);

// A variable to store the timer value
let timer = 0;

// A function to format the timer value as mm:ss
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Listen for socket connections
io.on("connection", (socket) => {
    console.log("New user connected");

    // Listen for chat messages and broadcast them to other users
    socket.on("chatMessage", (msg) => {
        io.emit("chatMessage", msg);
    });

    // Listen for timer updates and broadcast them to other users
    socket.on("updateTimer", (value) => {
        timer = value;
        io.emit("updateTimer", formatTime(timer));
    });

    // Start a setInterval function that decrements the timer every second and emits it to both clients
    const timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            io.emit("updateTimer", formatTime(timer));
        } else {
            // When the timer reaches zero, stop the chat and clear the interval function
            io.emit("stopChat");
            clearInterval(timerInterval);
        }
    }, 1000);

    // Listen for user disconnection and clear the interval function
    socket.on("disconnect", () => {
        console.log("User disconnected");
        clearInterval(timerInterval);
    });
});

// Use nextHandler for requests that are not handled by Express routes
app.get("*", (req, res) => {
    return nextHandler(req, res);
});

// Start the server on port 3000 or process.env.PORT if defined
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

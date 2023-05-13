// app.js

// Connect to the admin namespace on the server
const socket = io("http://localhost:3002/admin");

// Get the DOM elements for the admin controls
const roomInput = document.getElementById("room");
const joinButton = document.getElementById("join");
const leaveButton = document.getElementById("leave");
const userInput = document.getElementById("user");
const kickButton = document.getElementById("kick");
const newUserInput = document.getElementById("new-user");
const approveButton = document.getElementById("approve");
const denyButton = document.getElementById("deny");
const timerInput = document.getElementById("timer");
const setTimerButton = document.getElementById("set-timer");

// Listen for join button click
joinButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (roomInput.value) {
    // Emit the join room event to the server with the room name
    socket.emit("join room", roomInput.value);
    // Clear the room input field
    roomInput.value = "";
  }
});

// Listen for leave button click
leaveButton.addEventListener("click", function (e) {
  e.preventDefault();
  // Emit the leave room event to the server
  socket.emit("leave room");
});

// Listen for kick button click
kickButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (userInput.value) {
    // Emit the kick user event to the server with the user name
    socket.emit("kick user", userInput.value);
    // Clear the user input field
    userInput.value = "";
  }
});

// Listen for approve button click
approveButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (newUserInput.value) {
    // Emit the approve user event to the server with the new user name
    socket.emit("approve user", newUserInput.value);
    // Clear the new user input field
    newUserInput.value = "";
  }
});

// Listen for deny button click
denyButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (newUserInput.value) {
    // Emit the deny user event to the server with the new user name
    socket.emit("deny user", newUserInput.value);
    // Clear the new user input field
    newUserInput.value = "";
  }
});

// Listen for set timer button click
setTimerButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (timerInput.value) {
    // Emit the set timer event to the server with the timer value in minutes
    socket.emit("set timer", timerInput.value);
    // Clear the timer input field
    timerInput.value = "";
  }
});

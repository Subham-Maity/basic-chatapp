const socket = io();
const socket2 = io("http://localhost:3001");

let username = prompt("Enter your username for Client 1:");

// If no username is provided, set it to "Client 1"
if (!username) {
  username = "Client 1";
}

socket.emit("join", username);

let username2 = prompt("Enter your username for Client 2:");

// If no username is provided, set it to "Client 2"
if (!username2) {
  username2 = "Client 2";
}

socket2.emit("join", username2);

// Get the DOM elements
const form2 = document.getElementById("form2");
const input2 = document.getElementById("input2");
const messages2 = document.getElementById("messages2");
const timer = document.getElementById("timer");

// Add a function to append a new message to the list
const appendMessage = (msg, list) => {
  const li = document.createElement("li");
  li.textContent = msg;
  li.className = "p-2 break-all";
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
};

// Prompt user to specify duration of conversation
const duration = prompt(
  "Specify the duration of the conversation (in minutes):"
);
const endTime = new Date().getTime() + duration * 60 * 1000;

// Start the timer
let timerInterval = setInterval(() => {
  // Calculate the remaining time
  const remainingTime = Math.max(0, endTime - new Date().getTime());
  const remainingMinutes = Math.floor(remainingTime / 60000);
  const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);

  // Update the timer contents
  timer.textContent = `Time remaining: ${remainingMinutes}m ${remainingSeconds}s`;

  // End the conversation if the time has elapsed
  if (remainingTime === 0) {
    appendMessage("Conversation has ended.", messages2);
    socket2.disconnect();
    clearInterval(timerInterval);
  }
}, 1000);

// Listen for form submission on chat box 2
form2.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input2.value) {
    // Emit the chat message to the server2
    socket2.emit("chat message", input2.value);
    // Append the message to the list as self
    appendMessage(`Client 2: ${input2.value}`, messages2);
    // Clear the input field
    input2.value = "";
  }
});

// Listen for chat messages from the server1
socket.on("chat message", function (msg) {
  // Append the message to the list as other
  appendMessage(`Client 1: ${msg}`, messages2);
});

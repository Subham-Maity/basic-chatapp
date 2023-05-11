// Connect to the server on port 3000
const socket = io("http://localhost:3000");

// Get the DOM elements
const form = document.getElementById("form1");
const input = document.getElementById("input1");
const messages = document.getElementById("messages1");

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

// Listen for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    // Emit the chat message to the server
    socket.emit("chat message", input.value);
    // Append the message to the list as self
    appendMessage(`Client 1: ${input.value}`, messages);
    // Clear the input field
    input.value = "";
  }
});

// Listen for chat messages from the server
socket.on("chat message", function (msg) {
  // Check if conversation time has elapsed
  if (new Date().getTime() >= endTime) {
    // End the conversation
    appendMessage("Conversation has ended.", messages);
    socket.disconnect();
  } else {
    // Append the message to the list as other
    appendMessage(`Client 2: ${msg}`, messages);
  }
});

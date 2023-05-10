// Connect to the server1 on port 3000
const socket1 = io("http://localhost:3000");

// Connect to the server2 on port 3001
const socket2 = io("http://localhost:3001");

// Get the DOM elements
const form1 = document.getElementById("form1");
const input1 = document.getElementById("input1");
const messages1 = document.getElementById("messages1");
const form2 = document.getElementById("form2");
const input2 = document.getElementById("input2");
const messages2 = document.getElementById("messages2");

// Add a function to append a new message to the list
const appendMessage = (msg, list) => {
  const li = document.createElement("li");
  li.textContent = msg;
  li.className = "p-2 break-all";
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
};

// Listen for form submission on chat box 1
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input1.value) {
    // Emit the chat message to the server1
    socket1.emit("chat message", input1.value);
    // Append the message to the list as self
    appendMessage(`Client 1: ${input1.value}`, messages1);
    // Clear the input field
    input1.value = "";
  }
});

// Listen for form submission on chat box 2
form2.addEventListener("submit", (e) => {
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
socket1.on("chat message", (msg) => {
  // Append the message to the list as other
  appendMessage(`Client 2: ${msg}`, messages1);
});

// Listen for chat messages from the server2
socket2.on("chat message", (msg) => {
  // Append the message to the list as other
  appendMessage(`Client 1: ${msg}`, messages2);
});

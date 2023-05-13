
**This is a very basic chat app that serves the purpose of demonstrating how to setup and use socket.io in a chat app. The app is very simple and includes only the necessary features to demonstrate the setup process.**

![ezgif-3-ff918bac67](https://github.com/Subham-Maity/socket.io-demo/assets/97989643/9611dc61-46e7-40f8-98cb-b40ce3e960d4)

## How to Setup Guide
To set up the chat app, please follow these steps:

1. Install the dependencies by running `npm i`.

2. Run the server by executing `node server.js`.

3. Once the server is running, you will see the following messages:

```bash
Server1 listening on port 3000
Server2 listening on port 3001
```
4. Visit http://localhost:3000/ and http://localhost:3001/ in the browser
5. You will see two basic frontends for client 1 and client 2, and you can communicate between them.

_________________________
# Tutorial
_____________________

# How to use Socket.io at a basic level

Socket.io is a library that enables real-time, bidirectional and event-based communication between the browser and the server. It is built on top of the WebSocket protocol and provides additional features like fallback to HTTP long-polling or automatic reconnection.

In this article, we will learn how to use Socket.io at a basic level by creating a simple chat app. We will use Node.js for the server and HTML for the client. We will also use the official documentation as a reference and include code examples.

## Step 1: Install Socket.io

The first step is to install Socket.io on both the server and the client. We will use npm for the server and a CDN for the client.

### Server

To install Socket.io on the server, follow these steps:

- Open your terminal and navigate to your project folder.
- Run the following command:

```bash
npm install socket.io
```

This will add Socket.io as a dependency in your package.json file.

### Client

To install Socket.io on the client, follow these steps:

- Create a folder named `public` in your project folder. This is where we will put our HTML file later.
- Create a file named `index.html` in the `public` folder and add the following script tag in the head section:

```html
<script src="/socket.io/socket.io.js"></script>
```

This will load the Socket.io client library from the server.

## Step 2: Create a server

The next step is to create a server that listens for new connections and handles chat messages. We will use Express to create a simple web server and Socket.io to enable WebSocket communication.

To create a server, follow these steps:

- Create a file named `server.js` in your project folder.
- Import the `express`, `http` and `socketio` modules:

```js
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
```

- Create an Express app and an HTTP server:

```js
// Create a new express application
const app = express();

// Create a new http server
const server = http.createServer(app);
```

- Create a Socket.io instance and pass it the HTTP server:

```js
// Create a new socket.io instance
const io = socketio(server);
```

- Serve the static files from the public folder:

```js
// Serve the static files from the public folder
app.use(express.static("public"));
```

- Listen for new connections from clients:

```js
// Listen for new connections
io.on("connection", (socket) => {
  // The socket parameter represents a single connection between a client and the server.
  // You can use socket.on() and socket.emit() to listen for and send events.
});
```

- Listen for chat messages from clients:

```js
// Listen for chat messages
socket.on("chat message", (msg) => {
  // The msg parameter contains the message sent by the client.
  // You can use console.log() to print it to the terminal.
  console.log("Message: " + msg);

  // You can use socket.broadcast.emit() to broadcast the message to all other clients connected to the server.
  // This means that everyone except the sender will receive the message.
  socket.broadcast.emit("chat message", msg);
});
```

- Listen for disconnections from clients:

```js
// Listen for disconnections
socket.on("disconnect", () => {
  // This happens when a client closes their browser or loses their network connection.
  // You can use console.log() to print it to the terminal.
  console.log("A user disconnected");
});
```

- Start the server on port 3000:

```js
// Start the server on port 3000
server.listen(3000, () => {
  // You can use console.log() to print it to the terminal.
  console.log("Server listening on port 3000");
});
```

## Step 3: Create a client

The final step is to create a client that connects to the server and sends and receives chat messages. We will use HTML and JavaScript for this.

To create a client, follow these steps:

- Open your `index.html` file in the `public` folder.
- Add some basic HTML structure and title:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <!-- Link to socket.io client script -->
    <script src="/socket.io/socket.io.js"></script>
</head>

<body>
    <h1>Chat App</h1>
    <!-- We will add some more HTML elements here later -->
</body>

</html>
```

- Add some HTML elements for displaying and sending chat messages:

```html
<!-- index.html -->
<body>
    <h1>Chat App</h1>
    <!-- A list to display the chat messages -->
    <ul id="messages"></ul>
    <!-- A form to send a chat message -->
    <form id="form">
        <input id="input" type="text" placeholder="Type a message...">
        <button type="submit">Send</button>
    </form>
</body>
```

- Add some JavaScript code to connect to the server and handle chat events:

```html
<!-- index.html -->
<script>
  // Connect to the socket.io server
  const socket = io();

  // Get the DOM elements
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  // Add a function to append a new message to the list
  const appendMessage = (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
  };

  // Listen for form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      // Emit the chat message to the server
      socket.emit('chat message', input.value);
      // Append the message to the list as self
      appendMessage(`You: ${input.value}`);
      // Clear the input field
      input.value = '';
    }
  });

  // Listen for chat messages from the server
  socket.on('chat message', (msg) => {
    // Append the message to the list as other
    appendMessage(`Other: ${msg}`);
  });
</script>
```

Let's break down this code:

- We use `io()` to connect to the socket.io server. This returns a socket object that we can use to communicate with the server.
- We use `document.getElementById()` to get the DOM elements that we need: the form, the input and the messages list.
- We define a function named `appendMessage` that takes a message as a parameter and appends it to the messages list as a new list item.
- We use `form.addEventListener()` to listen for the submit event on the form. This happens when the user clicks on the send button or presses enter on the input field.
- We use `e.preventDefault()` to prevent the default behavior of reloading the page when submitting a form.
- We use `if (input.value)` to check if the input field is not empty.
- We use `socket.emit()` to emit a custom event named `chat message` to the server. We pass the input value as the data for this event.
- We use `appendMessage()` to append the message to the messages list as self. We use a template literal to add `You:` before the message.
- We use `input.value = ''` to clear the input field after sending a message.
- We use `socket.on()` to listen for a custom event named `chat message` from the server. This happens when another client sends a message and the server broadcasts it to us.
- We use `appendMessage()` to append the message to the messages list as other. We use a template literal to add `Other:` before the message.

## Step 4: Test your app

The last step is to test your app and see if it works as expected. To do this, follow these steps:

- Open your terminal and navigate to your project folder.
- Run your server by typing:

```bash
node server.js
```

You should see a message saying `Server listening on port 3000`.

- Open your browser and go to http://localhost:3000. You should see your chat app with an empty messages list and an input field with a send button.
- Open another browser tab or window and go to http://localhost:3000 again.
- In one of the tabs, type a message in the input field and click on the send button. You should see your message appear in both tabs with `You:` before it.
- In the other tab, type a different message in the input field and click on the send button. You should see your message appear in both tabs with `Other:` before it.
- Try closing one of the tabs and see what happens in the terminal. You should see a message saying `A user disconnected`.
- Try opening a new tab and go to http://localhost:3000 again. You should see a message saying `A user connected` in the terminal and the messages list in the new tab.

Congratulations! You have successfully created a simple chat app using Socket.io at a basic level. You can now explore more features and options that Socket.io offers by reading the documentation or checking out some examples.

## References

: https://socket.io/docs/v4
: https://socket.io/get-started/chat

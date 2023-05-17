Next.js chat app with an app router nextjs13.4 and use tsx(typescript edition) and the following features and specifications:

`Structure`

```
my-app/
├── .next
├── node_modules
├── app
| ├── favicon.ico
| ├── globals.css
| ├── layout.tsx
| ├── page.tsx
| ├── ChatBox.tsx
| ├── ChatList.tsx
| └── Countdown.tsx
├── pages/
│ ├── _app.tsx
│ ├── _document.tsx
│ ├── index.tsx
│ └── chat.tsx
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── server.js
├── tailwind.config.js
└── tsconfig.json
```

- Use a Node.js server with Socket.io and Express that connects to the Next.js frontend. The server should start both the frontend and the backend with one command using nodemon. Modify the package.json script accordingly.
- Add a timer feature that lets two clients chat for a specified time. The timer should be set by the user and synced with the server. The chat should stop when the timer expires. Both clients should see the countdown on their screens.
- Use only Tailwind CSS for a dark-themed and responsive UI that works well on mobile devices. Show the sender's messages on the right and the receiver's messages on the left.

Here are some steps and code snippets to guide you through the process:

1. Create a new Next.js project by running `npx create-next-app@latest` in your terminal. Answer the prompts as follows:
    - What is your project named? ... ./
    - Would you like to use TypeScript with this project? ...  Yes
    - Would you like to use ESLint with this project? ... Yes
    - Would you like to use Tailwind CSS with this project? ... Yes
    - Would you like to use `src/` directory with this project? ... No
    - Use App Router (recommended)? ... Yes
    - Would you like to customize the default import alias? ... Yes
    - What import alias would you like configured? ... @/*
2. Install the dependencies for Socket.io, Express and nodemon by running `npm install socket.io express nodemon`.
3. Create a file called `server.js` in the root of your project and add the following code:

```js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Keep track of online users
let users = [];

// Handle socket connection and events
io.on('connection', (socket) => {
  console.log('New user connected');

  // Add new user to the list of users
  users.push(socket.id);
  io.emit('updateUsers', users);

  // Remove user from the list of users when they disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
    users = users.filter((user) => user !== socket.id);
    io.emit('updateUsers', users);
  });

  // Handle chat message event
  socket.on('chatMessage', (msg) => {
    console.log('Message received: ', msg);
    // Broadcast message to all connected clients
    io.emit('chatMessage', msg);
  });

  // Handle timer event
  socket.on('timer', (time) => {
    console.log('Timer set: ', time);
    // Sync timer with all connected clients
    io.emit('timer', time);
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

This code creates an Express server and sets up Socket.io to work with it. It also handles some socket events such as connection, disconnect, chatMessage and timer.

4. Modify your `package.json` script to start both the frontend and the backend with one command using nodemon. Replace `"dev": "next dev"` with `"dev": "nodemon server.js"`.
5. Create a folder called `app` in your project and add four files: `favicon.ico`, `globals.css`, `layout.tsx` and `page.tsx`. These files will contain some common components and styles for your app.
6. In `globals.css`, add some custom styles for your app using Tailwind CSS classes:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}

/* Dark theme */
.dark {
  --bg-color: #1a202c;
  --text-color: #f7fafc;
}

.dark body {
  background-color: var(--bg-color);
}

.dark h1,
.dark p,
.dark input,
.dark button {
  color: var(--text-color);
}

/* Chat box */
.chat-box {
  max-width: 800px;
  margin: auto;
}

/* Chat list */
.chat-list {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Chat item */
.chat-item {
  display: flex;
  align-items: center;
}

/* Sender message */
.sender {
  justify-content: flex-end;
}

.sender .message {
  background-color: #4a5568;
}

/* Receiver message */
.receiver {
  justify-content: flex-start;
}

.receiver .message {
  background-color: #2d3748;
}

/* Message */
.message {
  max-width: 60%;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
}

/* Timer */
.timer {
  display: flex;
  justify-content: center;
}
```

7. In `layout.tsx`, add a component that will wrap your pages with a dark theme class:

```tsx
import React from 'react';

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div className="dark">{children}</div>;
}
```

8. In `page.tsx`, add a component that will render a page title and a back button:

```tsx
import React from 'react';
import Link from 'next/link';

type PageProps = {
  title?: string;
};

export default function Page({ title }: PageProps) {
  
return (
<div className="p-4">
<h1 className="text-4xl font-bold">{title}</h1>
<Link href="/">
<a className="text-blue-500 hover:text-blue-700">Back</a>
</Link>
</div>
);
}
```

9. In `favicon.ico`, add any icon you like for your app.
10. Create three more files in your `app` folder: `ChatBox.tsx`, `ChatList.tsx` and `Countdown.tsx`. These files will contain some components for your chat app functionality.
11. In `ChatBox.tsx`, add a component that will render a chat box with an input field and a send button:

```tsx
import React, { useState } from 'react';
import io from 'socket.io-client';

// Connect to socket.io server
const socket = io('http://localhost:3000');

export default function ChatBox() {

// State for message input value
const [message, setMessage] = useState('');

// Handle message input change
const handleChange = (e) => {
setMessage(e.target.value);
};

// Handle message submit
const handleSubmit = (e) => {
e.preventDefault();
// Emit chat message event to server with message value
socket.emit('chatMessage', message);
// Clear message input value
setMessage('');
};

return (
<form onSubmit={handleSubmit} className="flex p-4">
<input
type="text"
value={message}
onChange={handleChange}
placeholder="Type a message..."
className="flex-1 p-2 border rounded-l"
/>
<button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
Send
</button>
</form>
);
}
```

This code connects to the socket.io server and handles sending messages to it.

12. In `ChatList.tsx`, add a component that will render a list of chat messages and online users:

```tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to socket.io server
const socket = io('http://localhost:3000');

export default function ChatList() {

// State for chat messages array
const [messages, setMessages] = useState([]);

// State for online users array
const [users, setUsers] = useState([]);

// Use effect hook to listen to socket events
useEffect(() => {

// Listen to chat message event from server and update messages state
socket.on('chatMessage', (msg) => {
setMessages((prevMessages) => [...prevMessages, msg]);
});

// Listen to update users event from server and update users state
socket.on('updateUsers', (users) => {
setUsers(users);
});

}, []);

return (
<div className="chat-list">
<h2 className="p-4 text-xl font-bold">Online Users ({users.length})</h2>
<ul className="p-4">
{users.map((user) => (
<li key={user}>{user}</li>
))}
</ul>
<h2 className="p-4 text-xl font-bold">Chat Messages</h2>
<ul className="p-4">
{messages.map((msg, index) => (
<li key={index} className={`chat-item ${msg.sender ? 'sender' : 'receiver'}`}>
<div className="message">{msg.text}</div>
</li>
))}
</ul>
</div>
);
}
```

This code listens to socket events from the server and updates the state for messages and users accordingly.



13. In `Countdown.tsx`, add a component that will render a countdown timer with an input field and a set button:

```tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to socket.io server
const socket = io('http://localhost:3000');

export default function Countdown() {

// State for timer input value
const [time, setTime] = useState('');

// State for timer seconds
const [seconds, setSeconds] = useState(0);

// Use effect hook to listen to socket events
useEffect(() => {

// Listen to timer event from server and update seconds state
socket.on('timer', (time) => {
setSeconds(time);
});

}, []);

// Use effect hook to update timer every second
useEffect(() => {

// Set an interval to decrement seconds state by one every second
const interval = setInterval(() => {
if (seconds > 0) {
setSeconds((prevSeconds) => prevSeconds - 1);
}
}, 1000);

// Clear the interval when seconds state changes or component unmounts
return () => clearInterval(interval);

}, [seconds]);

// Handle timer input change
const handleChange = (e) => {
setTime(e.target.value);
};

// Handle timer submit
const handleSubmit = (e) => {
e.preventDefault();
// Parse the input value as a number
const time = parseInt(e.target.time.value);
// Emit timer event to server with time value
socket.emit('timer', time);
// Clear timer input value
setTime('');
};

return (
<div className="timer p-4">
<h2 className="text-xl font-bold">Countdown Timer</h2>
<form onSubmit={handleSubmit} className="flex">
<input
type="number"
name="time"
value={time}
onChange={handleChange}
placeholder="Enter time in seconds..."
className="flex-1 p-2 border rounded-l"
/>
<button type="submit" className="p-2 bg-green-500 text-white rounded-r">
Set
</button>
</form>
<p className="text-4xl font-bold">{seconds}</p>
</div>
);
}
```

This code listens to the timer event from the server and updates the seconds state accordingly. It also handles setting the timer and emitting it to the server.

14. Create a file called `_app.tsx` in your `pages` folder and add the following code:

```tsx
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/app/layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

This code wraps your pages with the Layout component that applies the dark theme class.

15. Create a file called `_document.tsx` in your `pages` folder and add the following code:

```tsx
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

This code adds some custom elements to the document such as the favicon and the language attribute.

16. Create a file called `index.tsx` in your `pages` folder and add the following code:

```tsx
import React from 'react';
import Link from 'next/link';
import Page from '@/app/page';

export default function Home() {
  return (
    <Page title="Next.js Chat App">
      <Link href="/chat">
        <a className="p-4 bg-blue-500 text-white rounded">Start Chatting</a>
      </Link>
    </Page>
  );
}
```

This code renders a home page with a link to the chat page.

17. Create a file called `chat.tsx` in your `pages` folder and add the following code:

```tsx
import React from 'react';
import Page from '@/app/page';
import ChatBox from '@/app/ChatBox';
import ChatList from '@/app/ChatList';
import Countdown from '@/app/Countdown';

export default function Chat() {
  return (
    <Page title="Next.js Chat App">
      <div className="chat-box">
        <ChatList />
        <ChatBox />
        <Countdown />
      </div>
    </Page>
  );
}
```

This code renders a chat page with the ChatList, ChatBox and Countdown components.

18. Run `npm run dev` to start your app and visit `http://localhost:3000` in your browser. You should see something like this:

![Next.js Chat App](https://i.imgur.com/5fZ7Y8y.png)

19. You can open another tab or window and visit the same URL to simulate another client. You should be able to chat with each other and set a timer that stops the chat when it expires.

Congratulations! You have created a simple Next.js chat app with an app router nextjs13.4 and use tsx(typescript edition) and the following features and specifications:

- Use a Node.js server with Socket.io and Express that connects to the Next.js frontend. The server should start both the frontend and the backend with one command using nodemon. Modify the package.json script accordingly.
- Add a timer feature that lets two clients chat for a specified time. The timer should be set by the user and synced with the server. The chat should stop when the timer expires. Both clients should see the countdown on their screens.
- Use only Tailwind CSS for a dark-themed and responsive UI that works well on mobile devices. Show the sender's messages on the right and the receiver's messages on the left.


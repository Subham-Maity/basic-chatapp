# chat-app

A Realtime Chat Application built using Node.js, Express, Socket.io, and Next.js

---

## Getting Started

First, run the backend server:

```bash
npm run dev

# or

yarn dev
```

Then, run the frontend server:

```bash
npm run dev

# or

yarn dev
```

---

## Built With

-   [Node.js](https://nodejs.org/en/) - JavaScript runtime
-   [Express](https://expressjs.com/) - Web framework for Node.js
-   [Socket.io](https://socket.io/) - Realtime application framework
-   [Next.js](https://nextjs.org/) - React framework for production
-   [React](https://reactjs.org/) - JavaScript library for building user interfaces
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale

---

## Backend

The backend server is built using Node.js, Express, and Socket.io. It is responsible for handling the socket connections and emitting events to the frontend.

### [Events](./client/config/events.ts)

#### `join`

Emitted when a user joins a room.

##### Payload

```typescript
{
	roomId: string;
}
```

#### `send message`

Emitted when a user sends a new message.

##### Payload

```typescript
{
	time: string;
	roomId: string;
	message: string;
}
```

#### `create new room`

Emitted when a user creates a new room.

##### Payload

```typescript
{
	roomName: string;
}
```

---

## Screenshots

![screenshot_1](./client/screenshots/ss2.png)
![screenshot_2](./client/screenshots/ss1.png)
![screenshot_3](./client/screenshots/ss3.png)

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details

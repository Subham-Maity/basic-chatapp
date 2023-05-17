import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
	connection: "connection",
	CLIENT: {
		CREATE_ROOM: "CREATE_ROOM",
		SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
		JOIN_ROOM: "JOIN_ROOM",
	},
	SERVER: {
		ROOMS: "ROOMS",
		JOINED_ROOM: "JOINED_ROOM",
		ROOM_MESSAGE: "ROOM_MESSAGE",
	},
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
	io.on(EVENTS.connection, (socket: Socket) => {
		logger.info(`New client connected with id:${socket.id}`);
		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});

		// show all the rooms to the client
		socket.emit(EVENTS.SERVER.ROOMS, rooms);

		/**
		 * Client creates a new room
		 * @param roomName
		 */
		socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
			console.log(`Client joined ${roomName}`);

			// create a roomId
			const roomId = nanoid();

			// add a new room to rooms object
			rooms[roomId] = { name: roomName };

			// socket.join(roomId)
			socket.join(roomId);

			// broadcast an event saying that a new room has been created
			socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

			// emit back to the room creator with all the rooms
			socket.emit(EVENTS.SERVER.ROOMS, rooms);

			// emit an event back to room creator that they have joined the room
			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
		});

		/**
		 * When a client sends a new room message
		 * @param roomId
		 * @param message
		 * @param username
		 */
		socket.on(
			EVENTS.CLIENT.SEND_ROOM_MESSAGE,
			({ roomId, message, username }) => {
				console.log(`Client sent a new message to ${roomId}`);

				const time = new Date(); // get the current time

				// emit an event to all clients in the room with this roomid
				socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
					message,
					username,
					time: `${time.getHours()}:${time.getMinutes()}`,
				});

				// emit an event to all clients in the room
				socket
					.to(roomId)
					.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, message);
			}
		);

		/**
		 * When a client joins a room
		 * @param roomId
		 */
		socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
			console.log(`Client joined ${roomId}`);

			// socket.join(roomId)
			socket.join(roomId);

			// emit an event back to room creator that they have joined the room
			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
		});
	});
}

export default socket;

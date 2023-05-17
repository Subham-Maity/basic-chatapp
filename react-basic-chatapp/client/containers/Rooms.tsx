import EVENTS from "@/config/events";
import { useSocket } from "@/context/socket.context";
import { useRef } from "react";
import styles from "../styles/Rooms.module.css";

const RoomsContainer = () => {
	const { socket, roomId, rooms } = useSocket();
	const newRoomRef = useRef<HTMLInputElement>(null);

	function handleNewRoom() {
		// get the room name
		const roomName = newRoomRef.current?.value || "";

		if (!String(roomName).trim()) return;

		// emit room created event
		socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

		// set room name input to empty string
		newRoomRef.current!.value = "";
	}

	function handleJoinRoom(key: string) {
		if (key === roomId) return;

		socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
	}

	return (
		<nav className={styles.wrapper}>
			<div className={styles.createRoomWrapper}>
				<input placeholder="Room Name" ref={newRoomRef} />
				<button className="cta" onClick={handleNewRoom}>
					Create Room
				</button>
			</div>

			<ul className={styles.roomList}>
				{Object.keys(rooms).map((key) => (
					<div key={key}>
						<button
							disabled={key === roomId}
							title={`Join ${rooms[key].name}`}
							onClick={() => handleJoinRoom(key)}>
							{rooms[key].name}
						</button>
					</div>
				))}
			</ul>
		</nav>
	);
};

export default RoomsContainer;

import EVENTS from "@/config/events";
import { useSocket } from "@/context/socket.context";
import { useEffect, useRef } from "react";
import styles from "../styles/Messages.module.css";

const MessagesContainer = () => {
	const { messages, socket, roomId, username, setMessages } = useSocket();
	const newMessageRef = useRef<HTMLTextAreaElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	function handleMessageSend() {
		const message = newMessageRef.current?.value;

		if (!String(message).trim()) {
			return;
		}

		socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
			roomId,
			message,
			username,
		});

		const date = new Date();

		setMessages([
			...(messages as any),
			{
				message,
				username: "You",
				time: `${date.getHours()}:${date.getMinutes()}`,
			},
		]);

		newMessageRef.current!.value = "";
	}

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	if (!roomId) return <div />;

	return (
		<div className={styles.wrapper}>
			<div className={styles.messageList}>
				{messages?.map(({ message, username, time }, index) => (
					<div key={index} className={styles.message}>
						<div>
							<span className={styles.messageSender}>
								{username} - {time}
							</span>
							<div className={styles.messageBody}>{message}</div>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className={styles.messageBox}>
				<textarea
					placeholder="Type a message..."
					rows={1}
					ref={newMessageRef}
				/>
			</div>

			<button onClick={handleMessageSend}>Send</button>
		</div>
	);
};

export default MessagesContainer;

// Import dependencies
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Define the message type
type Message = {
    sender: string;
    content: string;
};

// Define the props type
type Props = {
    username: string;
};

// Create a ChatBox component
const ChatBox: React.FC<Props> = ({ username }) => {
    // Use state hooks to store the messages and the current input value
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    // Use a ref hook to store the socket instance
    const socketRef = useRef<SocketIOClient.Socket>();

    // Use an effect hook to initialize the socket connection and listen for events
    useEffect(() => {
        // Connect to the socket server
        socketRef.current = io("http://localhost:3000");

        // Listen for chat messages and update the state
        socketRef.current.on("chatMessage", (msg: Message) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Listen for stop chat event and disable the input field
        socketRef.current.on("stopChat", () => {
            setInput("");
            alert("Time is up! Chat is over.");
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // A function to handle the input change and update the state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // A function to handle the form submission and emit the chat message
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Check if the input is not empty
        if (input) {
            // Create a message object with the sender and content
            const msg: Message = {
                sender: username,
                content: input,
            };
            // Emit the message to the socket server
            socketRef.current?.emit("chatMessage", msg);
            // Clear the input field
            setInput("");
        }
    };

    // A function to render each message based on the sender
    const renderMessage = (msg: Message) => {
        // Check if the message is sent by the current user or not
        const isOwnMessage = msg.sender === username;
        // Return a div element with different styles and alignment based on the sender
        return (
            <div
                key={msg.content}
                className={`flex my-2 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                }`}
            >
                <div
                    className={`max-w-xs p-2 rounded-md ${
                        isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                    }`}
                >
                    <p className="font-bold">{msg.sender}</p>
                    <p>{msg.content}</p>
                </div>
            </div>
        );
    };

    // Return a div element that contains a form element for the input field and a button, and a div element for displaying the messages
    return (
        <div className="flex flex-col h-full">
            <div className="overflow-y-auto p-4">{messages.map(renderMessage)}</div>
            <form onSubmit={handleSubmit} className="flex p-4">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    className="flex-1 mr-2 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;

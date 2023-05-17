// Import dependencies
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Define the props type
type Props = {
    username: string;
};

// Create a ChatList component
const ChatList: React.FC<Props> = ({ username }) => {
    // Use state hooks to store the list of online users
    const [users, setUsers] = useState<string[]>([]);

    // Use a ref hook to store the socket instance
    const socketRef = useRef<SocketIOClient.Socket>();

    // Use an effect hook to initialize the socket connection and listen for events
    useEffect(() => {
        // Connect to the socket server
        socketRef.current = io("http://localhost:3000");

        // Listen for update users event and update the state
        socketRef.current.on("updateUsers", (users: string[]) => {
            setUsers(users);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // A function to render each user based on their socket id
    const renderUser = (user: string) => {
        // Check if the user is the current user or not
        const isCurrentUser = user === socketRef.current?.id;
        // Return a li element with different styles and text based on the user
        return (
            <li
                key={user}
                className={`my-2 p-2 rounded-md ${
                    isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
            >
                {isCurrentUser ? "You" : `User ${user.slice(0, 4)}`}
            </li>
        );
    };

    // Return a div element that contains a ul element for displaying the users
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Online Users</h2>
            <ul>{users.map(renderUser)}</ul>
        </div>
    );
};

export default ChatList;

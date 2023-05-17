// Import dependencies
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Define the props type
type Props = {
    username: string;
};

// Create a Countdown component
const Countdown: React.FC<Props> = ({ username }) => {
    // Use state hooks to store the timer value and the input value
    const [timer, setTimer] = useState("00:00");
    const [input, setInput] = useState("");

    // Use a ref hook to store the socket instance
    const socketRef = useRef<SocketIOClient.Socket>();

    // Use an effect hook to initialize the socket connection and listen for events
    useEffect(() => {
        // Connect to the socket server
        socketRef.current = io("http://localhost:3000");

        // Listen for update timer event and update the state
        socketRef.current.on("updateTimer", (value: string) => {
            setTimer(value);
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

    // A function to handle the button click and emit the timer value
    const handleClick = () => {
        // Check if the input is a valid number
        const value = parseInt(input);
        if (!isNaN(value) && value > 0) {
            // Emit the timer value to the socket server
            socketRef.current?.emit("updateTimer", value * 60);
            // Clear the input field
            setInput("");
        } else {
            // Alert the user to enter a valid number
            alert("Please enter a positive number");
        }
    };

    // Return a div element that contains an input field and a button for setting the timer, and a p element for displaying the timer
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Set Timer (in minutes)</h2>
            <div className="flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    className="mr-2 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter a number..."
                />
                <button
                    type="button"
                    onClick={handleClick}
                    className="py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring"
                >
                    Set
                </button>
            </div>
            <p className="text-4xl font-bold mt-4">{timer}</p>
        </div>
    );
};

export default Countdown;

'use client'; // Declare the client module boundary at the top of the file

// Import dependencies
import { useState } from "react";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import Countdown from "./Countdown";

// Define the page status type
type Status = "init" | "ready" | "chatting";

// Create a page component
const Page = () => {
    // Use state hooks to store the username and the page status
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<Status>("init");

    // A function to handle the username change and update the state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    // A function to handle the button click and update the page status
    const handleClick = () => {
        // Check if the username is not empty
        if (username) {
            // Update the page status to ready
            setStatus("ready");
        } else {
            // Alert the user to enter a username
            alert("Please enter a username");
        }
    };

    // A function to render the page content based on the page status
    const renderContent = () => {
        switch (status) {
            case "init":
                // Return a div element that contains an input field and a button for entering the username
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold mb-4">Enter your username</h2>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={username}
                                onChange={handleChange}
                                className="mr-2 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter a username..."
                            />
                            <button
                                type="button"
                                onClick={handleClick}
                                className="py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                );
            case "ready":
                // Return a div element that contains the Countdown component and a button for starting the chat
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Countdown username={username} />
                        <button
                            type="button"
                            onClick={() => setStatus("chatting")}
                            className="py-2 px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring mt-4"
                        >
                            Start Chatting
                        </button>
                    </div>
                );
            case "chatting":
                // Return a div element that contains the ChatBox and ChatList components in a grid layout
                return (
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <ChatList username={username} />
                        <ChatBox username={username} />
                    </div>
                );
        }
    };

    // Return a div element that contains the page content
    return <div className="h-full">{renderContent()}</div>;
};

export default Page;

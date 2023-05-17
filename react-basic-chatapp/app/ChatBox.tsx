import React, { useState } from "react";

const ChatBox = ({ onMessage }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onMessage(message);

        setMessage("");
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    );
};

export default ChatBox;

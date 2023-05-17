import React, { useState } from "react";

const ChatList = ({ messages }) => {
    return (
        <ul>
            {messages.map((message) => (
                <li key={message}>{message}</li>
            ))}
        </ul>
    );
};

export default ChatList;

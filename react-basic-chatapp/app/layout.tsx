'use client';


import React, { useState } from "react";
import ReactDOM from "react-dom";

const Layout = () => {
    const [messages, setMessages] = useState([]);

    const handleMessage = (message) => {
        setMessages([...messages, message]);
    };

    return (
        <div>
            <h1>Chat App</h1>
            <ChatBox onMessage={handleMessage} />
            <ChatList messages={messages} />
        </div>
    );
};

export default Layout;

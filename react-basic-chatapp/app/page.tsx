'use client'; // Declare the client module boundary at the top of the file

import React, { useState } from "react";
import ReactDOM from "react-dom";
import Layout from "../app/layout";

const Page = () => {
    const [timer, setTimer] = useState(0);

    const handleTimerChange = () => {
        setTimer(timer + 1);
    };

    return (
        <Layout>
            <h2>Chat Page</h2>
            <div>
                <input
                    type="number"
                    value={timer}
                    onChange={handleTimerChange}
                />
            </div>
        </Layout>
    );
};

export default Page;

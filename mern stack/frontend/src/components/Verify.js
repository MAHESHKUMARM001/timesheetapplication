import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Verify() {
    const { token } = useParams();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/api/auth/verify/${token}`);
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed.");
            }
        };

        verifyEmail();
    }, [token]);

    return <div><h2>{message}</h2></div>;
}

export default Verify;

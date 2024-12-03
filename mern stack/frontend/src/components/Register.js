import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Send a request to verify if the token is valid
                const response = await axios.get("http://localhost:5000/api/protected", {
                    withCredentials: true, // Include cookies
                });
                // If valid, navigate to the home page
                if (response.status === 200) {
                    navigate("/home");
                }
            } catch (err) {
                console.log("User not logged in:", err.response?.data?.message || err.message);
            }
        };

        checkLoginStatus();
    }, [navigate]);
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("/api/auth/register", {
                email,
                password,
            });

            if (response.status === 201) {
                // setCurrentUser({ email }); // Update user state
                navigate("/home"); // Redirect to Home page
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || "Registration failed.");
            } else {
                setMessage("An error occurred. Please try again.");
            }
            console.error(error);
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;

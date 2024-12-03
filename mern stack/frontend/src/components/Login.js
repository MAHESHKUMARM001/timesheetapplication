import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ mail_id: "", password: "" });
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Check if the user is already logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Send a request to verify if the token is valid
                const response = await axios.get("http://localhost:5000/api/protected", {
                    withCredentials: true, // Include cookies
                });
                // If valid, navigate to the home page
                if (response.status === 200) {
                    // navigate("/home");
                    const role = response.data.user.role;
                    if (role === "admin") {
                        navigate("/admin"); // Navigate to dashboard if admin
                    } else {
                        navigate("/home"); // Navigate to home if regular user
                    }
                }
            } catch (err) {
                console.log("User not logged in:", err.response?.data?.message || err.message);
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/login",
                formData,
                { withCredentials: true } // Enable cookies with Axios
            );
            setMessage(response.data.message);
            setError("");
            
            const role = response.data.role;
            if (role === "admin") {
                navigate("/admin"); // Navigate to dashboard if admin
            } else {
                navigate("/home"); // Navigate to home if regular user
            }
            // Navigate to protected route or home
            // navigate("/home");
        } catch (err) {
            setMessage("");
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="email"
                        name="mail_id"
                        placeholder="Email"
                        value={formData.mail_id}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Login
                </button>
            </form>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;

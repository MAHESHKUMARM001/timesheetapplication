import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Invitation = () => {
    const [formData, setFormData] = useState({
        name: "",
        mail_id: "",
        password: "",
        phone: "",
        department: "",
        business_unit: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/invitation", formData);
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setMessage("");
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <Navbar/>
            <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
                <h2>Invite People</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                        />
                    </div>
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
                    <div style={{ marginBottom: "10px" }}>
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
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            list="departments"
                            name="department"
                            placeholder="Select or Search Department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                        />
                        <datalist id="departments">
                            <option value="CSE" />
                            <option value="ECE" />
                            <option value="EEE" />
                            <option value="MECH" />
                            <option value="CIVIL" />
                        </datalist>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            list="businessUnits"
                            name="business_unit"
                            placeholder="Select or Search Business Unit"
                            value={formData.business_unit}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                        />
                        <datalist id="businessUnits">
                            <option value="A" />
                            <option value="B" />
                            <option value="C" />
                            <option value="D" />
                        </datalist>
                    </div>
                    <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                        Register
                    </button>
                </form>
                {message && <p style={{ color: "green" }}>{message}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
};

export default Invitation;

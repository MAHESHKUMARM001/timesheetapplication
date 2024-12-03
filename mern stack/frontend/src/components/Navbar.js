import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaUsers } from "react-icons/fa";
import "./Navbar.css"; // Importing the CSS file
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mail_id, setmail_id] = useState("");
  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true, // Include cookies in the request
        });
        const userData = response.data.user;
        setUser(userData); // Set user details
        setmail_id(userData.mail_id); // Save the user's ID as mail_id
      } catch (err) {
        console.error("Error fetching user details:", err);
        navigate("/login"); // Redirect to login page if unauthorized
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchUserDetails();
  }, [navigate]);
  return (
    <div className="navbar-container">
      {/* Header Section */}
      <div className="header">
        <div className="tabler-logo">
          <p>Time Sheet</p>
        </div>
        <div className="profile-section">
          <div className="avatar"></div>
          <div>
            <p className="email">{mail_id}</p>
            <p className="role">Administrator</p>
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <hr className="horizontal-line" />

      {/* Menu Section */}
      <div className="menu-section">
        <Link to="/admin" className="menu-item">
          <FaHome className="menu-icon" /> Home
        </Link>
        <Link to="/project" className="menu-item">
          <FaProjectDiagram className="menu-icon" /> Projects
        </Link>
        <Link to="/employee" className="menu-item">
          <FaUsers className="menu-icon" /> Employee
        </Link>
      </div>

      {/* Horizontal Line */}
      <hr className="horizontal-line" />
    </div>
  );
};

export default Navbar;

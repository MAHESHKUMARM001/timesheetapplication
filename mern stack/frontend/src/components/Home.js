import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import "./ProjectList.css";
import "./Home.css";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";

const Home = () => {
  const [user, setUser] = useState(null); // User details
  const [loading, setLoading] = useState(true); // Loading state
  const [projects, setProjects] = useState([]); // Projects state
  const [error, setError] = useState(null); // Error state
  const [userdetails, setuserdetails] = useState("");
  const [emplyeeperformance, setemplyeeperformance] = useState(0); // Initialize performance as 0

  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true, // Include cookies in the request
        });
        const userData = response.data.user;
        setUser(userData); // Set user details
        fetchProjects(userData.mail_id); // Fetch projects after user is set
        fetchdetails(userData.mail_id);
        fetchperformance(userData.mail_id);
      } catch (err) {
        console.error("Error fetching user details:", err);
        navigate("/login"); // Redirect to login page if unauthorized
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Fetch projects for the logged-in user
  const fetchProjects = async (mailId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/employees/${mailId}/projects`
      );
      setProjects(response.data);
    } catch (err) {
      setError("Failed to load projects.");
      console.error("Error fetching employee projects:", err);
    }
  };

  const fetchdetails = async (mailId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${mailId}`
      );
      setuserdetails(response.data);
    } catch (err) {
      setError("Failed to load details.");
      console.error("Error fetching employee details:", err);
    }
  };

  const fetchperformance = async (mailId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/employeeperformance/${mailId}`
      );
      setemplyeeperformance(response.data.overallPerformance); // Set overall performance
    } catch (err) {
      setError("Failed to load performance.");
      console.error("Error fetching employee performance:", err);
    }
  };

  // Update the gauge options when emplyeeperformance changes
  useEffect(() => {
    setOptions({
      type: "radial-gauge",
      value: emplyeeperformance, // Use dynamic performance value
      scale: {
        min: 0,
        max: 100,
      },
      needle: {
        enabled: true,
      },
      bar: {
        enabled: false,
      },
    });
  }, [emplyeeperformance]);

  const [options, setOptions] = useState({
    type: "radial-gauge",
    value: 0, // Default initial value
    scale: {
      min: 0,
      max: 100,
    },
    needle: {
      enabled: true,
    },
    bar: {
      enabled: false,
    },
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <Navbar1 />
          <div className="employee-projects-container">
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <div>
              <h3>Employee Details</h3>
              <p>Name : {userdetails.name}</p>
              <p>Mail_id : {userdetails.mail_id}</p>
              <p>Phone No : {userdetails.phone}</p>
              <p>Department : {userdetails.department}</p>
              <p>Business Unit : {userdetails.business_unit}</p>
              </div>
              <div style={{paddingRight:150}}>
                <h4>Overall Performance: {emplyeeperformance}%</h4>
                {/* Radial Gauge */}
                <AgGauge options={options}/>
              </div>
            </div>

            <h3>Projects Assigned to Employee</h3>
            {error && <p className="error">{error}</p>}
            <table className="project-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Project Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <Link to={`/tasklist/${project._id}`}>
                        {project.project_name}
                      </Link>
                    </td>
                    <td>{project.project_type}</td>
                    <td>{project.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleLogout}>logout</button>
          </div>
        </div>
      ) : (
        <p>User details not available.</p>
      )}
    </div>
  );
};

export default Home;

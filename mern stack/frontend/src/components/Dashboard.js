import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UsersDetails from "./UsersDetails";
import ProjectList from "./ProjectList";
import Navbar from "./Navbar";
import './Dashboard.css';
import TimeLogCalendar from "./TimeLogCalendar";
import AllTimeLog from "./AllTimeLog";
import TaskStatusOfProject from "./TaskStatusOfProject";
import TaskStatus from "./TaskStatusOfProject";
import EmployeeStatus from "./EmployeeStatus";
import ProjectHoursChart from "./ProjectHoursChart";
import Hoursofproject from "./ProjectHoursChart";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import ProjectListFilter from "./ProjectListFilter";
import "./ProjectHourChart.css"


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    Completed: 0,
    "In Progress": 0,
    "To Do": 0,
    total: 0,
  });
  const [totalEmployees, setTotalEmployees] = useState(0); // State for storing total employees
  const [error, setError] = useState(null); // Error state

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true, // Include cookies in the request
        });
        setUser(response.data.user); // Set user details
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        // If not authorized, redirect to login page
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [navigate]);


  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching project summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/totalEmployees");
        setTotalEmployees(response.data.totalEmployees);
      } catch (err) {
        setError("Failed to load total employees.");
        console.error("Error fetching total employees:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTotalEmployees();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleAddEmployee = () => {
    navigate("/invitation");
  };
  const handleproject = () => {
    navigate("/projectcreate");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.role === "admin" ? (
        <div>
          <Navbar/>
          <div className="fullproject">
          <div className="dashboard-container">
            {/* Header Section */}
            <header className="dashboard-header">
              <h1>Dashboard</h1>
            </header>
            <br />

                <section className="welcome-section">
                  <h2>Welcome Maheshkumar M</h2>
                  <p>
                    Here's where you'll view a summary of Project's status, priorities,
                    workload, and more.
                  </p>
                </section>

                <section className="task-section">
                  <div className="task-card done">
                    <p>Total Project</p>
                    <p>{summary.total}</p>
                  </div>
                  <div className="task-card create">
                    <p>Total Employees</p>
                    <p>{totalEmployees}</p>
                  </div>
                  {/* <div className="task-card edit">
                    <p>Total Project</p>
                    <p>{}</p>
                  </div>
                  <div className="task-card pending">
                    <p>Project ToDo</p>
                    <p>{}</p>
                  </div> */}
                </section>

                {/* Chart Section */}
                <header className="dashboard-header">
                <h1 style={{ paddingTop: 20 }}>Status Overview</h1>
              </header>
                <section className="chart-section">
                  <div className="statuscart">
                    <div className="chart-card1">
                      <h3>Line Chart: Project Hours Overview</h3>
                      <div style={{ width: "80%", margin: "0 auto", marginTop: "2rem" }}>
                        <ProjectHoursChart />
                      </div>
                    </div>
                  </div>
                </section>
                
        </div>
        <ProjectListFilter/>
        <div style={styles.nav}>
              <button style={styles.button} onClick={handleLogout}>
                Logout
              </button>
            </div>
        {/* <ProjectD/> */}
          </div> 
          
        </div>
      ) : (
        <div style={styles.infoBox}>

          <p>You do not have admin privileges.</p>
          
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  infoBox: {
    marginTop: 20,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  nav: {
    marginTop: 20,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  
};

export default Dashboard;

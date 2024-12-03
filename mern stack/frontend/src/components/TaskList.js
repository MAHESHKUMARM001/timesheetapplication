import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectList.css";
import Navbar1 from "./Navbar1";

const TaskList = () => {
  const { id } = useParams(); // Extract project ID from URL
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null); // Store user details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true, // Include cookies in the request
        });
        const userData = response.data.user;
        setUser(userData); // Set user details
        fetchTasks(userData.mail_id); // Fetch tasks after user is set
      } catch (err) {
        console.error("Error fetching user details:", err);
        navigate("/login"); // Redirect to login page if unauthorized
      }
    };

    // Fetch tasks assigned to the user for the given project ID
    const fetchTasks = async (mailId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/projects/${id}/tasks`
        );

        // Filter tasks based on the logged-in user's mail ID
        const assignedTasks = response.data.filter(
          (task) => task.assigned_user === mailId
        );
        setTasks(assignedTasks); // Set filtered tasks
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar1 />
      <div className="task-details-container" style={{ paddingLeft: 50 }}>
        <ToastContainer />
        <h3>My Assigned Tasks</h3>
        <table className="project-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Planned Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <Link to={`/taskdetail/${task._id}`}>{task.task_name}</Link>
                </td>
                <td>{task.planned_hours}</td>
                <td>{task.status}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="3" className="no-data">
                  No tasks assigned to you.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;

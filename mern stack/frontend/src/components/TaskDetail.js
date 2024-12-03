import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar1 from "./Navbar1";

const TaskDetail = () => {
  const { id } = useParams(); // Extract task ID from the URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch task details for the given task ID
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${id}`);
        setTask(response.data); // Set the task data
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to fetch task details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!task) {
    return <div>No task found.</div>;
  }

  return (
    <div>
      <Navbar1 />
      <div className="task-detail-container" style={{ paddingLeft: 50 }}>
        <ToastContainer />
        <h3>Task Details</h3>
        <p><strong>Task Name :</strong> {task.task_name}</p>
        <p><strong>Planned Hours :</strong> {task.planned_hours}</p>
        <p><strong>Status :</strong> {task.status}</p>
        <p><strong>Description :</strong> {task.description || "No description available"}</p>

        {/* Conditional Rendering for the Button */}
        {task.status === "Completed" ? (
          <p style={{ color: "green", fontWeight: "bold" }}>Task Completed</p>
        ) : (
          <button className="create-button" style={{ backgroundColor: "#0087ff" }}>
            <Link 
              to={`/addtimelog/${id}`} // Use template literals for dynamic paths
              style={{ textDecoration: "none", color: "white" }}
            >
              Time Log
            </Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;

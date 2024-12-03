import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const ProjectState = () => {
  const { id } = useParams(); // Extract project ID from the URL
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalPlannedHours: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projecttasksdata/${id}`);
        const projectTasks = response.data;

        // Calculate stats
        const totalPlannedHours = projectTasks.reduce(
          (sum, task) => sum + (task.planned_hours || 0),
          0
        );

        const totalTasks = projectTasks.length;
        const todoTasks = projectTasks.filter((task) => task.status === "To Do").length;
        const inProgressTasks = projectTasks.filter((task) => task.status === "In Progress").length;
        const completedTasks = projectTasks.filter((task) => task.status === "Completed").length;

        // Update state with calculated stats
        setStats({
          totalPlannedHours,
          totalTasks,
          todoTasks,
          inProgressTasks,
          completedTasks,
        });

        setTasks(projectTasks);
      } catch (error) {
        console.error("Error fetching project tasks:", error);
        toast.error("Failed to fetch project tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [id]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h2>Project Statistics</h2>
      <div style={{ marginTop: "10px" }}>
        <p><strong>Total Planned Hours:</strong> {stats.totalPlannedHours}</p>
        <p><strong>Total Tasks:</strong> {stats.totalTasks}</p>
        <p><strong>Tasks in To Do:</strong> {stats.todoTasks}</p>
        <p><strong>Tasks in In Progress:</strong> {stats.inProgressTasks}</p>
        <p><strong>Tasks in Completed:</strong> {stats.completedTasks}</p>
      </div>
    </div>
  );
};

export default ProjectState;

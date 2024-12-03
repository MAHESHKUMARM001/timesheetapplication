import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskStatusOfProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [timeframe, setTimeframe] = useState("day");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState(""); // New state for status filter
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projectlistall");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch tasks when project, timeframe, filterDate, or statusFilter changes
  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject, timeframe, filterDate, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/${selectedProject}`, {
        params: { timeframe, date: filterDate, status: statusFilter },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-dashboard">
      <h2>Project Tasks</h2>

      {/* Dropdown to select project */}
      <div className="filters">
        <label htmlFor="project">Select Project:</label>
        <select
          id="project"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Project --</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.project_name}
            </option>
          ))}
        </select>

        {/* Dropdown to select timeframe */}
        <label htmlFor="timeframe">Timeframe:</label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        {/* Date picker for filter */}
        <label htmlFor="filterDate">Date:</label>
        {timeframe === "day" || timeframe === "week" ? (
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        ) : timeframe === "month" ? (
          <input
            type="month"
            id="filterDate"
            value={filterDate.slice(0, 7)}
            onChange={(e) => setFilterDate(e.target.value + "-01")}
          />
        ) : timeframe === "year" ? (
          <input
            type="number"
            id="filterDate"
            placeholder="Enter Year"
            value={filterDate.slice(0, 4)}
            onChange={(e) => setFilterDate(e.target.value + "-01-01")}
          />
        ) : null}

        {/* Dropdown to filter by status */}
        <label htmlFor="statusFilter">Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">-- All Statuses --</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table to display tasks */}
      <div className="project-table">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned User</th>
                <th>Planned Hours</th>
                <th>Actual Hours</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.task_name}</td>
                  <td>{task.assigned_user}</td>
                  <td>{task.planned_hours}</td>
                  <td>{task.actual_hours}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default TaskStatusOfProject;

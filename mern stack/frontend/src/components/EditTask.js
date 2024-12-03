import React, { useState } from "react";
import axios from "axios";

const EditTask = ({ task, onUpdate }) => {
  const [updatedTask, setUpdatedTask] = useState({ ...task });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${task._id}`,
        updatedTask
      );
      onUpdate(response.data); // Notify parent of the update
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3>Edit Task</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:      
          <input
            type="text"
            name="task_name"
            value={updatedTask.task_name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Planned Hours:
          <input
            type="number"
            name="planned_hours"
            value={updatedTask.planned_hours}
            onChange={handleChange}
          />
        </label>
        <br />
        {/* <label>
          Assigned User:
          <input
            type="text"
            name="assigned_user"
            value={updatedTask.assigned_user}
            onChange={handleChange}
          />
        </label>
        <br /> */}
        <label>
          Status:
          <select
            name="status"
            value={updatedTask.status}
            onChange={handleChange}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditTask;

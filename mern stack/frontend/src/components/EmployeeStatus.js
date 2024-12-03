import React, { useState } from "react";
import axios from "axios";

const EmployeeStatus = () => {
  const [period, setPeriod] = useState("day");
  const [dateInputs, setDateInputs] = useState({});
  const [tasks, setTasks] = useState([]);

  const handleFilterChange = (e) => {
    setPeriod(e.target.value);
    setDateInputs({});
  };

  const handleDateInputChange = (e) => {
    setDateInputs({ ...dateInputs, [e.target.name]: e.target.value });
  };

  const fetchTasks = async () => {
    const params = { ...dateInputs, period, user_id: "USER_ID_HERE" };
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/completed", { params });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <h1>Task Completion Report</h1>
      <div>
        <label>
          Period:
          <select value={period} onChange={handleFilterChange}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </label>
      </div>
      <div>
        {period === "day" && (
          <input
            type="date"
            name="day"
            value={dateInputs.day || ""}
            onChange={handleDateInputChange}
          />
        )}
        {period === "week" && (
          <>
            <input
              type="date"
              name="from_week"
              value={dateInputs.from_week || ""}
              onChange={handleDateInputChange}
              placeholder="From Week"
            />
            <input
              type="date"
              name="to_week"
              value={dateInputs.to_week || ""}
              onChange={handleDateInputChange}
              placeholder="To Week"
            />
          </>
        )}
        {period === "month" && (
          <input
            type="month"
            name="month"
            value={dateInputs.month || ""}
            onChange={handleDateInputChange}
          />
        )}
        {period === "year" && (
          <input
            type="number"
            name="year"
            value={dateInputs.year || ""}
            onChange={handleDateInputChange}
            placeholder="Enter Year"
          />
        )}
      </div>
      <button onClick={fetchTasks}>Fetch Tasks</button>

      <div>
        <h2>Completed Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              Group: {task._id}, Count: {task.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeStatus;

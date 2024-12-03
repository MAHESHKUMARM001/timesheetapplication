import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./TimeLogStyles.css";

const AllTimeLog = () => {
  const [timeLogs, setTimeLogs] = useState({});
  const [timeframe, setTimeframe] = useState("day"); // Default to day
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/timelogs/grouped`, {
          params: { timeframe },
        });
        setTimeLogs(response.data);
      } catch (error) {
        console.error("Error fetching time logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLogs();
  }, [timeframe]);

  const renderLogs = () => {
    if (Object.keys(timeLogs).length === 0) {
      return <p>No time logs found.</p>;
    }

    return Object.entries(timeLogs).map(([key, logs]) => (
      <div key={key} className="timelog-group">
        <h3>{`Timeframe: ${key}`}</h3>
        <table className="timelog-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Task Name</th>
              <th>Date</th>
              <th>Hours Spent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.user}</td>
                <td>{log.task_name}</td>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>{log.hours_spent}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <div className="timelog-container">
      <h2>User Time Log Entries</h2>
      <div className="timelog-controls">
        <label htmlFor="timeframe">Group by:</label>
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
      </div>
      {loading ? <p>Loading...</p> : renderLogs()}
    </div>
  );
};

export default AllTimeLog;

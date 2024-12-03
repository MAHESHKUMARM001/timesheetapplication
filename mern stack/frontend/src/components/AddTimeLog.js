import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "./Navbar";
import Navbar1 from "./Navbar1";

const AddTimeLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // User details
  const [mail_id, setmail_id] = useState(""); // To store user's mail_id
  const [loading, setLoading] = useState(true); // Track loading state

  const [timeLog, setTimeLog] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    start_time: "",
    end_time: "",
    hours_spent: "", // This will now be calculated
    status: "To Do", // Default status
  });
  const [endTimes, setEndTimes] = useState([]); // Valid end times based on start time

  // Fetch user details on mount
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimeLog((prevLog) => ({ ...prevLog, [name]: value }));

    if (name === "start_time") {
      updateEndTimes(value); // Update valid end times when start time changes
    }

    if (name === "start_time" || name === "end_time") {
      calculateHoursSpent(name === "start_time" ? value : timeLog.start_time, name === "end_time" ? value : timeLog.end_time);
    }
  };

  const updateEndTimes = (startTime) => {
    const startHour = parseInt(startTime.split(":")[0], 10);
    const startMinute = parseInt(startTime.split(":")[1], 10);

    let validEndTimes = [];
    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = hour === startHour ? startMinute + 1 : 0; minute < 60; minute += 1) {
        validEndTimes.push(
          `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        );
      }
    }

    setEndTimes(validEndTimes);
  };

  const calculateHoursSpent = (startTime, endTime) => {
    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDate = new Date(0, 0, 0, startHour, startMinute, 0);
      const endDate = new Date(0, 0, 0, endHour, endMinute, 0);

      const diff = (endDate - startDate) / (1000 * 60 * 60); // Difference in hours
      const hours = Math.max(diff, 0); // Ensure no negative value
      setTimeLog((prevLog) => ({ ...prevLog, hours_spent: hours.toFixed(2) }));
    } else {
      setTimeLog((prevLog) => ({ ...prevLog, hours_spent: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      toast.error("Please wait, loading user data...");
      return;
    }

    const { date, start_time, end_time, hours_spent, status } = timeLog;

    if (!start_time || !end_time || !hours_spent) {
      toast.error("All fields are required!");
      return;
    }

    const payload = {
      mail_id,
      date,
      start_time,
      end_time,
      hours_spent,
      status,
    };

    try {
      const response = await axios.post(`http://localhost:5000/timelogs/${id}`, payload);
      toast.success("Timelog added successfully!");
      setTimeLog({
        date: new Date().toISOString().split("T")[0],
        start_time: "",
        end_time: "",
        hours_spent: "",
        status: "To Do",
      });
      setEndTimes([]);
    } catch (error) {
      console.error("Error adding timelog:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to add timelog.");
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <Navbar1/>
      <div className="add-timelog-container" style={{paddingLeft:50}}>
        <ToastContainer />
        <h2>Add Timelog</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={timeLog.date}
              onChange={handleChange}
              readOnly // Prevent editing
            />
          </div>
          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="time"
              name="start_time"
              value={timeLog.start_time}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Time:</label>
            <select
              name="end_time"
              value={timeLog.end_time}
              onChange={handleChange}
              disabled={!timeLog.start_time} // Disable if no start time is set
            >
              <option value="">Select End Time</option>
              {endTimes.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Hours Spent:</label>
            <input
              type="text"
              name="hours_spent"
              value={timeLog.hours_spent}
              readOnly // Read-only as it's auto-calculated
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={timeLog.status} onChange={handleChange}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            Add Timelog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTimeLog;

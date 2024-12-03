import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarStyles.css";
import axios from "axios";
import Navbar1 from "./Navbar1";

const localizer = momentLocalizer(moment);

const TimeLogCalendar = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch time logs from the backend
  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/timelogs");
        const timeLogs = response.data;

        const calendarEvents = timeLogs.flatMap((log) =>
          log.timelog.map((entry) => ({
            title: `${log.task_id.task_name}`,
            user: log.task_id.assigned_user || "Unassigned",
            start_time: entry.start_time,
            start: new Date(moment(entry.date).format("YYYY-MM-DD") + "T" + entry.start_time),
            end: new Date(moment(entry.date).format("YYYY-MM-DD") + "T" + entry.end_time),
            description: log.task_id.description || "No description available",
            status: entry.status,
          }))
        );

        setEvents(calendarEvents);
        console.log("Calendar Events Fetched:", calendarEvents);
      } catch (error) {
        console.error("Error fetching time logs:", error);
        setError("Failed to load time logs. Please try again later.");
      }
    };

    fetchTimeLogs();
  }, []);

  // Custom styling for calendar events
  const eventStyleGetter = (event) => {
    const colorMap = {
      "To Do": "#ff9800", // Orange
      "In Progress": "#2196f3", // Blue
      "Completed": "#4caf50", // Green
    };
    return {
      style: {
        backgroundColor: colorMap[event.status] || "#9e9e9e", // Default gray
        color: "white",
        borderRadius: "5px",
        border: "none",
        padding: "5px",
      },
    };
  };

  // Custom Event Component
  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <p>
        {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}
      </p>
      <p>Status: {event.status}</p>
      <p>Assigned To: {event.user}</p>
      <p>{event.description}</p>
    </div>
  );

  return (
    <div>
      <Navbar1 />
      <div style={{ paddingLeft: 50, paddingRight: 50, paddingBottom: 30 }}>
        <div style={{ height: "80vh", padding: "20px" }}>
          <h2>Task Calendar</h2>
          {error ? (
            <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              components={{ event: CustomEvent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeLogCalendar;

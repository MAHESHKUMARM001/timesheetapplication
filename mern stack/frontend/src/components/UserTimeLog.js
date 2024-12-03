import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarStyles.css";
import axios from "axios";
import Navbar1 from "./Navbar1";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const UserTimeLog = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true, // Include cookies in the request
        });
        const userData = response.data.user;
        // setUser(userData); // Set user details
        fetchTimeLogs(userData.mail_id); // Fetch projects after user is set
      } catch (err) {
        console.error("Error fetching user details:", err);
        navigate("/login"); // Redirect to login page if unauthorized
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const fetchTimeLogs = async (mail_id) => {
    try {
        if (!mail_id) {
            toast.error("No mail_id provided!");
            return;
        }
      const response = await axios.get(`http://localhost:5000/usertimelogs?mail_id=${mail_id}`);
      const timeLogs = response.data;
      // setTimeLogs(response.data);

      const calendarEvents = timeLogs.flatMap((log) =>
        log.timelog.map((entry) => ({
          title: `${log.task_id.task_name}`, // Add status to the title
          user: log.task_id.assigned_user, // Assigned user
          start_time: entry.start_time,
          start: new Date(moment(entry.date).format("YYYY-MM-DD") + "T" + entry.start_time),
          end: new Date(moment(entry.date).format("YYYY-MM-DD") + "T" + entry.end_time),
          description: `Assigned User: ${log.task_id.assigned_user} | ${log.task_id.description}`, // Detailed description
          status: entry.status,
        }))
      );
      
      setEvents(calendarEvents);
      console.log(calendarEvents);
    } catch (error) {
      console.error("Error fetching time logs:", error);
      toast.error("Failed to fetch time logs.");
    } finally {
      setLoading(false);
    }
   };


  if (loading) {
    return <div>Loading time logs...</div>;
  }


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

  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <p>{moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}</p>
      <p>Status: {event.status}</p>
    </div>
  );

  return (
    <div>
    <Navbar1/>
    <div style={{paddingLeft:50, paddingRight:50, paddingBottom:30}}>

      <div style={{ height: "80vh", padding: "20px" }}>
        <h2>Task Calendar</h2>
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
      </div>
      <br/>
      <br/>
      <br/>

    </div>
  </div>
        
  );
};

export default UserTimeLog;

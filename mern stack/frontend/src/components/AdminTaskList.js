// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useParams } from "react-router-dom";
// import "./ProjectList.css";

// const AdminTaskList = () => {
//   const { id } = useParams(); // Extract project_id from URL
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/projecttasks/${id}`);
//         setTasks(response.data);
//         setFilteredTasks(response.data); // Initially show all tasks
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         toast.error("Failed to fetch tasks. Please try again later.");
//       }
//     };

//     fetchTasks();
//   }, [id]);

//   // Handle search input change
//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//     filterTasks(event.target.value, statusFilter);
//   };

//   // Handle status filter change
//   const handleStatusFilter = (event) => {
//     setStatusFilter(event.target.value);
//     filterTasks(searchQuery, event.target.value);
//   };

//   // Filter tasks based on search query and status filter
//   const filterTasks = (query, status) => {
//     let filtered = tasks;

//     // Apply search filter
//     if (query) {
//       filtered = filtered.filter(
//         (task) =>
//           task.task_name.toLowerCase().includes(query.toLowerCase()) ||
//           task.assigned_user.toLowerCase().includes(query.toLowerCase())
//       );
//     }

//     // Apply status filter
//     if (status !== "All") {
//       filtered = filtered.filter((task) => task.status === status);
//     }

//     setFilteredTasks(filtered);
//   };

//   // Function to get dynamic status styles
//   const getStatusStyle = (status) => {
//     const styles = {
//       "To Do": { backgroundColor: "#ff9800", color: "white", padding: "5px", borderRadius: "5px" }, // Orange
//       "In Progress": { backgroundColor: "#2196f3", color: "white", padding: "5px", borderRadius: "5px" }, // Blue
//       "Completed": { backgroundColor: "#4caf50", color: "white", padding: "5px", borderRadius: "5px" }, // Green
//       Default: { backgroundColor: "#9e9e9e", color: "white", padding: "5px", borderRadius: "5px" }, // Gray
//     };

//     return styles[status] || styles.Default;
//   };

//   return (
//     <div className="task-list-container">
//       <ToastContainer />
//       <h2>Tasks for Project</h2>

//       {/* Search and Filter Controls */}
//       <div className="task-filters">
//         <input
//           type="text"
//           placeholder="Search by task name or assigned user"
//           value={searchQuery}
//           onChange={handleSearch}
//           className="search-input"
//           style={{marginRight:25}}
//         />

//         <select value={statusFilter} onChange={handleStatusFilter} className="status-dropdown" style={{width:"150px", height:"29px", border:"1px solid #ccc", borderRadius:"4px"}}>
//           <option value="All">All Statuses</option>
//           <option value="To Do">To Do</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//         </select>
//       </div>

//       {/* Task List */}
//       {filteredTasks.length === 0 ? (
//         <p>No tasks found for the given criteria.</p>
//       ) : (
//         <table className="project-table">
//           <thead>
//             <tr>
//               <th>Task Name</th>
//               <th>Planned Hours</th>
//               <th>Assigned User</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.map((task) => (
//               <tr key={task._id}>
//                 <td>{task.task_name}</td>
//                 <td>{task.planned_hours}</td>
//                 <td>{task.assigned_user}</td>
//                 <td>
//                   <span style={getStatusStyle(task.status)}>{task.status}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminTaskList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import NewWindow from "react-new-window";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./ProjectList.css";
import EditTask from "./EditTask";

const AdminTaskList = () => {
  const { id } = useParams(); // Extract project_id from URL
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null); // Task to edit
  const [showEditWindow, setShowEditWindow] = useState(false); // Show/hide edit window
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projecttasks/${id}`);
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filtered tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, [id]);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterTasks(event.target.value, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    filterTasks(searchQuery, event.target.value);
  };

  // Filter tasks based on search query and status filter
  const filterTasks = (query, status) => {
    let filtered = tasks;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(
        (task) =>
          task.task_name.toLowerCase().includes(query.toLowerCase()) ||
          task.assigned_user.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== "All") {
      filtered = filtered.filter((task) => task.status === status);
    }

    setFilteredTasks(filtered);
  };

  // Function to get dynamic status styles
  const getStatusStyle = (status) => {
    const styles = {
      "To Do": { backgroundColor: "#ff9800", color: "white", padding: "5px", borderRadius: "5px" }, // Orange
      "In Progress": { backgroundColor: "#2196f3", color: "white", padding: "5px", borderRadius: "5px" }, // Blue
      "Completed": { backgroundColor: "#4caf50", color: "white", padding: "5px", borderRadius: "5px" }, // Green
      Default: { backgroundColor: "#9e9e9e", color: "white", padding: "5px", borderRadius: "5px" }, // Gray
    };

    return styles[status] || styles.Default;
  };

  // Open edit window
  const handleEditClick = (task) => {
    setEditTask(task); // Set the task to edit
    setShowEditWindow(true); // Open the new window
  };

  // Update the task list after editing
  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    filterTasks(searchQuery, statusFilter); // Re-apply filters after update
    toast.success("Task updated successfully!");
    setShowEditWindow(false); // Close the new window
  };

  return (
    <div className="task-list-container">
      <ToastContainer />
      <h2>Tasks for Project</h2>
      <div className="task-filters">
        <input
          type="text"
          placeholder="Search by task name or assigned user"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          style={{ marginRight: 25 }}
        />

        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="status-dropdown"
          style={{ width: "150px", height: "29px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="All">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found for this project.</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks found for the given criteria.</p>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Planned Hours</th>
              <th>Assigned User</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task_name}</td>
                <td>{task.planned_hours}</td>
                <td>{task.assigned_user}</td>
                <td>
                  <span style={getStatusStyle(task.status)}>{task.status}</span>
                </td>
                <td>
                  <button onClick={() => handleEditClick(task)}  style={{height:25}}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Open new window for editing */}
      {showEditWindow && editTask && (
        <NewWindow
          onUnload={() => setShowEditWindow(false)} // Handle window close
          features={{ width: 600, height: 400, left: 200, top: 200 }}
        >
          <EditTask task={editTask} onUpdate={handleTaskUpdate} />
        </NewWindow>
      )}
    </div>
  );
};

export default AdminTaskList;

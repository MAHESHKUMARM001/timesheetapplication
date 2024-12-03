// import React, { useState } from "react";
// import { useParams } from "react-router-dom"; // Import useParams
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CreateTask = () => {
//   const { id } = useParams();  // Get project ID from URL
//   const [taskData, setTaskData] = useState({
//     task_name: "",
//     planned_hours: "",
//   });

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Handle task submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate input
//     if (!taskData.task_name || !taskData.planned_hours) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }

//     try {
//       // Correct the axios POST request URL (use backticks and template literals)
//       await axios.post(`http://localhost:5000/projects/${id}/tasks`, taskData);
//       toast.success("Task added successfully!");
//       setTaskData({ task_name: "", planned_hours: "" });
//     } catch (error) {
//       console.error("Error creating task:", error);
//       toast.error("Failed to add task.");
//     }
//   };

//   return (
//     <div className="create-task-container">
//       <ToastContainer />
//       <h2>Create Task</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Task Name */}
//         <div className="form-group">
//           <label>Task Name:</label>
//           <input
//             type="text"
//             name="task_name"
//             value={taskData.task_name}
//             onChange={handleInputChange}
//             placeholder="Enter task name"
//           />
//         </div>

//         {/* Planned Hours */}
//         <div className="form-group">
//           <label>Planned Hours:</label>
//           <input
//             type="number"
//             name="planned_hours"
//             value={taskData.planned_hours}
//             onChange={handleInputChange}
//             placeholder="Enter planned hours"
//             min="1"
//           />
//         </div>

//         <div className="form-group">
//           <label>Task Description:</label>
//           <textarea
//             name="description"
//             value={taskData.description}
//             onChange={handleInputChange}
//             placeholder="Enter task description"
//             rows="4"  // You can adjust the rows to your preference
//           />
//         </div>

//         <button type="submit" className="submit-button">
//           Add Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateTask;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
  const { id } = useParams(); // Get project ID from URL
  const [taskData, setTaskData] = useState({
    task_name: "",
    planned_hours: "",
    description: "",
    assigned_user: "", // Store the selected user's mail_id
  });
  const [users, setUsers] = useState([]); // List of users assigned to the project
  const [loading, setLoading] = useState(true);

  // Fetch users for the project
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects/${id}/users`);
        setUsers(response.data.users); // Assuming `response.data.users` contains the list of users
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle user selection
  const handleUserSelection = (e) => {
    setTaskData((prevData) => ({ ...prevData, assigned_user: e.target.value }));
  };

  // Handle task submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!taskData.task_name || !taskData.planned_hours || !taskData.assigned_user) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Send task data to the backend
      await axios.post(`http://localhost:5000/projects/${id}/tasks`, taskData);
      toast.success("Task added successfully!");
      setTaskData({ task_name: "", planned_hours: "", description: "", assigned_user: "" });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to add task.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="create-task-container">
      <ToastContainer />
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Task Name */}
        <div className="form-group">
          <label>Task Name:</label>
          <input
            type="text"
            name="task_name"
            value={taskData.task_name}
            onChange={handleInputChange}
            placeholder="Enter task name"
          />
        </div>

        {/* Planned Hours */}
        <div className="form-group">
          <label>Planned Hours:</label>
          <input
            type="number"
            name="planned_hours"
            value={taskData.planned_hours}
            onChange={handleInputChange}
            placeholder="Enter planned hours"
            min="1"
          />
        </div>

        {/* Task Description */}
        <div className="form-group">
          <label>Task Description:</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        {/* Assign User */}
        <div className="form-group">
          <label>Assign User:</label>
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.mail_id}>
                <input
                  type="radio"
                  id={`user-${user.mail_id}`}
                  name="assigned_user"
                  value={user.mail_id}
                  checked={taskData.assigned_user === user.mail_id}
                  onChange={handleUserSelection}
                />
                <label htmlFor={`user-${user.mail_id}`}>{user.mail_id}</label>
              </div>
            ))
          ) : (
            <p>No users available to assign.</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;

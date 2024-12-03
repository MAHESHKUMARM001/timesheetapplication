// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import ProjectSummary from "./ProjectSummary";

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/projectlistall/${id}`);
//         setProject(response.data);
//         console.log(project);
//       } catch (error) {
//         console.error("Error fetching project details:", error);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   if (!project) {
//     return <p>Loading project details...</p>;
//   }

//   return (
//     <div>
//       <h1>{project.project_name}</h1>
//       <p><strong>Client Name:</strong> {project.client_name}</p>
//       <p><strong>Address:</strong> {project.address}</p>
//       <p><strong>Department:</strong> {project.department}</p>
//       <p><strong>Business Unit:</strong> {project.business_unit}</p>
//       <p><strong>Project Type:</strong> {project.project_type}</p>
//       <h3>Users</h3>
//       <ul>
//         {project.users.map((user, index) => (
//           <li key={index}>{user.mail_id}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProjectDetail;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import ReactPaginate from "react-paginate"; // Import the pagination library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectList.css";
import "./ProjectDetail.css";
// import "react-paginate/dist/react-paginate.css"; // Import optional styles for react-paginate

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const itemsPerPage = 10; // Number of records per page

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projectlistall/${id}`);
        setProject(response.data);

        // Fetch user details based on mail_id
        const users = response.data.users;
        const userDetailPromises = users.map((user) =>
          axios.get(`http://localhost:5000/users/${user.mail_id}`)
        );
        const userDetailsResponses = await Promise.all(userDetailPromises);
        setUserDetails(userDetailsResponses.map((res) => res.data));
      } catch (error) {
        console.error("Error fetching project or user details:", error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <p>Loading project details...</p>;
  }

  // Handle delete user mail_id from project
  const handleDeleteUser = async (mailId) => {
    try {
      // Update the backend to remove the user
      const updatedUsers = project.users.filter((user) => user.mail_id !== mailId);

      // Send the updated user list to the server
      await axios.put(`http://localhost:5000/projectlistall/${id}`, {
        ...project,
        users: updatedUsers,
      });

      // Update local state
      setProject((prev) => ({
        ...prev,
        users: updatedUsers,
      }));
      setUserDetails((prev) => prev.filter((user) => user.mail_id !== mailId));

      // Show success toast
      toast.success(`User with mail_id ${mailId} has been removed from the project.`);
    } catch (error) {
      console.error("Error deleting user from project:", error);
      toast.error("Failed to remove the user. Please try again.");
    }
  };

  // Filter userDetails based on searchTerm
  const filteredUsers = userDetails.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page's data for pagination
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage); // Total number of pages
  const startIndex = currentPage * itemsPerPage;
  const currentPageData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="project-list-container">
      <ToastContainer />
      <div className="header1">
        <input
          type="text"
          className="search-input1"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
       <button className="create-button" style={{ backgroundColor: "#0087ff" }}>
        <Link 
          to={`/projectlist/${id}/addemployee`} // Use template literals for dynamic paths
          style={{ textDecoration: "none", color: "white" }}
        >
          Add Employee
        </Link>
      </button>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Business Unit</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.mail_id}</td>
                <td>{user.phone}</td>
                <td>{user.department}</td>
                <td>{user.business_unit}</td>
                <td>{user.role}</td>
                <td>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteUser(user.mail_id)}
                    style={{ cursor: "pointer", color: "#ff0000" }}
                    title="Delete Project"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;

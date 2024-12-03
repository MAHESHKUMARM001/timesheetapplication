import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa"; // Importing the delete icon
import "react-toastify/dist/ReactToastify.css";
import "./ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    department: "",
    business_unit: "",
    status: "",
    project_type: "",
  });

  const itemsPerPage = 10; // Number of projects per page

  // Fetch project data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projectlistall");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjects();
  }, []);

  // Delete project
  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/projectlist/${projectId}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
      toast.success("Project successfully deleted!");
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
      console.error("Error deleting project:", error);
    }
  };

  // Filter projects based on search term and dropdown filters
  const filteredProjects = projects
    .filter((project) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) =>
      filters.department ? project.department === filters.department : true
    )
    .filter((project) =>
      filters.business_unit ? project.business_unit === filters.business_unit : true
    )
    .filter((project) =>
      filters.status ? project.status === filters.status : true
    )
    .filter((project) =>
      filters.project_type ? project.project_type === filters.project_type : true
    );

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentProjects = filteredProjects.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(0); // Reset to the first page
  };

  return (
    <div className="project-list-container">
      <ToastContainer />
      <div className="header1">
        <h1>Projects</h1>
        <button className="create-button" style={{ backgroundColor: "#0087ff" }}>
          <Link to="/projectcreate" style={{textDecoration:"none", color:"white"}}>
            Create Project
          </Link>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search Projects"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
        <select
          name="business_unit"
          value={filters.business_unit}
          onChange={handleFilterChange}
        >
          <option value="">All Business Units</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="A">C</option>
          <option value="B">D</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="To do">To do</option>
          <option value="In process">In process</option>
          <option value="Done">Done</option>
        </select>
        <select
          name="project_type"
          value={filters.project_type}
          onChange={handleFilterChange}
        >
          <option value="">All Project Types</option>
          <option value="Development">Development</option>
          <option value="Research">Research</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Testing">Testing</option>
        </select>
      </div>

      {/* Project Table */}
      <table className="project-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Project Type</th>
            <th>Department</th>
            <th>Business Unit</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <tr key={project._id}>
              <td>
                <Link to={`/projectlist/${project._id}`}>
                  {project.project_name}
                </Link>
              </td>
              <td>{project.project_type}</td>
              <td>{project.department}</td>
              <td>{project.business_unit}</td>
              <td>{project.status}</td>
              <td>
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete(project._id)}
                  style={{ cursor: "pointer", color: "#ff0000" }}
                  title="Delete Project"
                />
              </td>
            </tr>
          ))}
          {currentProjects.length === 0 && (
            <tr>
              <td colSpan="6" className="no-data">
                No projects found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination-container"}
          activeClassName={"active-page"}
          disabledClassName={"disabled-page"}
        />
      </div>
    </div>
  );
};

export default ProjectList;

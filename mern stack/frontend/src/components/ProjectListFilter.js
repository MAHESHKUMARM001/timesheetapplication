import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
// import "./ProjectListWithFilters.css"; // Create and style this CSS file for pagination styling.

import "./EmployeeList.css";


const ProjectListWithFilters = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const projectsPerPage = 10; // Number of records per page.

  // Fetch projects on component mount.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projectlistall");
        setProjects(response.data);
        setFilteredProjects(response.data); // Initially, all projects are shown.
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects whenever search term, department, or status changes.
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !departmentFilter || project.department === departmentFilter;
      const matchesStatus =
        !statusFilter || project.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    setFilteredProjects(filtered);
    setCurrentPage(0); // Reset to the first page when filters change.
  }, [searchTerm, departmentFilter, statusFilter, projects]);

  // Handle pagination page change.
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get current page's projects.
  const startIndex = currentPage * projectsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  return (
    <div className="project-list">
      <h2>Project List</h2>

      {/* Search and Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by project name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{marginRight:25}}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{marginRight:25, width:200, height:23}}
        >
          <option value="">Filter by Department</option>
          {/* Add department options dynamically */}
          {[...new Set(projects.map((p) => p.department))].map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{marginRight:25, width:200, height:23}}
        >
          <option value="">Filter by Status</option>
          <option value="To do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <br/>
      <br/>

      {/* Project Table */}
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client Name</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.project_name}</td>
                <td>{project.client_name}</td>
                <td>{project.department}</td>
                <td>{project.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No projects found</td>
            </tr>
          )}
        </tbody>
      </table>


      {/* Pagination */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredProjects.length / projectsPerPage)}
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

export default ProjectListWithFilters;

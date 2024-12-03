import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [businessUnitFilter, setBusinessUnitFilter] = useState("");

  const ITEMS_PER_PAGE = 10;

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users"); // Adjust API endpoint as needed
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Extract unique department and business unit options
  const departmentOptions = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const businessUnitOptions = ["A", "B", "C", "D"];

  // Handle pagination
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // Filter employees based on search and dropdown filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mail_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter
      ? employee.department === departmentFilter
      : true;
    const matchesBusinessUnit = businessUnitFilter
      ? employee.business_unit === businessUnitFilter
      : true;

    return matchesSearch && matchesDepartment && matchesBusinessUnit;
  });

  // Pagination logic
  const offset = currentPage * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  return (
    <div className="project-list-container">
      <ToastContainer />
      {/* <h2 style={{paddingTop:10, paddingBottom:10}}>Employee List</h2> */}
      <div className="header1">
        <h1>Employee List</h1>
        <button className="create-button" style={{ backgroundColor: "#0087ff" }}>
          <Link to="/invitation" style={{textDecoration:"none", color:"white"}}>
            Add Employee
          </Link>
        </button>
      </div>
      {/* Filters */}
      <div className="filters-container1">
        <input
          type="text"
          placeholder="Search by name or email"
          className="search-input1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <select
          className="filter-dropdown"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">All Departments</option>
          {departmentOptions.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          className="filter-dropdown"
          value={businessUnitFilter}
          onChange={(e) => setBusinessUnitFilter(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">All Business Units</option>
          {businessUnitOptions.map((businessUnit) => (
            <option key={businessUnit} value={businessUnit}>
              {businessUnit}
            </option>
          ))}
        </select>
      </div>

      {/* Employees Table */}
      <table className="project-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Business Unit</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <Link
                    to={`/employeelist/${employee._id}`}
                    className="employee-name-link"
                  >
                    {employee.name}
                  </Link>
                </td>
                <td>{employee.department}</td>
                <td>{employee.business_unit}</td>
                <td>{employee.mail_id}</td>
                <td>{employee.phone}</td>
                <td>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteEmployee(employee._id)}
                    style={{ cursor: "pointer", color: "#ff0000" }}
                    title="Delete User"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No employees found.
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
          pageCount={Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)}
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

export default EmployeeList;

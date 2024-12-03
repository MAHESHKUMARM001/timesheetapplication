import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddProjectEmployee.css";

const AddProjectEmployee = () => {
  const { id } = useParams(); // Get project ID from route
  const [project, setProject] = useState(null); // Project details
  const [employees, setEmployees] = useState([]); // Available employees
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Selected employees
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndEmployees = async () => {
      try {
        // Fetch project details
        const projectResponse = await axios.get(`http://localhost:5000/projectlistall/${id}`);
        const projectData = projectResponse.data;
        setProject(projectData);

        // Fetch available employees based on department and business unit
        const { department, business_unit } = projectData;
        const employeesResponse = await axios.get(
          `http://localhost:5000/api/projectusers?department=${department}&business_unit=${business_unit}`
        );

        const employeesData = employeesResponse.data;

        // Filter out employees already in the project
        const filteredEmployees = employeesData.filter(
          (employee) => !projectData.users.some((user) => user.mail_id === employee.mail_id)
        );

        setEmployees(filteredEmployees);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch project or employees.");
        setIsLoading(false);
      }
    };

    fetchProjectAndEmployees();
  }, [id]);

  // Handle checkbox selection
  const handleCheckboxChange = (mailId) => {
    if (selectedEmployees.includes(mailId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== mailId));
    } else {
      setSelectedEmployees([...selectedEmployees, mailId]);
    }
  };

  // Handle adding employees to the project
  const handleAddEmployees = async () => {
    if (selectedEmployees.length === 0) {
      toast.warn("Please select at least one employee to add.");
      return;
    }

    try {
      // Add selected employees to the project
      const updatedUsers = [
        ...project.users,
        ...employees.filter((employee) => selectedEmployees.includes(employee.mail_id)),
      ];

      // Update project on the backend
      await axios.put(`http://localhost:5000/projectlistall/${id}`, {
        ...project,
        users: updatedUsers,
      });

      // Update local state
      setProject((prev) => ({
        ...prev,
        users: updatedUsers,
      }));

      // Remove added employees from the available list
      setEmployees((prev) =>
        prev.filter((employee) => !selectedEmployees.includes(employee.mail_id))
      );

      // Clear selected employees
      setSelectedEmployees([]);

      toast.success("Employees successfully added to the project.");
    } catch (error) {
      console.error("Error adding employees:", error);
      toast.error("Failed to add employees. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div className="add-employee-container">
      <ToastContainer />
      <h2>Add Employees to Project</h2>

      {/* Project Overview */}
      <div className="project-overview">
        <p><strong>Project Name:</strong> {project.project_name}</p>
        <p><strong>Department:</strong> {project.department}</p>
        <p><strong>Business Unit:</strong> {project.business_unit}</p>
      </div>

      {/* Employees Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Business Unit</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.mail_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.mail_id)}
                    onChange={() => handleCheckboxChange(employee.mail_id)}
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.mail_id}</td>
                <td>{employee.phone}</td>
                <td>{employee.department}</td>
                <td>{employee.business_unit}</td>
                <td>{employee.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No employees available to add.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Employees Button */}
      <button
        className="add-button"
        onClick={handleAddEmployees}
        disabled={selectedEmployees.length === 0}
      >
        Add Selected Employees
      </button>
    </div>
  );
};

export default AddProjectEmployee;

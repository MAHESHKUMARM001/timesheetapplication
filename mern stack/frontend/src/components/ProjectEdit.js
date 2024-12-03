import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectEdit.css";

const ProjectEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    project_name: "",
    client_name: "",
    address: "",
    department: "",
    business_unit: "",
    project_type: "",
  });

  // Dropdown options
  const departmentOptions = ["CSE", "ECE", "MECH", "CIVIL","EEE"];
  const businessUnitOptions = ["A", "B", "C", "D"];
  const projectTypeOptions = ["Development", "Research", "Maintenance","Testing"];

  // Fetch existing project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projectlistall/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/projectlistall/${id}`, formData);
      toast.success("Project updated successfully!"); // Display success toast
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again."); // Display error toast
    }
  };

  return (
    <div className="project-edit-container">
      {/* <h1>Edit Project</h1> */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project_name" style={{paddingRight:40}}>Project Name:</label>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
          />
        </div>
          
          <br/>
          <br/>
        <div className="form-group">
          <label htmlFor="client_name" style={{paddingRight:40}}>Client Name:</label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
          />
        </div>
        
          <br/>
          <br/>
        <div className="form-group">
          <label htmlFor="address" style={{paddingRight:40}}>Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
       
          <br/>
          <br/>
        <div className="form-group">
          <label htmlFor="department" style={{paddingRight:40}}>Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <br/>
          <br/>
          
        <div className="form-group">
          <label htmlFor="business_unit" style={{paddingRight:40}}>Business Unit:</label>
          <select
            id="business_unit"
            name="business_unit"
            value={formData.business_unit}
            onChange={handleChange}
            required
          >
            <option value="">Select Business Unit</option>
            {businessUnitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
          <br/>
          <br/>
        <div className="form-group" style={{paddingRight:40}}>
          <label htmlFor="project_type">Project Type:</label>
          <select
            id="project_type"
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Project Type</option>
            {projectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProjectEdit;

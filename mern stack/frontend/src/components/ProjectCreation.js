import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectCreation.css";
import Navbar from "./Navbar";

const ProjectCreation = () => {
  const [formData, setFormData] = useState({
    project_name: "",
    client_name: "",
    address: "",
    department: "",
    business_unit: "",
    project_type: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]); // Holds filtered users
  const [selectedUsers, setSelectedUsers] = useState([]); // Holds selected users
  const [step, setStep] = useState(1); // Tracks form step

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch filtered users and move to step 2
  const handleNext = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projectusers", {
        params: {
          department: formData.department,
          business_unit: formData.business_unit,
        },
      });
      setFilteredUsers(response.data); // Set users matching criteria
      setStep(2); // Move to next step
    } catch (error) {
      toast.error("Error fetching users. Please try again.");
      console.error("Error fetching users:", error);
    }
  };

  // Handle user selection
  const handleUserSelection = (user) => {
    if (selectedUsers.some((selected) => selected.mail_id === user.mail_id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.mail_id !== user.mail_id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle project creation
  const handleCreateProject = async () => {
    try {
      const projectData = {
        ...formData,
        users: selectedUsers.map((user) => ({ mail_id: user.mail_id })), // Only mail_id
      };
      await axios.post("http://localhost:5000/api/projects", projectData);
      toast.success("Project created successfully!");
      // Reset form
      setFormData({
        project_name: "",
        client_name: "",
        address: "",
        department: "",
        business_unit: "",
        project_type: "",
      });
      setSelectedUsers([]);
      setStep(1);
    } catch (error) {
      toast.error("Error creating project. Please try again.");
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="project-container">
        <ToastContainer position="top-right" autoClose={3000} />
        {step === 1 && (
          <div className="project-form">
            <h2>Create Project</h2>
            <input
              type="text"
              name="project_name"
              placeholder="Project Name"
              value={formData.project_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="client_name"
              placeholder="Client Name"
              value={formData.client_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              list="departments"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <datalist id="departments">
              <option value="CSE" />
              <option value="ECE" />
              <option value="EEE" />
              <option value="MECH" />
              <option value="CIVIL" />

            </datalist>
            <input
              list="business_units"
              name="business_unit"
              placeholder="Business Unit"
              value={formData.business_unit}
              onChange={handleChange}
              required
            />
            <datalist id="business_units">
              <option value="A" />
              <option value="B" />
              <option value="C" />
              <option value="D" />
            </datalist>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              required style={{width:150, height:50}}
            >
              <option value="" disabled>
                Select Project Type
              </option>
              <option value="Development">Development</option>
              <option value="Research">Research</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Testing">Testing</option>
            </select><br/>
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="user-selection">
            <h2>Select Users for Project</h2>
            <ul>
              {filteredUsers.length === 0 ? (
                <p>No users found matching the criteria.</p>
              ) : (
                filteredUsers.map((user) => (
                  <li key={user.mail_id}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.some(
                        (selected) => selected.mail_id === user.mail_id
                      )}
                      onChange={() => handleUserSelection(user)}
                    />
                    {user.name} ({user.mail_id})
                  </li>
                ))
              )}
            </ul>
            <div className="actions">
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={handleCreateProject}>Create Project</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCreation;

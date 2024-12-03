import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeeDetail.css"; // Custom CSS for styling
import "./ProjectList.css"
import Navbar from "./Navbar";
import { AgGauge } from "ag-charts-react";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("summary"); // Tracks the active tab
  const [mail_id, setmail_id] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    department: "",
    business_unit: "",
    mail_id: "",
    phone: "",
    role: "",
  });
  const [emplyeeperformance, setemplyeeperformance] = useState(0); // Initialize performance as 0
  const [error, setError] = useState(null); // Error state




  // Fetch employee details and projects
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employees/${id}`);
        setEmployee(response.data);
        setEditForm({
          name: response.data.name,
          department: response.data.department,
          business_unit: response.data.business_unit,
          mail_id: response.data.mail_id,
          phone: response.data.phone,
          role: response.data.role,
        });
        const fetchedMailId = response.data.mail_id;
        setmail_id(fetchedMailId)

        console.log("mail id is",mail_id);
        fetchProjects(fetchedMailId);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        toast.error("Failed to fetch employee details.");
      }
    };

    const fetchProjects = async (employeeMailId) => {
        if (!employeeMailId) return; // Avoid calling API with an empty mail_id
        try {
          const response = await axios.get(
            `http://localhost:5000/employees/${employeeMailId}/projects`
          );
          setProjects(response.data);
          fetchperformance(employeeMailId);
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to fetch employee projects.");
        }
      };

    fetchEmployee();
  }, [mail_id,id]);

  const fetchperformance = async (mailId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/employeeperformance/${mailId}`
      );
      setemplyeeperformance(response.data.overallPerformance); // Set overall performance
    } catch (err) {
      setError("Failed to load performance.");
      console.error("Error fetching employee performance:", err);
    }
  };

  // Update the gauge options when emplyeeperformance changes
  useEffect(() => {
    setOptions({
      type: "radial-gauge",
      value: emplyeeperformance, // Use dynamic performance value
      scale: {
        min: 0,
        max: 100,
      },
      needle: {
        enabled: true,
      },
      bar: {
        enabled: false,
      },
    });
  }, [emplyeeperformance]);

  const [options, setOptions] = useState({
    type: "radial-gauge",
    value: 0, // Default initial value
    scale: {
      min: 0,
      max: 100,
    },
    needle: {
      enabled: true,
    },
    bar: {
      enabled: false,
    },
  });


  // Handle tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/employees/${mail_id}`, editForm);
      toast.success("Employee details updated successfully!");
      setEmployee(editForm);
    } catch (error) {
      console.error("Error updating employee details:", error);
      toast.error("Failed to update employee details.");
    }
  };

  if (!employee) {
    return <p>Loading employee details...</p>;
  }

  return (
    <div>
      <Navbar/>
      <div className="employee-detail-container">
        <ToastContainer />
        <h2 style={{paddingLeft:80, paddingTop:25}}>Employee Details</h2>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => handleTabSwitch("summary")}
          >
            Employee Summary
          </button>
          <button
            className={`tab-button ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => handleTabSwitch("edit")}
          >
            Edit Employee
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "summary" && (
            <div className="employee-summary" style={{paddingLeft:20}}>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <div className="employee">
                  <h3 >Employee Information</h3>
                  <p><strong>Name:</strong> {employee.name}</p>
                  <p><strong>Department:</strong> {employee.department}</p>
                  <p><strong>Business Unit:</strong> {employee.business_unit}</p>
                  <p><strong>Email:</strong> {employee.mail_id}</p>
                  <p><strong>Phone Number:</strong> {employee.phone}</p>
                  <p><strong>Role:</strong> {employee.role}</p>
                </div>
                <div style={{paddingRight:150}}>
                  <h4>Overall Performance: {emplyeeperformance}%</h4>
                  {/* Radial Gauge */}
                  <AgGauge options={options}/>
                </div>
              </div>



              <br/>

              <div className="projectdetail">
                <h3>Working Projects</h3>
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Client Name</th>
                      <th>Address</th>
                      <th>Project Type</th>
                      <th>Department</th>
                      <th>Business Unit</th>
                      <th>Project Status</th>

                    </tr>
                  </thead>
                  <tbody>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr key={project._id || project.mail_id || project.project_name}>
                          <td>
                            <Link to={`/projectlist/${project._id}`}>
                              {project.project_name}
                            </Link>
                          </td>
                          {/* <td>{project.project_name}</td> */}
                          <td>{project.client_name}</td>
                          <td>{project.address}</td>
                          <td>{project.project_type}</td>
                          <td>{project.department}</td>
                          <td>{project.business_unit}</td>
                          <td>{project.status}</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === "edit" && (
            <div className="edit-employee" style={{paddingLeft:65}}>
              <h3>Edit Employee Details</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Department Dropdown */}
                <div className="form-group">
                  <label>Department:</label>
                  <select
                    name="department"
                    value={editForm.department}
                    onChange={handleInputChange} 
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>

                {/* Business Unit Dropdown */}
                <div className="form-group">
                  <label>Business Unit:</label>
                  <select
                    name="business_unit"
                    value={editForm.business_unit}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Business Unit</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="mail_id"
                    value={editForm.mail_id}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{paddingBottom:25}}></div>
                <button type="submit" className="submit-button" width="200px">
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

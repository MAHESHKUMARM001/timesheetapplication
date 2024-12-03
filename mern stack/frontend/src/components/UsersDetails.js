import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserDetails.css";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Predefined options for departments and business units
  const departmentOptions = ["CSE","ECE", "MECH","CIVIL","EEE"];
  const businessUnitOptions = ["A", "B", "C", "D"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle search and filtering logic
  useEffect(() => {
    let updatedUsers = users;

    // Search by name or email
    if (searchQuery.trim()) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mail_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment) {
      updatedUsers = updatedUsers.filter(
        (user) => user.department === selectedDepartment
      );
    }

    // Filter by business unit
    if (selectedBusinessUnit) {
      updatedUsers = updatedUsers.filter(
        (user) => user.business_unit === selectedBusinessUnit
      );
    }

    setFilteredUsers(updatedUsers);
  }, [searchQuery, selectedBusinessUnit, selectedDepartment, users]);

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        selectedUser
      );
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? response.data : user
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  return (
    <div className="container">
      <h1>User Details</h1>

      {/* Search and Filter Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="filter-group">
          <label>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All</option>
            {departmentOptions.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Business Unit:</label>
          <select
            value={selectedBusinessUnit}
            onChange={(e) => setSelectedBusinessUnit(e.target.value)}
          >
            <option value="">All</option>
            {businessUnitOptions.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Business Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.mail_id}</td>
              <td>{user.phone}</td>
              <td>{user.department}</td>
              <td>{user.business_unit}</td>
              <td>
                <button onClick={() => handleView(user)}>View</button>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isViewMode ? "View User Details" : "Edit User"}</h2>
            <div className="input-group">
              <label>Name:</label>
              {isViewMode ? (
                <p>{selectedUser.name}</p>
              ) : (
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              )}
            </div>
            <div className="input-group">
              <label>Email:</label>
              {isViewMode ? (
                <p>{selectedUser.mail_id}</p>
              ) : (
                <input
                  type="email"
                  value={selectedUser.mail_id}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, mail_id: e.target.value })
                  }
                />
              )}
            </div>
            <div className="input-group">
              <label>Phone:</label>
              {isViewMode ? (
                <p>{selectedUser.phone}</p>
              ) : (
                <input
                  type="text"
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
              )}
            </div>
            <div className="input-group">
              <label>Department:</label>
              {isViewMode ? (
                <p>{selectedUser.department}</p>
              ) : (
                <input
                  list="departments"
                  value={selectedUser.department}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      department: e.target.value,
                    })
                  }
                />
              )}
              <datalist id="departments">
                {departmentOptions.map((dept, index) => (
                  <option key={index} value={dept} />
                ))}
              </datalist>
            </div>
            <div className="input-group">
              <label>Business Unit:</label>
              {isViewMode ? (
                <p>{selectedUser.business_unit}</p>
              ) : (
                <input
                  list="business-units"
                  value={selectedUser.business_unit}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      business_unit: e.target.value,
                    })
                  }
                />
              )}
              <datalist id="business-units">
                {businessUnitOptions.map((unit, index) => (
                  <option key={index} value={unit} />
                ))}
              </datalist>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              {!isViewMode && (
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./EmployeePerformanceTable.css"; // Create CSS if needed

const EmployeePerformanceTable = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [overallPerformances, setOverallPerformances] = useState([]); // State for overall employee performance data
  const [error, setError] = useState(null); // Error state

  // Fetch all employees' overall performance data
  useEffect(() => {
    const fetchAllOverallPerformance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allEmployeePerformance");
        setOverallPerformances(response.data.overallPerformanceData);
      } catch (err) {
        setError("Failed to load performance data.");
        console.error("Error fetching overall employee performance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOverallPerformance();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>All Employees' Overall Performance</h3>
      {error && <p className="error">{error}</p>}
      
      {/* Performance Table */}
      <table className="performance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Overall Performance (%)</th>
          </tr>
        </thead>
        <tbody>
          {overallPerformances.map((performance, index) => (
            <tr key={index}>
              <td>{performance.employee}</td>
              <td>{performance.overallPerformance}%</td> {/* Overall performance percentage */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePerformanceTable;

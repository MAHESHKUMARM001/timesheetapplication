import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectD = () => {
  const [summary, setSummary] = useState({
    Completed: 0,
    "In Progress": 0,
    "To Do": 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching project summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="project-summary-container">
      <h2>Project Summary</h2>
      {loading ? (
        <p>Loading project summary...</p>
      ) : (
        <div className="project-summary">
          <p>Total Projects: <strong>{summary.total}</strong></p>
          <p>Projects Completed: <strong>{summary.Completed}</strong></p>
          <p>Projects In Progress: <strong>{summary["In Progress"]}</strong></p>
          <p>Projects To Do: <strong>{summary["To Do"]}</strong></p>
        </div>
      )}
    </div>
  );
};

export default ProjectD;

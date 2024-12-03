import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { AgCharts } from "ag-charts-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import from recharts
import "./ProjectSummary.css";
import ProjectList from "./ProjectList";
import ProjectD from "./ProjectD";
// import React, { useEffect, useState } from "react";
import axios from "axios";

const Project = () => {

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

    // Task data
    const taskData = [
      { status: "Total Tasks", count: summary.total },
      { status: "Ongoing Tasks", count: summary["In Progress"] },
      { status: "Pending Tasks", count: summary["To Do"] },
      { status: "Completed Tasks", count: summary.Completed },
    ];
  
    // Line Chart Options
    const lineChartOptions = {
      title: {
        text: "Task Summary Chart",
      },
      subtitle: {
        text: "Progress Overview",
      },
      data: taskData,
      series: [
        {
          type: "line",
          xKey: "status",
          yKey: "count",
          stroke: "#4caf50",
          marker: {
            shape: "circle",
            size: 10,
            fill: "#4caf50",
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Task Status" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Number of Tasks" },
        },
      ],
      legend: { enabled: false },
    };
  
    // Pie Chart Data (same as taskData)
    const pieChartData = taskData.map((task, index) => ({
      name: task.status,
      value: task.count,
    }));
  
    // Colors for the Pie Chart
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d84a4a"];
  return (
    <div>
      <Navbar/>
      <div className="fullproject">
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="dashboard-header">
              <h1>Projects</h1>
            </header>
            <br />

                <section className="welcome-section">
                  <h2>Welcome Maheshkumar M</h2>
                  <p>
                    Here's where you'll view a summary of Project's status, priorities,
                    workload, and more.
                  </p>
                </section>

                <section className="task-section">
                  <div className="task-card done">
                    <p>Project Done</p>
                    <p>{summary.Completed}</p>
                  </div>
                  <div className="task-card create">
                    <p>Project InProgress</p>
                    <p>{summary["In Progress"]}</p>
                  </div>
                  <div className="task-card edit">
                    <p>Total Project</p>
                    <p>{summary.total}</p>
                  </div>
                  <div className="task-card pending">
                    <p>Project ToDo</p>
                    <p>{summary["To Do"]}</p>
                  </div>
                </section>

                {/* Chart Section */}
                <header className="dashboard-header">
                <h1 style={{ paddingTop: 20 }}>Status Overview</h1>
              </header>
                <section className="chart-section">
                  <div className="statuscart">
                    <div className="chart-card">
                      <h3>Line Chart: Task Progress Overview</h3>
                      <div style={{ width: "80%", margin: "0 auto", marginTop: "2rem" }}>
                        <AgCharts options={lineChartOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Pie Chart: Task Progress Overview</h3>
                    <div style={{ width: "80%", margin: "0 auto", marginTop: "2rem" }}>
                      <PieChart width={400} height={300}>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          label
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </div>
                  </div>
                </section>
        </div>
        <ProjectList/>
        {/* <ProjectD/> */}
      </div>      
    </div>
  )
}

export default Project
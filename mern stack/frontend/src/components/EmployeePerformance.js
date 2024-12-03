import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import axios from "axios";

const EmployeePerformance = () => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Fetch employee performance data
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allemployeeperformance");
        const performanceData = response.data;

        // Prepare the data for the chart
        setChartOptions({
          data: performanceData,
          series: [
            {
              type: "line",
              xKey: "employee", // Employee name
              yKey: "averagePerformance", // Average performance
              yName: "Performance",
              stroke: "#27AE60", // Line color
              marker: {
                fill: "#27AE60",
                stroke: "#fff",
                size: 8,
              },
            },
          ],
          axes: [
            { type: "category", position: "bottom" },
            {
              type: "number",
              position: "left",
              title: { text: "Performance (%)" },
            },
          ],
          title: {
            text: "Employee Performance Over Time",
          },
          legend: {
            position: "top",
          },
        });
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, []);

  return (
    <div className="performance-chart">
      <h2>Employee Performance Line Chart</h2>
      <AgCharts options={chartOptions} />
    </div>
  );
};

export default EmployeePerformance;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgCharts } from "ag-charts-react"; // AG Charts

const OneEmployeePerformance = ({ mailId }) => {
  const [performanceData, setPerformanceData] = useState("");
  const [chartOptions, setChartOptions] = useState({});

  // Fetch employee performance data when the component mounts
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employeeperformance/${mailId}`);
        const data = response.data.overallPerformance;
        setPerformanceData(data);

        // Configure the chart options
        // setChartOptions({
        //   data: chartData,
        //   series: [
        //     {
        //       type: "line",
        //       xKey: "task", // Task name
        //       yKey: "performance", // Performance value
        //       yName: "Performance",
        //       stroke: "#27AE60", // Line color
        //       marker: {
        //         fill: "#27AE60",
        //         stroke: "#fff",
        //         size: 8,
        //       },
        //     },
        //   ],
        //   axes: [
        //     { type: "category", position: "bottom" }, // X-axis
        //     {
        //       type: "number",
        //       position: "left", // Y-axis
        //       title: { text: "Performance (%)" },
        //     },
        //   ],
        //   title: {
        //     text: `Employee Performance for ${mailId}`,
        //   },
        //   legend: {
        //     position: "top",
        //   },
        // });
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, [mailId]);

  return (
    <div className="performance-chart">
      <h2>Employee Performance</h2>
      {performanceData}
    </div>
  );
};

export default OneEmployeePerformance;

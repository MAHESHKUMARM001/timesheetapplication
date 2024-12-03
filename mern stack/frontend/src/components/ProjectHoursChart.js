import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./ProjectHourChart.css"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Title);

const ProjectHoursChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchProjectHours = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projectlistall");

        // Transform data for the chart
        const labels = response.data.map((project) => project.project_name);
        const plannedHours = response.data.map((project) => project.planned_hour);
        const actualHours = response.data.map((project) => project.actual_hour);

        setData({
          labels,
          datasets: [
            {
              label: "Planned Hours",
              data: plannedHours,
              fill: true,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
            {
              label: "Actual Hours",
              data: actualHours,
              fill: false,
              backgroundColor: "rgba(116, 39, 116, 0.2)",
              borderColor: "#742774",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching project hours:", error);
      }
    };

    fetchProjectHours();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Project Hours Comparison</h2>
      <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} style={{width: 1200}}/>
    </div>
  );
};

export default ProjectHoursChart;

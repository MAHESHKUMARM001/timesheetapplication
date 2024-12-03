import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { AgCharts } from "ag-charts-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import from recharts
import "./ProjectSummary.css";
import ProjectDetail from "./ProjectDetails";
import ProjectEdit from "./ProjectEdit";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateTask from "./CreateTask";
import AdminTaskList from "./AdminTaskList";
import ProjectState from "./ProjectState";

const ProjectSummary = () => {
  const [activeTab, setActiveTab] = useState("Summary"); // Default tab is "Summary"
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [taskactiveTab, settaskActiveTab] = useState("tab1");

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalPlannedHours: 0,
    totalActualHours: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projecttasksdataall/${id}`);
        const projectTasks = response.data;

        // Calculate stats
        const totalPlannedHours = projectTasks.reduce(
          (sum, task) => sum + (task.planned_hours || 0),
          0
        );
        const totalActualHours = projectTasks.reduce(
          (sum, task) => sum + (task.actual_hours || 0),
          0
        );


        const totalTasks = projectTasks.length;
        const todoTasks = projectTasks.filter((task) => task.status === "To Do").length;
        const inProgressTasks = projectTasks.filter((task) => task.status === "In Progress").length;
        const completedTasks = projectTasks.filter((task) => task.status === "Completed").length;

        const projectupdate = await axios.put(`http://localhost:5000/projecthourupdate/${id}?plannedhour=${totalPlannedHours}&actualhour=${totalActualHours}`);
        const updatedproject = projectupdate.data;
        // Update state with calculated stats
        setStats({
          totalPlannedHours,
          totalActualHours,
          totalTasks,
          todoTasks,
          inProgressTasks,
          completedTasks,
        });

        setTasks(projectTasks);



        // `http://localhost:5000/api/projectusers?department=${department}&business_unit=${business_unit}`


      } catch (error) {
        console.error("Error fetching project tasks:", error);
        // toast.error("Failed to fetch project tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [id]);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projectlistall/${id}`);
        setProject(response.data);

        // // Fetch user details based on mail_id
        // const users = response.data.users;
        // const userDetailPromises = users.map((user) =>
        //   axios.get(`http://localhost:5000/users/${user.mail_id}`)
        // );
        // const userDetailsResponses = await Promise.all(userDetailPromises);
        // setUserDetails(userDetailsResponses.map((res) => res.data));
      } catch (error) {
        console.error("Error fetching project or user details:", error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <p>Loading project details...</p>;
  }
  // Task data
  const taskData = [
    { status: "Total Tasks", count: stats.totalTasks },
    { status: "Ongoing Tasks", count: stats.inProgressTasks },
    { status: "Pending Tasks", count: stats.todoTasks },
    { status: "Completed Tasks", count: stats.completedTasks },
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

  const tabs = ["Summary", "Task", "Edit"];

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Switch active tab
  };

  return (
    <div>
      <Navbar />
      <div className="fullproject">
        <div className="dashboard-container">
          {/* Header Section */}
          <header className="dashboard-header">
            <h1>{project.project_name}</h1>
          </header>
          <br />

          {/* Tab Navigation */}
          <nav className="dashboard-tabs">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </span>
            ))}
          </nav>

          {/* Conditional Tab Content */}
          {activeTab === "Summary" && (
            <>
              {/* Welcome Section */}
              <section className="welcome-section">
                <h2>Welcome Maheshkumar M</h2>
                <p>
                  Here's where you'll view a summary of pro001's status, priorities,
                  workload, and more.
                </p>
              </section>

              {/* Task Cards */}
              <section className="task-section">
                <div className="task-card done">
                  <p>Task Done</p>
                  <p>{stats.completedTasks}</p>
                </div>
                <div className="task-card create">
                  <p>Task InProgress</p>
                  <p>{stats.inProgressTasks}</p>
                </div>
                <div className="task-card edit">
                  <p>Total Tasks</p>
                  <p>{stats.totalTasks}</p>
                </div>
                <div className="task-card pending">
                  <p>Task ToDo</p>
                  <p>{stats.todoTasks}</p>
                </div>
              </section>


              <header className="dashboard-header">
                  <h1 style={{ paddingTop: 20 }}>Project Overview</h1>
                </header>
              <section>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                  <div>
                    {/* <h3>Project Overview</h3> */}
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Project Name</p>{project.project_name}
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Client Name</p>{project.client_name}
                    </div>
                    
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Department</p>{project.department}
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Business Unit</p>{project.business_unit}
                    </div>
                    {/* <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, }}>Client Name</p>{project.client_name}
                    <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20}}>Project Type</p>{project.project_type}
                    <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20}}>Planned Hours</p>{stats.totalPlannedHours}
                    <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20}}>Actual Hours</p>{stats.totalActualHours}
                    <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20}}>Department</p>{project.department}
                    <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20}}>Business Unit</p>{project.business_unit} */}
                  </div>
                  <div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Project Type</p>{project.project_type}
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Planned Hours</p>{stats.totalPlannedHours}
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Actual Hours</p>{stats.totalActualHours}
                    </div>
                    <div style={{display:"flex", alignItems:"center"}}>
                      <p style={{backgroundColor:"rgb(222, 222, 222)",fontWeight:"bold", width:200, height:20, marginRight:20}}>Project Status</p>{project.status}
                    </div>
                  </div>
                </div>
                </section>
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
              <header className="dashboard-header">
                <h1 style={{ paddingTop: 35, paddingBottom: 25 }}>Project Employees</h1>
              </header>
              <ProjectDetail />
              {/* <ProjectState /> */}
            </>
          )}

          {activeTab === "Task" && (
            <section className="task-tab">
              <h2>Task Details</h2>
              <p>This section will display task-related details.</p>
              {/* <CreateTask/> */}
              {/* <AdminTaskList/> */}
              <div className="tab-buttons">
                <button
                  className={`tab-button ${taskactiveTab === "tab1" ? "active" : ""}`}
                  onClick={() => settaskActiveTab("tab1")}
                >
                  Task List
                </button>
                <button
                  className={`tab-button ${taskactiveTab === "tab2" ? "active" : ""}`}
                  onClick={() => settaskActiveTab("tab2")}
                >
                  Create Task
                </button>
              </div>
              <div className="tab-content">
                {taskactiveTab === "tab1" && <AdminTaskList />}
                {taskactiveTab === "tab2" && <CreateTask />}
              </div>
              {/* You can add task-specific content or components here */}
            </section>
          )}

          {activeTab === "Edit" && (
            <section className="edit-tab">
              <h2>Edit Project</h2>
              <ProjectEdit/>
              <header className="dashboard-header">
                <h1 style={{ paddingTop: 35, paddingBottom: 25 }}>Project Employees</h1>
              </header>
              <ProjectDetail />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;

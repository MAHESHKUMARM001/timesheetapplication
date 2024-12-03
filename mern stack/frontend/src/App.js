import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/Login";

import Verify from "./components/Verify";
import Invitation from "./components/Invitaion";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import ProjectCreation from "./components/ProjectCreation";
import ProjectDetails from "./components/ProjectDetails";
import Navbar from "./components/Navbar";
import Project from "./components/Project";
import Home001 from "./components/home001";
import ProjectSummary from "./components/ProjectSummary";
import AddProjectEmployee from "./components/AddProjectEmployee";
import EmployeeList from "./components/EmployeeList";
import Employee from "./components/Employee";
import EmployeeDetail from "./components/EmployeeDetail";
import CreateTask from "./components/CreateTask";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";
import AddTimeLog from "./components/AddTimeLog";
import TimeLogCalendar from "./components/TimeLogCalendar";
import UserTimeLog from "./components/UserTimeLog";
import ReactGA from 'react-ga4';
import TrackPageView from "./components/TrackPageView";
import LandingPage from "./components/LandingPage";

function App() {
    // const [currentUser, setCurrentUser] = useState(null); // Store logged-in user details
    useEffect(() => {
        // Initialize Google Analytics
        ReactGA.initialize('G-09WR4ND6TB'); // Replace with your Measurement ID
        ReactGA.send('pageview'); // Track initial page load
      }, []);

      

    return (
        <Router>
            {/* <Navbar/> */}
            <TrackPageView />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/invitation" element={<Invitation />} />
                <Route path="/login" element={<Login/>} />
                {/* <Route path="/verify/:token" element={<Verify />} /> */}
                <Route path="/home" element= {<Home />} />
                <Route path="/admin" element= {<Dashboard />} />
                <Route path="/projectcreate" element= {<ProjectCreation />} />
                {/* <Route path="/projectlist" element={<ProjectList />} /> */}
                {/* <Route path="/projectlist/:id" element={<ProjectDetails />} /> */}
                <Route path="/projectlist/:id" element={<ProjectSummary />} />
                <Route path="/home001" element={<Home001 />} />
                <Route path="/projectlist/:id/addemployee" element={<AddProjectEmployee />} />
                
                <Route path="/project" element={<Project />} />
                <Route path="/projectSummary" element={<ProjectSummary />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/employeelist/:id" element={<EmployeeDetail />} />
                <Route path="/createtask" element={<CreateTask />} />
                <Route path="/tasklist/:id" element={<TaskList />} />
                <Route path="/taskdetail/:id" element={<TaskDetail />} />
                <Route path="/addtimelog/:id" element={<AddTimeLog />} />
                <Route path="/timelog" element={<UserTimeLog />} />
                
            </Routes>
        </Router>
        // <TimeLogCalendar/>
        
        //  <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>
    );
}

export default App;

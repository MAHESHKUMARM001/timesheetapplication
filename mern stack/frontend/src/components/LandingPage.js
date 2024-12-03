import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Custom CSS for styling the landing page

const LandingPage = () => {
  const navigate = useNavigate();

  // Function to navigate to login or signup page
  const handleGetStarted = () => {
    navigate("/login"); // Redirect to login page or another route like "/signup"
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to TimeSheet Pro</h1>
          <p className="hero-description">
            Effortlessly track your time, manage projects, and boost productivity with our easy-to-use timesheet application.
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Task Tracking</h3>
            <p>Monitor task progress and deadlines effectively.</p>
          </div>
          <div className="feature-item">
            <h3>Project Management</h3>
            <p>Organize projects with clear timelines and deliverables.</p>
          </div>
          <div className="feature-item">
            <h3>Employee Performance</h3>
            <p>Track individual employee performance and generate reports.</p>
          </div>
          <div className="feature-item">
            <h3>Timesheet Logs</h3>
            <p>Submit and approve timesheets for better time management.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

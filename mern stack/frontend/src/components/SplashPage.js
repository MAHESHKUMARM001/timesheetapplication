// SplashPage.js
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player'; // Import Lottie Player
import './SplashPage.css';
// import myimage from "./Animation.lottie";

const SplashPage = ({ onGetStarted }) => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <h1 className="splash-title">Welcome to Timesheet Pro</h1>
        <p className="splash-subtitle">Effortlessly track your time and boost productivity.</p>
        <div className="splash-animation">
          <Player
            autoplay
            loop
            src="/aniimage.js" // Replace with your .lottie file path
            style={{ height: '300px', width: '300px' }}
          />
        </div>
      </div>
      <button className="get-started-button" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default SplashPage;

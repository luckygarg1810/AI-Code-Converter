import React from "react";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Fetching code, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

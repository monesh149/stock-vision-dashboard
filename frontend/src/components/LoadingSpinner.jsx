import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p className="loading-text">{message}</p>
  </div>
);

export default LoadingSpinner;

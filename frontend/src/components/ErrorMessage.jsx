import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => (
  <div className="error-container">
    <AlertCircle />
    <h3>Error</h3>
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry}>Try Again</button>
    )}
  </div>
);

export default ErrorMessage;

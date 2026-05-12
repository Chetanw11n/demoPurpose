import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="access-denied-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={handleGoBack}>Go to Home</button>
    </div>
  );
};

export default AccessDenied;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShieldAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserSelection.css';

function UserSelection() {
  const navigate = useNavigate();

  const handleCitizenClick = () => {
    navigate('/citizen-signup');
  };

  const handleUserClick = () => {
    navigate('/signup');
  };

  return (
    <div className="user-selection-container">
      <div className="selection-card">
        <h1 className="selection-title">Welcome to CTS TranspoGov</h1>
        <p className="selection-subtitle">Who are you?</p>

        <div className="selection-options">
          {/* Citizen Option */}
          <div className="option-card citizen-card" onClick={handleCitizenClick}>
            <div className="option-icon citizen-icon">
              <FaUser />
            </div>
            <h3 className="option-title">Citizen</h3>
            <p className="option-description">
              I am a citizen looking to use transport services
            </p>
            <button className="option-button btn btn-outline-primary">
              Continue as Citizen
            </button>
          </div>

          {/* User/Staff Option */}
          <div className="option-card user-card" onClick={handleUserClick}>
            <div className="option-icon user-icon">
              <FaShieldAlt />
            </div>
            <h3 className="option-title">Staff/Admin</h3>
            <p className="option-description">
              I am a staff member or administrator
            </p>
            <button className="option-button btn btn-outline-primary">
              Continue as Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSelection;

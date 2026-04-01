import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TopBar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };


  return (
    <nav className="top-bar">
      <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Menu">
        ☰
      </button>
      <div className="top-bar-title">
        WorkBridge Dashboard
      </div>
      <div className="top-bar-right">
        <div className="profile-info" onClick={handleProfileClick}>
          {user?.name || 'Worker'}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopBar;


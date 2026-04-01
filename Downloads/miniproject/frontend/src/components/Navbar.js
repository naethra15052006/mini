import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';


const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
☰
        </button>
        <div className="navbar-brand">
          WorkBridge
        </div>
      </div>
      <div className="navbar-right">
        <div className="profile-avatar" onClick={handleProfileClick} title="Profile">
👤
          <span>{user.name.split(' ')[0]}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
🚪
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


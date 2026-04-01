import React, { useContext } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div className="loading-container"><p>Loading profile...</p></div>;

  return (
<div className="page-container profile-page">
      <button className="back-btn" onClick={() => navigate('/employer-dashboard')}>
        ← Back to Dashboard
      </button>
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="name-heading">{user.name}</h1>
          <span className="role-badge role-{user.role?.toLowerCase()}">{user.role || 'User'}</span>

          </div>
        </div>
        <div className="profile-grid">
          <div className="profile-item">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user.name}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Age</span>
            <span className="profile-value">{user.age || 'Not set'}</span>
          </div>
          <div className="profile-item skills-container">
            <span className="profile-label">Skills</span>
            <div className="skills-badges">
              {user.skills ? user.skills.split(',').map((skill, index) => (
                <span key={index} className="skill-badge">{skill.trim()}</span>
              )) : <span className="info-value">Not set</span>}
            </div>
          </div>
          <div className="profile-item">
            <span className="profile-label">Location</span>
            <span className="profile-value">
              {user.latitude && user.longitude 
                ? `${user.latitude.toFixed(2)}, ${user.longitude.toFixed(2)}`
                : 'Not set'}
            </span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Experience</span>
            <span className="profile-value">{user.experience || 'Not set'}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Phone</span>
            <span className="profile-value">{user.phoneNumber || 'Not set'}</span>
          </div>
          {user.role === 'EMPLOYER' && (
            <>
              <div className="profile-item">
                <span className="profile-label">Company Name</span>
                <span className="profile-value">{user.companyName || 'Not set'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Company Phone</span>
                <span className="profile-value">{user.companyPhone || 'Not set'}</span>
              </div>
            </>
          )}
          <div className="profile-item full-width">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;

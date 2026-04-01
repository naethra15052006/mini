import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { applicationAPI } from '../services/applicationAPI';
import './Dashboard.css';

const ProgressPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await applicationAPI.getMyApplications();
        console.log('Progress apps:', res.data);
        setApplications(res.data || []);
      } catch (err) {
        console.error('Error loading applications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadApplications();
  }, [user]);

  const currentProgress = applications.filter(app => app.status === 'APPLIED' || app.status === 'SHORTLISTED');
  const completed = applications.filter(app => app.status === 'COMPLETED');

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>📊 Progress Check</h1>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Current Progress */}
      <div className="dashboard-section">
        <h3>Current Jobs Applied</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : currentProgress.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">⏳</span>
            <p>No current applications</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {currentProgress.map(app => (
              <div key={app.id} className="job-card progress-card">
                <h4>{app.job?.title || app.jobTitle || 'Job'}</h4>
                <div className="progress-status">
                  <span className="status-icon spin">⏳</span>
                  <span>{app.status || 'Applied'}</span>
                </div>
                <p>Applied: {app.appliedDate || app.createdAt ? new Date(app.appliedDate || app.createdAt).toLocaleDateString() : 'Recent'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Work */}
      <div className="dashboard-section">
        <h3>Completed Work</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : completed.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon success">✅</span>
            <p>No completed jobs yet</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {completed.map(app => (
              <div key={app.id} className="job-card completed-card">
                <h4>{app.job?.title || app.jobTitle || 'Job'}</h4>
                <div className="progress-status">
                  <span className="status-icon success">✅</span>
                  <span>Completed</span>
                </div>
                <p>Applied: {app.appliedDate || app.createdAt ? new Date(app.appliedDate || app.createdAt).toLocaleDateString() : 'Recent'}</p>
                {app.rating && <p>Rating: {app.rating} ⭐</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

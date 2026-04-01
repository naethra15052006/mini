import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { jobAPI } from '../services/api';

import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [employerApps, setEmployerApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const refreshDashboard = useCallback(() => {
    loadMyJobs();
  }, []);

  useEffect(() => {
    if (searchParams.get('refresh')) {
      refreshDashboard();
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('refresh');
      setSearchParams(newParams);
    } else {
      loadMyJobs();
    }
  }, [refreshDashboard, searchParams]);

  const loadMyJobs = async () => {
    try {
      const jobsRes = await jobAPI.getMyJobs();
      const appsRes = await api.get('/applications/my-applications-employer');
      setEmployerApps(appsRes.data);
      
      const jobsWithCounts = jobsRes.data.map(job => ({
        ...job,
        applicantCount: appsRes.data.filter(app => app.job.id === job.id).length
      }));
      setMyJobs(jobsWithCounts);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="employer-dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="welcome-card employer-welcome">
        <div className="welcome-left">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Manage your job postings and applications</p>
        </div>
        <div className="profile-icon" onClick={handleProfileClick} title="Profile">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      {/* POST JOB BUTTON */}
      <div className="employer-actions">
        <button 
          className="apply-btn post-job-btn" 
          onClick={() => navigate('/post-job')}
        >
          ➕ Post New Job
        </button>
      </div>

      {/* POSTED JOBS */}
      <div className="dashboard-section">
        <h3>My Job Posts ({myJobs.length})</h3>
        {myJobs.length === 0 ? (
          <div className="empty-state employer-empty">
            <div className="empty-icon">📋</div>
            <p>No jobs posted yet</p>
            <button className="apply-btn" onClick={() => navigate('/post-job')}>
              Post your first job
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {myJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h4>{job.title}</h4>
                  <span className={`status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                  {job.applicantCount > 0 && (
                    <span className="applicant-badge">
                      {job.applicantCount} applicant{job.applicantCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="job-card-details">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Experience:</strong> {job.experienceRequired || 'Not specified'}</p>
                  <p><strong>Status:</strong> {job.status}</p>
                  <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="job-actions">
                  <button className="apply-btn" onClick={() => navigate(`/employer-jobs/${job.id}`)}>
                    View Details & Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;


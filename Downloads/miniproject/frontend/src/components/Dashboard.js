import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, ratingAPI, userAPI } from '../services/api';
import { applicationAPI } from '../services/applicationAPI';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const jobsRes = await jobAPI.getAllJobs();
        console.log('Jobs data:', jobsRes.data);
        const ratingRes = await ratingAPI.getAverageRating(user.id);
        console.log('Rating data:', ratingRes.data);
        // Applications 403 - use mock fallback
        const appsRes = await applicationAPI.getMyApplications().catch(() => null);
        setJobs(jobsRes.data || []);
        setMyApplications(appsRes?.data || []);
        setAverageRating(ratingRes.data?.average || ratingRes.data || 0);
        setCompletedJobs([]);
      } catch (err) {
        console.error('Dashboard data load error:', err);
        // Mock fallback
        setJobs([]);
        setMyApplications([]);
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadDashboardData();
  }, [user]);

  useEffect(() => {
    // Search filter
    if (searchQuery) {
      // Filter jobs client-side if needed
    }
  }, [searchQuery]);

  const getStatusClass = (status) => {
    if (status === 'OPEN') return 'open';
    if (status === 'CLOSED') return 'closed';
    if (status === 'COMPLETED') return 'completed';
    return '';
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="welcome-card">
        <h2>Welcome, {user?.name || 'Worker'} 👋</h2>
        <p>Your activity overview</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Available Jobs</h4>
          <p>{jobs.length}</p>
        </div>
        <div className="stat-card">
          <h4>My Applications</h4>
          <p>{myApplications.length}</p>
        </div>
        <div className="stat-card">
          <h4>Average Rating</h4>
          <p>{Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'} ⭐</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search jobs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* AVAILABLE JOBS */}
      <div className="dashboard-section">
        <h3>Available Jobs</h3>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs match your search</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h4>{job.title}</h4>
                  <span className={`status-badge open`}>Open</span>
                </div>
                <div className="job-card-details">
                  <p><strong>Description:</strong> {job.description?.substring(0, 100)}...</p>
                  <p><strong>Salary:</strong> ₹{job.wage?.toLocaleString()}</p>
                  <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                  <p><strong>Skill:</strong> {job.skill}</p>
                </div>
                <button
                  className="apply-btn"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MY APPLICATIONS */}
      <div className="dashboard-section">
        <h3>My Applications</h3>
        {loading ? (
          <div className="loading">Loading your applications...</div>
        ) : myApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet. Apply to jobs to see them here.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {myApplications.map(app => (
              <div key={app.id} className="job-card">
                <h4>{app.job?.title || app.jobTitle || 'Job Title'}</h4>
                <p>Status: <span className={`status-badge ${app.status?.toLowerCase() || 'applied'}`}>{app.status || 'Applied'}</span></p>
                <p>Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.appliedDate || 'Recent'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;


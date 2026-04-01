import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { adminAPI, userAPI, jobAPI } from '../services/api';
import { applicationAPI } from '../services/applicationAPI';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalEmployers: 0,
    totalJobs: 0
  });

  const [activeTab, setActiveTab] = useState('stats');
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, recentUsersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentUsers()
      ]);
      setStats(statsRes.data);
      setWorkers(statsRes.data.totalWorkers); // placeholder
      setEmployers(statsRes.data.totalEmployers);
      setJobs(statsRes.data.totalJobs);
      setRecentUsers(recentUsersRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      loadData();
    } catch (error) {
      alert('Error blocking user');
    }
  };

  const handleAccept = async (appId) => {
    try {
      await applicationAPI.acceptApplication(appId);
      loadData();
    } catch (error) {
      alert('Error accepting application');
    }
  };

  const handleReject = async (appId) => {
    try {
      await applicationAPI.rejectApplication(appId);
      loadData();
    } catch (error) {
      alert('Error rejecting application');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="top-header-card">
        <h1 className="top-header-title">
          Welcome, {user?.name || "Admin"}!
        </h1>
      </div>

      {/* WELCOME CARD */}
<div className="welcome-card">
        <h2 className="welcome-title">
          Welcome, {user?.name || "Admin"}!
        </h2>
        <div className="admin-nav">
          <Link to="/admin/workers" className="nav-link">Workers</Link>
          <Link to="/admin/employers" className="nav-link">Employers</Link>
          <Link to="/admin/jobs" className="nav-link">Jobs</Link>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="dashboard-section">
        <h3 className="section-title">Statistics</h3>

        <div className="stats-grid">

          <div className="stat-card">
            <h4 className="stat-title">Total Workers</h4>
            <span className="status-badge">ACTIVE</span>
            <p className="stat-number">{stats.totalWorkers}</p>
          </div>

          <div className="stat-card">
            <h4 className="stat-title">Total Employers</h4>
            <span className="status-badge">ACTIVE</span>
            <p className="stat-number">{stats.totalEmployers}</p>
          </div>

          <div className="stat-card">
            <h4 className="stat-title">Total Jobs</h4>
            <span className="status-badge">ACTIVE</span>
            <p className="stat-number">{stats.totalJobs}</p>
          </div>

        </div>
      </div>



      {/* APPLICATIONS TAB */}
      {user.role === 'EMPLOYER' && (
        <div className="dashboard-section">
          <h3 className="section-title">My Job Applications ({applications.length})</h3>
          <div className="jobs-grid">
            {applications.map(app => (
              <div key={app.id} className="job-card application-card">
                <div className="app-header">
                  <h4>{app.job.title}</h4>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>
                <p><strong>Worker:</strong> {app.worker.name}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Phone:</strong> {app.phoneNumber || 'N/A'}</p>
                <p><strong>Skills:</strong> {app.skills}</p>
                <div className="app-actions">
                  {app.status === 'APPLIED' && (
                    <>
                      <button className="apply-btn accept-btn" onClick={() => handleAccept(app.id)}>
                        ✅ Accept
                      </button>
                      <button className="cancel-btn reject-btn" onClick={() => handleReject(app.id)}>
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

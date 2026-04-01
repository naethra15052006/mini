import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { applicationAPI } from '../services/applicationAPI';
import './EmployerJobDetails.css';

const EmployerJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobRes = await jobAPI.getJobById(id);
      const appsRes = await applicationAPI.getEmployerApplications();
      setJob(jobRes.data);
      setApplicants(appsRes.data.filter(app => app.job.id == id));
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    if (!window.confirm(`Update status to ${status}?`)) return;
    try {
      setUpdatingStatus(prev => ({...prev, [appId]: true}));
      await applicationAPI.updateStatus(appId, status);
      loadJobDetails(); // Reload
      alert('Status updated!');
    } catch (error) {
      alert('Error updating status');
    } finally {
      setUpdatingStatus(prev => ({...prev, [appId]: false}));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  const postedDate = job.createdDate ? new Date(job.createdDate).toLocaleDateString('en-GB') : 'Recent';

  return (
    <div className="job-details-container">
      <div className="job-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>{job.title}</h1>
        <div className="job-meta">
          <span>Status: <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span></span>
          <span>Posted: {postedDate}</span>
        </div>
      </div>

      <div className="job-info-grid">
        <div className="job-section">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>
        <div className="job-section">
          <h3>Details</h3>
          <p><strong>Skill:</strong> {job.skill}</p>
          <p><strong>Wage:</strong> ${job.wage}</p>
          <p><strong>Location:</strong> {job.location}</p>
        </div>
      </div>

      <div className="applicants-section">
        <h2>Applicants ({applicants.length})</h2>
        {applicants.length === 0 ? (
          <p className="no-applicants">No applicants yet.</p>
        ) : (
          <div className="applicants-list">
            {applicants.map(app => (
              <div key={app.id} className={`applicant-card ${app.status.toLowerCase()}`}>
                <div className="applicant-info">
                  <h4>{app.name}</h4>
                  <p>Email: {app.email}</p>
                  <p>Phone: {app.phoneNumber || 'N/A'}</p>
                  <p>Skills: {app.skills}</p>
                  <p>Experience: {app.experience}</p>
                  <p>Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                </div>
                <div className="applicant-status">
                  <select 
                    className={`status-dropdown ${app.status.toLowerCase()}`}
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    disabled={updatingStatus[app.id]}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  {updatingStatus[app.id] && <span>Updating...</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerJobDetails;


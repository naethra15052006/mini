import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobAPI } from '../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      const response = await jobAPI.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'OPEN') return 'open';
    if (status === 'CLOSED') return 'closed';
    if (status === 'COMPLETED') return 'completed';
    return '';
  };

  if (loading) {
    return (
      <div className="job-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-container">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p className="empty-state-text">{error || 'Job not found'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwner = job.employer && job.employer.id === user?.id;

  return (
    <div className="job-detail-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Jobs
      </button>
      
      <div className="job-detail-card">
        <div className="job-detail-header">
          <h1 className="job-detail-title">{job.title}</h1>
          <span className={`status-badge ${getStatusClass(job.status)}`}>
            {job.status}
          </span>
        </div>
        
        <div className="job-detail-content">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Wage</span>
              <span className="detail-value highlight">${job.wage}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Skill Required</span>
              <span className="detail-value">{job.skill || 'Not specified'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">
                {job.latitude?.toFixed(4)}, {job.longitude?.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          {job.employer && (
            <div className="detail-section">
              <h3>About the Employer</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{job.employer.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{job.employer.email}</span>
                </div>
                {job.employer.rating && (
                  <div className="detail-item">
                    <span className="detail-label">Rating</span>
                    <span className="detail-value">
                      {job.employer.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="payment-card">
              <h3>Payment Details</h3>
              <div className="payment-row">
                <span className="payment-label">Base Wage</span>
                <span className="payment-value">${job.wage}</span>
              </div>

              <div className="payment-row">
                <span className="payment-label">Payment Method</span>
                <span className="payment-value">Direct Bank Transfer</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Payment Terms</span>
                <span className="payment-value">
                  {job.status === 'COMPLETED'
                    ? 'Payment completed'
                    : 'Payment on job completion'}
                </span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Total Payment</span>
                <span className="payment-value total">${job.wage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="job-detail-actions form-buttons">
          <button 
            className="apply-btn cancel-btn" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button 
            className="apply-btn proceed-btn" 
            onClick={() => navigate(`/apply/${id}`)}
          >
            Proceed to Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
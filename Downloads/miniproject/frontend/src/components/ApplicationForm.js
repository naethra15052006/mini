import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/applicationAPI';
import './Dashboard.css';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    skills: '',
    experience: 'first-time'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationAPI.applyToJob(id, formData);
      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      <button className="back-btn" onClick={() => navigate(`/jobs/${id}`)}>
        ← Back
      </button>
      
      <div className="dashboard-section">
        <h1>Application Form</h1>
        <p>Job ID: {id}</p>
        
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Skills (comma separated) *</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, CSS"
              required
            />
          </div>

          <div className="form-group">
            <label>Experience</label>
            <select name="experience" value={formData.experience} onChange={handleChange}>
              <option value="first-time">First time</option>
              <option value="experienced">Already experienced</option>
            </select>
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              className="apply-btn cancel-btn" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="apply-btn proceed-btn" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Proceed & Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;


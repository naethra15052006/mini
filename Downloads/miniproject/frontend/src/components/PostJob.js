import React, { useState, useContext, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    location: '',
    salary: '',
    latitude: user?.latitude || 12.9716,
    longitude: user?.longitude || 77.5946,
    maxApplicants: 1
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.latitude && user?.longitude) {
      setFormData(prev => ({
        ...prev,
        latitude: user.latitude,
        longitude: user.longitude
      }));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        () => {
          // GPS failed, keep default location
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/employer-dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobAPI.postJob({
        ...formData,
        skill: formData.skillsRequired,
        wage: formData.salary ? parseFloat(formData.salary) : null,
        maxApplicants: parseInt(formData.maxApplicants)
      });

      setShowSuccessModal(true);
    } catch (error) {
      alert('Error posting job: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
{showSuccessModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',padding:'2rem',borderRadius:'12px',textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.3)'}}>
            <div style={{fontSize:'4rem',marginBottom:'1rem'}}>✅</div>
            <h3 style={{margin:'0 0 1rem 0',color:'#28a745'}}>Job Submitted Successfully!</h3>
            <p style={{margin:0,color:'#666'}}>Redirecting to dashboard...</p>
          </div>
        </div>
      )}
      <div className="post-job-container post-job-card card">
        <h2>Post a New Job</h2>
        <form className="post-job-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g., Need a Plumber for Home Repair"
              required 
            />
          </div>
          <div className="form-group">
            <label>Job Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Describe the job details, requirements, and any specific instructions..."
              required 
            />
          </div>
          <div className="form-group">
            <label>Required Skills</label>
            <input 
              type="text" 
              name="skillsRequired" 
              value={formData.skillsRequired} 
              onChange={handleChange} 
              placeholder="Comma-separated e.g., React, Node.js, AWS"
            />
          </div>
          <div className="form-group">
            <label>Location / Address *</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="City or full address"
              required
            />
            <label>Salary (optional)</label>
            <input 
              type="number" 
              name="salary" 
              value={formData.salary} 
              onChange={handleChange} 
              placeholder="Enter salary range"
            />
          </div>
          <div className="form-group">
            <label>Max Applicants</label>
            <input 
              type="number" 
              name="maxApplicants" 
              value={formData.maxApplicants} 
              onChange={handleChange} 
              placeholder="Maximum number of workers needed"
              required 
            />
          </div>
          <button type="submit" className="post-job-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;


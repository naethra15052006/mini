import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'WORKER',
    skills: '',
    availability: 'FULL_TIME',
    latitude: 0,
    longitude: 0,
    age: '',
    experience: '',
    phoneNumber: ''
  });

  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (err) => console.error('GPS error:', err)
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(formData);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        {/* HEADER */}
        <h2 className="register-title">WorkBridge</h2>
        <p className="register-subtitle">
          Create your account to get started
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          {/* ROLE */}
          <div className="form-group">
            <label>I want to</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="WORKER">Find Work</option>
              <option value="EMPLOYER">Hire Workers</option>
            </select>
          </div>

          {/* WORKER ONLY FIELDS */}
          {formData.role === 'WORKER' && (
            <>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="18"
                  max="70"
                />
              </div>

              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Carpenter, Electrician"
                />
              </div>

              <div className="form-group">
                <label>Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe your experience..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="WEEKEND">Weekend Only</option>
                </select>
              </div>
            </>
          )}

          {/* LOCATION */}
          <div className="location-info">
            📍 Location: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </div>

          {/* ERROR */}
          {error && <div className="error-message">{error}</div>}

          {/* BUTTON */}
          <button type="submit" className="submit-btn">
            Create Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>

      </div>
    </div>
  );
};

export default Register;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (storedUser.role === 'EMPLOYER') {
        navigate('/employer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };




  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">WorkBridge</h1>
        <p className="login-subtitle">Welcome back! Please login to continue.</p>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );

};

export default Login;


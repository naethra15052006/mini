import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    jobAPI.getAllJobs()
      .then(res => {
        console.log('Jobs:', res.data);
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No jobs available');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <h1>Worker Dashboard</h1>
        <p>Available Jobs: {jobs.length}</p>
      </div>
      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>₹{job.wage}</p>
            <p>{job.skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;


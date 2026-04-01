import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './AdminManagement.css';

const JobsManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs/admin/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/admin/jobs/${id}`);
      loadJobs();
    } catch (error) {
      window.alert('Error deleting job');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Set job status to ${status.toUpperCase()}?`)) return;
    try {
      await api.put(`/jobs/admin/jobs/${id}/status/${status}`);
      loadJobs();
    } catch (error) {
      window.alert('Error updating job status');
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.employer?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || j.status === statusFilter)
  );

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="admin-management">
      <button className="back-btn" onClick={() => navigate('/admin')}>
        ← Back to Dashboard
      </button>
      <div className="table-header">
        <h2>Jobs Management ({jobs.length})</h2>
      </div>

      
      <div className="search-filter">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search by title or employer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Employer</th>
            <th>Location</th>
            <th>Wage</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No jobs found</td>
            </tr>
          ) : (
            filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.employer?.name || 'N/A'}</td>
                <td>{job.location}</td>
                <td>${job.wage}</td>
                <td><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></td>
                <td>
                  <button className="action-btn btn-delete" onClick={() => handleDelete(job.id)}>
                    Delete
                  </button>
                  <button className="action-btn btn-block" onClick={() => handleStatusUpdate(job.id, 'CLOSED')}>
                    Close
                  </button>
                  <button className="action-btn btn-unblock" onClick={() => handleStatusUpdate(job.id, 'OPEN')}>
                    Open
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobsManagement;

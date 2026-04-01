import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { adminAPI } from '../services/api';
import './AdminManagement.css';

const EmployerJobs = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // employer ID
  const [employerName, setEmployerName] = useState('Loading...');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadEmployerName();
    loadJobs();
  }, [id]);

  const loadEmployerName = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setEmployerName(res.data.name || 'Unknown Employer');
    } catch (error) {
      console.error('Error loading employer:', error);
      setEmployerName('Unknown Employer');
    }
  };

  const loadJobs = async () => {
    try {
      const res = await adminAPI.getEmployerJobs(id);
      setJobs(res.data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      console.log('Deleting job:', jobId);
      await api.delete(`/jobs/admin/jobs/${jobId}`);
      loadJobs();
    } catch (error) {
      console.error('Delete error:', error);
      window.alert('Error deleting job: ' + error.response?.data?.message || error.message);
    }
  };

  const handleStatusUpdate = async (jobId, status) => {
    if (!window.confirm(`Set job status to ${status.toUpperCase()}?`)) return;
    try {
      await adminAPI.updateJobStatus(jobId, status);
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
      <button className="back-btn" onClick={() => navigate('/admin/employers')}>
        ← Back to Employers
      </button>
      <div className="table-header">
        <h2>Jobs Management for {employerName} ({jobs.length})</h2>
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
              <td colSpan="6" className="no-data">No jobs found for this employer</td>
            </tr>
          ) : (
            filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{employerName}</td>
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

export default EmployerJobs;


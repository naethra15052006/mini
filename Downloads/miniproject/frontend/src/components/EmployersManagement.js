import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminManagement.css';

const EmployersManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    try {
      const res = await api.get('/users/admin/employers');
      console.log('Employers response:', res.data); // Debug
      setEmployers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error loading employers:', error);
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm('Block this employer?')) return;
    try {
      await api.put(`/users/admin/users/${id}/block`);
      loadEmployers();
    } catch (error) {
      window.alert('Error blocking employer');
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Unblock this employer?')) return;
    try {
      await api.put(`/users/admin/users/${id}/unblock`);
      loadEmployers();
    } catch (error) {
      window.alert('Error unblocking employer');
    }
  };

  const handleViewJobs = (id) => {
    navigate(`/admin/employers/${id}/jobs`);
  };

  const filteredEmployers = employers.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || e.status === statusFilter)
  );

  if (loading) return <div>Loading employers...</div>;

  return (
    <div className="admin-management">
      <button className="back-btn" onClick={() => navigate('/admin')}>
        ← Back to Dashboard
      </button>
      <div className="table-header">
        <h2>Employers Management ({employers.length})</h2>
      </div>

      
      <div className="search-filter">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployers.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">No employers found</td>
            </tr>
          ) : (
            filteredEmployers.map((employer) => (
              <tr key={employer.id}>
                <td>{employer.name}</td>
                <td>{employer.email}</td>
                <td>{employer.phoneNumber || 'Not provided'}</td>
                <td><span className={`status-badge status-${employer.status.toLowerCase()}`}>{employer.status}</span></td>
                <td>
                  <button className="action-btn" onClick={() => handleViewJobs(employer.id)}>
                    View Jobs
                  </button>
                  {employer.status === 'ACTIVE' ? (
                    <button className="action-btn btn-block" onClick={() => handleBlock(employer.id)}>
                      Block
                    </button>
                  ) : (
                    <button className="action-btn btn-unblock" onClick={() => handleUnblock(employer.id)}>
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployersManagement;

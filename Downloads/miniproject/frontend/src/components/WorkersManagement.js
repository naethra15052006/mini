import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './AdminManagement.css';

const WorkersManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const res = await api.get('/users/workers');
      console.log('Workers response:', res.data); // Debug
      setWorkers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error loading workers:', error);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm('Block this worker?')) return;
    try {
      await api.put(`/users/admin/users/${id}/block`);
      loadWorkers();
    } catch (error) {
      console.error(error);
      window.alert('Error blocking worker: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Unblock this worker?')) return;
    try {
      await api.put(`/users/admin/users/${id}/unblock`);
      loadWorkers();
    } catch (error) {
      window.alert('Error unblocking worker');
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || w.status === statusFilter)
  );

  if (loading) return <div>Loading workers...</div>;

  return (
    <div className="admin-management">
      <button className="back-btn" onClick={() => navigate('/admin')}>
        ← Back to Dashboard
      </button>
      <div className="table-header">
        <h2>Workers Management ({workers.length})</h2>
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
          {filteredWorkers.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">No workers found</td>
            </tr>
          ) : (
            filteredWorkers.map((worker) => (
              <tr key={worker.id}>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{worker.phoneNumber || 'Not provided'}</td>
                <td><span className={`status-badge status-${worker.status.toLowerCase()}`}>{worker.status}</span></td>
                <td>
                  {worker.status === 'ACTIVE' ? (
                    <button className="action-btn btn-block" onClick={() => handleBlock(worker.id)}>
                      Block
                    </button>
                  ) : (
                    <button className="action-btn btn-unblock" onClick={() => handleUnblock(worker.id)}>
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

export default WorkersManagement;

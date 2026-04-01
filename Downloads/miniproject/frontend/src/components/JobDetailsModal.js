import React from 'react';

const JobDetailsModal = ({ isOpen, job, onClose, onProceed }) => {
  if (!isOpen || !job) return null;

  const location = job.latitude && job.longitude ? `${job.latitude.toFixed(2)}, ${job.longitude.toFixed(2)}` : 'Not specified';
  const days = 'Duration/Days: See description (ask employer for details)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Job Description - {job.title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Wage:</strong> ${job.wage || 'Negotiable'}</p>
          <p><strong>Skill:</strong> {job.skill || 'Not specified'}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>{days}</strong></p>
          <p><strong>Status:</strong> {job.status}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onProceed}>Proceed to Apply</button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;


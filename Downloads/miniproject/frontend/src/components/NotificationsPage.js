import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/notificationAPI';
// import { FaBell, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

import './Dashboard.css'; // Reuse attractive styles

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notifsRes, unreadRes] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getUnreadCount()
      ]);
      setNotifications(notifsRes.data);
      setUnreadCount(unreadRes.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({...n, read: true})));
    } catch (error) {
      console.error('Error marking all read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'JOB_MATCH': return <span className="notif-icon success">✅</span>;
      case 'APPLICATION_SUBMITTED': return <span className="notif-icon warning">📩</span>;
      case 'APPLICATION_APPROVED': return <span className="notif-icon success">✅</span>;
      case 'APPLICATION_REJECTED': return <span className="notif-icon danger">❌</span>;
      default: return <span className="notif-icon">🔔</span>;
    }
  };

  const getNotifClass = (type) => {
    switch (type) {
      case 'JOB_MATCH':
      case 'APPLICATION_APPROVED': return 'notif-item success';
      case 'APPLICATION_SUBMITTED': return 'notif-item warning';
      case 'APPLICATION_REJECTED': return 'notif-item danger';
      default: return 'notif-item';
    }
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>🔔 Notifications ({unreadCount})</h1>
        {unreadCount > 0 && (
          <button className="mark-read-btn" onClick={markAllRead}>
            Mark all read
          </button>
        )}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="dashboard-section">
        <h3>All Notifications</h3>
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span>🔔</span>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div key={notif.id} className={`${getNotifClass(notif.type)} ${notif.read ? 'read' : 'unread'}`} 
                   onClick={() => !notif.read && markAsRead(notif.id)}>
                <div className="notif-icon-container">
                  {getIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <p className="notif-message">{notif.title}</p>
                  <p className="notif-description">{notif.message}</p>
                  <span className="notif-time">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;


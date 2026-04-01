import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EmployerDashboard from './components/EmployerDashboard';
import PostJob from './components/PostJob';
import JobDetail from './components/JobDetail';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import RatingsPage from './components/RatingsPage';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import NotificationsPage from './components/NotificationsPage';
import ProgressPage from './components/ProgressPage';
import ApplicationForm from './components/ApplicationForm';
import EmployerJobDetails from './components/EmployerJobDetails';
import WorkersManagement from './components/WorkersManagement';
import EmployersManagement from './components/EmployersManagement';
import JobsManagement from './components/JobsManagement';
import EmployerJobs from './components/EmployerJobs';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="app-container">
      <TopBar onToggleSidebar={toggleSidebar} />
      <Sidebar isCollapsed={!sidebarOpen} onToggle={toggleSidebar} />
      <main className={`page-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['WORKER']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/progress" element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/apply/:id" element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            } />
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/workers" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <WorkersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/employers" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EmployersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/jobs" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <JobsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/employers/:id/jobs" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EmployerJobs />
                </ProtectedRoute>
              } 
            />
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            } />
            <Route 
              path="/employer-jobs/:id" 
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerJobDetails />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/ratings" element={
              <ProtectedRoute>
                <RatingsPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import PimpinanRegisterPage from './Pages/PimpinanRegisterPage';

import Dashboard from './Pages/Dashboard';
import ProfilePage from './Pages/ProfilePage';
import TicketListPage from './Pages/TicketListPage';
import NewTicketPage from './Pages/NewTicketPage';
import TicketDetailPage from './Pages/TicketDetailPage';
import KnowledgeBasePage from './Pages/KnowledgeBasePage';
import AdminTicketPage from './Pages/AdminTicketPage';
import AdminMonitoringAgentPage from './Pages/AdminMonitoringAgentPage';

import RegisterSuperAdminTemp from './Pages/RegisterSuperAdminTemp';
import SystemControlPage from './Pages/SystemControlPage';


import initialUsers from './data/users.json';
import initialTickets from './data/tickets.json';

// A simple authentication check function
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }
  return children;
};

// Cleanup function to remove password reset requests data
const cleanupPasswordResetData = () => {
  // Remove password reset requests data that may have been stored previously
  localStorage.removeItem('passwordResetRequests');
};


function App() {
  // Centralized data initialization
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      // Create empty users array in localStorage
      localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('tickets')) {
      localStorage.setItem('tickets', JSON.stringify(initialTickets));
    }
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([]));
    }

    // Cleanup any existing password reset requests data
    cleanupPasswordResetData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-pimpinan" element={<PimpinanRegisterPage />} />

        <Route path="/admin/tickets" element={
          <ProtectedRoute>
            <AdminTicketPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/monitoring-agent" element={
          <ProtectedRoute>
            <AdminMonitoringAgentPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/unit-report" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/register-superadmin" element={<RegisterSuperAdminTemp />} />
        <Route path="/admin/system-control" element={
          <ProtectedRoute>
            <SystemControlPage />
          </ProtectedRoute>
        } />

        <Route 
          path="/Dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tickets" 
          element={
            <ProtectedRoute>
              <TicketListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/queue" 
          element={
            <ProtectedRoute>
              <TicketListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-ticket" 
          element={
            <ProtectedRoute>
              <NewTicketPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ticket/:ticketId" 
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/kb" 
          element={
            <ProtectedRoute>
              <KnowledgeBasePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<LandingPage />} 
        />

      </Routes>
    </Router>
  );
}

export default App;
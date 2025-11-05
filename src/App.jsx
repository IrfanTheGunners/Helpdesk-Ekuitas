import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import ExecutiveRegisterPage from './Pages/ExecutiveRegisterPage';
import Dashboard from './Pages/Dashboard';
import ProfilePage from './Pages/ProfilePage';
import TicketListPage from './Pages/TicketListPage';
import NewTicketPage from './Pages/NewTicketPage';
import TicketDetailPage from './Pages/TicketDetailPage';
import KnowledgeBasePage from './Pages/KnowledgeBasePage';
import AgentRegisterPage from './Pages/AgentRegisterPage';
import RegisterAdminPage from './Pages/RegisterAdminPage'; 
import AdminTicketPage from './Pages/AdminTicketPage';
import AdminMonitoringAgentPage from './Pages/AdminMonitoringAgentPage';

import RegisterSuperAdminPage from './Pages/RegisterSuperAdminPage';
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
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-executive" element={<ExecutiveRegisterPage />} />
        <Route path="/register-agent" element={<AgentRegisterPage />} />
        <Route path="/register-admin" element={<RegisterAdminPage />} />
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

        <Route path="/register-superadmin" element={<RegisterSuperAdminPage />} />
        <Route path="/admin/system-control" element={
          <ProtectedRoute>
            <SystemControlPage />
          </ProtectedRoute>
        } />

        <Route 
          path="/dashboard" 
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
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage          from './pages/LandingPage';
import TemplateGallery      from './pages/TemplateGallery';
import InvitationCustomizer from './pages/InvitationCustomizer';
import Dashboard            from './pages/Dashboard';
import InvitationView       from './pages/InvitationView';
import LiveBoard            from './pages/LiveBoard';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';

/**
 * ProtectedRoute — redirects to /login if the user is not authenticated.
 * Passes original destination via `state.from` so login can redirect back.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', fontFamily: 'var(--font-sans)' }}>
        <p style={{ color: 'var(--outline)' }}>Memuat sesi...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * GuestRoute — redirects already-logged-in users away from /login and /register.
 */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/"              element={<LandingPage />} />
            <Route path="/gallery"       element={<TemplateGallery />} />
            <Route path="/invitation/:id" element={<InvitationView />} />
            <Route path="/live-board/:id" element={<LiveBoard />} />

            {/* Guest-only routes (redirect to /dashboard if already logged in) */}
            <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* Protected routes (require login) */}
            <Route path="/customize" element={<ProtectedRoute><InvitationCustomizer /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TemplateGallery from './pages/TemplateGallery';
import InvitationCustomizer from './pages/InvitationCustomizer';
import Dashboard from './pages/Dashboard';
import InvitationView from './pages/InvitationView';
import LiveBoard from './pages/LiveBoard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<TemplateGallery />} />
          <Route path="/customize" element={<InvitationCustomizer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invitation/:id" element={<InvitationView />} />
          <Route path="/live-board/:id" element={<LiveBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

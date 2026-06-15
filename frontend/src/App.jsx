// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyApplications from './pages/MyApplications';

// Redirect logged-in users away from login/register
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/my-applications" replace /> : children;
}

// Redirect guests to login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '160px 24px' }}>
              <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
              <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

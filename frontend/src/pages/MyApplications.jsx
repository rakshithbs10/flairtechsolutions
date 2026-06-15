// src/pages/MyApplications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './MyApplications.css';

const STATUS_COLORS = {
  pending:  { bg: '#fef9c3', color: '#854d0e', label: 'Under Review' },
  reviewed: { bg: '#dbeafe', color: '#1e40af', label: 'Reviewed' },
  interview:{ bg: '#d1fae5', color: '#065f46', label: 'Interview' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Not Selected' },
  hired:    { bg: '#d1fae5', color: '#065f46', label: 'Hired 🎉' },
};

export default function MyApplications() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    applicationsApi.getMy()
      .then(res => setApplications(res.data.data))
      .catch(() => setError('Failed to load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-apps-page">
      <div className="page-header">
        <div className="container">
          <h1>My Applications</h1>
          <p className="breadcrumb"><a href="/">Home</a><span>›</span> My Applications</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* User info bar */}
          <div className="user-bar card">
            <div className="user-info">
              <div className="user-avatar">{user?.fullName?.[0]?.toUpperCase()}</div>
              <div>
                <div className="user-name">{user?.fullName}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
            <div className="user-actions">
              <Link to="/careers" className="btn btn-primary btn-sm">Browse Jobs</Link>
              <button className="btn btn-outline btn-sm" onClick={logout}>Sign Out</button>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', width: 36, height: 36 }} />
              <p>Loading your applications...</p>
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && applications.length === 0 && (
            <div className="empty-apps card">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>You haven't applied to any positions yet. Browse our open roles and apply today.</p>
              <Link to="/careers" className="btn btn-accent" style={{ marginTop: 16 }}>View Open Positions</Link>
            </div>
          )}

          {!loading && applications.length > 0 && (
            <div className="apps-list">
              <h2 className="apps-count">{applications.length} Application{applications.length !== 1 ? 's' : ''}</h2>
              {applications.map(app => {
                const status = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                return (
                  <div key={app.id} className="app-card card">
                    <div className="app-header">
                      <div>
                        <h3 className="app-title">{app.listedJobTitle || app.jobTitle || 'Position'}</h3>
                        <div className="app-meta">
                          {app.location && <span>📍 {app.location}</span>}
                          {app.jobType && <span>💼 {app.jobType}</span>}
                          <span>📅 Applied {new Date(app.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className="app-status" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    {app.resumeFileName && (
                      <div className="app-resume">
                        📄 <span>{app.resumeFileName}</span>
                      </div>
                    )}

                    {app.coverLetter && (
                      <div className="app-cover">
                        <strong>Cover Letter:</strong>
                        <p>{app.coverLetter}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

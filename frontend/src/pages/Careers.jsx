// src/pages/Careers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi, applicationsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './Careers.css';

function ApplicationModal({ job, onClose }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', coverLetter: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!resumeFile) e.resume = 'Please attach your resume';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('jobTitle', job.title);
      fd.append('jobId', job.id);
      fd.append('coverLetter', form.coverLetter);
      fd.append('resume', resumeFile);
      const res = await applicationsApi.submit(fd);
      setResult({ type: 'success', message: res.data.message });
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Apply for {job.title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {result ? (
            <div>
              <div className={`alert alert-${result.type}`}>{result.message}</div>
              {result.type === 'success' && (
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={onClose}>Close</button>
              )}
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className={`form-control${errors.fullName ? ' error' : ''}`} value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Smith" />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className={`form-control${errors.email ? ' error' : ''}`} type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Resume * (PDF, DOC, DOCX — max 5MB)</label>
                <div className={`file-drop${errors.resume ? ' error' : ''}`}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag'); }}
                  onDragLeave={e => e.currentTarget.classList.remove('drag')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('drag'); const f = e.dataTransfer.files[0]; if (f) setResumeFile(f); }}>
                  {resumeFile ? (
                    <div className="file-selected">
                      <span>📄 {resumeFile.name}</span>
                      <button onClick={() => setResumeFile(null)}>✕</button>
                    </div>
                  ) : (
                    <label>
                      <span>📎 Drag & drop your resume or <u>click to browse</u></span>
                      <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                        onChange={e => setResumeFile(e.target.files[0])} />
                    </label>
                  )}
                </div>
                {errors.resume && <div className="form-error">{errors.resume}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea className="form-control" rows={4} value={form.coverLetter}
                  onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                  placeholder="Tell us why you're a great fit for this role..." />
              </div>
              <button className="btn btn-accent" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><span className="spinner" /> Uploading & Submitting...</> : 'Submit Application'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    jobsApi.getAll()
      .then(res => setJobs(res.data.data))
      .catch(() => setError('Failed to load job listings. Please refresh the page.'))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (job) => {
    if (!user) {
      navigate('/login', { state: { from: '/careers' } });
      return;
    }
    setSelectedJob(job);
  };

  return (
    <div className="careers-page">
      <div className="page-header">
        <div className="container">
          <h1>Careers at FlairTech</h1>
          <p className="breadcrumb"><a href="/">Home</a><span>›</span> Careers</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="careers-intro">
            <div className="divider"></div>
            <h2 className="section-title">Open Positions</h2>
            <p className="section-sub">Review the positions we are currently hiring for and apply to the ones that interest you. All positions are in Redmond, WA unless otherwise noted.</p>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', width: 36, height: 36 }} />
              <p>Loading job listings...</p>
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && (
            <div className="jobs-list">
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <p>No open positions at this time. Please check back soon.</p>
                </div>
              ) : jobs.map(job => (
                <div key={job.id} className="job-card card">
                  <div className="job-header">
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-meta">
                        <span className="badge badge-primary">📍 {job.location}</span>
                        <span className="badge badge-accent">💼 {job.jobType}</span>
                        {job.salary && <span className="badge" style={{ background: '#f0fdf4', color: '#166534' }}>💰 {job.salary}</span>}
                      </div>
                    </div>
                    <div className="job-date">
                      Posted: {new Date(job.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <p className="job-desc">{job.description}</p>
                  {job.requirements && (
                    <div className="job-requirements">
                      <strong>Requirements:</strong> {job.requirements}
                    </div>
                  )}
                  <div className="job-footer">
                    <button className="btn btn-accent" onClick={() => handleApplyClick(job)}>
                      {user ? 'Apply Now' : '🔒 Sign In to Apply'}
                    </button>
                    {!user && <span className="login-hint">You need an account to apply</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

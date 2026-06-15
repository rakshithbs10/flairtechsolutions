// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/my-applications';

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const res = await authApi.login(form);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="brand-flair">Flair</span><span className="brand-tech">Tech</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to your account to apply for jobs</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" className={`form-control${errors.email ? ' error' : ''}`}
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" className={`form-control${errors.password ? ' error' : ''}`}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

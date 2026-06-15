// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const { confirmPassword, ...payload } = form;
      const res = await authApi.register(payload);
      login(res.data.token, res.data.user);
      navigate('/my-applications', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type} className={`form-control${errors[name] ? ' error' : ''}`}
        value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
      />
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="brand-flair">Flair</span><span className="brand-tech">Tech</span>
          </div>
          <h2>Create your account</h2>
          <p>Join FlairTech to apply for open positions</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {field('fullName', 'Full Name', 'text', 'John Smith')}
          {field('email', 'Email Address', 'email', 'you@example.com')}
          {field('phone', 'Phone (optional)', 'tel', '+1 (555) 000-0000')}
          <div className="form-row-auth">
            {field('password', 'Password', 'password', 'Min. 6 characters')}
            {field('confirmPassword', 'Confirm Password', 'password', 'Re-enter password')}
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

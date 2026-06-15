// src/pages/Contact.jsx
import React, { useState } from 'react';
import { contactApi } from '../api';
import './Contact.css';

const initialForm = { fullName: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await contactApi.send(form);
      setResult({ type: 'success', message: res.data.message });
      setForm(initialForm);
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="breadcrumb"><a href="/">Home</a><span>›</span> Contact</p>
        </div>
      </div>

      <section className="section">
        <div className="container contact-grid">
          {/* ── Info ─────────────────────────────── */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>FlairTech Solutions consistently works with extraordinary talents to deliver critical projects. We'd love to hear from you whether you're a prospective client or looking to join our network of consultants.</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div>
                  <h4>USA Office</h4>
                  <p>2775 152nd Ave NE<br />Redmond, WA 98052</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div>
                  <h4>India Office</h4>
                  <p>KUB Tower, 48/81, Rd Number 3<br />Gachibowli, Hyderabad 500032</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div>
                  <h4>Email Us</h4>
                  <a href="mailto:HR@flairtechsolutions.com">HR@flairtechsolutions.com</a>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🕐</div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday – Friday: 9am – 6pm</p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Saturday – Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form ─────────────────────────────── */}
          <div className="contact-form-wrapper card">
            <h3>Send Us a Message</h3>
            {result && (
              <div className={`alert alert-${result.type}`}>
                {result.message}
                {result.type === 'success' && <button style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }} onClick={() => setResult(null)}>✕</button>}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="fullName" className={`form-control${errors.fullName ? ' error' : ''}`}
                    value={form.fullName} onChange={handleChange} placeholder="Your full name" />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input name="email" type="email" className={`form-control${errors.email ? ' error' : ''}`}
                    value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input name="subject" className="form-control" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea name="message" rows={5} className={`form-control${errors.message ? ' error' : ''}`}
                  value={form.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                {submitting ? <><span className="spinner" /> Sending...</> : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

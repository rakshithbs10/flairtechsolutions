// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const services = [
  { icon: '📊', title: 'Business Intelligence', desc: 'Data-driven insights to power smarter decisions across your organization.' },
  { icon: '🏗️', title: 'Design / Architecture', desc: 'Scalable enterprise architecture designed for growth and resilience.' },
  { icon: '⚙️', title: 'Enterprise Resource Planning', desc: 'End-to-end ERP solutions that streamline your core business processes.' },
  { icon: '🔧', title: 'Infrastructure Engineering', desc: 'Robust cloud and on-premise infrastructure built for reliability and scale.' },
  { icon: '✅', title: 'Quality Assurance', desc: 'Comprehensive testing strategies ensuring software quality at every stage.' },
  { icon: '🗄️', title: 'Database Management', desc: 'Expert database design, optimization, and management for peak performance.' },
];

const testimonials = [
  {
    text: 'FlairTech is a great choice because of how professional and thorough they are. They helped us through the entire implementation and after. Their consultants are great to work with and really guide you through the process from start to finish.',
    author: 'Director of IT Operations',
    company: 'Fortune 500 Client',
  },
  {
    text: 'Their ability to integrate with our existing systems and deliver results ahead of schedule was impressive. FTS understands real business challenges.',
    author: 'VP of Technology',
    company: 'Healthcare Sector',
  },
  {
    text: 'The team at FlairTech brought deep expertise and a genuine commitment to our success. We continue to rely on them as a trusted partner.',
    author: 'CTO',
    company: 'Financial Services',
  },
];

const slides = [
  { bg: 'linear-gradient(135deg, #0f2347 0%, #1a3a6b 50%, #2557a7 100%)', title: 'IT Staffing & Consulting', sub: 'Connecting extraordinary talent with critical projects' },
  { bg: 'linear-gradient(135deg, #0f2347 0%, #1a3a4b 50%, #1a5a3b 100%)', title: 'Technology Solutions', sub: 'Innovation and deep industry knowledge at your service' },
  { bg: 'linear-gradient(135deg, #2d1a47 0%, #3a1a6b 50%, #571a97 100%)', title: 'Trusted Partnership', sub: 'Your success is the foundation of our own' },
];

export default function Home() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero" style={{ background: slides[slideIdx].bg }}>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot${i === slideIdx ? ' active' : ''}`} onClick={() => setSlideIdx(i)} />
          ))}
        </div>
        <div className="container hero-content">
          <div className="hero-badge">IT Staffing & Technology Consulting</div>
          <h1 className="hero-title">{slides[slideIdx].title}</h1>
          <p className="hero-sub">{slides[slideIdx].sub}</p>
          <div className="hero-actions">
            <Link to="/careers" className="btn btn-accent btn-lg">View Open Positions</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Get In Touch</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="container hero-stats-inner">
            <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Consultants Placed</span></div>
            <div className="stat"><span className="stat-num">15+</span><span className="stat-label">Years of Excellence</span></div>
            <div className="stat"><span className="stat-num">200+</span><span className="stat-label">Clients Served</span></div>
            <div className="stat"><span className="stat-num">2</span><span className="stat-label">Global Offices</span></div>
          </div>
        </div>
      </section>

      {/* ── About Teaser ─────────────────────────────────── */}
      <section className="section about-teaser">
        <div className="container">
          <div className="about-teaser-grid">
            <div className="about-teaser-text">
              <div className="eyebrow">Welcome to FlairTech Solutions</div>
              <h2>Smart Technology Plans Are the Path to Success</h2>
              <p>FlairTech has flexibility to integrate with third-party vendors and partners to extend customer reach and value. We answer real business challenges for our clients through innovation and deep industry knowledge.</p>
              <p>We consistently work with extraordinary talent and drive to deliver critical projects. Our consultants bring thorough understanding of their industries — from research and analysis through to design, implementation, and support.</p>
              <Link to="/about" className="btn btn-primary" style={{ marginTop: 16 }}>Learn More About Us</Link>
            </div>
            <div className="about-teaser-values">
              {['Integrity', 'Quality', 'Collaboration', 'Discipline'].map(v => (
                <div key={v} className="value-chip">✓ {v}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section services-section">
        <div className="container">
          <div className="divider"></div>
          <h2 className="section-title">Our Services</h2>
          <p className="section-sub">End-to-end IT capabilities designed to drive measurable results for our clients.</p>
          <div className="services-grid">
            {services.map(s => (
              <div key={s.title} className="service-card card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/services" className="service-link">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="divider"></div>
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonial-slider">
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{testimonials[testimonialIdx].text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonials[testimonialIdx].author[0]}</div>
                <div>
                  <div className="author-name">{testimonials[testimonialIdx].author}</div>
                  <div className="author-co">{testimonials[testimonialIdx].company}</div>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`t-dot${i === testimonialIdx ? ' active' : ''}`} onClick={() => setTestimonialIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready to Work With Extraordinary Talent?</h2>
          <p>Whether you're looking for your next opportunity or your next great hire, FlairTech Solutions is your partner.</p>
          <div className="cta-actions">
            <Link to="/careers" className="btn btn-accent btn-lg">Browse Careers</Link>
            <Link to="/contact" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

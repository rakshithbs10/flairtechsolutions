// src/pages/About.jsx
import React from 'react';
import './About.css';

const coreValues = [
  { icon: '⚖️', title: 'Integrity', desc: 'We place a high value on honesty. We do what we say we are going to do and always aim to be fair to all parties. We view relationships as a two-way street.' },
  { icon: '⭐', title: 'Quality', desc: 'We maintain high standards of quality in all aspects of our business — quality of people, quality of services, and quality of our interactions.' },
  { icon: '🤝', title: 'Collaboration', desc: 'We view our relationships as partnerships — with employees, customers, and other businesses to ensure mutual success and shared achievement.' },
  { icon: '💡', title: 'Contribution', desc: 'We value everyone\'s opinion and welcome their contributions. We expect direct and honest communications and strive to be good listeners.' },
  { icon: '🎯', title: 'Discipline', desc: 'We run our business objectively, utilizing a structured approach to ensure goals and objectives are met or exceeded through defined processes.' },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p className="breadcrumb"><a href="/">Home</a><span>›</span> About Us</p>
        </div>
      </div>

      {/* ── Who We Are ──────────────────────────────── */}
      <section className="section">
        <div className="container about-intro-grid">
          <div className="about-intro-text">
            <div className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Who We Are</div>
            <h2>A Staffing Firm Built on Trust and Excellence</h2>
            <p>FlairTech Solutions consistently works with extraordinary talents and drives to deliver critical projects to our clients. FlairTech has established a reputation of professional, fair, and understanding qualities, which enabled us to become the staffing firm of choice for many of the best independent consultants in their specializations.</p>
            <p>Our consultants bring thorough understanding of their industries, applying research, analysis, and design solutions to implement exactly what clients need. Our clients partner with us to work directly alongside their teams to make things happen.</p>
            <p>FlairTech evaluates performance of their resources during and after every project. We maintain a level of involvement that challenges companies to look beyond their core processes — to recognize the dynamics of a changing world and position themselves accordingly.</p>
          </div>
          <div className="about-visual">
            <div className="about-stat-grid">
              <div className="about-stat"><span className="about-stat-num">500+</span><span className="about-stat-label">Placements</span></div>
              <div className="about-stat"><span className="about-stat-num">15+</span><span className="about-stat-label">Years</span></div>
              <div className="about-stat"><span className="about-stat-num">200+</span><span className="about-stat-label">Clients</span></div>
              <div className="about-stat accent"><span className="about-stat-num">2</span><span className="about-stat-label">Global Offices</span></div>
            </div>
            <div className="about-mission">
              <h4>Our Mission</h4>
              <p>By providing an end-to-end capability across the IT service lifecycle, we embody a commitment to delivering superior service with measurable results — enabling our clients' success as well as our own.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="divider"></div>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-sub">The principles that guide every decision, every relationship, and every engagement at FlairTech Solutions.</p>
          <div className="values-grid">
            {coreValues.map(v => (
              <div key={v.title} className="value-card card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offices ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="divider"></div>
          <h2 className="section-title">Our Offices</h2>
          <div className="offices-grid">
            <div className="office-card card">
              <div className="office-flag">🇺🇸</div>
              <h3>USA Headquarters</h3>
              <p>2775 152nd Ave NE<br />Redmond, WA 98052</p>
              <a href="https://maps.google.com/?q=2775+152nd+Ave+NE+Redmond+WA+98052" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>View on Map</a>
            </div>
            <div className="office-card card">
              <div className="office-flag">🇮🇳</div>
              <h3>India Office</h3>
              <p>KUB Tower, 48/81, Rd Number 3<br />Gachibowli, Hyderabad 500032</p>
              <a href="https://maps.google.com/?q=KUB+Tower+Gachibowli+Hyderabad" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>View on Map</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

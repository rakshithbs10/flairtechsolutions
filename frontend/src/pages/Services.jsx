// src/pages/Services.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const services = [
  {
    icon: '📊',
    title: 'Business Intelligence',
    desc: 'Transform raw data into strategic insights. Our BI consultants implement robust reporting frameworks, dashboards, and analytics platforms that empower leadership with real-time visibility into business performance.',
    skills: ['Power BI', 'Tableau', 'SQL Server Reporting', 'Data Warehousing', 'ETL Pipelines'],
  },
  {
    icon: '🏗️',
    title: 'Design / Architecture',
    desc: 'Build technology systems that scale. We design enterprise architecture aligned with your business objectives — from cloud-native microservices to hybrid on-premise/cloud deployments.',
    skills: ['Solution Architecture', 'Cloud Design', 'Microservices', 'API Design', 'Security Architecture'],
  },
  {
    icon: '⚙️',
    title: 'Enterprise Resource Planning',
    desc: 'Streamline core business operations with end-to-end ERP solutions. Our consultants bring deep expertise in implementation, migration, integration, and ongoing support.',
    skills: ['SAP', 'Oracle', 'Microsoft Dynamics', 'ERP Integration', 'Process Optimization'],
  },
  {
    icon: '🔧',
    title: 'Infrastructure Engineering / Administration',
    desc: 'Reliable infrastructure is the backbone of digital success. Our infrastructure engineers design, deploy, and manage cloud and on-premise environments built for performance and resilience.',
    skills: ['Azure', 'AWS', 'VMware', 'Network Engineering', 'DevOps', 'Kubernetes'],
  },
  {
    icon: '✅',
    title: 'Quality Assurance / Test Engineering',
    desc: 'Deliver software your users trust. Our QA engineers bring comprehensive testing methodologies — from manual exploratory testing to sophisticated automated test suites.',
    skills: ['Selenium', 'JIRA', 'Test Automation', 'Performance Testing', 'API Testing', 'Agile QA'],
  },
  {
    icon: '🗄️',
    title: 'Database Management / Development',
    desc: 'Expert database professionals covering the full lifecycle — design, development, migration, optimization, and ongoing DBA support for relational and NoSQL platforms.',
    skills: ['SQL Server', 'Oracle', 'PostgreSQL', 'MongoDB', 'Azure SQL', 'Performance Tuning'],
  },
];

export default function Services() {
  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p className="breadcrumb"><a href="/">Home</a><span>›</span> Our Services</p>
        </div>
      </div>

      <section className="section services-intro">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="divider"></div>
          <h2 className="section-title">End-to-End IT Capabilities</h2>
          <p className="section-sub">FlairTech provides an end-to-end capability across the IT service lifecycle, embodying a commitment to delivering superior service with measurable results.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-light)', paddingTop: 0 }}>
        <div className="container services-detail-grid">
          {services.map(s => (
            <div key={s.title} className="service-detail-card card">
              <div className="sd-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="sd-skills">
                {s.skills.map(k => <span key={k} className="skill-tag">{k}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Ready to Work Together?</h2>
          <p style={{ color: 'var(--text-body)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>Tell us about your technology needs and we'll connect you with the right experts.</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Start a Conversation</Link>
        </div>
      </section>
    </div>
  );
}

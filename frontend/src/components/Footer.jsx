// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="brand-flair">Flair</span><span className="brand-tech">Tech</span>
            <span className="brand-tag">Solutions</span>
          </div>
          <p>Smart technology plans that drive business success. FlairTech delivers critical IT solutions through innovation and deep industry knowledge.</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><span>Business Intelligence</span></li>
            <li><span>Design / Architecture</span></li>
            <li><span>Enterprise Resource Planning</span></li>
            <li><span>Infrastructure Engineering</span></li>
            <li><span>Quality Assurance</span></li>
            <li><span>Database Management</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>
              <span className="icon">📍</span>
              <span>2775 152nd Ave NE,<br />Redmond, WA 98052</span>
            </li>
            <li>
              <span className="icon">📍</span>
              <span>KUB Tower, 48/81, Rd No.3,<br />Gachibowli, Hyderabad 500032</span>
            </li>
            <li>
              <span className="icon">✉️</span>
              <a href="mailto:HR@flairtechsolutions.com">HR@flairtechsolutions.com</a>
            </li>
            <li>
              <span className="icon">🕐</span>
              <span>Mon–Fri: 9am – 6pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FlairTech Solutions Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Our Services' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          <span className="brand-flair">Flair</span><span className="brand-tech">Tech</span>
          <span className="brand-tag">Solutions</span>
        </Link>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
                {label}
              </NavLink>
            </li>
          ))}

          {/* Auth area */}
          {user ? (
  <li className="nav-user-menu">
    <NavLink to="/my-applications" className={({ isActive }) => `nav-user-btn${isActive ? ' active' : ''}`}>
      <span className="nav-avatar">{user.fullName[0].toUpperCase()}</span>
      <span className="nav-username">{user.fullName.split(' ')[0]}</span>
    </NavLink>
    <button className="btn btn-outline-white btn-sm nav-signout" onClick={handleLogout}>Sign Out</button>
  </li>
) : !loading ? (
  <li className="nav-auth-links">
    <Link to="/login" className="nav-login-link">Sign In</Link>
    <Link to="/register" className="btn btn-accent btn-sm">Register</Link>
  </li>
) : null}
        </ul>
      </div>
    </nav>
  );
}

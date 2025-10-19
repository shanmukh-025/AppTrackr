import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>📊 AppTracker</h2>
        <p className="navbar-subtitle">Job Application Tracker</p>
      </div>

      <ul className="navbar-menu">
        <li className={isActive('/dashboard') ? 'active' : ''}>
          <Link to="/dashboard">
            <span className="icon">🏠</span>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={isActive('/applications') ? 'active' : ''}>
          <Link to="/applications">
            <span className="icon">📋</span>
            <span>Applications</span>
          </Link>
        </li>
        <li className={isActive('/companies') ? 'active' : ''}>
          <Link to="/companies">
            <span className="icon">🏢</span>
            <span>Companies</span>
          </Link>
        </li>
        <li className={isActive('/analytics') ? 'active' : ''}>
          <Link to="/analytics">
            <span className="icon">📊</span>
            <span>Analytics</span>
          </Link>
        </li>
        <li className={isActive('/resources') ? 'active' : ''}>
          <Link to="/resources">
            <span className="icon">📚</span>
            <span>Resources</span>
          </Link>
        </li>
        <li className={isActive('/profile') ? 'active' : ''}>
          <Link to="/profile">
            <span className="icon">👤</span>
            <span>Profile</span>
          </Link>
        </li>
      </ul>

      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
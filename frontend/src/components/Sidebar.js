import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const { user: authUser, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/applications', icon: '📋', label: 'Applications' },
    { path: '/jobs', icon: '💼', label: 'Jobs' },
    { path: '/ai-features', icon: '🤖', label: 'AI Assistant' },
    { path: '/companies', icon: '🏢', label: 'Companies' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/resources', icon: '📚', label: 'Resources' }
  ];

  const toggleMobileMenu = () => {
    console.log('Hamburger clicked - Current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(prev => {
      console.log('Toggling from', prev, 'to', !prev);
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={`mobile-header ${isMobileMenuOpen ? 'hidden' : ''}`}>
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">AppTrackr</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">AppTrackr</span>
          </div>
          {/* Close button for mobile */}
          <button className="sidebar-close-btn" onClick={closeMobileMenu}>
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {authUser?.profilePicture ? (
              <img src={authUser.profilePicture} alt="Profile" className="avatar-img" />
            ) : (
              (authUser?.name || authUser?.email || '').charAt(0).toUpperCase()
            )}
          </div>
          <div className="user-info">
            <div className="user-name">{authUser?.name || 'User'}</div>
            <div className="user-email">{authUser?.email}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
      />
    </>
  );
}

export default Sidebar;
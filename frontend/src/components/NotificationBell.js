import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/NotificationBell.css';

const NotificationBell = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notifs = response.data.data || response.data || [];
      setRecentNotifications(notifs);
      
      const unread = notifs.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      deadline: '⏰',
      interview: '🎤',
      skill: '📈',
      job: '💼',
      achievement: '🏆',
      message: '💬',
      reminder: '🔔',
      system: '⚙️'
    };
    return icons[type] || '📬';
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Recent Notifications</h4>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read"
                onClick={fetchNotifications}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="dropdown-list">
            {recentNotifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              recentNotifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`dropdown-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <span className="item-icon">{getNotificationIcon(notif.type)}</span>
                  <div className="item-content">
                    <p className="item-title">{notif.title}</p>
                    <p className="item-message">{notif.message}</p>
                  </div>
                  {!notif.read && <div className="item-unread-dot"></div>}
                </div>
              ))
            )}
          </div>

          <div className="dropdown-footer">
            <a href="/notifications" className="view-all-link">
              View all notifications →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

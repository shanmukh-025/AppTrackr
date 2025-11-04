import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/NotificationCenter.css';

const NotificationCenter = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    dailyDigest: true,
    instantAlerts: true,
    applicationReminders: true
  });
  const [loading, setLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notifs = response.data.data || response.data || [];
      setNotifications(notifs);
      
      // Count unread
      const unread = notifs.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [token, API_URL]);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchPreferences]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${API_URL}/api/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_URL}/api/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      await axios.patch(
        `${API_URL}/api/notifications/settings`,
        newPreferences,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      setNotification({ type: 'success', message: 'Notification preferences updated!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update preferences' });
    }
  };

  const getFilteredNotifications = () => {
    switch(activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'important':
        return notifications.filter(n => n.priority === 'high');
      default:
        return notifications;
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

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>🔔 Notifications Center</h2>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="notification-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`tab ${activeTab === 'important' ? 'active' : ''}`}
          onClick={() => setActiveTab('important')}
        >
          Important
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Preferences
        </button>
      </div>

      {/* Content */}
      <div className="notification-content">
        {activeTab === 'settings' ? (
          // Preferences Panel
          <div className="preferences-panel">
            <h3>Notification Preferences</h3>
            <div className="preference-group">
              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                />
                <span>Email Notifications</span>
                <p className="preference-desc">Receive important updates via email</p>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.instantAlerts}
                  onChange={(e) => updatePreferences({ instantAlerts: e.target.checked })}
                />
                <span>Instant Alerts</span>
                <p className="preference-desc">Get real-time alerts for urgent events</p>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.dailyDigest}
                  onChange={(e) => updatePreferences({ dailyDigest: e.target.checked })}
                />
                <span>Daily Digest</span>
                <p className="preference-desc">Receive a summary of all updates daily</p>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.applicationReminders}
                  onChange={(e) => updatePreferences({ applicationReminders: e.target.checked })}
                />
                <span>Application Reminders</span>
                <p className="preference-desc">Get reminders for application deadlines</p>
              </label>
            </div>
          </div>
        ) : (
          // Notifications List
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-notifications">
                <div className="empty-icon">📭</div>
                <p>No {activeTab !== 'all' ? activeTab : ''} notifications</p>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.read ? 'read' : 'unread'} priority-${notif.priority || 'normal'}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="notification-body">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">
                      {new Date(notif.createdAt).toLocaleDateString()} {' '}
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    ✕
                  </button>

                  {!notif.read && <div className="unread-badge"></div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

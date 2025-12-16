import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SmartNotifications.css';

const SmartNotifications = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [activeTab, setActiveTab] = useState('smart');
  const [notifications, setNotifications] = useState([]);
  const [smartRules, setSmartRules] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Smart Rules State
  const [newRule, setNewRule] = useState({
    trigger: '',
    condition: '',
    action: '',
    priority: 'medium',
    enabled: true
  });

  // AI Insights
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  const [trendingOpportunities, setTrendingOpportunities] = useState([]);

  useEffect(() => {
    fetchSmartNotifications();
    fetchSmartRules();
    fetchAIInsights();
  }, []);

  const fetchSmartNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/smart-notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock data for demo
      setNotifications([
        {
          id: 1,
          type: 'ai-prediction',
          priority: 'high',
          title: 'Application about to expire',
          message: 'Your Google application will likely be rejected in 3 days without follow-up',
          action: 'Send follow-up email',
          timestamp: '5 minutes ago',
          read: false,
          icon: '🔮'
        },
        {
          id: 2,
          type: 'market-trend',
          priority: 'high',
          title: 'Your skills are trending +40%',
          message: 'React + TypeScript roles increased 40% this week. 23 new matches found.',
          action: 'View opportunities',
          timestamp: '1 hour ago',
          read: false,
          icon: '📈'
        },
        {
          id: 3,
          type: 'competitor-alert',
          priority: 'medium',
          title: 'Competitor got hired',
          message: 'Someone with similar profile got hired at Meta. View their strategy.',
          action: 'Analyze profile',
          timestamp: '3 hours ago',
          read: false,
          icon: '👥'
        },
        {
          id: 4,
          type: 'timing-alert',
          priority: 'high',
          title: 'Perfect time to apply',
          message: 'Amazon hiring manager is most active now. 85% response rate detected.',
          action: 'Apply now',
          timestamp: '5 hours ago',
          read: true,
          icon: '⏰'
        },
        {
          id: 5,
          type: 'network-signal',
          priority: 'medium',
          title: 'Your connection just joined Microsoft',
          message: 'John Smith can refer you. Referrals have 3x higher success rate.',
          action: 'Request referral',
          timestamp: '1 day ago',
          read: true,
          icon: '🤝'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmartRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/smart-notifications/rules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSmartRules(response.data.rules || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      // Mock data
      setSmartRules([
        {
          id: 1,
          name: 'Application Expiry Alert',
          trigger: 'No response after 7 days',
          action: 'Send follow-up reminder + suggest email template',
          enabled: true,
          successRate: 68
        },
        {
          id: 2,
          name: 'Skill Trend Detector',
          trigger: 'When my skills trend +30% in job market',
          action: 'Alert me with matching jobs',
          enabled: true,
          successRate: 82
        },
        {
          id: 3,
          name: 'Competitor Hired Alert',
          trigger: 'Similar profile gets hired at target company',
          action: 'Analyze their strategy and notify me',
          enabled: true,
          successRate: 74
        },
        {
          id: 4,
          name: 'Optimal Apply Time',
          trigger: 'Hiring manager activity detected',
          action: 'Push notification to apply immediately',
          enabled: true,
          successRate: 91
        },
        {
          id: 5,
          name: 'Network Referral Opportunity',
          trigger: 'My connection joins target company',
          action: 'Suggest referral request with template',
          enabled: true,
          successRate: 88
        },
        {
          id: 6,
          name: 'Salary Drop Alert',
          trigger: 'Job I applied to lowers salary by 10%+',
          action: 'Warn me before accepting offer',
          enabled: false,
          successRate: 95
        }
      ]);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/smart-notifications/ai-insights`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiInsights(response.data);
    } catch (error) {
      // Mock data
      setPredictiveAlerts([
        {
          id: 1,
          prediction: 'Application likely to be rejected',
          company: 'Google',
          probability: 78,
          reason: 'No activity for 14 days, similar patterns show 78% rejection rate',
          recommendation: 'Send follow-up email or withdraw and reapply in Q2',
          timeframe: 'Within 3 days'
        },
        {
          id: 2,
          prediction: 'Interview invitation incoming',
          company: 'Microsoft',
          probability: 85,
          reason: 'Hiring manager viewed your profile 3 times, typical pre-interview behavior',
          recommendation: 'Prepare for system design interview, start practicing now',
          timeframe: 'Next 48 hours'
        },
        {
          id: 3,
          prediction: 'Offer likely below market',
          company: 'Startup XYZ',
          probability: 72,
          reason: 'Company budget analysis shows 15-20% below market for your role',
          recommendation: 'Prepare strong negotiation strategy with competing offers',
          timeframe: 'If offer comes'
        }
      ]);

      setTrendingOpportunities([
        {
          id: 1,
          trend: 'React + AI Skills Surge',
          growth: '+45%',
          jobs: 127,
          avgSalary: '$165,000',
          urgency: 'High',
          reason: 'AI integration boom - companies need React devs who understand AI'
        },
        {
          id: 2,
          trend: 'Remote Senior Roles Increase',
          growth: '+32%',
          jobs: 89,
          avgSalary: '$180,000',
          urgency: 'Medium',
          reason: 'Companies expanding remote-first policies for senior talent'
        },
        {
          id: 3,
          trend: 'Fintech Engineering Demand',
          growth: '+28%',
          jobs: 64,
          avgSalary: '$175,000',
          urgency: 'Medium',
          reason: 'Banking sector digital transformation accelerating'
        }
      ]);
    }
  };

  const createSmartRule = async () => {
    if (!newRule.trigger || !newRule.action) {
      alert('Please fill in trigger and action');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/smart-notifications/rules`,
        newRule,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSmartRules();
      setNewRule({ trigger: '', condition: '', action: '', priority: 'medium', enabled: true });
    } catch (error) {
      console.error('Error creating rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/smart-notifications/rules/${ruleId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSmartRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const deleteRule = async (ruleId) => {
    if (!window.confirm('Delete this rule?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/smart-notifications/rules/${ruleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSmartRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/smart-notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="smart-notifications-container">
      {/* Header */}
      <div className="smart-notif-header">
        <div className="header-content">
          <div className="header-left">
            <div className="notif-icon">🔔</div>
            <div>
              <h1 className="header-title">Smart Notifications</h1>
              <p className="header-subtitle">AI-powered predictive alerts and intelligent automation</p>
            </div>
          </div>
          <div className="unread-badge">
            {notifications.filter(n => !n.read).length} unread
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="smart-notif-nav">
        <button
          className={`notif-nav-btn ${activeTab === 'smart' ? 'active' : ''}`}
          onClick={() => setActiveTab('smart')}
        >
          🔔 Smart Alerts
        </button>
        <button
          className={`notif-nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          ⚙️ Automation Rules
        </button>
        <button
          className={`notif-nav-btn ${activeTab === 'ai-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-insights')}
        >
          🤖 AI Predictions
        </button>
      </div>

      {/* Smart Alerts Tab */}
      {activeTab === 'smart' && (
        <div className="smart-notif-content">
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card ${notif.priority} ${notif.read ? 'read' : 'unread'}`}
              >
                <div className="notif-icon-large">{notif.icon}</div>
                <div className="notif-content">
                  <div className="notif-header">
                    <h3>{notif.title}</h3>
                    <span className={`priority-badge ${notif.priority}`}>
                      {notif.priority === 'high' ? '🔥' : '⚡'} {notif.priority}
                    </span>
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  <div className="notif-footer">
                    <span className="notif-time">{notif.timestamp}</span>
                    <div className="notif-actions">
                      <button className="action-btn primary">{notif.action}</button>
                      {!notif.read && (
                        <button
                          className="action-btn secondary"
                          onClick={() => markAsRead(notif.id)}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Rules Tab */}
      {activeTab === 'rules' && (
        <div className="smart-notif-content">
          <div className="rules-section">
            <h2>⚙️ Your Automation Rules</h2>
            <p className="section-desc">
              Set up intelligent rules that automatically monitor and alert you based on job search patterns
            </p>

            {/* Create New Rule */}
            <div className="create-rule-card">
              <h3>Create New Rule</h3>
              <div className="rule-inputs">
                <div className="input-group">
                  <label>When (Trigger)</label>
                  <input
                    type="text"
                    placeholder="e.g., No response after 5 days"
                    value={newRule.trigger}
                    onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                    className="rule-input"
                  />
                </div>
                <div className="input-group">
                  <label>Then (Action)</label>
                  <input
                    type="text"
                    placeholder="e.g., Send me an alert with follow-up suggestions"
                    value={newRule.action}
                    onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                    className="rule-input"
                  />
                </div>
                <div className="input-group">
                  <label>Priority</label>
                  <select
                    value={newRule.priority}
                    onChange={(e) => setNewRule({...newRule, priority: e.target.value})}
                    className="rule-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <button className="create-rule-btn" onClick={createSmartRule} disabled={loading}>
                {loading ? 'Creating...' : '+ Create Rule'}
              </button>
            </div>

            {/* Existing Rules */}
            <div className="rules-list">
              {smartRules.map((rule) => (
                <div key={rule.id} className={`rule-card ${rule.enabled ? 'enabled' : 'disabled'}`}>
                  <div className="rule-header">
                    <div className="rule-toggle">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                        className="toggle-switch"
                      />
                    </div>
                    <h4>{rule.name}</h4>
                    <div className="rule-success">
                      <span className="success-rate">{rule.successRate}%</span>
                      <span className="success-label">success rate</span>
                    </div>
                  </div>
                  <div className="rule-body">
                    <div className="rule-line">
                      <span className="rule-label">When:</span>
                      <span className="rule-value">{rule.trigger}</span>
                    </div>
                    <div className="rule-line">
                      <span className="rule-label">Then:</span>
                      <span className="rule-value">{rule.action}</span>
                    </div>
                  </div>
                  <div className="rule-footer">
                    <button className="rule-edit-btn">✏️ Edit</button>
                    <button className="rule-delete-btn" onClick={() => deleteRule(rule.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Predictions Tab */}
      {activeTab === 'ai-insights' && (
        <div className="smart-notif-content">
          <div className="ai-insights-section">
            <h2>🤖 AI-Powered Predictions</h2>
            <p className="section-desc">
              Machine learning analysis of your applications and market trends
            </p>

            {/* Predictive Alerts */}
            <div className="predictions-section">
              <h3>🔮 Application Outcome Predictions</h3>
              <div className="predictions-grid">
                {predictiveAlerts.map((alert) => (
                  <div key={alert.id} className="prediction-card">
                    <div className="prediction-header">
                      <h4>{alert.prediction}</h4>
                      <div className="probability-meter">
                        <div className="probability-fill" style={{ width: `${alert.probability}%` }} />
                      </div>
                      <span className="probability-value">{alert.probability}% probability</span>
                    </div>
                    <div className="prediction-body">
                      <div className="prediction-line">
                        <strong>Company:</strong> {alert.company}
                      </div>
                      <div className="prediction-line">
                        <strong>Timeframe:</strong> {alert.timeframe}
                      </div>
                      <div className="prediction-reason">
                        <strong>Why:</strong> {alert.reason}
                      </div>
                      <div className="prediction-recommendation">
                        💡 <strong>Recommendation:</strong> {alert.recommendation}
                      </div>
                    </div>
                    <button className="prediction-action-btn">Take Action</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Opportunities */}
            <div className="trending-section">
              <h3>📈 Trending Market Opportunities</h3>
              <div className="trending-grid">
                {trendingOpportunities.map((trend) => (
                  <div key={trend.id} className="trending-card">
                    <div className="trending-header">
                      <h4>{trend.trend}</h4>
                      <span className={`urgency-badge ${trend.urgency.toLowerCase()}`}>
                        {trend.urgency} urgency
                      </span>
                    </div>
                    <div className="trending-stats">
                      <div className="stat-item">
                        <span className="stat-icon">📈</span>
                        <div>
                          <div className="stat-value">{trend.growth}</div>
                          <div className="stat-label">Growth</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">💼</span>
                        <div>
                          <div className="stat-value">{trend.jobs}</div>
                          <div className="stat-label">New Jobs</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">💰</span>
                        <div>
                          <div className="stat-value">{trend.avgSalary}</div>
                          <div className="stat-label">Avg Salary</div>
                        </div>
                      </div>
                    </div>
                    <div className="trending-reason">
                      <strong>Why it's trending:</strong> {trend.reason}
                    </div>
                    <button className="trending-action-btn">View Opportunities</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNotifications;

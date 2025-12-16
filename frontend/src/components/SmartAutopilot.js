import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SmartAutopilot.css';

const SmartAutopilot = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [activeView, setActiveView] = useState('dashboard');
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Autopilot Settings
  const [settings, setSettings] = useState({
    autoApply: false,
    autoFollowUp: true,
    autoResumeTailor: true,
    autoCoverLetter: true,
    autoSchedule: true,
    maxApplicationsPerDay: 5,
    preferredRoles: [],
    preferredCompanies: [],
    salaryMin: 80000,
    workMode: 'remote'
  });

  // Dashboard Stats
  const [stats, setStats] = useState({
    applicationsSubmitted: 0,
    followUpsSent: 0,
    interviewsScheduled: 0,
    resumesTailored: 0,
    responseRate: 0,
    avgResponseTime: 0
  });

  // Smart Queue
  const [applicationQueue, setApplicationQueue] = useState([]);
  const [currentlyProcessing, setCurrentlyProcessing] = useState(null);

  // AI Recommendations
  const [recommendations, setRecommendations] = useState([]);
  
  // Activity Timeline
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    fetchAutopilotData();
  }, []);

  const fetchAutopilotData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/autopilot/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data.stats || stats);
      setApplicationQueue(response.data.queue || []);
      setRecommendations(response.data.recommendations || []);
      setActivityLog(response.data.activity || []);
      setSettings(response.data.settings || settings);
      setAutopilotEnabled(response.data.enabled || false);
    } catch (error) {
      console.error('Error fetching autopilot data:', error);
    }
  };

  const toggleAutopilot = async () => {
    try {
      const token = localStorage.getItem('token');
      const newState = !autopilotEnabled;
      
      await axios.post(
        `${API_URL}/api/autopilot/toggle`,
        { enabled: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAutopilotEnabled(newState);
    } catch (error) {
      console.error('Error toggling autopilot:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/autopilot/settings`,
        newSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="autopilot-container">
      {/* Header with Autopilot Toggle */}
      <div className="autopilot-header">
        <div className="header-content">
          <div className="header-left">
            <div className="autopilot-icon">🤖</div>
            <div>
              <h1 className="header-title">Smart Application Autopilot</h1>
              <p className="header-subtitle">
                AI-powered automation for your entire job search process
              </p>
            </div>
          </div>
          
          <div className="autopilot-toggle-section">
            <div className="toggle-status">
              <span className={`status-indicator ${autopilotEnabled ? 'active' : ''}`} />
              <span className="status-text">
                {autopilotEnabled ? 'Autopilot Active' : 'Autopilot Inactive'}
              </span>
            </div>
            <button 
              className={`toggle-btn ${autopilotEnabled ? 'active' : ''}`}
              onClick={toggleAutopilot}
            >
              <span className="toggle-switch" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="autopilot-nav">
        <button
          className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeView === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveView('queue')}
        >
          <span className="nav-icon">📋</span>
          Smart Queue
        </button>
        <button
          className={`nav-btn ${activeView === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveView('activity')}
        >
          <span className="nav-icon">⚡</span>
          Activity Log
        </button>
        <button
          className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveView('settings')}
        >
          <span className="nav-icon">⚙️</span>
          Settings
        </button>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="autopilot-view dashboard-view">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card applications">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🚀</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.applicationsSubmitted}</div>
                <div className="stat-label">Auto-Applied</div>
                <div className="stat-trend positive">+{stats.applicationsSubmitted} this week</div>
              </div>
            </div>

            <div className="stat-card interviews">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📅</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.interviewsScheduled}</div>
                <div className="stat-label">Interviews Scheduled</div>
                <div className="stat-trend positive">Auto-scheduled</div>
              </div>
            </div>

            <div className="stat-card response">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">💬</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.responseRate}%</div>
                <div className="stat-label">Response Rate</div>
                <div className="stat-trend">{stats.followUpsSent} follow-ups sent</div>
              </div>
            </div>

            <div className="stat-card tailored">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📄</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.resumesTailored}</div>
                <div className="stat-label">Resumes Tailored</div>
                <div className="stat-trend">AI-optimized</div>
              </div>
            </div>
          </div>

          {/* Currently Processing */}
          {currentlyProcessing && (
            <div className="processing-card">
              <div className="processing-header">
                <span className="processing-icon">⚙️</span>
                <h3>Currently Processing</h3>
              </div>
              <div className="processing-content">
                <h4>{currentlyProcessing.role} at {currentlyProcessing.company}</h4>
                <div className="processing-steps">
                  <div className="step completed">✓ Resume tailored</div>
                  <div className="step active">⏳ Generating cover letter...</div>
                  <div className="step pending">○ Submitting application</div>
                  <div className="step pending">○ Scheduling follow-up</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="recommendations-section">
            <h2 className="section-title">🎯 AI Recommendations</h2>
            <div className="recommendations-grid">
              {(recommendations.length > 0 ? recommendations : [
                {
                  type: 'opportunity',
                  title: 'High-Match Opportunity Detected',
                  description: 'Senior Developer role at TechCorp - 95% match with your profile',
                  action: 'Apply Now',
                  priority: 'high'
                },
                {
                  type: 'followup',
                  title: 'Follow-up Recommended',
                  description: '3 applications from last week need follow-up emails',
                  action: 'Send Follow-ups',
                  priority: 'medium'
                },
                {
                  type: 'optimize',
                  title: 'Resume Optimization Available',
                  description: 'Update your resume with trending keywords for better matches',
                  action: 'Optimize',
                  priority: 'low'
                }
              ]).map((rec, index) => (
                <div key={index} className={`recommendation-card ${rec.priority}`}>
                  <div className="rec-header">
                    <span className={`rec-badge ${rec.priority}`}>
                      {rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚡' : '💡'} 
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                  <button className="rec-action-btn">{rec.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Queue View */}
      {activeView === 'queue' && (
        <div className="autopilot-view queue-view">
          <div className="queue-header">
            <h2>📋 Application Queue</h2>
            <p>AI-curated opportunities ready for auto-application</p>
          </div>

          <div className="queue-list">
            {(applicationQueue.length > 0 ? applicationQueue : [
              {
                id: 1,
                company: 'TechCorp',
                role: 'Senior Software Engineer',
                match: 96,
                salary: '$140K - $180K',
                status: 'ready',
                automations: ['Resume Tailored', 'Cover Letter Ready', 'LinkedIn Updated']
              },
              {
                id: 2,
                company: 'InnovateLabs',
                role: 'Tech Lead',
                match: 92,
                salary: '$150K - $200K',
                status: 'processing',
                automations: ['Resume Tailored', 'Generating Cover Letter...']
              },
              {
                id: 3,
                company: 'DataStream',
                role: 'Principal Engineer',
                match: 89,
                salary: '$160K - $220K',
                status: 'pending',
                automations: ['Waiting for approval']
              }
            ]).map((job) => (
              <div key={job.id} className={`queue-item ${job.status}`}>
                <div className="queue-item-header">
                  <div className="queue-item-info">
                    <h3>{job.role}</h3>
                    <p className="company-name">🏢 {job.company}</p>
                  </div>
                  <div className="match-badge">{job.match}% Match</div>
                </div>
                
                <div className="queue-item-details">
                  <span className="detail-chip">💰 {job.salary}</span>
                  <span className={`status-chip ${job.status}`}>
                    {job.status === 'ready' ? '✓ Ready' : 
                     job.status === 'processing' ? '⏳ Processing' : 
                     '○ Pending'}
                  </span>
                </div>

                <div className="automations-list">
                  {job.automations.map((auto, idx) => (
                    <div key={idx} className="automation-item">
                      <span className="auto-check">✓</span>
                      {auto}
                    </div>
                  ))}
                </div>

                <div className="queue-actions">
                  <button className="queue-btn primary">Apply Now</button>
                  <button className="queue-btn secondary">Edit</button>
                  <button className="queue-btn tertiary">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      {activeView === 'activity' && (
        <div className="autopilot-view activity-view">
          <h2 className="view-title">⚡ Activity Timeline</h2>
          
          <div className="activity-timeline">
            {(activityLog.length > 0 ? activityLog : [
              { time: '2 minutes ago', action: 'Applied to Senior Developer at TechCorp', type: 'application', icon: '🚀' },
              { time: '15 minutes ago', action: 'Tailored resume for Tech Lead position', type: 'resume', icon: '📄' },
              { time: '1 hour ago', action: 'Sent follow-up email to InnovateLabs', type: 'followup', icon: '📧' },
              { time: '2 hours ago', action: 'Scheduled interview with DataStream for Friday 2PM', type: 'interview', icon: '📅' },
              { time: '3 hours ago', action: 'Generated custom cover letter for 3 applications', type: 'coverletter', icon: '✍️' },
              { time: 'Yesterday', action: 'AI detected 5 new high-match opportunities', type: 'discovery', icon: '🎯' }
            ]).map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings View */}
      {activeView === 'settings' && (
        <div className="autopilot-view settings-view">
          <h2 className="view-title">⚙️ Autopilot Settings</h2>

          <div className="settings-grid">
            {/* Automation Toggles */}
            <div className="settings-card">
              <h3>🤖 Automation Features</h3>
              <div className="settings-options">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto-Apply to Jobs</label>
                    <p>Automatically submit applications to matched opportunities</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="setting-toggle"
                    checked={settings.autoApply}
                    onChange={(e) => setSettings({...settings, autoApply: e.target.checked})}
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Follow-Up</label>
                    <p>Send intelligent follow-up emails after 5-7 days</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="setting-toggle"
                    checked={settings.autoFollowUp}
                    onChange={(e) => setSettings({...settings, autoFollowUp: e.target.checked})}
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Resume Tailoring</label>
                    <p>AI customizes your resume for each application</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="setting-toggle"
                    checked={settings.autoResumeTailor}
                    onChange={(e) => setSettings({...settings, autoResumeTailor: e.target.checked})}
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Cover Letters</label>
                    <p>Generate personalized cover letters automatically</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="setting-toggle"
                    checked={settings.autoCoverLetter}
                    onChange={(e) => setSettings({...settings, autoCoverLetter: e.target.checked})}
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Interview Scheduling</label>
                    <p>Automatically respond to interview requests</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="setting-toggle"
                    checked={settings.autoSchedule}
                    onChange={(e) => setSettings({...settings, autoSchedule: e.target.checked})}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="settings-card">
              <h3>🎯 Application Preferences</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Max Applications Per Day</label>
                  <input 
                    type="number" 
                    value={settings.maxApplicationsPerDay}
                    onChange={(e) => setSettings({...settings, maxApplicationsPerDay: e.target.value})}
                    className="form-input"
                    min="1"
                    max="20"
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Salary</label>
                  <input 
                    type="number" 
                    value={settings.salaryMin}
                    onChange={(e) => setSettings({...settings, salaryMin: e.target.value})}
                    className="form-input"
                    placeholder="80000"
                  />
                </div>

                <div className="form-group">
                  <label>Work Mode Preference</label>
                  <select 
                    value={settings.workMode}
                    onChange={(e) => setSettings({...settings, workMode: e.target.value})}
                    className="form-select"
                  >
                    <option value="remote">Remote Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="save-settings-btn"
            onClick={() => updateSettings(settings)}
          >
            💾 Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartAutopilot;

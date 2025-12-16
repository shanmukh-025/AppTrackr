import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './CareerNetworkBuilder.css';

const CareerNetworkBuilder = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [networkStats, setNetworkStats] = useState(null);
  const [referralOpportunities, setReferralOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [referralMessage, setReferralMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [recsRes, statsRes, oppsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/network/recommendations', { headers }),
        axios.get('http://localhost:5000/api/network/stats', { headers }),
        axios.get('http://localhost:5000/api/network/referral-opportunities', { headers })
      ]);

      setRecommendations(recsRes.data.recommendations);
      setNetworkStats(statsRes.data);
      setReferralOpportunities(oppsRes.data.opportunities);
    } catch (error) {
      console.error('Error fetching network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReferral = async (contact) => {
    setSelectedContact(contact);
    setShowReferralModal(true);
    setReferralMessage(`Hi ${contact.name.split(' ')[0]},\n\nI noticed you work at ${contact.company} as a ${contact.role}. I'm currently applying for positions there and would greatly appreciate any insights you could share about the company culture and interview process.\n\nWould you be open to a brief chat?\n\nBest regards`);
  };

  const submitReferralRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/network/request-referral', {
        contactId: selectedContact.id,
        message: referralMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Referral request sent successfully!');
      setShowReferralModal(false);
      setSelectedContact(null);
      setReferralMessage('');
    } catch (error) {
      console.error('Error sending referral request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = filterCompany === 'all' || rec.company === filterCompany;
    return matchesSearch && matchesCompany;
  });

  const uniqueCompanies = ['all', ...new Set(recommendations.map(r => r.company))];

  if (loading) {
    return (
      <div className="network-builder">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Building your network insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="network-builder">
      {/* Header */}
      <div className="network-header">
        <div className="network-header-content">
          <div className="network-header-text">
            <div className="network-badge">
              <span className="badge-icon">🤝</span>
              <span>AI-Powered</span>
            </div>
            <h1>Career Network Builder</h1>
            <p>Connect with professionals who can accelerate your career with AI-matched recommendations</p>
          </div>
          <div className="network-stats-summary">
            <div className="stat-item">
              <div className="stat-value">{networkStats?.totalConnections || 0}</div>
              <div className="stat-label">Connections</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{networkStats?.profileViews || 0}</div>
              <div className="stat-label">Profile Views</div>
            </div>
            <div className="stat-item">
              <div className="stat-value growth">{networkStats?.growthRate || '0%'}</div>
              <div className="stat-label">Growth</div>
            </div>
          </div>
        </div>
        <div className="floating-element circle-1"></div>
        <div className="floating-element circle-2"></div>
        <div className="floating-element circle-3"></div>
      </div>

      {/* Tabs */}
      <div className="network-tabs">
        <button 
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <span className="tab-icon">✨</span>
          Recommendations
        </button>
        <button 
          className={`tab-button ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          <span className="tab-icon">🎯</span>
          Referral Opportunities
        </button>
        <button 
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <span className="tab-icon">📊</span>
          Network Insights
        </button>
      </div>

      {/* Content */}
      <div className="network-content">
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="recommendations-section">
            <div className="section-header">
              <h2>AI-Matched Connections</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search by name, company, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select 
                  value={filterCompany} 
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="filter-select"
                >
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>
                      {company === 'all' ? 'All Companies' : company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="recommendations-grid">
              {filteredRecommendations.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-header">
                    <div className="contact-avatar">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="contact-info">
                      <h3>{contact.name}</h3>
                      <p className="contact-role">{contact.role}</p>
                      <p className="contact-company">{contact.company}</p>
                    </div>
                    <div className="match-score" style={{borderColor: getMatchScoreColor(contact.matchScore)}}>
                      <span className="score-value">{contact.matchScore}</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>

                  <div className="contact-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{contact.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{contact.mutualConnections} mutual connections</span>
                    </div>
                    <div className="detail-item reason">
                      <span className="detail-icon">💡</span>
                      <span>{contact.reason}</span>
                    </div>
                  </div>

                  <div className="contact-skills">
                    {contact.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="contact-actions">
                    <button className="connect-button">
                      <span>🤝</span> Connect
                    </button>
                    {contact.canReferral && (
                      <button 
                        className="referral-button"
                        onClick={() => handleRequestReferral(contact)}
                      >
                        <span>💼</span> Request Referral
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referral Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="opportunities-section">
            <div className="section-header">
              <h2>Referral Opportunities</h2>
              <p>People in your network who can refer you to companies you're interested in</p>
            </div>

            <div className="opportunities-list">
              {referralOpportunities.map(opp => (
                <div key={opp.applicationId} className="opportunity-card">
                  <div className="opportunity-header">
                    <div className="opportunity-company">
                      <h3>{opp.company}</h3>
                      <p>{opp.role}</p>
                    </div>
                    <div className="opportunity-stats">
                      <div className="stat">
                        <span className="stat-value">{opp.referrers}</span>
                        <span className="stat-label">Referrers</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{opp.successRate}%</span>
                        <span className="stat-label">Success Rate</span>
                      </div>
                    </div>
                  </div>

                  <div className="top-contact">
                    <div className="contact-avatar small">
                      {opp.topContact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="contact-info">
                      <h4>{opp.topContact.name}</h4>
                      <p>{opp.topContact.role}</p>
                    </div>
                    <div className="match-score small" style={{borderColor: getMatchScoreColor(opp.topContact.matchScore)}}>
                      {opp.topContact.matchScore}%
                    </div>
                    <button 
                      className="action-button"
                      onClick={() => handleRequestReferral({
                        id: `${opp.applicationId}-${opp.topContact.name}`,
                        name: opp.topContact.name,
                        role: opp.topContact.role,
                        company: opp.company
                      })}
                    >
                      Request Referral
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Network Insights Tab */}
        {activeTab === 'insights' && networkStats && (
          <div className="insights-section">
            <div className="section-header">
              <h2>Network Analytics</h2>
              <p>Understand your network composition and growth</p>
            </div>

            <div className="insights-grid">
              <div className="insight-card">
                <h3>Network Distribution</h3>
                <div className="industry-chart">
                  {networkStats.topIndustries.map((industry, idx) => (
                    <div key={idx} className="industry-bar">
                      <div className="industry-label">
                        <span>{industry.name}</span>
                        <span className="industry-count">{industry.count}</span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{
                            width: `${(industry.count / networkStats.totalConnections) * 100}%`,
                            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx % 4]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insight-card">
                <h3>Recent Activity</h3>
                <div className="activity-timeline">
                  {networkStats.recentActivity.map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'connection' && '🤝'}
                        {activity.type === 'referral' && '💼'}
                        {activity.type === 'endorsement' && '⭐'}
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">
                          {activity.type === 'connection' && `Connected with ${activity.name}`}
                          {activity.type === 'referral' && `Received referral from ${activity.name}`}
                          {activity.type === 'endorsement' && `${activity.name} endorsed you for ${activity.skill}`}
                        </p>
                        <span className="activity-date">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insight-card">
                <h3>Network Health</h3>
                <div className="health-metrics">
                  <div className="health-metric">
                    <div className="metric-label">Engagement Rate</div>
                    <div className="metric-value">78%</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '78%', backgroundColor: '#10b981'}}></div>
                    </div>
                  </div>
                  <div className="health-metric">
                    <div className="metric-label">Response Rate</div>
                    <div className="metric-value">85%</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '85%', backgroundColor: '#3b82f6'}}></div>
                    </div>
                  </div>
                  <div className="health-metric">
                    <div className="metric-label">Referral Success</div>
                    <div className="metric-value">62%</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{width: '62%', backgroundColor: '#f59e0b'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Request Modal */}
      {showReferralModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowReferralModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Referral</h2>
              <button className="close-button" onClick={() => setShowReferralModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="contact-summary">
                <div className="contact-avatar">{selectedContact.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <h3>{selectedContact.name}</h3>
                  <p>{selectedContact.role} at {selectedContact.company}</p>
                </div>
              </div>
              <textarea
                value={referralMessage}
                onChange={(e) => setReferralMessage(e.target.value)}
                placeholder="Write your message..."
                rows="8"
                className="message-textarea"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowReferralModal(false)}>
                Cancel
              </button>
              <button className="send-button" onClick={submitReferralRequest}>
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerNetworkBuilder;

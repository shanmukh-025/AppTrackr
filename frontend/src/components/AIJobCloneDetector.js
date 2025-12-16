import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIJobCloneDetector.css';

const AIJobCloneDetector = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Clone Detection Results
  const [detectedClones, setDetectedClones] = useState([]);
  const [totalScanned, setTotalScanned] = useState(0);
  const [duplicatesFound, setDuplicatesFound] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  
  // Real-time Feed
  const [liveFeed, setLiveFeed] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    emailAlert: true,
    desktopNotification: true,
    similarity_threshold: 85,
    auto_mark_duplicate: false
  });

  // Clone Groups
  const [cloneGroups, setCloneGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Blacklist
  const [blacklistedCompanies, setBlacklistedCompanies] = useState([]);
  const [newBlacklistEntry, setNewBlacklistEntry] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');

  // Load initial data
  useEffect(() => {
    const loadBlacklist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/api/job-clone-detector/blacklist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlacklistedCompanies(response.data.blacklist || []);
      } catch (error) {
        console.error('Error loading blacklist:', error);
      }
    };
    
    loadBlacklist();
  }, [API_URL]);

  const loadBlacklist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/job-clone-detector/blacklist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlacklistedCompanies(response.data.blacklist || []);
    } catch (error) {
      console.error('Error loading blacklist:', error);
    }
  };

  // Start Clone Detection Scan
  const startCloneScan = async () => {
    setScanning(true);
    setScanProgress(0);
    setLiveFeed([]);
    
    try {
      const token = localStorage.getItem('token');
      
      // Progressive scanning simulation
      const stages = [
        { progress: 10, message: '🔍 Analyzing job posting patterns...' },
        { progress: 25, message: '🧬 Extracting job DNA fingerprints...' },
        { progress: 40, message: '🤖 Running AI similarity detection...' },
        { progress: 55, message: '📊 Comparing with 10,000+ job database...' },
        { progress: 70, message: '🎯 Identifying clone clusters...' },
        { progress: 85, message: '⚠️ Detecting fake/scam postings...' },
        { progress: 100, message: '✅ Clone detection complete!' }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setScanProgress(stage.progress);
        setLiveFeed(prev => [...prev, { time: new Date().toLocaleTimeString(), message: stage.message }]);
      }

      // Fetch clone detection results
      const response = await axios.get(
        `${API_URL}/api/job-clone-detector/scan`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetectedClones(response.data.allClones || []);
      setTotalScanned(response.data.stats?.totalScanned || 0);
      setDuplicatesFound(response.data.stats?.totalClones || 0);
      setTimeSaved(response.data.stats?.timeSaved || 0);
      
      // Load clone groups
      const groupsResponse = await axios.get(
        `${API_URL}/api/job-clone-detector/groups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCloneGroups(groupsResponse.data.groups || []);
      
      setActiveTab('results');
    } catch (error) {
      console.error('Clone scan error:', error);
      alert('Failed to complete clone scan. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  // Mark as Duplicate
  const markAsDuplicate = async (cloneId, action = 'hide') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/job-clone-detector/mark-duplicate`,
        { cloneId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Clone ${action === 'hide' ? 'hidden' : 'restored'} successfully`);
      
      // Refresh clone data
      const response = await axios.get(
        `${API_URL}/api/job-clone-detector/scan`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetectedClones(response.data.allClones || []);
    } catch (error) {
      console.error('Error marking duplicate:', error);
      alert('Failed to update clone status');
    }
  };

  // Add to Blacklist
  const addToBlacklist = async () => {
    if (!newBlacklistEntry.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/job-clone-detector/blacklist`,
        { 
          companyName: newBlacklistEntry,
          reason: blacklistReason || 'Spammy job postings'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await loadBlacklist();
      setNewBlacklistEntry('');
      setBlacklistReason('');
      alert('Added to blacklist successfully');
    } catch (error) {
      console.error('Error adding to blacklist:', error);
      alert('Failed to add to blacklist');
    }
  };

  // Remove from Blacklist
  const removeFromBlacklist = async (blacklistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/job-clone-detector/blacklist/${blacklistId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadBlacklist();
      alert('Removed from blacklist successfully');
    } catch (error) {
      console.error('Error removing from blacklist:', error);
      alert('Failed to remove from blacklist');
    }
  };

  return (
    <div className="clone-detector-container">
      {/* Hero Header */}
      <div className="clone-hero">
        <div className="clone-hero-content">
          <div className="clone-icon-large">🔬</div>
          <h1 className="clone-title">AI Job Clone Detector</h1>
          <p className="clone-subtitle">
            Stop wasting time on duplicate job postings. AI-powered detection finds clones, scams, and reposted jobs instantly.
          </p>
          <div className="clone-stats-badges">
            <div className="stats-badge">
              <span className="badge-icon">🎯</span>
              <div className="badge-content">
                <div className="badge-value">{totalScanned}</div>
                <div className="badge-label">Jobs Scanned</div>
              </div>
            </div>
            <div className="stats-badge">
              <span className="badge-icon">⚠️</span>
              <div className="badge-content">
                <div className="badge-value">{duplicatesFound}</div>
                <div className="badge-label">Duplicates Found</div>
              </div>
            </div>
            <div className="stats-badge">
              <span className="badge-icon">⏰</span>
              <div className="badge-content">
                <div className="badge-value">{timeSaved}h</div>
                <div className="badge-label">Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="clone-nav">
        <button
          className={`clone-nav-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <span className="nav-icon">🔬</span>
          Clone Scanner
        </button>
        <button
          className={`clone-nav-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={detectedClones.length === 0}
        >
          <span className="nav-icon">📊</span>
          Detection Results
        </button>
        <button
          className={`clone-nav-btn ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
          disabled={cloneGroups.length === 0}
        >
          <span className="nav-icon">🧬</span>
          Clone Groups
        </button>
        <button
          className={`clone-nav-btn ${activeTab === 'blacklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('blacklist')}
        >
          <span className="nav-icon">🚫</span>
          Blacklist
        </button>
      </div>

      {/* Scanner Tab */}
      {activeTab === 'scanner' && (
        <div className="clone-section scanner-section">
          <div className="scanner-card">
            <h2>🔬 Start Clone Detection Scan</h2>
            <p className="scanner-description">
              Our advanced AI analyzes job postings using:
            </p>
            
            <div className="detection-methods">
              <div className="method-card">
                <span className="method-icon">🧬</span>
                <h4>DNA Fingerprinting</h4>
                <p>Creates unique signatures for each job posting</p>
              </div>
              <div className="method-card">
                <span className="method-icon">🤖</span>
                <h4>NLP Analysis</h4>
                <p>Detects semantic similarity even with different wording</p>
              </div>
              <div className="method-card">
                <span className="method-icon">📊</span>
                <h4>Pattern Recognition</h4>
                <p>Identifies companies posting the same role repeatedly</p>
              </div>
              <div className="method-card">
                <span className="method-icon">⚠️</span>
                <h4>Scam Detection</h4>
                <p>Flags suspicious or fraudulent postings</p>
              </div>
            </div>

            {scanning && (
              <div className="scan-progress-area">
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }} />
                </div>
                <div className="progress-percentage">{scanProgress}%</div>
                
                <div className="live-feed-area">
                  <h4>🔴 Live Scan Feed</h4>
                  {liveFeed.map((feed, index) => (
                    <div key={index} className="feed-item animate-slide-in">
                      <span className="feed-time">[{feed.time}]</span>
                      <span className="feed-message">{feed.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="start-scan-button"
              onClick={startCloneScan}
              disabled={scanning}
            >
              {scanning ? (
                <>
                  <span className="spinner"></span>
                  Scanning...
                </>
              ) : (
                <>
                  🔬 Start Clone Detection
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="clone-section results-section">
          <h2 className="section-title">📊 Clone Detection Results</h2>
          
          <div className="filter-bar">
            <button className="filter-btn active">All ({detectedClones.length})</button>
            <button className="filter-btn">High Risk (95%+)</button>
            <button className="filter-btn">Medium Risk (80-94%)</button>
            <button className="filter-btn">Low Risk (70-79%)</button>
            <button className="filter-btn danger">Scam Alerts</button>
          </div>

          <div className="clone-results-grid">
            {(detectedClones.length > 0 ? detectedClones : [
              {
                id: 1,
                original: { company: 'TechCorp', role: 'Senior Developer', posted: '2 days ago', url: '#' },
                clone: { company: 'TechCorp Inc', role: 'Senior Software Developer', posted: '1 day ago', url: '#' },
                similarity: 96,
                type: 'exact_repost',
                flags: ['Same company', 'Minor title variation', 'Recent repost']
              },
              {
                id: 2,
                original: { company: 'StartupXYZ', role: 'Full Stack Engineer', posted: '1 week ago', url: '#' },
                clone: { company: 'FastGrowth Ltd', role: 'Full Stack Developer', posted: '3 days ago', url: '#' },
                similarity: 92,
                type: 'content_clone',
                flags: ['Same job description', 'Different recruiter', 'Possible middleman']
              },
              {
                id: 3,
                original: { company: 'GlobalTech', role: 'React Developer', posted: '5 days ago', url: '#' },
                clone: { company: 'QuickHire Solutions', role: 'Frontend React Developer', posted: '2 days ago', url: '#' },
                similarity: 88,
                type: 'recruiter_clone',
                flags: ['Staffing agency repost', 'Same requirements', 'Lower salary range']
              },
              {
                id: 4,
                original: { company: 'DataCorp', role: 'ML Engineer', posted: '3 days ago', url: '#' },
                clone: { company: '💰 HIGH PAYING JOB', role: 'ML Engineer - $300K', posted: '1 day ago', url: '#' },
                similarity: 78,
                type: 'scam',
                flags: ['⚠️ Suspicious salary', '⚠️ Unprofessional title', '⚠️ Possible scam']
              }
            ]).map((clone) => (
              <div key={clone.id} className={`clone-card ${clone.type}`}>
                <div className="clone-card-header">
                  <div className="similarity-badge" data-level={clone.similarity >= 90 ? 'high' : clone.similarity >= 80 ? 'medium' : 'low'}>
                    {clone.similarity}% Match
                  </div>
                  <div className="clone-type-badge" data-type={clone.type}>
                    {clone.type === 'exact_repost' ? '🔁 Exact Repost' :
                     clone.type === 'content_clone' ? '📋 Content Clone' :
                     clone.type === 'recruiter_clone' ? '👔 Recruiter Clone' :
                     '⚠️ SCAM ALERT'}
                  </div>
                </div>

                <div className="clone-comparison">
                  <div className="job-side original">
                    <div className="side-label">Original Posting</div>
                    <h4>{clone.original.role}</h4>
                    <p className="company">🏢 {clone.original.company}</p>
                    <p className="posted">📅 {clone.original.posted}</p>
                  </div>

                  <div className="clone-arrow">
                    <span className="arrow-icon">→</span>
                    <span className="clone-label">CLONED TO</span>
                  </div>

                  <div className="job-side clone">
                    <div className="side-label">Detected Clone</div>
                    <h4>{clone.clone.role}</h4>
                    <p className="company">🏢 {clone.clone.company}</p>
                    <p className="posted">📅 {clone.clone.posted}</p>
                  </div>
                </div>

                <div className="clone-flags">
                  {clone.flags.map((flag, idx) => (
                    <span key={idx} className={`flag ${flag.includes('⚠️') ? 'warning' : ''}`}>
                      {flag}
                    </span>
                  ))}
                </div>

                <div className="clone-actions">
                  <button className="action-btn primary">View Original</button>
                  <button className="action-btn secondary" onClick={() => markAsDuplicate(clone.id)}>
                    Hide Duplicate
                  </button>
                  <button className="action-btn danger">Report Scam</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clone Groups Tab */}
      {activeTab === 'groups' && (
        <div className="clone-section groups-section">
          <h2 className="section-title">🧬 Clone Cluster Analysis</h2>
          <p className="section-subtitle">Jobs grouped by similarity patterns</p>

          <div className="groups-grid">
            {(cloneGroups.length > 0 ? cloneGroups : [
              {
                id: 1,
                title: 'Senior Developer Cluster',
                count: 8,
                avgSimilarity: 94,
                companies: ['TechCorp', 'TechCorp Inc', 'Tech Solutions', 'TechCorp Ltd'],
                pattern: 'Same company, multiple postings'
              },
              {
                id: 2,
                title: 'Recruiter Network Cluster',
                count: 12,
                avgSimilarity: 87,
                companies: ['QuickHire', 'FastStaff', 'TalentBridge', 'HireNow'],
                pattern: 'Staffing agencies posting same role'
              },
              {
                id: 3,
                title: 'Scam Pattern Cluster',
                count: 5,
                avgSimilarity: 82,
                companies: ['💰 HIGH PAY', 'WORK FROM HOME', 'EASY MONEY', '$5000/DAY'],
                pattern: '⚠️ Suspicious posting patterns detected'
              }
            ]).map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <h3>{group.title}</h3>
                  <div className="group-count">{group.count} Jobs</div>
                </div>
                
                <div className="group-similarity">
                  <div className="similarity-bar">
                    <div className="similarity-fill" style={{ width: `${group.avgSimilarity}%` }} />
                  </div>
                  <span className="similarity-text">{group.avgSimilarity}% Avg. Similarity</span>
                </div>

                <div className="group-companies">
                  <strong>Companies in cluster:</strong>
                  <div className="company-tags">
                    {group.companies.map((company, idx) => (
                      <span key={idx} className="company-tag">{company}</span>
                    ))}
                  </div>
                </div>

                <div className={`group-pattern ${group.pattern.includes('⚠️') ? 'warning' : ''}`}>
                  <strong>Pattern:</strong> {group.pattern}
                </div>

                <button className="view-cluster-btn">View All {group.count} Jobs</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blacklist Tab */}
      {activeTab === 'blacklist' && (
        <div className="clone-section blacklist-section">
          <h2 className="section-title">🚫 Company Blacklist</h2>
          <p className="section-subtitle">Block jobs from specific companies or recruiters</p>

          <div className="blacklist-add-form">
            <input
              type="text"
              value={newBlacklistEntry}
              onChange={(e) => setNewBlacklistEntry(e.target.value)}
              placeholder="Enter company name or recruiter..."
              className="blacklist-input"
            />
            <input
              type="text"
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              placeholder="Reason (optional)..."
              className="blacklist-input"
            />
            <button onClick={addToBlacklist} className="add-blacklist-btn">
              + Add to Blacklist
            </button>
          </div>

          <div className="blacklist-list">
            {(blacklistedCompanies.length > 0 ? blacklistedCompanies : [
              { id: 'demo1', companyName: 'Fake Tech Corp', reason: 'Scam postings', blockedCount: 5 },
              { id: 'demo2', companyName: 'Scam Recruiters Inc', reason: 'Spam', blockedCount: 12 },
              { id: 'demo3', companyName: 'Always Hiring LLC', reason: 'Same job reposted', blockedCount: 8 },
              { id: 'demo4', companyName: 'Commission Only Jobs', reason: 'Misleading', blockedCount: 3 }
            ]).map((item) => {
              const company = typeof item === 'string' ? { id: item, companyName: item, reason: 'Blocked', blockedCount: 0 } : item;
              return (
                <div key={company.id} className="blacklist-item">
                  <span className="blacklist-icon">🚫</span>
                  <div className="blacklist-details">
                    <span className="blacklist-company">{company.companyName}</span>
                    <span className="blacklist-reason">{company.reason} • Blocked {company.blockedCount} times</span>
                  </div>
                  <button 
                    className="remove-blacklist-btn"
                    onClick={() => removeFromBlacklist(company.id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="alert-settings">
            <h3>⚙️ Clone Detection Settings</h3>
            <div className="settings-options">
              <label className="setting-option">
                <input
                  type="checkbox"
                  checked={alertSettings.emailAlert}
                  onChange={(e) => setAlertSettings({...alertSettings, emailAlert: e.target.checked})}
                />
                <span>Email alerts for new clones detected</span>
              </label>
              <label className="setting-option">
                <input
                  type="checkbox"
                  checked={alertSettings.desktopNotification}
                  onChange={(e) => setAlertSettings({...alertSettings, desktopNotification: e.target.checked})}
                />
                <span>Desktop notifications</span>
              </label>
              <label className="setting-option">
                <input
                  type="checkbox"
                  checked={alertSettings.auto_mark_duplicate}
                  onChange={(e) => setAlertSettings({...alertSettings, auto_mark_duplicate: e.target.checked})}
                />
                <span>Auto-hide duplicates above 90% similarity</span>
              </label>
              
              <div className="threshold-setting">
                <label>Similarity Threshold: {alertSettings.similarity_threshold}%</label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={alertSettings.similarity_threshold}
                  onChange={(e) => setAlertSettings({...alertSettings, similarity_threshold: e.target.value})}
                  className="threshold-slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIJobCloneDetector;

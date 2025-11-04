import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Resources.css';

const Resources = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('resume-builder');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Resume State
  const [resumeTemplates, setResumeTemplates] = useState({});
  const [selectedResumeTemplate, setSelectedResumeTemplate] = useState('technical_junior');

  // Cover Letter State
  const [coverLetterTemplates, setCoverLetterTemplates] = useState({});
  const [selectedCoverLetter, setSelectedCoverLetter] = useState('entry_level');
  
  // DSA Problems State
  const [allDsaProblems, setAllDsaProblems] = useState([]);
  const [dsaDifficulty, setDsaDifficulty] = useState('all');
  const [dsaTopic, setDsaTopic] = useState('all');
  
  // System Design State
  const [allSystemDesign, setAllSystemDesign] = useState([]);
  const [sdDifficulty, setSdDifficulty] = useState('all');

  // Behavioral State
  const [allBehavioral, setAllBehavioral] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Fetch all data on mount
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [
        resumeRes,
        clRes,
        dsaRes,
        systemDesignRes,
        behavioralRes
      ] = await Promise.all([
        axios.get(`${API_URL}/api/resources/resume-templates`, { headers }),
        axios.get(`${API_URL}/api/resources/cover-letter-templates`, { headers }),
        axios.get(`${API_URL}/api/resources/dsa-problems`, { headers }),
        axios.get(`${API_URL}/api/resources/system-design`, { headers }),
        axios.get(`${API_URL}/api/resources/behavioral-questions`, { headers })
      ]);

      setResumeTemplates(resumeRes.data.data);
      setCoverLetterTemplates(clRes.data.data);
      setAllDsaProblems(dsaRes.data.data);
      setAllSystemDesign(systemDesignRes.data.data);
      setAllBehavioral(behavioralRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  const downloadAsFile = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredDSA = allDsaProblems.filter(p => {
    if (dsaDifficulty !== 'all' && p.difficulty !== dsaDifficulty) return false;
    if (dsaTopic !== 'all' && !p.topics.includes(dsaTopic)) return false;
    return true;
  });

  const filteredSD = allSystemDesign.filter(p => {
    if (sdDifficulty !== 'all' && p.difficulty !== sdDifficulty) return false;
    return true;
  });

  const getUniqueDSATopics = () => {
    const topics = new Set();
    allDsaProblems.forEach(p => {
      p.topics?.forEach(t => topics.add(t));
    });
    return Array.from(topics).sort();
  };

  if (loading && Object.keys(resumeTemplates).length === 0) {
    return (
      <div className="page-container">
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Loading Resources Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container resources-page">
      <div className="page-header">
        <div>
          <h1>🎯 Resources Hub</h1>
          <p>Ready-to-use templates, interview prep, DSA & system design questions</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* TAB NAVIGATION */}
      <div className="resource-tabs">
        <button
          className={`tab-btn ${activeTab === 'resume-builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume-builder')}
        >
          📄 Resume
        </button>
        <button
          className={`tab-btn ${activeTab === 'cover-letter' ? 'active' : ''}`}
          onClick={() => setActiveTab('cover-letter')}
        >
          ✉️ Cover Letter
        </button>
        <button
          className={`tab-btn ${activeTab === 'interview-prep' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview-prep')}
        >
          💼 Interview Questions
        </button>
        <button
          className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavioral')}
        >
          🎤 Behavioral
        </button>
        <button
          className={`tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
          onClick={() => setActiveTab('dsa')}
        >
          💻 DSA
        </button>
        <button
          className={`tab-btn ${activeTab === 'system-design' ? 'active' : ''}`}
          onClick={() => setActiveTab('system-design')}
        >
          🏗️ System Design
        </button>
      </div>

      {/* RESUME BUILDER TAB */}
      {activeTab === 'resume-builder' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>📄 Resume Templates - Customizable & Ready-to-Use</h2>
            <p>Select your role and experience level</p>
          </div>

          <div className="template-grid">
            {Object.entries(resumeTemplates).map(([key, template]) => (
              <button
                key={key}
                className={`template-card ${selectedResumeTemplate === key ? 'selected' : ''}`}
                onClick={() => setSelectedResumeTemplate(key)}
              >
                <h3>{template.name}</h3>
                <p className="industry">{template.industry}</p>
                <p className="description">{template.description}</p>
              </button>
            ))}
          </div>

          {selectedResumeTemplate && resumeTemplates[selectedResumeTemplate] && (
            <div className="template-preview-container">
              <div className="preview-header">
                <h3>{resumeTemplates[selectedResumeTemplate].name}</h3>
                <div className="action-buttons">
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(resumeTemplates[selectedResumeTemplate].template)}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="btn-download"
                    onClick={() => downloadAsFile(
                      `resume-${selectedResumeTemplate}.txt`,
                      resumeTemplates[selectedResumeTemplate].template
                    )}
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
              <pre className="template-preview">{resumeTemplates[selectedResumeTemplate].template}</pre>
            </div>
          )}
        </div>
      )}

      {/* COVER LETTER TAB */}
      {activeTab === 'cover-letter' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>✉️ Cover Letter Templates - Customizable</h2>
            <p>Multiple templates for different situations</p>
          </div>

          <div className="template-grid">
            {Object.entries(coverLetterTemplates).map(([key, template]) => (
              <button
                key={key}
                className={`template-card ${selectedCoverLetter === key ? 'selected' : ''}`}
                onClick={() => setSelectedCoverLetter(key)}
              >
                <h3>{template.name}</h3>
                <p className="description">{template.description}</p>
              </button>
            ))}
          </div>

          {selectedCoverLetter && coverLetterTemplates[selectedCoverLetter] && (
            <div className="template-preview-container">
              <div className="preview-header">
                <h3>{coverLetterTemplates[selectedCoverLetter].name}</h3>
                <div className="action-buttons">
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(coverLetterTemplates[selectedCoverLetter].template)}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="btn-download"
                    onClick={() => downloadAsFile(
                      `cover-letter-${selectedCoverLetter}.txt`,
                      coverLetterTemplates[selectedCoverLetter].template
                    )}
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
              <pre className="template-preview">{coverLetterTemplates[selectedCoverLetter].template}</pre>
            </div>
          )}
        </div>
      )}

      {/* INTERVIEW PREP TAB */}
      {activeTab === 'interview-prep' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>💼 Interview Preparation Resources</h2>
            <p>Browse different types of interview questions below</p>
          </div>

          <div className="interview-info-box">
            <h3>🎯 Available Interview Resources</h3>
            <div className="resources-grid-simple">
              <div className="resource-card-simple">
                <div className="resource-icon">🎤</div>
                <h4>Behavioral Questions</h4>
                <p>STAR method, leadership, teamwork questions</p>
                <button className="btn-navigate" onClick={() => setActiveTab('behavioral')}>
                  View Behavioral →
                </button>
              </div>
              <div className="resource-card-simple">
                <div className="resource-icon">💻</div>
                <h4>DSA Problems</h4>
                <p>Data structures and algorithms practice</p>
                <button className="btn-navigate" onClick={() => setActiveTab('dsa')}>
                  View DSA →
                </button>
              </div>
              <div className="resource-card-simple">
                <div className="resource-icon">🏗️</div>
                <h4>System Design</h4>
                <p>Scalability, architecture, design patterns</p>
                <button className="btn-navigate" onClick={() => setActiveTab('system-design')}>
                  View System Design →
                </button>
              </div>
            </div>

            <div className="ai-assistant-promo">
              <h4>🤖 Want Company-Specific Questions?</h4>
              <p>Use our AI Assistant to generate custom interview questions tailored to specific companies and roles!</p>
              <button className="btn-primary" onClick={() => window.location.href = '/ai-features'}>
                Go to AI Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEHAVIORAL TAB */}
      {activeTab === 'behavioral' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>🎤 Behavioral Questions - {allBehavioral.length} Questions</h2>
            <p>Master behavioral and cultural fit interviews</p>
          </div>

          <div className="behavioral-list">
            {allBehavioral.map(bq => (
              <div key={bq.id} className="behavioral-card">
                <div
                  className="behavioral-header"
                  onClick={() => setExpandedQuestion(expandedQuestion === bq.id ? null : bq.id)}
                >
                  <div className="question-content">
                    <h4>{bq.question}</h4>
                    <div className="question-meta">
                      <span className={`difficulty-badge ${bq.difficulty}`}>{bq.difficulty}</span>
                      <span className="category">{bq.category}</span>
                    </div>
                  </div>
                  <span className="expand-icon">{expandedQuestion === bq.id ? '−' : '+'}</span>
                </div>

                {expandedQuestion === bq.id && (
                  <div className="behavioral-body">
                    <div className="tips">
                      <strong>💡 Tips:</strong>
                      <p>{bq.tips}</p>
                    </div>
                    <div className="sample-answer">
                      <strong>📝 Sample Answer:</strong>
                      <p>{bq.sample_answer}</p>
                      <button className="btn-small" onClick={() => copyToClipboard(bq.sample_answer)}>
                        📋 Copy Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DSA TAB */}
      {activeTab === 'dsa' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>💻 DSA Problems - {filteredDSA.length} Questions</h2>
            <p>Practice data structures and algorithms</p>
          </div>

          <div className="filter-row">
            <div className="filter-section">
              <label>Difficulty:</label>
              <select value={dsaDifficulty} onChange={(e) => setDsaDifficulty(e.target.value)} className="filter-select">
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="filter-section">
              <label>Topic:</label>
              <select value={dsaTopic} onChange={(e) => setDsaTopic(e.target.value)} className="filter-select">
                <option value="all">All Topics</option>
                {getUniqueDSATopics().map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="problems-list">
            {filteredDSA.map(problem => (
              <div key={problem.id} className="problem-card">
                <div className="problem-header">
                  <h4>{problem.id}. {problem.title}</h4>
                  <div className="problem-badges">
                    <span className={`difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
                  </div>
                </div>
                <p className="platform">{problem.platform}</p>
                <div className="topics">
                  {problem.topics?.map(t => (
                    <span key={t} className="topic-badge">{t}</span>
                  ))}
                </div>
                <a href={problem.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                  → View on LeetCode
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM DESIGN TAB */}
      {activeTab === 'system-design' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>🏗️ System Design - {filteredSD.length} Questions</h2>
            <p>Master system design interviews</p>
          </div>

          <div className="filter-section">
            <label>Difficulty:</label>
            <select value={sdDifficulty} onChange={(e) => setSdDifficulty(e.target.value)} className="filter-select">
              <option value="all">All Levels</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="sd-grid">
            {filteredSD.map(design => (
              <div key={design.id} className="design-card">
                <div className="design-header">
                  <h3>{design.title}</h3>
                  <span className={`difficulty ${design.difficulty}`}>{design.difficulty}</span>
                </div>
                <p className="time">⏱️ {design.estimatedTime}</p>
                <div className="topics">
                  {design.topics.map(t => (
                    <span key={t} className="topic-badge">{t}</span>
                  ))}
                </div>
                <div className="companies">
                  {design.companies.map(c => (
                    <span key={c} className="company-badge">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;

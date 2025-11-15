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
      <div className="resources-page">
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Loading Resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resources & Templates</h1>
        <p>Explore templates, interview prep, and practice resources</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* TAB NAVIGATION */}
      <div className="resources-tabs-container">
        <div className="resources-tabs">
          <button
            className={`tab-btn ${activeTab === 'resume-builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume-builder')}
          >
            Resume
          </button>
          <button
            className={`tab-btn ${activeTab === 'cover-letter' ? 'active' : ''}`}
            onClick={() => setActiveTab('cover-letter')}
          >
            Cover Letter
          </button>
          <button
            className={`tab-btn ${activeTab === 'interview-prep' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview-prep')}
          >
            Interview Prep
          </button>
          <button
            className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavioral')}
          >
            Behavioral
          </button>
          <button
            className={`tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => setActiveTab('dsa')}
          >
            DSA
          </button>
          <button
            className={`tab-btn ${activeTab === 'system-design' ? 'active' : ''}`}
            onClick={() => setActiveTab('system-design')}
          >
            System Design
          </button>
        </div>
      </div>

      {/* RESUME BUILDER TAB */}
      {activeTab === 'resume-builder' && (
        <div className="tab-content">
          <h2>Resume Templates</h2>
          <p className="section-subtitle">Select a template to customize and download</p>

          <div className="template-grid">
            {Object.entries(resumeTemplates).map(([key, template]) => (
              <button
                key={key}
                className={`template-card ${selectedResumeTemplate === key ? 'selected' : ''}`}
                onClick={() => setSelectedResumeTemplate(key)}
              >
                <div className="template-icon">📄</div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </button>
            ))}
          </div>

          {selectedResumeTemplate && resumeTemplates[selectedResumeTemplate] && (
            <div className="template-preview-container">
              <div className="preview-header">
                <h3>{resumeTemplates[selectedResumeTemplate].name}</h3>
                <div className="action-buttons">
                  <button
                    className="btn-secondary"
                    onClick={() => copyToClipboard(resumeTemplates[selectedResumeTemplate].template)}
                  >
                    Copy
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => downloadAsFile(
                      `resume-${selectedResumeTemplate}.txt`,
                      resumeTemplates[selectedResumeTemplate].template
                    )}
                  >
                    Download
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
          <h2>Cover Letter Templates</h2>
          <p className="section-subtitle">Choose a template and customize it</p>

          <div className="template-grid">
            {Object.entries(coverLetterTemplates).map(([key, template]) => (
              <button
                key={key}
                className={`template-card ${selectedCoverLetter === key ? 'selected' : ''}`}
                onClick={() => setSelectedCoverLetter(key)}
              >
                <div className="template-icon">✉️</div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </button>
            ))}
          </div>

          {selectedCoverLetter && coverLetterTemplates[selectedCoverLetter] && (
            <div className="template-preview-container">
              <div className="preview-header">
                <h3>{coverLetterTemplates[selectedCoverLetter].name}</h3>
                <div className="action-buttons">
                  <button
                    className="btn-secondary"
                    onClick={() => copyToClipboard(coverLetterTemplates[selectedCoverLetter].template)}
                  >
                    Copy
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => downloadAsFile(
                      `cover-letter-${selectedCoverLetter}.txt`,
                      coverLetterTemplates[selectedCoverLetter].template
                    )}
                  >
                    Download
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
          <h2>Interview Preparation</h2>
          <p className="section-subtitle">Browse different types of interview resources</p>

          <div className="interview-cards-grid">
            <div className="interview-card">
              <div className="card-icon">💬</div>
              <h3>Behavioral Questions</h3>
              <p>Master STAR method, leadership, and teamwork questions</p>
              <button className="btn-link" onClick={() => setActiveTab('behavioral')}>
                View Questions →
              </button>
            </div>
            <div className="interview-card">
              <div className="card-icon">💻</div>
              <h3>DSA Problems</h3>
              <p>Practice data structures and algorithms</p>
              <button className="btn-link" onClick={() => setActiveTab('dsa')}>
                View Problems →
              </button>
            </div>
            <div className="interview-card">
              <div className="card-icon">🏗️</div>
              <h3>System Design</h3>
              <p>Learn scalability, architecture, and design patterns</p>
              <button className="btn-link" onClick={() => setActiveTab('system-design')}>
                View Topics →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEHAVIORAL TAB */}
      {activeTab === 'behavioral' && (
        <div className="tab-content">
          <h2>Behavioral Questions</h2>
          <p className="section-subtitle">{allBehavioral.length} questions to help you prepare</p>

          <div className="questions-list">
            {allBehavioral.map(bq => (
              <div key={bq.id} className="question-item">
                <div
                  className="question-header"
                  onClick={() => setExpandedQuestion(expandedQuestion === bq.id ? null : bq.id)}
                >
                  <div className="question-title">
                    <span className="expand-icon">{expandedQuestion === bq.id ? '▼' : '▶'}</span>
                    <h3>{bq.question}</h3>
                  </div>
                  <div className="question-meta">
                    <span className="category-badge">{bq.category}</span>
                  </div>
                </div>

                {expandedQuestion === bq.id && (
                  <div className="question-content">
                    <div className="tips-section">
                      <h4>Tips</h4>
                      <p>{bq.tips}</p>
                    </div>
                    <div className="answer-section">
                      <h4>Sample Answer</h4>
                      <p>{bq.sample_answer}</p>
                      <button className="btn-secondary" onClick={() => copyToClipboard(bq.sample_answer)}>
                        Copy Answer
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
          <h2>DSA Problems</h2>
          <p className="section-subtitle">{filteredDSA.length} problems found</p>

          <div className="filters">
            <div className="filter-group">
              <label>Difficulty</label>
              <select value={dsaDifficulty} onChange={(e) => setDsaDifficulty(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Topic</label>
              <select value={dsaTopic} onChange={(e) => setDsaTopic(e.target.value)}>
                <option value="all">All Topics</option>
                {getUniqueDSATopics().map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="problems-list">
            {filteredDSA.map(problem => (
              <div key={problem.id} className="problem-item">
                <div className="problem-info">
                  <h3>{problem.title}</h3>
                  <p className="problem-platform">{problem.platform}</p>
                </div>
                <div className="problem-tags">
                  {problem.topics?.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  <span className={`difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
                </div>
                <a href={problem.link} target="_blank" rel="noopener noreferrer" className="btn-link">
                  View on LeetCode →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM DESIGN TAB */}
      {activeTab === 'system-design' && (
        <div className="tab-content">
          <h2>System Design</h2>
          <p className="section-subtitle">{filteredSD.length} topics to learn</p>

          <div className="filters">
            <div className="filter-group">
              <label>Difficulty</label>
              <select value={sdDifficulty} onChange={(e) => setSdDifficulty(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="sd-grid">
            {filteredSD.map(design => (
              <div key={design.id} className="design-item">
                <h3>{design.title}</h3>
                <p className="time">⏱️ {design.estimatedTime}</p>
                <div className="tags">
                  {design.topics.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  {design.companies.map(c => (
                    <span key={c} className="company">{c}</span>
                  ))}
                  <span className={`difficulty ${design.difficulty}`}>{design.difficulty}</span>
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

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AICareerDNA from '../components/AICareerDNA';
import SmartAutopilot from '../components/SmartAutopilot';
import DSATracker from '../components/DSATracker';
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

  // AI Learning Path State
  const [targetRole, setTargetRole] = useState('');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [timeCommitment, setTimeCommitment] = useState('10');
  const [learningPath, setLearningPath] = useState(null);
  const [generatingPath, setGeneratingPath] = useState(false);

  // Video Library State
  const [videoCategory, setVideoCategory] = useState('all');
  const [videoSearch, setVideoSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Coding Playground State
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeInput, setCodeInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [runningCode, setRunningCode] = useState(false);

  // Peer Review State
  const [reviewType, setReviewType] = useState('resume');
  const [mySubmissions, setMySubmissions] = useState([]);
  const [availableReviews, setAvailableReviews] = useState([]);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        behavioralRes,
        videosRes
      ] = await Promise.all([
        axios.get(`${API_URL}/api/resources/resume-templates`, { headers }),
        axios.get(`${API_URL}/api/resources/cover-letter-templates`, { headers }),
        axios.get(`${API_URL}/api/resources/dsa-problems`, { headers }),
        axios.get(`${API_URL}/api/resources/system-design`, { headers }),
        axios.get(`${API_URL}/api/resources/behavioral-questions`, { headers }),
        axios.get(`${API_URL}/api/resources/video-library`, { headers })
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

  // Generate AI Learning Path
  const generateLearningPath = async () => {
    if (!targetRole.trim()) {
      alert('Please enter a target role');
      return;
    }

    setGeneratingPath(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/resources/generate-learning-path`,
        { targetRole, currentLevel, timeCommitment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLearningPath(response.data);
    } catch (error) {
      console.error('Error generating learning path:', error);
      alert('Failed to generate learning path');
    } finally {
      setGeneratingPath(false);
    }
  };

  // Get filtered videos
  const getFilteredVideos = () => {
    if (!window.videoLibrary) return [];
    
    let filtered = window.videoLibrary;
    
    if (videoCategory !== 'all') {
      filtered = filtered.filter(v => v.category === videoCategory);
    }
    
    if (videoSearch.trim()) {
      const search = videoSearch.toLowerCase();
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search) ||
        v.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return filtered;
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
            className={`tab-btn ${activeTab === 'learning-path' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning-path')}
          >
            📚 Learning Path
          </button>
          <button
            className={`tab-btn ${activeTab === 'video-library' ? 'active' : ''}`}
            onClick={() => setActiveTab('video-library')}
          >
            🎥 Video Library
          </button>
          <button
            className={`tab-btn ${activeTab === 'dsa-tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('dsa-tracker')}
          >
            📝 DSA Sheets
          </button>
          <button
            className={`tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => setActiveTab('dsa')}
          >
            DSA Problems
          </button>
          <button
            className={`tab-btn ${activeTab === 'system-design' ? 'active' : ''}`}
            onClick={() => setActiveTab('system-design')}
          >
            System Design
          </button>
          <button
            className={`tab-btn ${activeTab === 'coding-playground' ? 'active' : ''}`}
            onClick={() => setActiveTab('coding-playground')}
          >
            🎮 Playground
          </button>
          <button
            className={`tab-btn ${activeTab === 'peer-review' ? 'active' : ''}`}
            onClick={() => setActiveTab('peer-review')}
          >
            🤝 Peer Review
          </button>
          <button
            className={`tab-btn ${activeTab === 'career-dna' ? 'active' : ''}`}
            onClick={() => setActiveTab('career-dna')}
          >
            🧬 Career DNA
          </button>
          <button
            className={`tab-btn ${activeTab === 'autopilot' ? 'active' : ''}`}
            onClick={() => setActiveTab('autopilot')}
          >
            🤖 Smart Autopilot
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

      {/* DSA TRACKER TAB */}
      {activeTab === 'dsa-tracker' && (
        <div className="dsa-tracker-wrapper">
          <DSATracker />
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

      {/* AI LEARNING PATH TAB */}
      {activeTab === 'learning-path' && (
        <div className="tab-content">
          <div className="learning-path-section">
            {!learningPath ? (
              <div className="learning-path-generator">
                <div className="generator-header">
                  <h2>📚 AI Learning Path Generator</h2>
                  <p>Get a personalized roadmap to your dream role based on your current skills and time availability</p>
                </div>

                <div className="generator-form">
                  <div className="form-group">
                    <label>🎯 Target Role</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Full Stack Engineer, DevOps Engineer, ML Engineer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="role-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>📊 Current Level</label>
                      <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>⏰ Weekly Time Commitment</label>
                      <select value={timeCommitment} onChange={(e) => setTimeCommitment(e.target.value)}>
                        <option value="5">5 hours/week</option>
                        <option value="10">10 hours/week</option>
                        <option value="15">15 hours/week</option>
                        <option value="20">20+ hours/week</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    className="generate-path-btn"
                    onClick={generateLearningPath}
                    disabled={generatingPath}
                  >
                    {generatingPath ? (
                      <>
                        <span className="spinner"></span>
                        Generating Your Path...
                      </>
                    ) : (
                      <>
                        🚀 Generate My Learning Path
                      </>
                    )}
                  </button>
                </div>

                <div className="path-features">
                  <div className="feature-card">
                    <span className="feature-icon">🎯</span>
                    <h4>Personalized Roadmap</h4>
                    <p>Tailored to your target role and current skill level</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">📅</span>
                    <h4>Timeline Estimate</h4>
                    <p>Realistic timeline based on your availability</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">📚</span>
                    <h4>Curated Resources</h4>
                    <p>Best courses, books, and practice platforms</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">✅</span>
                    <h4>Milestone Tracking</h4>
                    <p>Clear checkpoints to measure progress</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="learning-path-result">
                <div className="result-header">
                  <h2>🎓 Your Personalized Learning Path</h2>
                  <button className="btn-secondary" onClick={() => setLearningPath(null)}>
                    ← Generate New Path
                  </button>
                </div>

                <div className="path-overview">
                  <div className="overview-card">
                    <h3>{learningPath.targetRole}</h3>
                    <p className="timeline">⏱️ Estimated Timeline: {learningPath.totalDuration}</p>
                    <p className="difficulty">Difficulty: {learningPath.overallDifficulty}</p>
                  </div>

                  <div className="path-stats">
                    <div className="stat">
                      <span className="stat-value">{learningPath.phases?.length || 0}</span>
                      <span className="stat-label">Learning Phases</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{learningPath.totalSkills || 0}</span>
                      <span className="stat-label">Skills to Master</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{learningPath.totalResources || 0}</span>
                      <span className="stat-label">Resources</span>
                    </div>
                  </div>
                </div>

                <div className="learning-phases">
                  {learningPath.phases?.map((phase, index) => (
                    <div key={index} className="phase-card">
                      <div className="phase-header">
                        <div className="phase-number">{index + 1}</div>
                        <div className="phase-info">
                          <h3>{phase.name}</h3>
                          <p className="phase-duration">⏱️ {phase.duration}</p>
                        </div>
                      </div>

                      <div className="phase-content">
                        <div className="skills-section">
                          <h4>📚 Skills to Learn</h4>
                          <div className="skills-grid">
                            {phase.skills?.map((skill, i) => (
                              <span key={i} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>

                        <div className="resources-section">
                          <h4>📖 Recommended Resources</h4>
                          <ul className="resources-list">
                            {phase.resources?.map((resource, i) => (
                              <li key={i}>
                                <strong>{resource.type}:</strong> {resource.name}
                                {resource.link && (
                                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                                    🔗 View
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="milestones-section">
                          <h4>✅ Milestones</h4>
                          <ul className="milestones-list">
                            {phase.milestones?.map((milestone, i) => (
                              <li key={i}>{milestone}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="path-tips">
                  <h3>💡 Pro Tips for Success</h3>
                  <div className="tips-grid">
                    {learningPath.tips?.map((tip, index) => (
                      <div key={index} className="tip-card">
                        <span className="tip-icon">💡</span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIDEO LIBRARY TAB */}
      {activeTab === 'video-library' && (
        <div className="tab-content">
          <div className="video-library-section">
            <div className="library-header">
              <h2>🎥 Interview Prep Video Library</h2>
              <p>Curated collection of high-quality interview preparation videos with AI-generated summaries</p>
            </div>

            <div className="library-controls">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search videos, topics, or tags..."
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  className="video-search-input"
                />
              </div>

              <div className="category-filters">
                <button 
                  className={`category-btn ${videoCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setVideoCategory('all')}
                >
                  All Videos
                </button>
                <button 
                  className={`category-btn ${videoCategory === 'technical' ? 'active' : ''}`}
                  onClick={() => setVideoCategory('technical')}
                >
                  💻 Technical
                </button>
                <button 
                  className={`category-btn ${videoCategory === 'behavioral' ? 'active' : ''}`}
                  onClick={() => setVideoCategory('behavioral')}
                >
                  💬 Behavioral
                </button>
                <button 
                  className={`category-btn ${videoCategory === 'system-design' ? 'active' : ''}`}
                  onClick={() => setVideoCategory('system-design')}
                >
                  🏗️ System Design
                </button>
                <button 
                  className={`category-btn ${videoCategory === 'coding' ? 'active' : ''}`}
                  onClick={() => setVideoCategory('coding')}
                >
                  ⌨️ Coding
                </button>
              </div>
            </div>

            <div className="videos-grid">
              {getFilteredVideos().map((video, index) => (
                <div 
                  key={index} 
                  className="video-card"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="video-duration">{video.duration}</div>
                    <div className="video-category-badge">{video.category}</div>
                  </div>

                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p className="video-channel">{video.channel}</p>
                    <p className="video-description">{video.description}</p>

                    <div className="video-meta">
                      <span className="views">👁️ {video.views}</span>
                      <span className="difficulty">{video.difficulty}</span>
                    </div>

                    <div className="video-tags">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="video-tag">{tag}</span>
                      ))}
                    </div>

                    {video.aiSummary && (
                      <div className="ai-summary-badge">
                        <span>✨ AI Summary Available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {getFilteredVideos().length === 0 && (
              <div className="no-videos">
                <p>No videos found matching your search</p>
              </div>
            )}
          </div>

          {/* Video Detail Modal */}
          {selectedVideo && (
            <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
              <div className="video-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedVideo(null)}>✕</button>
                
                <div className="modal-video">
                  <iframe
                    width="100%"
                    height="400"
                    src={selectedVideo.url}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="modal-content">
                  <h2>{selectedVideo.title}</h2>
                  <p className="modal-channel">{selectedVideo.channel} • {selectedVideo.views} views</p>

                  <div className="modal-tags">
                    {selectedVideo.tags.map((tag, i) => (
                      <span key={i} className="modal-tag">{tag}</span>
                    ))}
                  </div>

                  {selectedVideo.aiSummary && (
                    <div className="ai-summary-section">
                      <h3>✨ AI-Generated Summary</h3>
                      <div className="summary-content">
                        <div className="summary-item">
                          <strong>Key Takeaways:</strong>
                          <ul>
                            {selectedVideo.aiSummary.keyTakeaways.map((takeaway, i) => (
                              <li key={i}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="summary-item">
                          <strong>Topics Covered:</strong>
                          <div className="topics-list">
                            {selectedVideo.aiSummary.topicsCovered.map((topic, i) => (
                              <span key={i} className="topic-pill">{topic}</span>
                            ))}
                          </div>
                        </div>

                        <div className="summary-item">
                          <strong>Best For:</strong>
                          <p>{selectedVideo.aiSummary.bestFor}</p>
                        </div>

                        <div className="summary-item">
                          <strong>Time to Study:</strong>
                          <p>{selectedVideo.aiSummary.studyTime}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="modal-description">
                    <h3>Description</h3>
                    <p>{selectedVideo.fullDescription || selectedVideo.description}</p>
                  </div>

                  <a 
                    href={selectedVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="watch-on-youtube-btn"
                  >
                    📺 Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CODING PLAYGROUND TAB */}
      {activeTab === 'coding-playground' && (
        <div className="tab-content">
          <h2>🎮 Interactive Coding Playground</h2>
          <p className="tab-description">
            Practice coding problems with instant execution and feedback. No setup required!
          </p>

          <div className="playground-container">
            <div className="playground-header">
              <div className="language-selector">
                <label>Language:</label>
                <select 
                  value={codeLanguage} 
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="language-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              
              <div className="quick-problems">
                <button onClick={() => setCodeInput(
`// Two Sum Problem
function twoSum(nums, target) {
  // Your code here
  
}

// Test
console.log(twoSum([2,7,11,15], 9)); // Should return [0,1]`
                )} className="quick-btn">Two Sum</button>
                
                <button onClick={() => setCodeInput(
`// Reverse String
function reverseString(str) {
  // Your code here
  
}

// Test
console.log(reverseString("hello")); // Should return "olleh"`
                )} className="quick-btn">Reverse String</button>
                
                <button onClick={() => setCodeInput(
`// Fibonacci
function fibonacci(n) {
  // Your code here
  
}

// Test  
console.log(fibonacci(10)); // Should return 55`
                )} className="quick-btn">Fibonacci</button>
              </div>
            </div>

            <div className="editor-section">
              <div className="code-editor-header">
                <span>📝 Code Editor</span>
                <button onClick={() => setCodeInput('')} className="clear-btn">Clear</button>
              </div>
              <textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="code-editor"
                placeholder={`// Write your ${codeLanguage} code here...\n// Click "Run Code" to execute\n\nconsole.log("Hello, World!");`}
                rows={15}
              />
            </div>

            <div className="playground-actions">
              <button 
                onClick={async () => {
                  setRunningCode(true);
                  setCodeOutput('');
                  try {
                    // Simulate code execution
                    setTimeout(() => {
                      try {
                        // Create a safe execution environment
                        const logs = [];
                        const customConsole = {
                          log: (...args) => logs.push(args.join(' ')),
                          error: (...args) => logs.push('Error: ' + args.join(' '))
                        };
                        
                        // Execute the code
                        const func = new Function('console', codeInput);
                        func(customConsole);
                        
                        setCodeOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully! No console output.');
                        setTestCases([
                          { input: 'Test 1', expected: 'Pass', actual: 'Pass', passed: true },
                          { input: 'Test 2', expected: 'Pass', actual: 'Pass', passed: true }
                        ]);
                      } catch (error) {
                        setCodeOutput(`Error: ${error.message}`);
                        setTestCases([]);
                      }
                      setRunningCode(false);
                    }, 1000);
                  } catch (error) {
                    setCodeOutput(`Execution Error: ${error.message}`);
                    setRunningCode(false);
                  }
                }}
                className="run-btn"
                disabled={runningCode || !codeInput.trim()}
              >
                {runningCode ? '⏳ Running...' : '▶️ Run Code'}
              </button>
              
              <button onClick={() => {
                copyToClipboard(codeInput);
              }} className="copy-code-btn">
                📋 Copy Code
              </button>
              
              <button onClick={() => {
                downloadAsFile('solution.js', codeInput);
              }} className="download-code-btn">
                💾 Download
              </button>
            </div>

            <div className="output-section">
              <div className="output-header">
                <span>📤 Output</span>
              </div>
              <pre className="code-output">
                {codeOutput || 'Click "Run Code" to see output...'}
              </pre>
            </div>

            {testCases.length > 0 && (
              <div className="test-cases-section">
                <h3>Test Results</h3>
                <div className="test-cases">
                  {testCases.map((test, index) => (
                    <div key={index} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                      <span className="test-icon">{test.passed ? '✅' : '❌'}</span>
                      <div className="test-details">
                        <strong>{test.input}</strong>
                        <div className="test-comparison">
                          <span>Expected: {test.expected}</span>
                          <span>Got: {test.actual}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="playground-tips">
              <h3>💡 Pro Tips</h3>
              <ul>
                <li>Use <code>console.log()</code> to debug your code</li>
                <li>Click quick problems above for common interview questions</li>
                <li>Try optimizing your solution for better time complexity</li>
                <li>Test edge cases like empty inputs, null values, and large numbers</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PEER REVIEW TAB */}
      {activeTab === 'peer-review' && (
        <div className="tab-content">
          <h2>🤝 Peer Review Exchange</h2>
          <p className="tab-description">
            Get feedback on your resume, code, or projects from the community. Help others and earn karma!
          </p>

          <div className="peer-review-container">
            <div className="review-stats">
              <div className="stat-box">
                <span className="stat-icon">⭐</span>
                <div className="stat-content">
                  <span className="stat-value">125</span>
                  <span className="stat-label">Karma Points</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📝</span>
                <div className="stat-content">
                  <span className="stat-value">{mySubmissions.length}</span>
                  <span className="stat-label">My Submissions</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🎯</span>
                <div className="stat-content">
                  <span className="stat-value">18</span>
                  <span className="stat-label">Reviews Given</span>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🏆</span>
                <div className="stat-content">
                  <span className="stat-value">Gold</span>
                  <span className="stat-label">Reviewer Badge</span>
                </div>
              </div>
            </div>

            <div className="review-tabs">
              <button 
                className={`review-tab-btn ${reviewType === 'resume' ? 'active' : ''}`}
                onClick={() => setReviewType('resume')}
              >
                📄 Resume
              </button>
              <button 
                className={`review-tab-btn ${reviewType === 'code' ? 'active' : ''}`}
                onClick={() => setReviewType('code')}
              >
                💻 Code
              </button>
              <button 
                className={`review-tab-btn ${reviewType === 'project' ? 'active' : ''}`}
                onClick={() => setReviewType('project')}
              >
                🚀 Project
              </button>
              <button 
                className={`review-tab-btn ${reviewType === 'cover-letter' ? 'active' : ''}`}
                onClick={() => setReviewType('cover-letter')}
              >
                ✉️ Cover Letter
              </button>
            </div>

            <div className="submit-for-review">
              <h3>Submit for Review</h3>
              <p>Get constructive feedback from experienced developers. Reviews typically come within 24 hours!</p>
              
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="submission-textarea"
                placeholder={`Paste your ${reviewType === 'resume' ? 'resume text or link to PDF' : reviewType === 'code' ? 'code snippet' : reviewType === 'project' ? 'project link and description' : 'cover letter text'} here...`}
                rows={8}
              />

              <div className="submission-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Make anonymous</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Notify me when reviewed</span>
                </label>
              </div>

              <button 
                onClick={() => {
                  if (!submissionText.trim()) {
                    alert('Please enter content to submit');
                    return;
                  }
                  setSubmitting(true);
                  setTimeout(() => {
                    alert('✅ Submitted for review! You\'ll be notified when feedback is ready.');
                    setSubmissionText('');
                    setSubmitting(false);
                    setMySubmissions([...mySubmissions, {
                      id: Date.now(),
                      type: reviewType,
                      content: submissionText.substring(0, 100) + '...',
                      status: 'pending',
                      submittedAt: new Date().toISOString()
                    }]);
                  }, 1500);
                }}
                className="submit-review-btn"
                disabled={submitting || !submissionText.trim()}
              >
                {submitting ? '⏳ Submitting...' : '📤 Submit for Review'}
              </button>
            </div>

            <div className="review-opportunities">
              <h3>Review Others & Earn Karma</h3>
              <p>Help others improve and earn karma points to unlock premium features!</p>
              
              <div className="available-reviews-list">
                {[
                  {
                    id: 1,
                    type: 'Resume',
                    author: 'Anonymous',
                    preview: 'Entry-level software engineer with 1 year experience...',
                    karma: 5,
                    timeAgo: '2 hours ago'
                  },
                  {
                    id: 2,
                    type: 'Code',
                    author: 'John D.',
                    preview: 'Binary tree traversal implementation in Python...',
                    karma: 10,
                    timeAgo: '5 hours ago'
                  },
                  {
                    id: 3,
                    type: 'Project',
                    author: 'Sarah M.',
                    preview: 'Full-stack e-commerce app using React and Node...',
                    karma: 15,
                    timeAgo: '1 day ago'
                  }
                ].map((review) => (
                  <div key={review.id} className="review-opportunity-card">
                    <div className="review-type-badge">{review.type}</div>
                    <div className="review-content">
                      <div className="review-meta">
                        <span className="author">{review.author}</span>
                        <span className="time-ago">{review.timeAgo}</span>
                      </div>
                      <p className="review-preview">{review.preview}</p>
                      <div className="review-footer">
                        <span className="karma-reward">+{review.karma} karma</span>
                        <button className="review-it-btn">
                          📝 Review It
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mySubmissions.length > 0 && (
              <div className="my-submissions-section">
                <h3>My Submissions</h3>
                <div className="submissions-list">
                  {mySubmissions.map((submission) => (
                    <div key={submission.id} className="submission-card">
                      <div className="submission-header">
                        <span className="submission-type-badge">{submission.type}</span>
                        <span className={`status-badge ${submission.status}`}>
                          {submission.status === 'pending' ? '⏳ Pending' : '✅ Reviewed'}
                        </span>
                      </div>
                      <p className="submission-content">{submission.content}</p>
                      <span className="submission-date">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="peer-review-benefits">
              <h3>Why Peer Review?</h3>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <span className="benefit-icon">👥</span>
                  <h4>Real Feedback</h4>
                  <p>Get honest opinions from real developers, not just AI</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">🎓</span>
                  <h4>Learn by Reviewing</h4>
                  <p>Improve your own skills by reviewing others' work</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">🤝</span>
                  <h4>Build Network</h4>
                  <p>Connect with developers who review your submissions</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">⚡</span>
                  <h4>Fast Turnaround</h4>
                  <p>Typically get feedback within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Career DNA Tab */}
      {activeTab === 'career-dna' && (
        <div className="tab-content">
          <AICareerDNA />
        </div>
      )}

      {/* Smart Autopilot Tab */}
      {activeTab === 'autopilot' && (
        <div className="tab-content">
          <SmartAutopilot />
        </div>
      )}
    </div>
  );
};

export default Resources;

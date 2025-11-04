import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoInterviewHome.css';

// 40 Behavioral Questions with categories
const BEHAVIORAL_QUESTIONS = [
  // Leadership
  { id: 1, question: "Tell me about a time when you had to lead a team through a difficult project.", category: "Leadership", difficulty: "Medium" },
  { id: 2, question: "Describe a situation where you had to motivate team members who were losing interest.", category: "Leadership", difficulty: "Hard" },
  { id: 3, question: "How have you handled delegating tasks to team members with different skill levels?", category: "Leadership", difficulty: "Medium" },
  { id: 4, question: "Tell me about a time when you had to make an unpopular decision as a leader.", category: "Leadership", difficulty: "Hard" },
  { id: 5, question: "Describe your experience mentoring junior team members.", category: "Leadership", difficulty: "Easy" },
  
  // Teamwork
  { id: 6, question: "Tell me about a time when you had to work with a difficult team member.", category: "Teamwork", difficulty: "Medium" },
  { id: 7, question: "Describe a situation where you had to collaborate with multiple departments.", category: "Teamwork", difficulty: "Medium" },
  { id: 8, question: "How do you handle conflicts within a team?", category: "Teamwork", difficulty: "Hard" },
  { id: 9, question: "Tell me about a successful team project you were part of.", category: "Teamwork", difficulty: "Easy" },
  { id: 10, question: "Describe a time when you had to compromise to achieve a team goal.", category: "Teamwork", difficulty: "Medium" },
  
  // Problem Solving
  { id: 11, question: "Tell me about a complex problem you solved at work.", category: "Problem Solving", difficulty: "Hard" },
  { id: 12, question: "Describe a time when you had to think outside the box to solve an issue.", category: "Problem Solving", difficulty: "Medium" },
  { id: 13, question: "How do you approach debugging a critical production issue?", category: "Problem Solving", difficulty: "Hard" },
  { id: 14, question: "Tell me about a time when you identified and fixed a systemic problem.", category: "Problem Solving", difficulty: "Hard" },
  { id: 15, question: "Describe your problem-solving process when facing a new challenge.", category: "Problem Solving", difficulty: "Easy" },
  
  // Conflict Resolution
  { id: 16, question: "Tell me about a time when you disagreed with your manager's decision.", category: "Conflict", difficulty: "Hard" },
  { id: 17, question: "Describe a situation where you had to mediate between two conflicting parties.", category: "Conflict", difficulty: "Hard" },
  { id: 18, question: "How did you handle a situation where a client was unhappy with your work?", category: "Conflict", difficulty: "Medium" },
  { id: 19, question: "Tell me about a time when you had to stand up for your technical decision.", category: "Conflict", difficulty: "Medium" },
  { id: 20, question: "Describe how you resolved a disagreement with a colleague.", category: "Conflict", difficulty: "Medium" },
  
  // Communication
  { id: 21, question: "Tell me about a time when you had to explain a technical concept to a non-technical audience.", category: "Communication", difficulty: "Medium" },
  { id: 22, question: "Describe a situation where miscommunication caused a problem. How did you handle it?", category: "Communication", difficulty: "Hard" },
  { id: 23, question: "How do you ensure clear communication in remote work environments?", category: "Communication", difficulty: "Easy" },
  { id: 24, question: "Tell me about a time when you had to deliver bad news to stakeholders.", category: "Communication", difficulty: "Hard" },
  
  // Failure & Learning
  { id: 25, question: "Tell me about your biggest professional failure and what you learned.", category: "Failure", difficulty: "Hard" },
  { id: 26, question: "Describe a project that didn't go as planned. How did you recover?", category: "Failure", difficulty: "Medium" },
  { id: 27, question: "How do you handle making mistakes at work?", category: "Failure", difficulty: "Easy" },
  { id: 28, question: "Tell me about a time when you received critical feedback. How did you respond?", category: "Failure", difficulty: "Medium" },
  
  // Time Management
  { id: 29, question: "How do you prioritize tasks when everything seems urgent?", category: "Time Management", difficulty: "Medium" },
  { id: 30, question: "Tell me about a time when you had to manage multiple deadlines simultaneously.", category: "Time Management", difficulty: "Hard" },
  { id: 31, question: "Describe your approach to work-life balance during crunch periods.", category: "Time Management", difficulty: "Easy" },
  
  // Initiative
  { id: 32, question: "Tell me about a time when you went above and beyond your job responsibilities.", category: "Initiative", difficulty: "Medium" },
  { id: 33, question: "Describe a process improvement you implemented without being asked.", category: "Initiative", difficulty: "Hard" },
  { id: 34, question: "How do you identify opportunities for innovation in your work?", category: "Initiative", difficulty: "Medium" },
  
  // Adaptability
  { id: 35, question: "Tell me about a time when you had to quickly learn a new technology or skill.", category: "Adaptability", difficulty: "Medium" },
  { id: 36, question: "Describe how you handled a major change in project direction.", category: "Adaptability", difficulty: "Hard" },
  { id: 37, question: "How do you stay current with industry trends and technologies?", category: "Adaptability", difficulty: "Easy" },
  
  // Customer Focus
  { id: 38, question: "Tell me about a time when you went the extra mile for a customer or user.", category: "Customer Focus", difficulty: "Medium" },
  { id: 39, question: "Describe how you balance user needs with technical constraints.", category: "Customer Focus", difficulty: "Hard" },
  { id: 40, question: "How do you gather and incorporate user feedback into your work?", category: "Customer Focus", difficulty: "Easy" }
];

const VideoInterviewHome = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showCameraTest, setShowCameraTest] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(BEHAVIORAL_QUESTIONS.map(q => q.category))];

  // Load session history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('video-interview-history') || '[]');
    setSessionHistory(history);
  }, []);

  // Camera test
  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraReady(true);
      setCameraError('');
      setShowCameraTest(true);
    } catch (err) {
      setCameraError('Camera access denied. Please enable camera permissions.');
      setCameraReady(false);
    }
  };

  const stopCameraTest = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraTest(false);
  };

  // Toggle question selection
  const toggleQuestion = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Select random questions
  const selectRandomQuestions = (count) => {
    const filtered = BEHAVIORAL_QUESTIONS.filter(q => 
      (categoryFilter === 'all' || q.category === categoryFilter)
    );
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count).map(q => q.id);
    setSelectedQuestions(selected);
  };

  // Start interview session
  const startInterview = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }
    if (!cameraReady) {
      alert('Please test your camera first');
      return;
    }
    
    // Navigate to interview session
    navigate('/video-interview/session', { 
      state: { questionIds: selectedQuestions }
    });
  };

  // Filter questions
  const filteredQuestions = BEHAVIORAL_QUESTIONS.filter(q => {
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="video-interview-home">
      {/* Header */}
      <div className="interview-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🎥 AI Video Interview</h1>
            <p>Practice behavioral interviews with advanced AI analysis</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{sessionHistory.length}</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{selectedQuestions.length}</span>
              <span className="stat-label">Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Setup Section */}
      <div className="camera-setup-section">
        <div className="section-header">
          <h2>1️⃣ Camera Setup</h2>
          <p>Test your camera and microphone before starting</p>
        </div>
        
        <div className="camera-test-container">
          {!showCameraTest ? (
            <div className="camera-test-prompt">
              <div className="camera-icon">📹</div>
              <h3>Test Your Equipment</h3>
              <p>Make sure your camera and microphone are working properly</p>
              <button className="btn-primary" onClick={startCameraTest}>
                <span>🎬</span> Test Camera & Microphone
              </button>
              {cameraError && <div className="error-message">{cameraError}</div>}
            </div>
          ) : (
            <div className="camera-preview">
              <video ref={videoRef} autoPlay playsInline muted className="preview-video" />
              <div className="camera-controls">
                <div className="status-indicator">
                  <span className="status-dot active"></span>
                  <span>Camera Active</span>
                </div>
                <button className="btn-secondary" onClick={stopCameraTest}>
                  Stop Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Selection Section */}
      <div className="question-selection-section">
        <div className="section-header">
          <h2>2️⃣ Select Questions</h2>
          <p>Choose questions for your practice session</p>
        </div>

        {/* Quick Select */}
        <div className="quick-select">
          <button className="btn-quick" onClick={() => selectRandomQuestions(3)}>
            Random 3 Questions
          </button>
          <button className="btn-quick" onClick={() => selectRandomQuestions(5)}>
            Random 5 Questions
          </button>
          <button className="btn-quick" onClick={() => selectRandomQuestions(10)}>
            Random 10 Questions
          </button>
          <button className="btn-quick" onClick={() => setSelectedQuestions([])}>
            Clear Selection
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            className="filter-search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Question List */}
        <div className="questions-grid">
          {filteredQuestions.map(q => (
            <div 
              key={q.id}
              className={`question-card ${selectedQuestions.includes(q.id) ? 'selected' : ''}`}
              onClick={() => toggleQuestion(q.id)}
            >
              <div className="question-header">
                <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                  {q.difficulty}
                </span>
                <span className="category-badge">{q.category}</span>
              </div>
              <p className="question-text">{q.question}</p>
              {selectedQuestions.includes(q.id) && (
                <div className="selected-indicator">✓ Selected</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="start-section">
        <button 
          className="btn-start-interview"
          onClick={startInterview}
          disabled={!cameraReady || selectedQuestions.length === 0}
        >
          <span>🎬</span> Start Video Interview ({selectedQuestions.length} questions)
        </button>
        {!cameraReady && (
          <p className="warning-text">⚠️ Please test your camera first</p>
        )}
        {selectedQuestions.length === 0 && (
          <p className="warning-text">⚠️ Please select at least one question</p>
        )}
      </div>

      {/* Session History */}
      {sessionHistory.length > 0 && (
        <div className="session-history-section">
          <h2>📊 Previous Sessions</h2>
          <div className="history-list">
            {sessionHistory.map((session, index) => (
              <div key={index} className="history-card">
                <div className="history-info">
                  <h3>Session {sessionHistory.length - index}</h3>
                  <p>{new Date(session.date).toLocaleDateString()}</p>
                  <p>{session.questionsCount} questions</p>
                </div>
                <div className="history-score">
                  <div className="score-circle">
                    {session.averageScore || 'N/A'}
                  </div>
                  <span>Avg Score</span>
                </div>
                <button 
                  className="btn-view"
                  onClick={() => navigate(`/video-interview/feedback/${session.id}`)}
                >
                  View Results
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Features Info */}
      <div className="features-section">
        <h2>🤖 AI Analysis Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Eye Contact & Body Language</h3>
            <p>AI tracks your facial expressions, eye contact, and posture</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Speech Analysis</h3>
            <p>Analyze clarity, pacing, filler words, and tone</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Content Evaluation</h3>
            <p>STAR method compliance and answer structure</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Timestamped Feedback</h3>
            <p>Review your performance with frame-by-frame analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewHome;

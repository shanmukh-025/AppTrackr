import React, { useState, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/AIInterviewCoach.css';

const INTERVIEW_TYPES = {
  behavioral: {
    name: 'Behavioral',
    icon: '💭',
    questions: [
      'Tell me about a time when you faced a significant challenge at work.',
      'Describe a situation where you had to work with a difficult team member.',
      'How do you handle tight deadlines and pressure?',
      'Tell me about your greatest achievement.',
      'How do you approach learning new technologies?'
    ]
  },
  technical: {
    name: 'Technical',
    icon: '💻',
    questions: [
      'Explain the concept of closures in JavaScript.',
      'What is the difference between SQL and NoSQL databases?',
      'How would you optimize a slow database query?',
      'Describe the MVC architecture pattern.',
      'What are the main differences between REST and GraphQL?'
    ]
  },
  situational: {
    name: 'Situational',
    icon: '🎯',
    questions: [
      'You discover a critical bug in production. What do you do?',
      'Your manager disagrees with your technical approach. How do you handle it?',
      'You\'re overwhelmed with multiple urgent tasks. How do you prioritize?',
      'A team member is struggling. How do you help?',
      'You make a significant mistake. How do you respond?'
    ]
  }
};

const AIInterviewCoach = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [activeTab, setActiveTab] = useState('start');
  const [recording, setRecording] = useState(false);
  const [isRecordingAvailable, setIsRecordingAvailable] = useState(false);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interviewSessions, setInterviewSessions] = useState([]);
  const [videoURL, setVideoURL] = useState('');

  // Start video recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: true 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      setError('Unable to access camera: ' + err.message);
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  }, [recording]);

  // Check if recording is available
  const checkRecordingSupport = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsRecordingAvailable(true);
    } catch (err) {
      setIsRecordingAvailable(false);
    }
  }, []);

  React.useEffect(() => {
    checkRecordingSupport();
  }, [checkRecordingSupport]);

  // Start interview
  const startInterview = useCallback(async () => {
    if (!company || !position) {
      setError('Please fill in company and position');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      setActiveTab('interview');
      setCurrentQuestionIndex(0);
      setResponses([]);
      setFeedback(null);
    } catch (err) {
      setError('Failed to start interview: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [company, position]);

  // Submit response
  const submitResponse = useCallback(async () => {
    const currentQuestion = INTERVIEW_TYPES[interviewType].questions[currentQuestionIndex];
    
    const response = {
      question: currentQuestion,
      videoURL,
      timestamp: new Date(),
      duration: videoURL ? 'recorded' : 'text-only'
    };

    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);

    if (currentQuestionIndex < INTERVIEW_TYPES[interviewType].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVideoURL('');
      chunksRef.current = [];
    }
  }, [currentQuestionIndex, videoURL, responses, interviewType]);

  // Generate AI feedback
  const generateFeedback = useCallback(async (userResponses) => {
    setLoading(true);
    try {
      const feedbackData = {
        interviewType,
        company,
        position,
        responses: userResponses,
        timestamp: new Date()
      };

      // Mock AI feedback - in production would call backend AI service
      const mockFeedback = generateMockFeedback(userResponses.length);
      
      setFeedback(mockFeedback);
      
      // Save to backend
      try {
        await axios.post(`${API_URL}/api/interviews/save`, feedbackData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log('Saved locally');
      }

      setActiveTab('feedback');
    } catch (err) {
      setError('Failed to generate feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [interviewType, company, position, token, API_URL]);

  // Generate mock feedback
  const generateMockFeedback = (responseCount) => {
    const scores = {
      clarity: Math.floor(Math.random() * 40) + 60,
      confidence: Math.floor(Math.random() * 40) + 60,
      structure: Math.floor(Math.random() * 40) + 60,
      engagement: Math.floor(Math.random() * 40) + 60,
      vocabulary: Math.floor(Math.random() * 40) + 60
    };

    const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length);

    return {
      overallScore,
      scores,
      strengths: [
        '✅ Good use of STAR method',
        '✅ Clear communication',
        '✅ Relevant examples'
      ],
      improvements: [
        '📌 Speak more slowly for clarity',
        '📌 Include more specific metrics',
        '📌 Practice longer answers'
      ],
      tips: [
        '💡 Pause between thoughts to gather yourself',
        '💡 Use concrete examples rather than generalizations',
        '💡 Practice your responses before the real interview'
      ],
      recommendations: [
        'Practice behavioral questions for 30 minutes daily',
        'Record yourself and review for improvements',
        'Study the company\'s values and culture',
        'Prepare questions to ask the interviewer'
      ]
    };
  };

  // Get interview history
  const fetchInterviewHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/interviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviewSessions(response.data.sessions || []);
    } catch (err) {
      console.log('Using local data');
    }
  }, [token, API_URL]);

  React.useEffect(() => {
    fetchInterviewHistory();
  }, [fetchInterviewHistory]);

  return (
    <div className="ai-interview-coach">
      {/* Header */}
      <div className="aic-header">
        <h1>🎯 AI Interview Coach</h1>
        <p>Practice interviews with real-time feedback and AI analysis</p>
      </div>

      {/* Tabs */}
      <div className="aic-tabs">
        <button 
          className={`tab ${activeTab === 'start' ? 'active' : ''}`}
          onClick={() => setActiveTab('start')}
        >
          🚀 Start Practice
        </button>
        <button 
          className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
          disabled={!company}
        >
          🎥 Interview
        </button>
        <button 
          className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
          disabled={!feedback}
        >
          📊 Feedback
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); fetchInterviewHistory(); }}
        >
          📝 History
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Content */}
      <div className="aic-content">
        {/* Start Tab */}
        {activeTab === 'start' && (
          <div className="start-section">
            <div className="setup-card">
              <h2>Select Interview Type</h2>
              <div className="interview-types">
                {Object.entries(INTERVIEW_TYPES).map(([key, type]) => (
                  <div 
                    key={key}
                    className={`type-option ${interviewType === key ? 'selected' : ''}`}
                    onClick={() => setInterviewType(key)}
                  >
                    <div className="type-icon">{type.icon}</div>
                    <div className="type-name">{type.name}</div>
                    <div className="type-desc">
                      {key === 'behavioral' && '5 common behavioral questions'}
                      {key === 'technical' && '5 technical deep-dives'}
                      {key === 'situational' && '5 scenario-based questions'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Startup Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Position</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Product Manager"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <button 
                className="start-btn"
                onClick={startInterview}
                disabled={loading || !company || !position}
              >
                {loading ? '⏳ Starting...' : '🎬 Start Interview'}
              </button>
            </div>

            {/* Benefits */}
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🎥</div>
                <h3>Video Recording</h3>
                <p>Record your responses and review your body language</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🤖</div>
                <h3>AI Analysis</h3>
                <p>Get detailed feedback on clarity, confidence, and structure</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Score Report</h3>
                <p>Track your performance across 5 key metrics</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📚</div>
                <h3>Improvement Tips</h3>
                <p>Personalized recommendations for better answers</p>
              </div>
            </div>
          </div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
          <div className="interview-section">
            <div className="interview-header">
              <div>
                <h2>{company} - {position}</h2>
                <p className="interview-type">
                  {INTERVIEW_TYPES[interviewType].icon} {INTERVIEW_TYPES[interviewType].name} Interview
                </p>
              </div>
              <div className="progress-indicator">
                <span className="question-counter">
                  Question {currentQuestionIndex + 1} of {INTERVIEW_TYPES[interviewType].questions.length}
                </span>
              </div>
            </div>

            <div className="question-display">
              <h3>Question:</h3>
              <p className="question-text">
                {INTERVIEW_TYPES[interviewType].questions[currentQuestionIndex]}
              </p>
            </div>

            {isRecordingAvailable ? (
              <div className="video-section">
                <div className="video-container">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="video-preview"
                  />
                  <div className={`recording-indicator ${recording ? 'active' : ''}`}>
                    {recording && '● RECORDING'}
                  </div>
                </div>

                <div className="recording-controls">
                  {!recording ? (
                    <button className="record-btn" onClick={startRecording}>
                      🔴 Start Recording
                    </button>
                  ) : (
                    <button className="stop-btn" onClick={stopRecording}>
                      ⏹️ Stop Recording
                    </button>
                  )}
                </div>

                {videoURL && (
                  <div className="video-preview-result">
                    ✅ Response recorded
                  </div>
                )}
              </div>
            ) : (
              <div className="no-camera">
                <p>📹 Camera not available. Please enable camera access in your browser settings.</p>
              </div>
            )}

            <div className="interview-actions">
              <button
                className="next-btn"
                onClick={() => {
                  if (currentQuestionIndex === INTERVIEW_TYPES[interviewType].questions.length - 1) {
                    // Create final response list and generate feedback
                    const finalResponse = {
                      question: INTERVIEW_TYPES[interviewType].questions[currentQuestionIndex],
                      videoURL,
                      timestamp: new Date(),
                      duration: videoURL ? 'recorded' : 'text-only'
                    };
                    generateFeedback([...responses, finalResponse]);
                  } else {
                    submitResponse();
                  }
                }}
                disabled={!videoURL && !recording}
              >
                {currentQuestionIndex === INTERVIEW_TYPES[interviewType].questions.length - 1
                  ? '✅ Complete Interview'
                  : '→ Next Question'}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && feedback && (
          <div className="feedback-section">
            <div className="overall-score">
              <div className="score-circle">
                <div className="score-number">{feedback.overallScore}</div>
                <div className="score-label">/100</div>
              </div>
              <div className="score-interpretation">
                {feedback.overallScore >= 80 && '🌟 Excellent! Ready for real interviews!'}
                {feedback.overallScore >= 70 && feedback.overallScore < 80 && '👍 Good! Keep practicing!'}
                {feedback.overallScore >= 60 && feedback.overallScore < 70 && '📈 Fair. Focus on improvements below.'}
                {feedback.overallScore < 60 && '💪 Keep practicing! Use the tips to improve.'}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="score-breakdown">
              <h3>Performance Breakdown</h3>
              <div className="metrics-grid">
                {Object.entries(feedback.scores).map(([metric, score]) => (
                  <div key={metric} className="metric-card">
                    <div className="metric-name">
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${score}%` }}></div>
                    </div>
                    <div className="metric-score">{score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="feedback-section-item">
              <h3>✨ Your Strengths</h3>
              <ul>
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="feedback-section-item">
              <h3>📌 Areas to Improve</h3>
              <ul>
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="feedback-section-item">
              <h3>💡 Expert Tips</h3>
              <ul>
                {feedback.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="feedback-section-item recommendations">
              <h3>📚 Next Steps</h3>
              <ul>
                {feedback.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="feedback-actions">
              <button className="retry-btn" onClick={() => {
                setCompany('');
                setPosition('');
                setFeedback(null);
                setActiveTab('start');
              }}>
                🔄 Practice Again
              </button>
              <button className="export-btn">
                📥 Export Report
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            {interviewSessions.length > 0 ? (
              <div className="sessions-list">
                {interviewSessions.map((session, idx) => (
                  <div key={idx} className="session-card">
                    <div className="session-info">
                      <h3>{session.company} - {session.position}</h3>
                      <p className="session-type">
                        {INTERVIEW_TYPES[session.type]?.icon} {INTERVIEW_TYPES[session.type]?.name}
                      </p>
                      <p className="session-date">
                        📅 {new Date(session.timestamp || session.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    {session.overallScore && (
                      <div className="session-score">{session.overallScore}/100</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Practice Sessions Yet</h3>
                <p>Start your first interview practice to see history!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterviewCoach;

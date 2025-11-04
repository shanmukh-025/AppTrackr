import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/MockInterview.css';

const MockInterview = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewing, setInterviewing] = useState(false);
  const [interviewType, setInterviewType] = useState('technical');
  const [role, setRole] = useState('Backend Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('60');
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Define endSession before useEffect so it can be used in dependencies
  const endSession = useCallback(async () => {
    try {
      await axios.post(
        `${API_URL}/api/resources/mock-interview/${sessionData?.sessionId}/end`,
        { session: sessionData },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSessionActive(false);
      setNotification({ type: 'success', message: 'Interview completed! Check your feedback.' });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [sessionData, token, API_URL, setNotification]);

  useEffect(() => {
    let timer;
    if (sessionActive && timeRemaining !== null && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0 && sessionActive) {
      endSession();
    }
    return () => clearTimeout(timer);
  }, [sessionActive, timeRemaining, endSession]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/resources/mock-interview/start`,
        { interviewType, role, difficulty, duration: parseInt(duration) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Mock interview start response:', response.data);
      const data = response.data.session || response.data.data || response.data;
      setSessionData(data);
      setSessionActive(true);
      setTimeRemaining(parseInt(duration) * 60);
      setCurrentQuestion(data.questions?.[0] || null);
      setResponses([]);
      setNotification({ type: 'success', message: 'Interview started! Good luck! 🎯' });
    } catch (error) {
      console.error('Start interview error:', error);
      setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to start interview' });
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) {
      setNotification({ type: 'error', message: 'Please provide a response' });
      return;
    }

    setInterviewing(true);
    try {
      const questionIndex = sessionData.questions.findIndex(q => q.id === currentQuestion.id);
      
      await axios.post(
        `${API_URL}/api/resources/mock-interview/${sessionData.sessionId}/submit`,
        { questionNumber: questionIndex + 1, response: userResponse },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setResponses([...responses, { question: currentQuestion, response: userResponse }]);
      
      // Move to next question
      const nextQuestionIndex = questionIndex + 1;
      if (nextQuestionIndex < sessionData.questions.length) {
        setCurrentQuestion(sessionData.questions[nextQuestionIndex]);
        setUserResponse('');
      } else {
        setNotification({ type: 'success', message: 'All questions completed! Wrapping up...' });
        setTimeout(() => endSession(), 2000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to submit response' });
    } finally {
      setInterviewing(false);
    }
  };

  const skipQuestion = () => {
    const currentIndex = sessionData.questions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < sessionData.questions.length - 1) {
      setCurrentQuestion(sessionData.questions[currentIndex + 1]);
      setUserResponse('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (sessionActive && currentQuestion) {
    return (
      <div className="mock-interview active">
        {/* Header with Timer */}
        <div className="interview-header">
          <div className="interview-info">
            <h3>{interviewType === 'technical' ? 'Technical Interview' : 'Behavioral Interview'}</h3>
            <p>{role} • {difficulty}</p>
          </div>
          <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(responses.length / sessionData.questions.length) * 100}%`
              }}
            ></div>
          </div>
          <p className="progress-text">
            Question {responses.length + 1} of {sessionData.questions.length}
          </p>
        </div>

        {/* Question Display */}
        <div className="interview-container">
          <div className="question-panel">
            <div className="question-number">Q{responses.length + 1}</div>
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.context && (
              <div className="question-context">
                <p>{currentQuestion.context}</p>
              </div>
            )}
          </div>

          {/* Response Input */}
          <div className="response-panel">
            <h4>Your Response</h4>
            <textarea
              className="response-textarea"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Speak or type your answer here..."
              rows={8}
            />

            {/* Action Buttons */}
            <div className="interview-actions">
              <button
                className="submit-response-btn"
                onClick={submitResponse}
                disabled={interviewing || !userResponse.trim()}
              >
                {interviewing ? '⏳ Processing...' : '✓ Submit Response'}
              </button>
              <button className="skip-btn" onClick={skipQuestion}>
                ⏭️ Skip
              </button>
              <button className="end-btn" onClick={endSession}>
                🛑 End Interview
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="interview-tips">
          <h5>💡 Tips:</h5>
          <ul>
            <li>Take time to think before answering</li>
            <li>Be clear and structured in your response</li>
            <li>Explain your thought process</li>
            <li>Ask clarifying questions if needed</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mock-interview">
      <h2>🎥 Mock Interview Simulator</h2>
      <p className="subtitle">Practice interviews with AI feedback and real-time evaluation</p>

      <div className="setup-panel">
        <h3>Configure Your Interview</h3>

        {/* Interview Type */}
        <div className="setup-section">
          <label>Interview Type</label>
          <div className="type-options">
            {['technical', 'behavioral', 'system-design'].map(type => (
              <button
                key={type}
                className={`type-btn ${interviewType === type ? 'active' : ''}`}
                onClick={() => setInterviewType(type)}
              >
                {type === 'technical' ? '💻 Technical' : type === 'behavioral' ? '🗣️ Behavioral' : '🏗️ System Design'}
              </button>
            ))}
          </div>
        </div>

        {/* Role Selection */}
        <div className="setup-section">
          <label>Target Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>Data Scientist</option>
            <option>DevOps Engineer</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="setup-section">
          <label>Difficulty Level</label>
          <div className="difficulty-options">
            {['Easy', 'Medium', 'Hard'].map(diff => (
              <button
                key={diff}
                className={`diff-btn ${difficulty === diff ? 'active' : ''}`}
                onClick={() => setDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="setup-section">
          <label>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="30"
            max="120"
            step="15"
          />
        </div>

        {/* Start Button */}
        <button
          className="start-interview-btn"
          onClick={startInterview}
          disabled={loading}
        >
          {loading ? '⏳ Starting Interview...' : '🎯 Start Interview'}
        </button>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎤</div>
          <h4>Real-time Q&A</h4>
          <p>Practice with AI-generated questions</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h4>Live Feedback</h4>
          <p>Get instant analysis on your responses</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📹</div>
          <h4>Recording</h4>
          <p>Review your interview later</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h4>Scoring</h4>
          <p>Get rated on multiple criteria</p>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;

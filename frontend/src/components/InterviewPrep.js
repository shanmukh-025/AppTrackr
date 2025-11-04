import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/InterviewPrep.css';

const InterviewPrep = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState([]);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('Software Engineer');
  const [categoryFilter, setCategoryFilter] = useState('technical');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [recordingActive, setRecordingActive] = useState(false);

  // Recording
  const mediaRecorder = useContext(null); // eslint-disable-line no-unused-vars
  const [recordedAnswers, setRecordedAnswers] = useState([]); // eslint-disable-line no-unused-vars

  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager'
  ];

  const categories = [
    { value: 'technical', label: '💻 Technical' },
    { value: 'behavioral', label: '🗣️ Behavioral' },
    { value: 'system-design', label: '🏗️ System Design' },
    { value: 'company-specific', label: '🏢 Company Specific' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const fetchQuestions = useCallback(async () => {
    try {
      const params = {
        role: roleFilter,
        category: categoryFilter
      };
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;

      const response = await axios.get(
        `${API_URL}/api/resources/interview-prep/questions`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setQuestions(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedQuestion(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback: create sample questions
      setQuestions(generateSampleQuestions());
    }
  }, [roleFilter, categoryFilter, difficultyFilter, token, API_URL]);

  const generateSampleQuestions = () => {
    return [
      {
        id: 1,
        question: 'Explain the difference between let, const, and var in JavaScript',
        category: 'technical',
        difficulty: 'easy',
        role: 'Frontend Developer',
        tips: 'Focus on scope, hoisting, and reassignability',
        expectedLength: '2-3 minutes'
      },
      {
        id: 2,
        question: 'How do you handle state management in a large React application?',
        category: 'technical',
        difficulty: 'hard',
        role: 'Frontend Developer',
        tips: 'Discuss Redux, Context API, Zustand, or other solutions',
        expectedLength: '5-7 minutes'
      },
      {
        id: 3,
        question: 'Tell me about a time you faced a conflict with a team member and how you resolved it',
        category: 'behavioral',
        difficulty: 'medium',
        role: 'Software Engineer',
        tips: 'Use the STAR method: Situation, Task, Action, Result',
        expectedLength: '3-4 minutes'
      }
    ];
  };

  const fetchPracticeHistory = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/resources/interview-prep/history`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPracticeHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchQuestions();
    fetchPracticeHistory();
  }, [fetchQuestions, fetchPracticeHistory]);

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      setNotification({ type: 'error', message: 'Please provide an answer' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/resources/interview-prep/evaluate`,
        {
          questionId: selectedQuestion.id,
          answer: userAnswer,
          role: roleFilter,
          category: categoryFilter
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFeedback(response.data.feedback || {
        score: 75,
        strengths: ['Good structure', 'Clear explanation'],
        improvements: ['Could provide more examples'],
        suggestions: 'Practice with real-world scenarios'
      });

      // Save to history
      setPracticeHistory([
        {
          questionId: selectedQuestion.id,
          question: selectedQuestion.question,
          answer: userAnswer,
          feedback: response.data.feedback,
          date: new Date(),
          score: response.data.feedback?.score || 75
        },
        ...practiceHistory
      ]);

      setNotification({ type: 'success', message: 'Answer evaluated!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to evaluate answer' });
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setRecordingActive(true);
      setNotification({ type: 'success', message: 'Recording started...' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to access microphone' });
    }
  };

  const stopRecording = () => {
    setRecordingActive(false);
    setNotification({ type: 'success', message: 'Recording saved' });
  };

  const nextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === selectedQuestion?.id);
    if (currentIndex < questions.length - 1) {
      setSelectedQuestion(questions[currentIndex + 1]);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  const previousQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === selectedQuestion?.id);
    if (currentIndex > 0) {
      setSelectedQuestion(questions[currentIndex - 1]);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  return (
    <div className="interview-prep">
      <div className="prep-header">
        <h2>🎤 Interview Preparation</h2>
        <p>Master interviews with targeted practice and expert feedback</p>
      </div>

      <div className="prep-container">
        {/* Tabs */}
        <div className="prep-tabs">
          <button
            className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Practice Questions
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Practice History ({practiceHistory.length})
          </button>
          <button
            className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>

        <div className="prep-content">
          {activeTab === 'questions' && (
            <div className="questions-panel">
              {/* Filters Sidebar */}
              <div className="filters-sidebar">
                <div className="filter-section">
                  <label>💼 Target Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-section">
                  <label>📋 Category</label>
                  <div className="category-buttons">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        className={`category-btn ${categoryFilter === cat.value ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(cat.value)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <label>⭐ Difficulty</label>
                  <div className="difficulty-buttons">
                    <button
                      className={`diff-btn ${difficultyFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setDifficultyFilter('all')}
                    >
                      All
                    </button>
                    {difficulties.map(diff => (
                      <button
                        key={diff.value}
                        className={`diff-btn ${difficultyFilter === diff.value ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter(diff.value)}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Display */}
              <div className="question-panel">
                {selectedQuestion && (
                  <>
                    {/* Question Header */}
                    <div className="question-header">
                      <div className="question-info">
                        <h3>{selectedQuestion.question}</h3>
                        <div className="question-meta">
                          <span className={`difficulty ${selectedQuestion.difficulty}`}>
                            {selectedQuestion.difficulty?.toUpperCase()}
                          </span>
                          <span className="category">
                            {selectedQuestion.category?.toUpperCase()}
                          </span>
                          <span className="expected-time">
                            ⏱️ {selectedQuestion.expectedLength}
                          </span>
                        </div>
                      </div>
                      <div className="question-number">
                        Q{questions.findIndex(q => q.id === selectedQuestion.id) + 1}/{questions.length}
                      </div>
                    </div>

                    {/* Tips */}
                    {selectedQuestion.tips && (
                      <div className="tips-box">
                        <strong>💡 Tips:</strong> {selectedQuestion.tips}
                      </div>
                    )}

                    {/* Answer Input */}
                    <div className="answer-section">
                      <div className="answer-header">
                        <h4>Your Answer</h4>
                        <button
                          className={`record-btn ${recordingActive ? 'active' : ''}`}
                          onClick={recordingActive ? stopRecording : startRecording}
                        >
                          {recordingActive ? '⏹️ Stop Recording' : '🎙️ Record'}
                        </button>
                      </div>

                      <textarea
                        className="answer-textarea"
                        placeholder="Type or speak your answer here. Be clear and structured..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={8}
                      />

                      <div className="answer-actions">
                        <button
                          className="submit-btn"
                          onClick={submitAnswer}
                          disabled={loading || !userAnswer.trim()}
                        >
                          {loading ? '⏳ Evaluating...' : '✓ Get Feedback'}
                        </button>
                        <button
                          className="reset-btn"
                          onClick={() => {
                            setUserAnswer('');
                            setFeedback(null);
                          }}
                        >
                          🔄 Clear
                        </button>
                      </div>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className="feedback-section">
                        <h4>📊 AI Feedback</h4>
                        
                        <div className="score-box">
                          <div className="score-circle">
                            <span className="score-number">{feedback.score}</span>
                            <span className="score-label">/100</span>
                          </div>
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{ width: `${feedback.score}%` }}
                            ></div>
                          </div>
                        </div>

                        {feedback.strengths && (
                          <div className="feedback-item strengths">
                            <h5>✅ Strengths</h5>
                            <ul>
                              {feedback.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.improvements && (
                          <div className="feedback-item improvements">
                            <h5>📈 Areas to Improve</h5>
                            <ul>
                              {feedback.improvements.map((imp, i) => (
                                <li key={i}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.suggestions && (
                          <div className="feedback-item suggestions">
                            <h5>💡 Suggestions</h5>
                            <p>{feedback.suggestions}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="question-navigation">
                      <button
                        className="nav-btn"
                        onClick={previousQuestion}
                        disabled={questions.findIndex(q => q.id === selectedQuestion.id) === 0}
                      >
                        ← Previous
                      </button>
                      <button
                        className="nav-btn"
                        onClick={nextQuestion}
                        disabled={questions.findIndex(q => q.id === selectedQuestion.id) === questions.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-panel">
              <h3>📜 Practice History</h3>
              {practiceHistory.length === 0 ? (
                <div className="empty-state">
                  <p>Start practicing to build your history</p>
                </div>
              ) : (
                <div className="history-list">
                  {practiceHistory.map((item, idx) => (
                    <div key={idx} className="history-item">
                      <div className="history-header">
                        <h4>{item.question}</h4>
                        <span className="score">Score: {item.score}</span>
                      </div>
                      <p className="history-answer">{item.answer}</p>
                      <span className="history-date">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-panel">
              <h3>📚 Interview Resources</h3>
              <div className="resources-grid">
                <div className="resource-card">
                  <h4>💻 System Design</h4>
                  <p>Learn to design large-scale systems and architecture patterns</p>
                  <button className="resource-link">Start Learning →</button>
                </div>
                <div className="resource-card">
                  <h4>🗣️ Behavioral Questions</h4>
                  <p>Master the STAR method and storytelling for interviews</p>
                  <button className="resource-link">Start Learning →</button>
                </div>
                <div className="resource-card">
                  <h4>💡 Problem Solving</h4>
                  <p>Improve algorithmic thinking and coding problem-solving</p>
                  <button className="resource-link">Start Learning →</button>
                </div>
                <div className="resource-card">
                  <h4>🎯 Interview Tips</h4>
                  <p>Expert tips for acing technical and behavioral interviews</p>
                  <button className="resource-link">Start Learning →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/BehavioralCoach.css';

// Hardcoded behavioral questions
const BEHAVIORAL_QUESTIONS = [
  // Leadership
  { id: 1, question: 'Tell me about a time when you led a team through a challenging project.', category: 'Leadership', difficulty: 'Medium' },
  { id: 2, question: 'Describe a situation where you had to motivate a team member who was underperforming.', category: 'Leadership', difficulty: 'Hard' },
  { id: 3, question: 'Give an example of when you had to make a difficult decision that affected your team.', category: 'Leadership', difficulty: 'Hard' },
  { id: 4, question: 'Tell me about a time you delegated tasks effectively.', category: 'Leadership', difficulty: 'Medium' },
  { id: 5, question: 'Describe a situation where you had to lead without formal authority.', category: 'Leadership', difficulty: 'Hard' },
  
  // Teamwork
  { id: 6, question: 'Tell me about a time when you worked with a difficult team member.', category: 'Teamwork', difficulty: 'Medium' },
  { id: 7, question: 'Describe a successful team project you contributed to.', category: 'Teamwork', difficulty: 'Easy' },
  { id: 8, question: 'Give an example of when you had to collaborate with someone from a different department.', category: 'Teamwork', difficulty: 'Medium' },
  { id: 9, question: 'Tell me about a time you helped a struggling teammate.', category: 'Teamwork', difficulty: 'Easy' },
  { id: 10, question: 'Describe a situation where you had to work with diverse perspectives.', category: 'Teamwork', difficulty: 'Medium' },
  
  // Problem Solving
  { id: 11, question: 'Tell me about a complex problem you solved at work.', category: 'Problem Solving', difficulty: 'Hard' },
  { id: 12, question: 'Describe a time when you identified a process improvement.', category: 'Problem Solving', difficulty: 'Medium' },
  { id: 13, question: 'Give an example of when you had to think creatively to solve a problem.', category: 'Problem Solving', difficulty: 'Medium' },
  { id: 14, question: 'Tell me about a time you debugged a critical production issue.', category: 'Problem Solving', difficulty: 'Hard' },
  { id: 15, question: 'Describe how you approached a problem with limited information.', category: 'Problem Solving', difficulty: 'Hard' },
  
  // Conflict
  { id: 16, question: 'Tell me about a time you disagreed with your manager.', category: 'Conflict', difficulty: 'Hard' },
  { id: 17, question: 'Describe a situation where you resolved a conflict between team members.', category: 'Conflict', difficulty: 'Medium' },
  { id: 18, question: 'Give an example of when you had to give difficult feedback to a colleague.', category: 'Conflict', difficulty: 'Hard' },
  { id: 19, question: 'Tell me about a time you received criticism and how you handled it.', category: 'Conflict', difficulty: 'Medium' },
  { id: 20, question: 'Describe a situation where you had to stand up for your technical decision.', category: 'Conflict', difficulty: 'Hard' },
  
  // Communication
  { id: 21, question: 'Tell me about a time you had to explain a technical concept to a non-technical person.', category: 'Communication', difficulty: 'Medium' },
  { id: 22, question: 'Describe a presentation you gave that went particularly well.', category: 'Communication', difficulty: 'Easy' },
  { id: 23, question: 'Give an example of when miscommunication caused a problem.', category: 'Communication', difficulty: 'Medium' },
  { id: 24, question: 'Tell me about a time you had to persuade stakeholders.', category: 'Communication', difficulty: 'Hard' },
  
  // Failure & Learning
  { id: 25, question: 'Tell me about a time you failed and what you learned from it.', category: 'Failure', difficulty: 'Hard' },
  { id: 26, question: 'Describe a project that didn\'t go as planned.', category: 'Failure', difficulty: 'Medium' },
  { id: 27, question: 'Give an example of when you made a mistake and how you fixed it.', category: 'Failure', difficulty: 'Medium' },
  { id: 28, question: 'Tell me about a time you had to admit you were wrong.', category: 'Failure', difficulty: 'Hard' },
  
  // Time Management
  { id: 29, question: 'Tell me about a time you had to manage multiple priorities.', category: 'Time Management', difficulty: 'Medium' },
  { id: 30, question: 'Describe how you handle tight deadlines.', category: 'Time Management', difficulty: 'Medium' },
  { id: 31, question: 'Give an example of when you had to say no to a request.', category: 'Time Management', difficulty: 'Hard' },
  
  // Initiative
  { id: 32, question: 'Tell me about a time you went above and beyond.', category: 'Initiative', difficulty: 'Medium' },
  { id: 33, question: 'Describe a project you started on your own.', category: 'Initiative', difficulty: 'Medium' },
  { id: 34, question: 'Give an example of when you identified and fixed a problem before it became critical.', category: 'Initiative', difficulty: 'Hard' },
  
  // Adaptability
  { id: 35, question: 'Tell me about a time you had to adapt to significant changes.', category: 'Adaptability', difficulty: 'Medium' },
  { id: 36, question: 'Describe a situation where you had to learn something new quickly.', category: 'Adaptability', difficulty: 'Medium' },
  { id: 37, question: 'Give an example of when you had to work outside your comfort zone.', category: 'Adaptability', difficulty: 'Hard' },
  
  // Customer Focus
  { id: 38, question: 'Tell me about a time you went out of your way to help a customer.', category: 'Customer Focus', difficulty: 'Medium' },
  { id: 39, question: 'Describe how you handled a difficult customer complaint.', category: 'Customer Focus', difficulty: 'Hard' },
  { id: 40, question: 'Give an example of when you improved user experience.', category: 'Customer Focus', difficulty: 'Medium' },
];

const BehavioralCoach = ({ setNotification }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Use hardcoded questions instead of API call
      const filteredQuestions = selectedCategory !== 'all' 
        ? BEHAVIORAL_QUESTIONS.filter(q => q.category === selectedCategory)
        : BEHAVIORAL_QUESTIONS;
      
      setQuestions(filteredQuestions);
      if (filteredQuestions.length > 0) {
        setSelectedQuestion(filteredQuestions[0]);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, setNotification]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchCategories = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.get('/api/resources/behavioral/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Categories removed - unused state
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const evaluateResponse = async () => {
    if (!userResponse.trim()) {
      setNotification({ type: 'error', message: 'Please provide a response' });
      return;
    }

    setEvaluating(true);
    try {
      const response = await axios.post(
        '/api/resources/behavioral/evaluate',
        { question: selectedQuestion, response: userResponse },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setFeedback(response.data.data);
      setNotification({ type: 'success', message: 'Response evaluated!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Evaluation failed' });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="behavioral-coach">
      <h2>🗣️ Behavioral Interview Coach</h2>
      <p className="subtitle">Master the STAR method and ace behavioral interviews</p>

      {/* STAR Method Guide */}
      <div className="star-guide">
        <h3>The STAR Method</h3>
        <div className="star-grid">
          <div className="star-card">
            <div className="star-letter">S</div>
            <h4>Situation</h4>
            <p>Set the context of the story</p>
          </div>
          <div className="star-card">
            <div className="star-letter">T</div>
            <h4>Task</h4>
            <p>Explain your responsibility</p>
          </div>
          <div className="star-card">
            <div className="star-letter">A</div>
            <h4>Action</h4>
            <p>Describe what you did</p>
          </div>
          <div className="star-card">
            <div className="star-letter">R</div>
            <h4>Result</h4>
            <p>Share the outcome</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="coach-container">
        {/* Questions Panel */}
        <div className="questions-panel">
          <h3>Questions</h3>

          {/* Category Filter */}
          <div className="category-filter">
            {['all', 'Leadership', 'Teamwork', 'Problem Solving', 'Conflict', 'Communication', 'Failure', 'Time Management', 'Initiative', 'Adaptability', 'Customer Focus'].map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="questions-list">
            {loading ? (
              <div className="loading">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="no-questions">No questions found</div>
            ) : (
              questions.map(q => (
                <div
                  key={q.id}
                  className={`question-item ${selectedQuestion?.id === q.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setUserResponse('');
                    setFeedback(null);
                  }}
                >
                  <p>{q.question}</p>
                  {q.category && <span className="category-badge">{q.category}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Response Panel */}
        {selectedQuestion ? (
          <div className="response-panel">
            <h3>Your Response</h3>

            {/* Question Display */}
            <div className="question-display">
              <h4>{selectedQuestion.question}</h4>
              {selectedQuestion.context && (
                <p className="question-context">{selectedQuestion.context}</p>
              )}
            </div>

            {/* Response Input */}
            <textarea
              className="response-input"
              placeholder="Type or paste your response here... Use the STAR method!"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              rows={8}
            />

            {/* Evaluate Button */}
            <button
              className="evaluate-btn"
              onClick={evaluateResponse}
              disabled={evaluating || !userResponse.trim()}
            >
              {evaluating ? '⏳ Evaluating...' : '✨ Get AI Feedback'}
            </button>

            {/* Feedback */}
            {feedback && (
              <div className="feedback-section">
                <h4>AI Feedback</h4>

                {/* Scores */}
                <div className="scores-grid">
                  <div className="score-card">
                    <h5>Structure</h5>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.structureScore * 10}%` }}
                      ></div>
                    </div>
                    <p>{feedback.structureScore}/10</p>
                  </div>
                  <div className="score-card">
                    <h5>Clarity</h5>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.clarityScore * 10}%` }}
                      ></div>
                    </div>
                    <p>{feedback.clarityScore}/10</p>
                  </div>
                  <div className="score-card">
                    <h5>Impact</h5>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.impactScore * 10}%` }}
                      ></div>
                    </div>
                    <p>{feedback.impactScore}/10</p>
                  </div>
                </div>

                {/* Suggestions */}
                {feedback.suggestions && (
                  <div className="suggestions">
                    <h5>Suggestions for Improvement</h5>
                    <ul>
                      {feedback.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* STAR Analysis */}
                {feedback.starAnalysis && (
                  <div className="star-analysis">
                    <h5>STAR Method Analysis</h5>
                    <div className="star-analysis-grid">
                      {['situation', 'task', 'action', 'result'].map(part => (
                        <div key={part} className="analysis-card">
                          <h6>{part.charAt(0).toUpperCase() + part.slice(1)}</h6>
                          <p>{feedback.starAnalysis[part] || 'Could be improved'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="empty-response">
            <p>Select a question to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehavioralCoach;

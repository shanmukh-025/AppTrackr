import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/VideoInterviewFeedback.css';

const VideoInterviewFeedback = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [sessionData, setSessionData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  // eslint-disable-next-line no-unused-vars
  const [playingVideo, setPlayingVideo] = useState(false);

  // Load session data
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('video-interview-history') || '[]');
    const session = history.find(s => s.id === parseInt(sessionId));
    
    if (session) {
      setSessionData(session);
      
      // Load analysis results
      const analysis = JSON.parse(localStorage.getItem(`interview-analysis-${sessionId}`) || '[]');
      setAnalysisResults(analysis);
      
      // Calculate average score
      if (analysis.length > 0) {
        const avgScore = Math.round(
          analysis.reduce((sum, a) => sum + a.overallScore, 0) / analysis.length
        );
        session.averageScore = avgScore;
        
        // Update in localStorage
        const updatedHistory = history.map(s => 
          s.id === parseInt(sessionId) ? session : s
        );
        localStorage.setItem('video-interview-history', JSON.stringify(updatedHistory));
      }
    }
  }, [sessionId]);

  if (!sessionData || !analysisResults.length) {
    return (
      <div className="feedback-loading">
        <div className="loading-spinner"></div>
        <p>Loading your interview feedback...</p>
      </div>
    );
  }

  const currentAnalysis = analysisResults[selectedRecording];
  const currentRecording = sessionData.recordings[selectedRecording];

  // Calculate category averages
  const calculateCategoryAverage = (category) => {
    const scores = {
      facial: (currentAnalysis.eyeContact + currentAnalysis.facialExpressions + 
               currentAnalysis.bodyLanguage + currentAnalysis.confidence) / 4,
      speech: (currentAnalysis.clarity + currentAnalysis.pacing + currentAnalysis.tone) / 3,
      content: (currentAnalysis.starCompliance + currentAnalysis.answerStructure + 
                currentAnalysis.relevance + currentAnalysis.depth) / 4
    };
    return Math.round(scores[category]);
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  // Export results as JSON
  const exportResults = () => {
    const dataStr = JSON.stringify({
      session: sessionData,
      analysis: analysisResults
    }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-feedback-${sessionId}.json`;
    link.click();
  };

  return (
    <div className="video-interview-feedback">
      {/* Header */}
      <div className="feedback-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => navigate('/behavioral')}>
            ← Back to Interviews
          </button>
          <div className="header-info">
            <h1>🎥 Interview Feedback & Analysis</h1>
            <p>{new Date(sessionData.date).toLocaleDateString()} • {analysisResults.length} Questions</p>
          </div>
          <div className="overall-score-badge">
            <div className="score-circle-large" style={{ 
              background: `conic-gradient(${getScoreColor(sessionData.averageScore)} ${sessionData.averageScore * 3.6}deg, #e5e7eb 0deg)` 
            }}>
              <div className="score-inner">
                <span className="score-value">{sessionData.averageScore}</span>
                <span className="score-label">Overall</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Selector */}
      <div className="question-selector">
        <h3>Select Question to Review:</h3>
        <div className="question-pills">
          {analysisResults.map((analysis, index) => (
            <button
              key={index}
              className={`question-pill ${selectedRecording === index ? 'active' : ''}`}
              onClick={() => setSelectedRecording(index)}
            >
              <span className="pill-number">Q{index + 1}</span>
              <span className="pill-category">{analysis.category}</span>
              <span className="pill-score" style={{ color: getScoreColor(analysis.overallScore) }}>
                {analysis.overallScore}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="feedback-content">
        {/* Tabs */}
        <div className="feedback-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            🎥 Video Review
          </button>
          <button 
            className={`tab ${activeTab === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveTab('detailed')}
          >
            📈 Detailed Analysis
          </button>
          <button 
            className={`tab ${activeTab === 'transcript' ? 'active' : ''}`}
            onClick={() => setActiveTab('transcript')}
          >
            📝 Transcript
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* AI Smart Analysis Section */}
              {currentAnalysis.aiAnalysis && (
                <div className="ai-smart-analysis">
                  <div className="ai-header">
                    <h2>🤖 AI Smart Analysis</h2>
                    {sessionData.domain && (
                      <span className="domain-badge">Domain: {sessionData.domain}</span>
                    )}
                  </div>
                  
                  {/* AI Scores Grid */}
                  <div className="ai-scores-grid">
                    <div className="ai-score-card">
                      <div className="ai-score-icon">📝</div>
                      <div className="ai-score-value">{currentAnalysis.aiAnalysis.contentScore}/100</div>
                      <div className="ai-score-label">Content Quality</div>
                    </div>
                    <div className="ai-score-card">
                      <div className="ai-score-icon">💬</div>
                      <div className="ai-score-value">{currentAnalysis.aiAnalysis.communicationScore}/100</div>
                      <div className="ai-score-label">Communication</div>
                    </div>
                    <div className="ai-score-card">
                      <div className="ai-score-icon">🎯</div>
                      <div className="ai-score-value">{currentAnalysis.aiAnalysis.behavioralScore}/100</div>
                      <div className="ai-score-label">Behavioral</div>
                    </div>
                  </div>

                  {/* STAR Compliance Analysis */}
                  {currentAnalysis.aiAnalysis.starCompliance && (
                    <div className="star-compliance-section">
                      <h3>⭐ STAR Method Analysis</h3>
                      <div className="star-grid">
                        {['situation', 'task', 'action', 'result'].map((component) => (
                          <div key={component} className={`star-item ${currentAnalysis.aiAnalysis.starCompliance[component]}`}>
                            <span className="star-letter">{component[0].toUpperCase()}</span>
                            <span className="star-name">{component.charAt(0).toUpperCase() + component.slice(1)}</span>
                            <span className={`star-status ${currentAnalysis.aiAnalysis.starCompliance[component]}`}>
                              {currentAnalysis.aiAnalysis.starCompliance[component] === 'present' ? '✓' : 
                               currentAnalysis.aiAnalysis.starCompliance[component] === 'weak' ? '⚠' : '✗'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="star-feedback">{currentAnalysis.aiAnalysis.starCompliance.feedback}</p>
                    </div>
                  )}

                  {/* Detailed AI Feedback */}
                  <div className="ai-detailed-feedback">
                    <h3>📊 Comprehensive Analysis</h3>
                    <p className="feedback-text">{currentAnalysis.aiAnalysis.detailedFeedback}</p>
                  </div>

                  {/* Key Insights */}
                  {currentAnalysis.aiAnalysis.keyInsights && currentAnalysis.aiAnalysis.keyInsights.length > 0 && (
                    <div className="key-insights">
                      <h3>💡 Key Insights</h3>
                      <ul>
                        {currentAnalysis.aiAnalysis.keyInsights.map((insight, idx) => (
                          <li key={idx}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Red Flags */}
                  {currentAnalysis.aiAnalysis.redFlags && currentAnalysis.aiAnalysis.redFlags.length > 0 && (
                    <div className="red-flags">
                      <h3>🚨 Areas of Concern</h3>
                      <ul>
                        {currentAnalysis.aiAnalysis.redFlags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Question Info */}
              <div className="question-info-card">
                <h2>Question:</h2>
                <p className="question-text">{currentAnalysis.question}</p>
                <div className="question-meta">
                  <span className="meta-item">📂 {currentAnalysis.category}</span>
                  <span className="meta-item">⏱️ {Math.floor(currentAnalysis.duration / 60)}:{(currentAnalysis.duration % 60).toString().padStart(2, '0')}</span>
                  {currentAnalysis.aiAnalysis?.responseAdequacy && (
                    <span className={`meta-item adequacy-${currentAnalysis.aiAnalysis.responseAdequacy}`}>
                      {currentAnalysis.aiAnalysis.responseAdequacy === 'too-short' ? '⚠️ Too Short' :
                       currentAnalysis.aiAnalysis.responseAdequacy === 'too-long' ? '⚠️ Too Long' :
                       '✓ Good Length'}
                    </span>
                  )}
                </div>
              </div>

              {/* Score Categories */}
              <div className="score-categories">
                {/* Facial Analysis */}
                <div className="category-card">
                  <div className="category-header">
                    <h3>👁️ Facial & Body Language</h3>
                    <span className="category-score" style={{ color: getScoreColor(calculateCategoryAverage('facial')) }}>
                      {calculateCategoryAverage('facial')}/100
                    </span>
                  </div>
                  <div className="score-bars">
                    <div className="score-bar-item">
                      <span>Eye Contact</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.eyeContact}%`,
                          backgroundColor: getScoreColor(currentAnalysis.eyeContact)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.eyeContact}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Facial Expressions</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.facialExpressions}%`,
                          backgroundColor: getScoreColor(currentAnalysis.facialExpressions)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.facialExpressions}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Body Language</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.bodyLanguage}%`,
                          backgroundColor: getScoreColor(currentAnalysis.bodyLanguage)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.bodyLanguage}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Confidence</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.confidence}%`,
                          backgroundColor: getScoreColor(currentAnalysis.confidence)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Speech Analysis */}
                <div className="category-card">
                  <div className="category-header">
                    <h3>🎤 Speech Quality</h3>
                    <span className="category-score" style={{ color: getScoreColor(calculateCategoryAverage('speech')) }}>
                      {calculateCategoryAverage('speech')}/100
                    </span>
                  </div>
                  <div className="score-bars">
                    <div className="score-bar-item">
                      <span>Clarity</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.clarity}%`,
                          backgroundColor: getScoreColor(currentAnalysis.clarity)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.clarity}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Pacing</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.pacing}%`,
                          backgroundColor: getScoreColor(currentAnalysis.pacing)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.pacing}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Tone</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.tone}%`,
                          backgroundColor: getScoreColor(currentAnalysis.tone)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.tone}</span>
                    </div>
                    <div className="score-bar-item warn">
                      <span>Filler Words</span>
                      <div className="score-bar">
                        <div className="score-bar-fill warning" style={{ 
                          width: `${Math.min(currentAnalysis.fillerWords * 5, 100)}%`
                        }}></div>
                      </div>
                      <span>{currentAnalysis.fillerWords} detected</span>
                    </div>
                  </div>
                </div>

                {/* Content Analysis */}
                <div className="category-card">
                  <div className="category-header">
                    <h3>📋 Content Quality</h3>
                    <span className="category-score" style={{ color: getScoreColor(calculateCategoryAverage('content')) }}>
                      {calculateCategoryAverage('content')}/100
                    </span>
                  </div>
                  <div className="score-bars">
                    <div className="score-bar-item">
                      <span>STAR Compliance</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.starCompliance}%`,
                          backgroundColor: getScoreColor(currentAnalysis.starCompliance)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.starCompliance}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Answer Structure</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.answerStructure}%`,
                          backgroundColor: getScoreColor(currentAnalysis.answerStructure)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.answerStructure}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Relevance</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.relevance}%`,
                          backgroundColor: getScoreColor(currentAnalysis.relevance)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.relevance}</span>
                    </div>
                    <div className="score-bar-item">
                      <span>Depth</span>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${currentAnalysis.depth}%`,
                          backgroundColor: getScoreColor(currentAnalysis.depth)
                        }}></div>
                      </div>
                      <span>{currentAnalysis.depth}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Sections */}
              <div className="feedback-sections">
                <div className="feedback-card strengths">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {currentAnalysis.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-card improvements">
                  <h3>🎯 Areas for Improvement</h3>
                  <ul>
                    {currentAnalysis.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-card suggestions">
                  <h3>💡 AI Suggestions</h3>
                  <p>{currentAnalysis.suggestions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Video Review Tab */}
          {activeTab === 'video' && (
            <div className="video-tab">
              <div className="video-player-container">
                <video 
                  src={currentRecording.videoURL}
                  controls
                  className="playback-video"
                  onPlay={() => setPlayingVideo(true)}
                  onPause={() => setPlayingVideo(false)}
                />
                <div className="video-info">
                  <p>📹 Recorded: {new Date(currentRecording.timestamp).toLocaleString()}</p>
                  <p>⏱️ Duration: {Math.floor(currentRecording.duration / 60)}:{(currentRecording.duration % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'detailed' && (
            <div className="detailed-tab">
              <div className="detailed-grid">
                <div className="detailed-card">
                  <h3>👁️ Visual Analysis</h3>
                  <div className="metric-list">
                    <div className="metric">
                      <span>Eye Contact</span>
                      <strong>{currentAnalysis.eyeContact}%</strong>
                    </div>
                    <div className="metric">
                      <span>Facial Expressions</span>
                      <strong>{currentAnalysis.facialExpressions}%</strong>
                    </div>
                    <div className="metric">
                      <span>Body Language</span>
                      <strong>{currentAnalysis.bodyLanguage}%</strong>
                    </div>
                    <div className="metric">
                      <span>Confidence Level</span>
                      <strong>{currentAnalysis.confidence}%</strong>
                    </div>
                  </div>
                </div>

                <div className="detailed-card">
                  <h3>🎙️ Audio Analysis</h3>
                  <div className="metric-list">
                    <div className="metric">
                      <span>Speech Clarity</span>
                      <strong>{currentAnalysis.clarity}%</strong>
                    </div>
                    <div className="metric">
                      <span>Speaking Pace</span>
                      <strong>{currentAnalysis.pacing}%</strong>
                    </div>
                    <div className="metric">
                      <span>Tone Quality</span>
                      <strong>{currentAnalysis.tone}%</strong>
                    </div>
                    <div className="metric">
                      <span>Filler Words Count</span>
                      <strong>{currentAnalysis.fillerWords}</strong>
                    </div>
                  </div>
                </div>

                <div className="detailed-card">
                  <h3>📄 Content Analysis</h3>
                  <div className="metric-list">
                    <div className="metric">
                      <span>STAR Method</span>
                      <strong>{currentAnalysis.starCompliance}%</strong>
                    </div>
                    <div className="metric">
                      <span>Structure</span>
                      <strong>{currentAnalysis.answerStructure}%</strong>
                    </div>
                    <div className="metric">
                      <span>Relevance</span>
                      <strong>{currentAnalysis.relevance}%</strong>
                    </div>
                    <div className="metric">
                      <span>Depth of Answer</span>
                      <strong>{currentAnalysis.depth}%</strong>
                    </div>
                  </div>
                </div>

                <div className="detailed-card overall">
                  <h3>🎯 Overall Performance</h3>
                  <div className="overall-score-display">
                    <div className="score-circle-medium" style={{ 
                      background: `conic-gradient(${getScoreColor(currentAnalysis.overallScore)} ${currentAnalysis.overallScore * 3.6}deg, #e5e7eb 0deg)` 
                    }}>
                      <div className="score-inner">
                        <span className="score-value">{currentAnalysis.overallScore}</span>
                      </div>
                    </div>
                    <p className="score-description">
                      {currentAnalysis.overallScore >= 85 ? 'Excellent performance! Ready for real interviews.' :
                       currentAnalysis.overallScore >= 70 ? 'Good job! A few areas to polish.' :
                       'Keep practicing! Focus on the improvement areas.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === 'transcript' && (
            <div className="transcript-tab">
              <div className="transcript-container">
                <h3>📝 Full Transcript</h3>
                <div className="transcript-content">
                  {currentAnalysis.transcript || 'No transcript available for this recording.'}
                </div>
                <div className="transcript-stats">
                  <span>Word Count: {currentAnalysis.transcript.split(' ').length}</span>
                  <span>Duration: {Math.floor(currentAnalysis.duration / 60)}:{(currentAnalysis.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="feedback-actions">
        <button className="btn-action secondary" onClick={exportResults}>
          📥 Export Results
        </button>
        <button className="btn-action primary" onClick={() => navigate('/behavioral')}>
          🎥 Practice Again
        </button>
      </div>
    </div>
  );
};

export default VideoInterviewFeedback;

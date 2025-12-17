import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ResumeScoreOptimizer.css';

const IMPROVEMENT_CATEGORIES = [
  {
    id: 'formatting',
    name: 'Formatting',
    icon: '📝',
    description: 'Layout, spacing, and visual hierarchy'
  },
  {
    id: 'keywords',
    name: 'Keywords',
    icon: '🔍',
    description: 'Industry keywords and ATS optimization'
  },
  {
    id: 'content',
    name: 'Content',
    icon: '✍️',
    description: 'Language, action verbs, and clarity'
  },
  {
    id: 'structure',
    name: 'Structure',
    icon: '🏗️',
    description: 'Sections organization and flow'
  }
];

const OPTIMIZATION_TIPS = [
  'Use action verbs like "developed", "implemented", "optimized"',
  'Include quantifiable results (numbers, percentages, metrics)',
  'Tailor keywords to match the job description',
  'Keep formatting clean and ATS-friendly (avoid graphics, tables)',
  'Use standard fonts and bullet points for readability',
  'Include relevant technical skills and certifications',
  'Highlight achievements, not just job duties',
  'Use consistent date formats and spacing',
  'Optimize for ATS scanning by using standard sections',
  'Keep to 1-2 pages for most roles'
];

function ResumeScoreOptimizer() {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('upload');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [improvements, setImprovements] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch resume analysis history
  const fetchAnalysisHistory = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/resumes/analysis-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.history) {
        console.log('📊 Fetched history:', response.data.history);
        setHistory(response.data.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      // Silently fail - history is not critical
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchAnalysisHistory();
    }
  }, [activeTab, fetchAnalysisHistory]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF, TXT, or Word document');
      }
    }
  };

  const handleAnalyzeClick = async () => {
    if (!resumeFile) {
      setError('Please upload a resume file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      console.log('📤 Sending resume for analysis...');

      const response = await axios.post(
        `${API_URL}/api/resumes/analyze-score`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 180000 // 3 minutes to match backend timeout
        }
      );

      if (response.data.success) {
        const analysis = response.data.analysis;
        console.log('✅ Analysis received:', analysis);

        setScoreData(analysis);
        setImprovements(analysis.improvements || []);
        setActiveTab('analysis');
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('❌ Analysis error:', err);
      const apiErr = err.response?.data;
      const detailed = apiErr?.details || apiErr?.message || '';
      const errorMessage = apiErr?.error
        ? `${apiErr.error}${detailed ? ': ' + detailed : ''}`
        : err.message || 'Failed to analyze resume';

      // Show more actionable messages for common failure modes
      if ((detailed || '').toLowerCase().includes('gemini') || (detailed || '').toLowerCase().includes('ai service') ) {
        setError('AI service is currently unavailable. Please check the backend logs or try again in a minute.');
      } else if ((detailed || '').toLowerCase().includes('pdf') || (detailed || '').toLowerCase().includes('parse')) {
        setError('Failed to parse the uploaded file. Try converting the PDF to text or upload a different resume. (' + (detailed || apiErr?.error || err.message) + ')');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!scoreData) return;

    const reportContent = `
RESUME ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${scoreData.overallScore}/100
ATS SCORE: ${scoreData.atsScore}/100

SCORE BREAKDOWN:
- Formatting: ${scoreData.formattingScore}/100
- Content Quality: ${scoreData.contentScore}/100
- Keywords: ${scoreData.keywordScore}/100

SECTIONS FOUND:
${scoreData.sections.present.map(s => `✓ ${s}`).join('\n')}

SECTIONS MISSING:
${scoreData.sections.missing.map(s => `✗ ${s}`).join('\n')}

STRENGTHS:
${scoreData.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${scoreData.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

RECOMMENDATIONS:
${OPTIMIZATION_TIPS.slice(0, 5).map((t, i) => `${i + 1}. ${t}`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `Resume_Analysis_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#ef4444';
    return '#dc2626';
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/api/resumes/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Remove from history state
        setHistory(history.filter(item => item.id !== analysisId));
        
        // If the deleted item was selected, deselect it
        const deletedIndex = history.findIndex(item => item.id === analysisId);
        if (selectedHistoryItem === deletedIndex) {
          setSelectedHistoryItem(null);
        }
        
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error('Error deleting analysis:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete analysis';
      setError(`Failed to delete analysis: ${errorMsg}`);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="resume-score-optimizer">
      {/* Page Header - Dashboard Style */}
      <div className="page-header">
        <div>
          <h1>Resume Score Optimizer</h1>
          <p className="dashboard-subtitle">Analyze and optimize your resume for ATS systems and recruiters</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rso-tabs">
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload
        </button>
        <button
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
          disabled={!scoreData}
        >
          📊 Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'improvements' ? 'active' : ''}`}
          onClick={() => setActiveTab('improvements')}
          disabled={improvements.length === 0}
        >
          ✨ Improvements
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="upload-section">
          {/* Upload Area - Dashboard Widget Style */}
          <div className="dashboard-widget">
            <div className="widget-header">
              <h2>📄 Upload Resume</h2>
            </div>
            
            <div className="file-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">📄</div>
                <h3>Upload Your Resume</h3>
                <p>Click to upload PDF, Word, or TXT file</p>
                {resumeFile && <p className="file-name">✓ {resumeFile.name}</p>}
              </div>
            </div>

            <button
              className="primary-btn analyze-btn"
              onClick={handleAnalyzeClick}
              disabled={loading || !resumeFile}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
            </button>
          </div>

          {/* Benefits Grid - Dashboard Stats Style */}
          <div className="upload-benefits">
            <h3>What You'll Get:</h3>
            <div className="stats-grid benefits-stats">
              <div className="stat-card benefit-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-label">ATS Score</div>
                  <div className="benefit-desc">See how well your resume passes ATS systems</div>
                </div>
              </div>
              <div className="stat-card benefit-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-label">Detailed Analysis</div>
                  <div className="benefit-desc">Formatting, content, keywords breakdown</div>
                </div>
              </div>
              <div className="stat-card benefit-card">
                <div className="stat-icon">💡</div>
                <div className="stat-content">
                  <div className="stat-label">Improvements</div>
                  <div className="benefit-desc">Specific, actionable recommendations</div>
                </div>
              </div>
              <div className="stat-card benefit-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-label">Comparison</div>
                  <div className="benefit-desc">Track your progress over time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && scoreData && (
        <div className="analysis-section">
          {/* Scores Grid - Minimal Style */}
          <div className="scores-grid">
            <div className="score-card-mini">
              <div className="score-icon">🎯</div>
              <div className="score-details">
                <div className="score-label">Overall Score</div>
                <div className="score-value-large" style={{ color: getScoreColor(scoreData.overallScore) }}>
                  {scoreData.overallScore}/100
                </div>
              </div>
            </div>

            <div className="score-card-mini">
              <div className="score-icon">🤖</div>
              <div className="score-details">
                <div className="score-label">ATS Score</div>
                <div className="score-value-large" style={{ color: getScoreColor(scoreData.atsScore) }}>
                  {scoreData.atsScore}/100
                </div>
              </div>
            </div>

            <div className="score-card-mini">
              <div className="score-icon">📝</div>
              <div className="score-details">
                <div className="score-label">Formatting</div>
                <div className="score-value-large" style={{ color: getScoreColor(scoreData.formattingScore) }}>
                  {scoreData.formattingScore}/100
                </div>
              </div>
            </div>

            <div className="score-card-mini">
              <div className="score-icon">✍️</div>
              <div className="score-details">
                <div className="score-label">Content</div>
                <div className="score-value-large" style={{ color: getScoreColor(scoreData.contentScore) }}>
                  {scoreData.contentScore}/100
                </div>
              </div>
            </div>

            <div className="score-card-mini">
              <div className="score-icon">🔍</div>
              <div className="score-details">
                <div className="score-label">Keywords</div>
                <div className="score-value-large" style={{ color: getScoreColor(scoreData.keywordScore) }}>
                  {scoreData.keywordScore}/100
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Details - Minimal Cards */}
          <div className="analysis-details-grid">
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">✅</span>
                <h3>Strengths</h3>
              </div>
              <ul className="simple-list">
                {scoreData.strengths?.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">💡</span>
                <h3>Areas to Improve</h3>
              </div>
              <ul className="simple-list">
                {scoreData.weaknesses?.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sections Info - Minimal */}
          <div className="detail-card">
            <div className="detail-header">
              <span className="detail-icon">📋</span>
              <h3>Resume Sections</h3>
            </div>
            <div className="sections-compact">
              {scoreData.sections?.present?.map((section) => (
                <span key={section} className="section-tag">✓ {section}</span>
              ))}
              {scoreData.sections?.missing?.map((section) => (
                <span key={section} className="section-tag missing">+ {section}</span>
              ))}
            </div>
          </div>

          <button className="minimal-btn download-btn" onClick={downloadReport}>
            📥 Download Report
          </button>
        </div>
      )}

      {/* Improvements Tab */}
      {activeTab === 'improvements' && (
        <div className="improvements-section">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h2>✨ Actionable Improvements</h2>
            </div>
            <div className="improvements-grid">
              {improvements.map((improvement, idx) => (
                <div key={idx} className={`improvement-card priority-${improvement.priority}`}>
                  <div className="improvement-header">
                    <span className="category-icon">
                      {IMPROVEMENT_CATEGORIES.find(c => c.id === improvement.category)?.icon}
                    </span>
                    <span className="category-name">
                      {IMPROVEMENT_CATEGORIES.find(c => c.id === improvement.category)?.name}
                    </span>
                    <span className={`priority-badge priority-${improvement.priority}`}>
                      {improvement.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="improvement-issue">
                    <strong>Issue:</strong> {improvement.issue}
                  </div>
                  <div className="improvement-suggestion">
                    <strong>Suggestion:</strong> {improvement.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-widget optimization-tips">
            <div className="widget-header">
              <h2>📚 General Optimization Tips</h2>
            </div>
            <div className="tips-grid">
              {OPTIMIZATION_TIPS.map((tip, idx) => (
                <div key={idx} className="tip-card">
                  <div className="tip-number">{idx + 1}</div>
                  <div className="tip-text">{tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          {history.length === 0 ? (
            <div className="dashboard-widget empty-state">
              <div className="empty-icon">📜</div>
              <h3>No Analysis History</h3>
              <p>Upload and analyze your resume to see history here</p>
            </div>
          ) : (
            <div className="dashboard-widget">
              <div className="widget-header">
                <h2>📜 Analysis History</h2>
              </div>
              <div className="history-grid">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`history-card ${selectedHistoryItem === idx ? 'selected' : ''}`}
                  >
                    <button
                      className="history-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnalysis(item.id);
                      }}
                      title="Delete this analysis"
                    >
                      🗑️
                    </button>
                    <div 
                      className="history-content"
                      onClick={() => setSelectedHistoryItem(selectedHistoryItem === idx ? null : idx)}
                    >
                      <div className="history-header">
                        <div className="history-score">
                          <div className="score-circle-small" style={{ borderColor: getScoreColor(item.score) }}>
                            {item.score}
                          </div>
                        </div>
                        <div className="history-info">
                          <div className="history-date">
                            {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="history-time">
                            {item.date ? new Date(item.date).toLocaleTimeString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {selectedHistoryItem === idx && (
                        <div className="history-details">
                          <p><strong>ATS Score:</strong> {item.atsScore}/100</p>
                          <p><strong>Formatting:</strong> {item.formattingScore}/100</p>
                          <p><strong>Keywords:</strong> {item.keywordScore}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeScoreOptimizer;

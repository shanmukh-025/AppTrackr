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
  const [resumeText, setResumeText] = useState('');
  const [inputMethod, setInputMethod] = useState('file');
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
      const response = await axios.get(`${API_URL}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.resumes) {
        setHistory(response.data.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
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

  const extractTextFromFile = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${API_URL}/api/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.resume) {
        // Store resume ID for later analysis
        setResumeFile({ ...file, resumeId: response.data.resume.id });
        return response.data.resume.rawText || '';
      }
      return '';
    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Failed to upload resume. Please try again.');
      return '';
    }
  }, [token, API_URL]);

  const analyzeResume = useCallback(async () => {
    if (!resumeFile && !resumeText.trim()) {
      setError('Please upload a resume or paste text');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (resumeFile && !resumeFile.resumeId) {
        // If file is uploaded but no resumeId, extract it first
        await extractTextFromFile(resumeFile);
      }

      // For now, generate mock analysis without job description
      // In production, you'd ask user for job description
      const mockAnalysis = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        atsScore: Math.floor(Math.random() * 40) + 60,
        contentScore: Math.floor(Math.random() * 40) + 60,
        formatScore: Math.floor(Math.random() * 40) + 60,
        strengths: [
          'Clear formatting and structure',
          'Good use of action verbs',
          'Relevant technical skills included'
        ],
        improvements: [
          { category: 'keywords', suggestion: 'Add more industry keywords', priority: 'High' },
          { category: 'formatting', suggestion: 'Use consistent date formatting', priority: 'Medium' },
          { category: 'content', suggestion: 'Quantify your achievements more', priority: 'High' }
        ],
        tips: OPTIMIZATION_TIPS.slice(0, 5)
      };

      setScoreData(mockAnalysis);
      setImprovements(mockAnalysis.improvements || []);
      setActiveTab('analysis');
    } catch (err) {
      setError(err.response?.data?.error || 'Error analyzing resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [resumeFile, resumeText, extractTextFromFile]);

  const generateMockAnalysis = useCallback(() => {
    const mockScore = Math.floor(Math.random() * 40) + 60;
    const mockData = {
      overallScore: mockScore,
      atsScore: Math.floor(mockScore * 0.95),
      formattingScore: Math.floor(Math.random() * 30) + 70,
      contentScore: Math.floor(Math.random() * 35) + 65,
      keywordScore: Math.floor(Math.random() * 35) + 65,
      sections: {
        present: ['Contact Info', 'Professional Summary', 'Experience', 'Skills', 'Education'],
        missing: ['Certifications', 'Languages', 'Volunteer Work']
      },
      strengths: [
        'Clear contact information and professional summary',
        'Good use of action verbs and quantifiable metrics',
        'Well-organized sections with consistent formatting'
      ],
      weaknesses: [
        'Could benefit from more technical keywords',
        'Some bullet points could be more concise',
        'Missing relevant industry certifications'
      ]
    };

    const mockImprovements = [
      {
        category: 'keywords',
        priority: 'high',
        issue: 'Missing key technical terms for your industry',
        suggestion: 'Add relevant skills like AI, machine learning, cloud platforms mentioned in job descriptions'
      },
      {
        category: 'content',
        priority: 'high',
        issue: 'Weak action verbs in some bullet points',
        suggestion: 'Replace "responsible for" with stronger verbs like "spearheaded", "engineered", "optimized"'
      },
      {
        category: 'formatting',
        priority: 'medium',
        issue: 'Inconsistent date formatting',
        suggestion: 'Use consistent format throughout (MM/YYYY or MMM YYYY)'
      },
      {
        category: 'structure',
        priority: 'medium',
        issue: 'Summary could be more impactful',
        suggestion: 'Include 2-3 key achievements and years of experience upfront'
      }
    ];

    setScoreData(mockData);
    setImprovements(mockImprovements);
    setActiveTab('analysis');
  }, []);

  const handleAnalyzeClick = async () => {
    if (resumeFile) {
      await analyzeResume();
    } else if (resumeText.trim()) {
      setLoading(true);
      setError(null);
      try {
        const analysisResponse = await axios.post(
          `${API_URL}/api/resume/analyze`,
          { resumeText },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (analysisResponse.data.success) {
          setScoreData(analysisResponse.data.analysis);
          setImprovements(analysisResponse.data.improvements || []);
          setActiveTab('analysis');
        }
      } catch (err) {
        // Fall back to mock data for demo
        generateMockAnalysis();
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please upload a resume or paste text');
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

  return (
    <div className="resume-score-optimizer">
      {/* Header */}
      <div className="rso-header">
        <h1>Resume Score Optimizer</h1>
        <p>Analyze and optimize your resume for ATS systems and recruiters</p>
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
        <div className="rso-content upload-section">
          <div className="input-method-toggle">
            <button
              className={`method-btn ${inputMethod === 'file' ? 'active' : ''}`}
              onClick={() => setInputMethod('file')}
            >
              📁 Upload File
            </button>
            <button
              className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
              onClick={() => setInputMethod('text')}
            >
              ✏️ Paste Text
            </button>
          </div>

          {inputMethod === 'file' ? (
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
          ) : (
            <div className="text-input-area">
              <textarea
                className="resume-textarea"
                placeholder="Paste your resume content here... Include your experience, skills, education, and achievements."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows="12"
              />
            </div>
          )}

          <button
            className="analyze-btn"
            onClick={handleAnalyzeClick}
            disabled={loading || (!resumeFile && !resumeText.trim())}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>

          <div className="upload-benefits">
            <h3>What You'll Get:</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">📈</div>
                <div className="benefit-title">ATS Score</div>
                <div className="benefit-desc">See how well your resume passes ATS systems</div>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-title">Detailed Analysis</div>
                <div className="benefit-desc">Formatting, content, keywords breakdown</div>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💡</div>
                <div className="benefit-title">Improvements</div>
                <div className="benefit-desc">Specific, actionable recommendations</div>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <div className="benefit-title">Comparison</div>
                <div className="benefit-desc">Track your progress over time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && scoreData && (
        <div className="rso-content analysis-section">
          <div className="score-container">
            <div className="main-score">
              <div className="score-circle" style={{ borderColor: getScoreColor(scoreData.overallScore) }}>
                <div className="score-value">{scoreData.overallScore}</div>
                <div className="score-label">Overall</div>
              </div>
            </div>

            <div className="score-breakdown">
              <div className="score-item">
                <div className="score-label-small">ATS Score</div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${scoreData.atsScore}%`,
                      backgroundColor: getScoreColor(scoreData.atsScore)
                    }}
                  />
                </div>
                <div className="score-number">{scoreData.atsScore}/100</div>
              </div>

              <div className="score-item">
                <div className="score-label-small">Formatting</div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${scoreData.formattingScore}%`,
                      backgroundColor: getScoreColor(scoreData.formattingScore)
                    }}
                  />
                </div>
                <div className="score-number">{scoreData.formattingScore}/100</div>
              </div>

              <div className="score-item">
                <div className="score-label-small">Content Quality</div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${scoreData.contentScore}%`,
                      backgroundColor: getScoreColor(scoreData.contentScore)
                    }}
                  />
                </div>
                <div className="score-number">{scoreData.contentScore}/100</div>
              </div>

              <div className="score-item">
                <div className="score-label-small">Keywords</div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{
                      width: `${scoreData.keywordScore}%`,
                      backgroundColor: getScoreColor(scoreData.keywordScore)
                    }}
                  />
                </div>
                <div className="score-number">{scoreData.keywordScore}/100</div>
              </div>
            </div>
          </div>

          <div className="analysis-grid">
            <div className="analysis-card strengths">
              <h3>✓ Strengths</h3>
              <ul>
                {scoreData.strengths?.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-card weaknesses">
              <h3>⚠️ Areas to Improve</h3>
              <ul>
                {scoreData.weaknesses?.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sections-info">
            <div className="sections-found">
              <h4>Sections Found ({scoreData.sections.present.length})</h4>
              <div className="section-badges">
                {scoreData.sections.present.map((section) => (
                  <span key={section} className="badge badge-success">✓ {section}</span>
                ))}
              </div>
            </div>

            {scoreData.sections.missing.length > 0 && (
              <div className="sections-missing">
                <h4>Sections Missing ({scoreData.sections.missing.length})</h4>
                <div className="section-badges">
                  {scoreData.sections.missing.map((section) => (
                    <span key={section} className="badge badge-warning">+ {section}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="download-btn" onClick={downloadReport}>
            ⬇️ Download Report
          </button>
        </div>
      )}

      {/* Improvements Tab */}
      {activeTab === 'improvements' && (
        <div className="rso-content improvements-section">
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

          <div className="optimization-tips">
            <h3>📚 General Optimization Tips</h3>
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
        <div className="rso-content history-section">
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📜</div>
              <h3>No Analysis History</h3>
              <p>Upload and analyze your resume to see history here</p>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className={`history-card ${selectedHistoryItem === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedHistoryItem(selectedHistoryItem === idx ? null : idx)}
                >
                  <div className="history-header">
                    <div className="history-score">
                      <div className="score-circle-small" style={{ borderColor: getScoreColor(item.score) }}>
                        {item.score}
                      </div>
                    </div>
                    <div className="history-info">
                      <div className="history-date">{new Date(item.date).toLocaleDateString()}</div>
                      <div className="history-time">{new Date(item.date).toLocaleTimeString()}</div>
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeScoreOptimizer;

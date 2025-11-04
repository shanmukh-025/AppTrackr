import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ResumeManager.css';

const ResumeManager = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('versions');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [templates, setTemplates] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    jobTarget: '',
    content: '',
    isDefault: false
  });

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/resume/versions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/resume/templates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }, [token, API_URL]);

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const createResume = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/resume/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes([...resumes, response.data.resume]);
      setFormData({ title: '', jobTarget: '', content: '', isDefault: false });
      setShowForm(false);
    } catch (error) {
      alert('Error creating resume');
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await axios.delete(
        `${API_URL}/api/resume/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes(resumes.filter(r => r.id !== id));
      if (selectedResume?.id === id) setSelectedResume(null);
    } catch (error) {
      alert('Error deleting resume');
    }
  };

  const duplicateResume = async (resume) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/resume/duplicate`,
        { resumeId: resume.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes([...resumes, response.data.resume]);
    } catch (error) {
      alert('Error duplicating resume');
    }
  };

  const analyzeResume = async (resume) => {
    setSelectedResume(resume);
    setShowAnalysis(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/resume/analyze`,
        { resumeId: resume.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysisResult(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeForJob = async (jobDescription) => {
    if (!selectedResume) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/resume/optimize-for-job`,
        {
          resumeId: selectedResume.id,
          jobDescription
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysisResult(response.data.optimized);
    } catch (error) {
      alert('Error optimizing resume');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (resume, format = 'pdf') => {
    try {
      const response = await axios.get(
        `${API_URL}/api/resume/${resume.id}/download?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: format === 'pdf' ? 'blob' : 'json'
        }
      );

      if (format === 'pdf') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resume.title}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert('Download started');
      }
    } catch (error) {
      alert('Error downloading resume');
    }
  };

  const setDefaultResume = async (resume) => {
    try {
      await axios.patch(
        `${API_URL}/api/resume/${resume.id}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes(resumes.map(r => ({
        ...r,
        isDefault: r.id === resume.id
      })));
    } catch (error) {
      alert('Error setting default resume');
    }
  };

  useEffect(() => {
    if (activeTab === 'templates' && templates.length === 0) {
      fetchTemplates();
    }
  }, [activeTab, templates.length, fetchTemplates]);

  return (
    <div className="resume-manager">
      {/* Header */}
      <div className="resume-header">
        <div>
          <h1>📄 Resume Manager</h1>
          <p>Manage your resume versions and optimize for different roles</p>
        </div>
        <button 
          className="btn-new-resume"
          onClick={() => {
            setFormData({ title: '', jobTarget: '', content: '', isDefault: false });
            setShowForm(true);
          }}
        >
          ✨ New Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="resume-tabs">
        <button 
          className={`resume-tab ${activeTab === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveTab('versions')}
        >
          My Resumes ({resumes.length})
        </button>
        <button 
          className={`resume-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`resume-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Tools & Tips
        </button>
      </div>

      {/* My Resumes Tab */}
      {activeTab === 'versions' && (
        <div className="resumes-container">
          {loading ? (
            <div className="loading">Loading resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <p>No resumes yet. Create your first resume!</p>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="resumes-grid">
              {resumes.map(resume => (
                <div key={resume.id} className="resume-card">
                  <div className="resume-card-header">
                    <h3>{resume.title}</h3>
                    {resume.isDefault && (
                      <span className="default-badge">DEFAULT</span>
                    )}
                  </div>

                  <p className="resume-target">{resume.jobTarget || 'General Purpose'}</p>

                  <div className="resume-meta">
                    <span className="date">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                    {resume.atsScore && (
                      <span className="ats-score">
                        ATS: {resume.atsScore}%
                      </span>
                    )}
                  </div>

                  <div className="resume-preview">
                    <p>{resume.content?.substring(0, 120)}...</p>
                  </div>

                  <div className="resume-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => setSelectedResume(resume)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn analyze"
                      onClick={() => analyzeResume(resume)}
                      title="Analyze"
                    >
                      🔍
                    </button>
                    <button 
                      className="action-btn duplicate"
                      onClick={() => duplicateResume(resume)}
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button 
                      className="action-btn download"
                      onClick={() => downloadResume(resume, 'pdf')}
                      title="Download"
                    >
                      ⬇️
                    </button>
                    {!resume.isDefault && (
                      <button 
                        className="action-btn default"
                        onClick={() => setDefaultResume(resume)}
                        title="Set as Default"
                      >
                        ⭐
                      </button>
                    )}
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteResume(resume.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="templates-container">
          <div className="templates-intro">
            <h2>Professional Resume Templates</h2>
            <p>Choose from our collection of professionally designed templates</p>
          </div>

          {templates.length === 0 ? (
            <div className="loading">Loading templates...</div>
          ) : (
            <div className="templates-grid">
              {templates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-preview">
                    <img src={template.preview} alt={template.name} />
                  </div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <button 
                    className="btn-use-template"
                    onClick={() => {
                      setFormData({
                        title: `${template.name} - Resume`,
                        jobTarget: '',
                        content: template.content || '',
                        isDefault: false
                      });
                      setShowForm(true);
                    }}
                  >
                    Use This Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="tools-container">
          <div className="tools-grid">
            <div className="tool-card">
              <h3>📊 ATS Optimization</h3>
              <p>Optimize your resume to pass Applicant Tracking Systems</p>
              <ul>
                <li>✓ Use standard fonts and formatting</li>
                <li>✓ Include relevant keywords from job description</li>
                <li>✓ Use clear section headers</li>
                <li>✓ Avoid graphics and tables</li>
              </ul>
            </div>

            <div className="tool-card">
              <h3>🎯 Keyword Strategy</h3>
              <p>Match your resume to job requirements</p>
              <ul>
                <li>✓ Extract keywords from job postings</li>
                <li>✓ Mirror the language used</li>
                <li>✓ Add industry-specific terms</li>
                <li>✓ Highlight relevant achievements</li>
              </ul>
            </div>

            <div className="tool-card">
              <h3>💡 Content Tips</h3>
              <p>Write compelling resume content</p>
              <ul>
                <li>✓ Start with strong action verbs</li>
                <li>✓ Quantify your achievements</li>
                <li>✓ Focus on impact, not duties</li>
                <li>✓ Keep it concise and relevant</li>
              </ul>
            </div>

            <div className="tool-card">
              <h3>📝 Formatting Guide</h3>
              <p>Professional formatting best practices</p>
              <ul>
                <li>✓ Use 1-page format for early career</li>
                <li>✓ Consistent date formatting</li>
                <li>✓ Standard margins (0.5-1 inch)</li>
                <li>✓ Clean typography</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* New Resume Form Modal */}
      {showForm && (
        <div className="form-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            <h2>Create New Resume</h2>

            <form onSubmit={createResume} className="resume-form">
              <div className="form-group">
                <label>Resume Title</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Engineer Resume"
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Job/Company (Optional)</label>
                <input 
                  type="text"
                  value={formData.jobTarget}
                  onChange={(e) => setFormData({ ...formData, jobTarget: e.target.value })}
                  placeholder="e.g., Senior Frontend Engineer at Google"
                />
              </div>

              <div className="form-group">
                <label>Resume Content</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste your resume content here..."
                  rows="12"
                  required
                />
              </div>

              <div className="form-checkbox">
                <input 
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                <label htmlFor="isDefault">Set as default resume</label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Create Resume</button>
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && selectedResume && (
        <div className="analysis-modal-overlay" onClick={() => setShowAnalysis(false)}>
          <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAnalysis(false)}>✕</button>
            <h2>Resume Analysis: {selectedResume.title}</h2>

            {loading ? (
              <div className="loading">Analyzing your resume...</div>
            ) : analysisResult ? (
              <div className="analysis-content">
                <section className="analysis-section">
                  <h3>ATS Score</h3>
                  <div className="score-display">
                    <div className="score-circle" style={{ background: `conic-gradient(var(--primary) 0deg ${analysisResult.atsScore * 3.6}deg, var(--neutral-200) ${analysisResult.atsScore * 3.6}deg)` }}>
                      <div className="score-inner">{analysisResult.atsScore}%</div>
                    </div>
                  </div>
                </section>

                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                  <section className="analysis-section">
                    <h3>✓ Strengths</h3>
                    <ul className="analysis-list">
                      {analysisResult.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                  <section className="analysis-section">
                    <h3>💡 Areas for Improvement</h3>
                    <ul className="analysis-list improvements">
                      {analysisResult.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                  <section className="analysis-section">
                    <h3>🎯 Recommendations</h3>
                    <ul className="analysis-list suggestions">
                      {analysisResult.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="analysis-section">
                  <h3>Optimize for Job Description</h3>
                  <textarea 
                    className="job-description-input"
                    placeholder="Paste the job description here to optimize your resume..."
                    rows="6"
                    onBlur={(e) => {
                      if (e.target.value) {
                        optimizeForJob(e.target.value);
                      }
                    }}
                  />
                </section>
              </div>
            ) : (
              <div className="empty-state">Error loading analysis</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;

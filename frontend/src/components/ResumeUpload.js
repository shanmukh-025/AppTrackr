import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = ({ onResumeUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysisJob, setAnalysisJob] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // Load resumes on mount
  React.useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await axios.get('/api/resumes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadResume(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadResume(files[0]);
    }
  };

  const uploadResume = async (file) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, JPG, or PNG file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        console.log('✅ Resume uploaded successfully');
        setUploadProgress(0);
        loadResumes();
        if (onResumeUploaded) onResumeUploaded(response.data.resume);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload resume: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const analyzeResume = async () => {
    if (!selectedResume || !analysisJob) {
      alert('Please select a resume and enter job description');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await axios.post(
        `/api/resumes/${selectedResume.id}/analyze`,
        { jobDescription: analysisJob },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze resume: ' + error.response?.data?.error);
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        loadResumes();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete resume');
      }
    }
  };

  return (
    <div className="resume-upload-container">
      <h2>📄 Resume Manager</h2>

      {/* Upload Section */}
      <div
        className={`upload-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
            <p>Uploading and parsing resume...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <p>Drag your resume here or click to select</p>
            <p className="upload-hint">Supports PDF, DOCX, JPG (Max 10MB)</p>
            <button
              className="btn-browse"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>

      {/* Resumes List */}
      {resumes.length > 0 && (
        <div className="resumes-list">
          <h3>Your Resumes ({resumes.length})</h3>
          <div className="resume-cards">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`resume-card ${selectedResume?.id === resume.id ? 'selected' : ''}`}
                onClick={() => setSelectedResume(resume)}
              >
                <div className="card-header">
                  <h4>{resume.name}</h4>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(resume.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="card-info">
                  {resume.personalInfo?.fullName && (
                    <p><strong>Name:</strong> {resume.personalInfo.fullName}</p>
                  )}
                  {resume.personalInfo?.email && (
                    <p><strong>Email:</strong> {resume.personalInfo.email}</p>
                  )}
                  <p><strong>Skills:</strong> {resume.skills?.slice(0, 3).join(', ')}</p>
                  <p className="upload-date">📅 {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {selectedResume && (
        <div className="analysis-section">
          <h3>🔍 Analyze Resume Against Job</h3>
          <textarea
            value={analysisJob}
            onChange={(e) => setAnalysisJob(e.target.value)}
            placeholder="Paste job description here..."
            rows="6"
            className="job-description-input"
          />
          <button
            onClick={analyzeResume}
            disabled={analyzing || !analysisJob}
            className="btn-analyze"
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </button>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="analysis-results">
              <div className="results-header">
                <h4>Analysis Results</h4>
              </div>

              <div className="score-section">
                <div className="score-box">
                  <div className="score-number">{analysisResult.analysis?.overallScore || 0}</div>
                  <div className="score-label">Overall Score</div>
                </div>
                {analysisResult.analysis?.matchScore && (
                  <div className="score-box">
                    <div className="score-number">{analysisResult.analysis.matchScore}</div>
                    <div className="score-label">Match Score</div>
                  </div>
                )}
              </div>

              {analysisResult.analysis?.strengths && (
                <div className="results-box">
                  <h5>✅ Strengths</h5>
                  <ul>
                    {analysisResult.analysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.analysis?.weaknesses && (
                <div className="results-box">
                  <h5>⚠️ Weaknesses</h5>
                  <ul>
                    {analysisResult.analysis.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.analysis?.skillsMatched && (
                <div className="results-box">
                  <h5>🎯 Skills Matched</h5>
                  <div className="tags">
                    {analysisResult.analysis.skillsMatched.map((skill, i) => (
                      <span key={i} className="tag matched">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.analysis?.skillsGaps && (
                <div className="results-box">
                  <h5>🔴 Skills Gaps</h5>
                  <div className="tags">
                    {analysisResult.analysis.skillsGaps.map((skill, i) => (
                      <span key={i} className="tag gap">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.analysis?.suggestions && (
                <div className="results-box">
                  <h5>💡 Suggestions</h5>
                  <ol>
                    {analysisResult.analysis.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;

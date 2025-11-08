import React, { useState } from 'react';
import axios from 'axios';
import './AIFeatures.css';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Resume Generator State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [generatedResume, setGeneratedResume] = useState(null);

  // Cover Letter State
  const [clCompany, setClCompany] = useState('');
  const [clPosition, setClPosition] = useState('');
  const [clJobDesc, setClJobDesc] = useState('');
  const [clTone, setClTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState(null);

  // ATS Checker State
  const [atsResumeText, setAtsResumeText] = useState('');
  const [atsResult, setAtsResult] = useState(null);

  // Resume Generator
  const generateResume = async () => {
    if (!fullName || !targetRole || !skills) {
      alert('Please fill in at least Name, Target Role, and Skills');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/generate-resume`,
        { 
          fullName,
          email,
          phone,
          targetRole,
          experience,
          skills
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGeneratedResume(response.data.resume);
    } catch (error) {
      console.error('Resume generation error:', error);
      alert('Failed to generate resume: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Generate Resume PDF
  const generateResumePDF = async () => {
    if (!fullName || !targetRole || !skills) {
      alert('Please fill in at least Name, Target Role, and Skills');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ai/generate-resume-pdf`,
        { 
          fullName,
          email,
          phone,
          targetRole,
          experience,
          skills
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' // Important for PDF download
        }
      );

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${fullName.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      alert('✅ PDF Resume downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Cover Letter Generator
  const generateCoverLetter = async () => {
    if (!clCompany || !clPosition || !clJobDesc) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📝 Sending cover letter request...');
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      console.log('Payload:', { clCompany, clPosition, clJobDesc, clTone });

      const response = await axios.post(
        `${API_URL}/api/ai/generate-cover-letter`,
        {
          company: clCompany,
          position: clPosition,
          jobDescription: clJobDesc,
          tone: clTone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Response received:', response.data);
      setCoverLetter(response.data.coverLetter);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Full error:', error);
      alert('Failed to generate cover letter: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ATS Compatibility Check
  const checkATSScore = async () => {
    if (!atsResumeText || atsResumeText.trim().length === 0) {
      alert('Please paste your resume text');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Checking ATS compatibility...');

      const response = await axios.post(
        `${API_URL}/api/ai/check-ats`,
        { resumeText: atsResumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ ATS check complete:', response.data);
      setAtsResult(response.data.analysis);
    } catch (error) {
      console.error('ATS check error:', error);
      alert('Failed to check ATS score: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-features-container">
      <div className="ai-header">
        <h1>🤖 AI Career Assistant</h1>
        <p>Powered by Advanced AI - Get personalized career help</p>
      </div>

      <div className="ai-tabs">
        <button
          className={activeTab === 'resume' ? 'tab-active' : ''}
          onClick={() => setActiveTab('resume')}
        >
          📄 Resume Generator
        </button>
        <button
          className={activeTab === 'cover' ? 'tab-active' : ''}
          onClick={() => setActiveTab('cover')}
        >
          ✉️ Cover Letter
        </button>
        <button
          className={activeTab === 'ats' ? 'tab-active' : ''}
          onClick={() => setActiveTab('ats')}
        >
          🎯 ATS Score Checker
        </button>
      </div>

      {/* RESUME GENERATOR TAB */}
      {activeTab === 'resume' && (
        <div className="ai-content">
          <div className="ai-section">
            <h2>AI Resume Generator</h2>
            <p>Generate a professional resume tailored to your target role</p>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g., John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="e.g., john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  placeholder="e.g., +1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Target Role:</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Work Experience:</label>
              <textarea
                rows={6}
                placeholder="Describe your work experience, projects, and achievements..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Skills:</label>
              <textarea
                rows={4}
                placeholder="List your skills (e.g., JavaScript, React, Node.js, Python, etc.)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <button
              className="ai-button"
              onClick={generateResume}
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '✨ Generate Resume'}
            </button>

            <button
              className="ai-button"
              onClick={generateResumePDF}
              disabled={loading}
              style={{ marginLeft: '10px', background: '#e74c3c' }}
            >
              {loading ? '🔄 Generating...' : '📄 Generate PDF Resume'}
            </button>

            {generatedResume && (
              <div className="ai-results">
                <h3>Your Generated Resume</h3>
                <div className="resume-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {generatedResume.content}
                  </pre>
                </div>
                <div className="action-buttons">
                  <button onClick={() => navigator.clipboard.writeText(generatedResume.content)}>
                    📋 Copy to Clipboard
                  </button>
                  <button onClick={() => {
                    const blob = new Blob([generatedResume.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'resume.txt';
                    a.click();
                  }}>
                    💾 Download as Text
                  </button>
                  <button onClick={generateResumePDF} disabled={loading}>
                    📄 Download as PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COVER LETTER TAB */}
      {activeTab === 'cover' && (
        <div className="ai-content">
          <div className="ai-section">
            <h2>Cover Letter Generator</h2>
            <p>Generate personalized cover letters in seconds</p>

            <div className="form-row">
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  placeholder="e.g., Google"
                  value={clCompany}
                  onChange={(e) => setClCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Position:</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={clPosition}
                  onChange={(e) => setClPosition(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description:</label>
              <textarea
                rows={6}
                placeholder="Paste the job description..."
                value={clJobDesc}
                onChange={(e) => setClJobDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tone:</label>
              <select value={clTone} onChange={(e) => setClTone(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>

            <button
              className="ai-button"
              onClick={generateCoverLetter}
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '✨ Generate Cover Letter'}
            </button>

            {coverLetter && (
              <div className="ai-results">
                <h3>Your Cover Letter</h3>
                <div className="cover-letter-content">
                  {coverLetter.content}
                </div>
                <div className="action-buttons">
                  <button onClick={() => navigator.clipboard.writeText(coverLetter.content)}>
                    📋 Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ATS SCORE CHECKER TAB */}
      {activeTab === 'ats' && (
        <div className="ai-content">
          <div className="ai-section">
            <h2>🎯 ATS Compatibility Checker</h2>
            <p>Check how well your resume passes Applicant Tracking Systems</p>

            <div className="form-group">
              <label>Paste Your Resume Text:</label>
              <textarea
                rows={12}
                placeholder="Paste your entire resume text here..."
                value={atsResumeText}
                onChange={(e) => setAtsResumeText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '14px' }}
              />
            </div>

            <button
              className="ai-button"
              onClick={checkATSScore}
              disabled={loading}
            >
              {loading ? '🔄 Analyzing...' : '🎯 Check ATS Score'}
            </button>

            {atsResult && (
              <div className="ai-results">
                <div className="ats-score-header">
                  <h3>ATS Compatibility Score</h3>
                  <div className="score-circle" style={{
                    background: `conic-gradient(
                      ${atsResult.overallScore >= 80 ? '#2ecc71' : 
                        atsResult.overallScore >= 60 ? '#f39c12' : '#e74c3c'} 
                      ${atsResult.overallScore * 3.6}deg, 
                      #ecf0f1 0deg
                    )`
                  }}>
                    <div className="score-inner">
                      <span className="score-number">{atsResult.overallScore}</span>
                      <span className="score-label">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="ats-categories">
                  <h4>📊 Category Breakdown</h4>
                  {Object.entries(atsResult.categories || {}).map(([key, value]) => (
                    <div key={key} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="category-score">{value.score}/100</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${value.score}%`,
                            backgroundColor: value.score >= 80 ? '#2ecc71' : 
                                           value.score >= 60 ? '#f39c12' : '#e74c3c'
                          }}
                        />
                      </div>
                      <p className="category-feedback">{value.feedback}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                {atsResult.strengths && atsResult.strengths.length > 0 && (
                  <div className="ats-section">
                    <h4>✅ Strengths</h4>
                    <ul className="ats-list success">
                      {atsResult.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {atsResult.warnings && atsResult.warnings.length > 0 && (
                  <div className="ats-section">
                    <h4>⚠️ Warnings</h4>
                    <ul className="ats-list warning">
                      {atsResult.warnings.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Critical Issues */}
                {atsResult.criticalIssues && atsResult.criticalIssues.length > 0 && (
                  <div className="ats-section">
                    <h4>🚫 Critical Issues</h4>
                    <ul className="ats-list error">
                      {atsResult.criticalIssues.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                  <div className="ats-section">
                    <h4>💡 Suggestions for Improvement</h4>
                    <ul className="ats-list info">
                      {atsResult.suggestions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Elements */}
                {atsResult.missingElements && atsResult.missingElements.length > 0 && (
                  <div className="ats-section">
                    <h4>📋 Missing Elements</h4>
                    <ul className="ats-list">
                      {atsResult.missingElements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detected Keywords */}
                {atsResult.detectedKeywords && atsResult.detectedKeywords.length > 0 && (
                  <div className="ats-section">
                    <h4>🔑 Detected Keywords</h4>
                    <div className="keywords-cloud">
                      {atsResult.detectedKeywords.map((keyword, idx) => (
                        <span key={idx} className="keyword-badge">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                {atsResult.recommendation && (
                  <div className="ats-section recommendation">
                    <h4>📝 Overall Recommendation</h4>
                    <p>{atsResult.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeatures;

import React, { useState } from 'react';
import axios from 'axios';
import './AIFeatures.css';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);

  // Resume Analyzer State
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  // Cover Letter State
  const [clCompany, setClCompany] = useState('');
  const [clPosition, setClPosition] = useState('');
  const [clJobDesc, setClJobDesc] = useState('');
  const [clTone, setClTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState(null);

  // Interview Prep State
  const [ipCompany, setIpCompany] = useState('');
  const [ipPosition, setIpPosition] = useState('');
  const [ipJobDesc, setIpJobDesc] = useState('');
  const [interviewPrep, setInterviewPrep] = useState(null);

  // Resume Analyzer
  const analyzeResume = async () => {
    if (!resumeText) {
      alert('Please enter your resume text');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/analyze-resume',
        { resumeText, jobDescription: jobDescription || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResumeAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Resume analysis error:', error);
      alert('Failed to analyze resume: ' + (error.response?.data?.error || error.message));
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
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-cover-letter',
        {
          company: clCompany,
          position: clPosition,
          jobDescription: clJobDesc,
          tone: clTone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCoverLetter(response.data.coverLetter);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      alert('Failed to generate cover letter: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Interview Prep Generator
  const generateInterviewPrep = async () => {
    if (!ipCompany || !ipPosition || !ipJobDesc) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-interview-prep',
        {
          company: ipCompany,
          position: ipPosition,
          jobDescription: ipJobDesc
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterviewPrep(response.data.interviewPrep);
    } catch (error) {
      console.error('Interview prep generation error:', error);
      alert('Failed to generate interview prep: ' + (error.response?.data?.error || error.message));
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
          📄 Resume Analyzer
        </button>
        <button
          className={activeTab === 'cover' ? 'tab-active' : ''}
          onClick={() => setActiveTab('cover')}
        >
          ✉️ Cover Letter
        </button>
        <button
          className={activeTab === 'interview' ? 'tab-active' : ''}
          onClick={() => setActiveTab('interview')}
        >
          💼 Interview Prep
        </button>
      </div>

      {/* RESUME ANALYZER TAB */}
      {activeTab === 'resume' && (
        <div className="ai-content">
          <div className="ai-section">
            <h2>Resume Analyzer</h2>
            <p>Get AI-powered feedback on your resume</p>

            <div className="form-group">
              <label>Your Resume (paste text):</label>
              <textarea
                rows={10}
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Job Description (optional - for matching):</label>
              <textarea
                rows={6}
                placeholder="Paste job description to see how well your resume matches..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              className="ai-button"
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? '🔄 Analyzing...' : '🚀 Analyze Resume'}
            </button>

            {resumeAnalysis && (
              <div className="ai-results">
                <h3>Analysis Results</h3>
                <div className="score-cards">
                  <div className="score-card">
                    <div className="score-value">{resumeAnalysis.overallScore}/100</div>
                    <div className="score-label">Overall Score</div>
                  </div>
                  {resumeAnalysis.matchScore && (
                    <div className="score-card">
                      <div className="score-value">{resumeAnalysis.matchScore}/100</div>
                      <div className="score-label">Job Match</div>
                    </div>
                  )}
                </div>

                {resumeAnalysis.skillsMatched && resumeAnalysis.skillsMatched.length > 0 && (
                  <div className="result-section">
                    <h4>✅ Skills Matched</h4>
                    <div className="skills-list">
                      {resumeAnalysis.skillsMatched.map((skill, idx) => (
                        <span key={idx} className="skill-badge matched">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeAnalysis.skillsGaps && resumeAnalysis.skillsGaps.length > 0 && (
                  <div className="result-section">
                    <h4>⚠️ Missing Skills</h4>
                    <div className="skills-list">
                      {resumeAnalysis.skillsGaps.map((skill, idx) => (
                        <span key={idx} className="skill-badge gap">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeAnalysis.strengths && resumeAnalysis.strengths.length > 0 && (
                  <div className="result-section">
                    <h4>💪 Strengths</h4>
                    <ul>
                      {resumeAnalysis.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resumeAnalysis.weaknesses && resumeAnalysis.weaknesses.length > 0 && (
                  <div className="result-section">
                    <h4>🔧 Areas to Improve</h4>
                    <ul>
                      {resumeAnalysis.weaknesses.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resumeAnalysis.suggestions && resumeAnalysis.suggestions.length > 0 && (
                  <div className="result-section">
                    <h4>💡 Suggestions</h4>
                    <ul>
                      {resumeAnalysis.suggestions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* INTERVIEW PREP TAB */}
      {activeTab === 'interview' && (
        <div className="ai-content">
          <div className="ai-section">
            <h2>Interview Preparation</h2>
            <p>Get likely interview questions and sample answers</p>

            <div className="form-row">
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  placeholder="e.g., Microsoft"
                  value={ipCompany}
                  onChange={(e) => setIpCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Position:</label>
                <input
                  type="text"
                  placeholder="e.g., Full Stack Developer"
                  value={ipPosition}
                  onChange={(e) => setIpPosition(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description:</label>
              <textarea
                rows={6}
                placeholder="Paste the job description..."
                value={ipJobDesc}
                onChange={(e) => setIpJobDesc(e.target.value)}
              />
            </div>

            <button
              className="ai-button"
              onClick={generateInterviewPrep}
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '🎯 Generate Interview Questions'}
            </button>

            {interviewPrep && (
              <div className="ai-results">
                <h3>Interview Questions & Answers</h3>
                {interviewPrep.questions && interviewPrep.questions.map((q, idx) => (
                  <div key={idx} className="interview-question">
                    <div className="question-header">
                      <span className="question-number">Q{idx + 1}</span>
                      <span className={`question-tag ${q.category}`}>{q.category}</span>
                      <span className={`difficulty-tag ${q.difficulty}`}>{q.difficulty}</span>
                    </div>
                    <div className="question-text">{q.question}</div>
                    <div className="answer-text">
                      <strong>Sample Answer:</strong> {q.answer}
                    </div>
                  </div>
                ))}

                {interviewPrep.tips && interviewPrep.tips.length > 0 && (
                  <div className="result-section">
                    <h4>💡 Interview Tips</h4>
                    <ul>
                      {interviewPrep.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
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

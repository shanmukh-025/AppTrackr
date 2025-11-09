import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ResumeVersions.css';

const ResumeVersions = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showCompanyTracking, setShowCompanyTracking] = useState(false);
  const [newCompany, setNewCompany] = useState({ company: '', position: '' });
  const token = localStorage.getItem('token');

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setResumes(data.resumes || []);
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleTrackSent = async (resumeId) => {
    if (!newCompany.company) {
      alert('Please enter company name');
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}/mark-sent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCompany)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the resume in state
        setResumes(resumes.map(r => 
          r.id === resumeId 
            ? { ...r, companiesSentTo: data.companiesSentTo }
            : r
        ));
        
        setNewCompany({ company: '', position: '' });
        setShowCompanyTracking(false);
        
        alert(`Resume marked as sent to ${newCompany.company}`);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to track company');
      }
    } catch (err) {
      alert('Error tracking company');
      console.error(err);
    }
  };

  const handleRemoveCompany = async (resumeId, company) => {
    if (!window.confirm(`Remove ${company} from tracking?`)) return;

    try {
      const response = await fetch(`/api/resumes/${resumeId}/remove-company-sent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company })
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(resumes.map(r => 
          r.id === resumeId 
            ? { ...r, companiesSentTo: data.companiesSentTo }
            : r
        ));
        alert(`${company} removed from tracking`);
      }
    } catch (err) {
      alert('Error removing company');
      console.error(err);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== resumeId));
        setSelectedResume(null);
        alert('Resume deleted');
      }
    } catch (err) {
      alert('Error deleting resume');
      console.error(err);
    }
  };

  return (
    <div className="resume-versions-container">
      <div className="resume-versions-header">
        <h1>📋 Resume Versions</h1>
        <p>Manage multiple resume versions and track which companies received each</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading resumes...</div>}

      <div className="resume-versions-grid">
        <div className="resumes-list">
          <h2>Your Resumes</h2>
          {resumes.length === 0 ? (
            <div className="empty-state">
              <p>No resumes yet. Create one from the AI Resume Generator!</p>
            </div>
          ) : (
            resumes.map(resume => (
              <div
                key={resume.id}
                className={`resume-item ${selectedResume?.id === resume.id ? 'active' : ''}`}
                onClick={() => setSelectedResume(resume)}
              >
                <div className="resume-item-header">
                  <h3>{resume.name}</h3>
                  <span className="version-badge">v{resume.version}</span>
                </div>
                {resume.description && (
                  <p className="resume-description">{resume.description}</p>
                )}
                <div className="resume-item-meta">
                  <small>Created: {new Date(resume.createdAt).toLocaleDateString()}</small>
                  <span className="companies-count">
                    🏢 {resume.companiesSentTo?.length || 0} companies
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedResume && (
          <div className="resume-details">
            <div className="details-header">
              <h2>{selectedResume.name}</h2>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteResume(selectedResume.id)}
              >
                🗑️ Delete
              </button>
            </div>

            <div className="details-section">
              <h3>Version Information</h3>
              <div className="info-grid">
                <div>
                  <strong>Version:</strong> {selectedResume.version}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(selectedResume.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(selectedResume.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {selectedResume.description && (
              <div className="details-section">
                <h3>Description</h3>
                <p>{selectedResume.description}</p>
              </div>
            )}

            <div className="details-section">
              <div className="companies-header">
                <h3>Companies This Resume Was Sent To</h3>
                <button 
                  className="track-btn"
                  onClick={() => setShowCompanyTracking(!showCompanyTracking)}
                >
                  + Add Company
                </button>
              </div>

              {showCompanyTracking && (
                <div className="company-tracking-form">
                  <input
                    type="text"
                    placeholder="Company name (e.g., Google)"
                    value={newCompany.company}
                    onChange={(e) => setNewCompany({...newCompany, company: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Position applied for (optional)"
                    value={newCompany.position}
                    onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                  />
                  <div className="form-actions">
                    <button 
                      className="save-btn"
                      onClick={() => handleTrackSent(selectedResume.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => setShowCompanyTracking(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {selectedResume.companiesSentTo && selectedResume.companiesSentTo.length > 0 ? (
                <div className="companies-list">
                  {selectedResume.companiesSentTo.map((sent, idx) => (
                    <div key={idx} className="company-item">
                      <div className="company-info">
                        <h4>{sent.company}</h4>
                        {sent.position && <p>{sent.position}</p>}
                        <small>Sent: {new Date(sent.sentDate).toLocaleDateString()}</small>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveCompany(selectedResume.id, sent.company)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-companies">
                  <p>No companies tracked yet. Add one to keep track!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeVersions;

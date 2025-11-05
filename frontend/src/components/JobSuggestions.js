import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobSuggestions.css';

const JobSuggestions = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchJobSuggestions();
    fetchStats();
  }, []);

  const fetchJobSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/jobs/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 6 } // Show 6 jobs on dashboard
      });

      if (response.data.success) {
        setJobs(response.data.data.jobs);
        // Check if there's a message about missing skills
        if (response.data.data.message && response.data.data.jobs.length === 0) {
          setError(response.data.data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching job suggestions:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load job suggestions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/jobs/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleJobClick = async (job) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/jobs/track-click`,
        { jobId: job.id, source: job.source },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Open job URL in new tab
      window.open(job.url, '_blank');
    } catch (err) {
      console.error('Error tracking click:', err);
      // Still open the job even if tracking fails
      window.open(job.url, '_blank');
    }
  };

  const getSourceBadge = (source) => {
    const badges = {
      remoteok: { color: '#6B7280', text: 'RemoteOK', icon: '🔗' },
      remotive: { color: '#6B7280', text: 'Remotive', icon: '🔗' },
      jooble: { color: '#6B7280', text: 'Jooble', icon: '🔗' },
      apijobs: { color: '#6B7280', text: 'APIJobs', icon: '🔗' },
      arbeitnow: { color: '#6B7280', text: 'Arbeitnow', icon: '🔗' }
    };
    
    const badge = badges[source] || { color: '#757575', text: source, icon: '🔗' };
    
    const tooltip = 'Opens job listing page (all free APIs redirect)';
    
    return (
      <span className="source-badge" style={{ backgroundColor: badge.color }} title={tooltip}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const getJobAge = (postedDate) => {
    if (!postedDate) return null;
    
    const now = new Date();
    const posted = new Date(postedDate);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Posted today', color: '#4CAF50', icon: '🆕' };
    if (diffDays === 1) return { text: 'Posted yesterday', color: '#4CAF50', icon: '🆕' };
    if (diffDays <= 7) return { text: `Posted ${diffDays} days ago`, color: '#4CAF50', icon: '🆕' };
    if (diffDays <= 14) return { text: `Posted ${diffDays} days ago`, color: '#FF9800', icon: '📅' };
    if (diffDays <= 30) return { text: `Posted ${diffDays} days ago`, color: '#FF9800', icon: '📅' };
    return { text: `Posted ${diffDays} days ago`, color: '#757575', icon: '📅' };
  };

  const getRelevanceColor = (score) => {
    if (score >= 40) return '#4CAF50'; // Green - High relevance
    if (score >= 20) return '#FF9800'; // Orange - Medium relevance
    return '#757575'; // Gray - Low relevance
  };

  if (loading) {
    return (
      <div className="job-suggestions">
        <div className="suggestions-header">
          <h2>💼 Job Suggestions For You</h2>
          <p>Personalized recommendations based on your profile</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Finding the best jobs for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-suggestions">
        <div className="suggestions-header">
          <h2>💼 Job Suggestions For You</h2>
        </div>
        <div className="error-container">
          <p className="error-message">💡 {error}</p>
          <p className="error-hint">Add skills like JavaScript, Python, React, etc. to your profile to get personalized job recommendations!</p>
          <div className="error-actions">
            <button 
              className="profile-btn"
              onClick={() => window.location.href = '/profile'}
            >
              📝 Update Profile
            </button>
            <button className="retry-btn" onClick={fetchJobSuggestions}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-suggestions">
      <div className="suggestions-header">
        <div>
          <h2>💼 Job Suggestions For You</h2>
          <p>Based on your skills and profile</p>
        </div>
        {stats && stats.rateLimits && stats.rateLimits.jooble && stats.rateLimits.apijobs && (
          <div className="api-stats">
            <div className="stat-item">
              <span className="stat-label">Jooble:</span>
              <span className="stat-value">{stats.rateLimits.jooble.remaining}/{stats.rateLimits.jooble.limit}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">APIJobs:</span>
              <span className="stat-value">{stats.rateLimits.apijobs.remaining}/{stats.rateLimits.apijobs.limit}</span>
            </div>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>😔 No job suggestions found. Try updating your profile with more skills!</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="badge-group">
                    {getSourceBadge(job.source)}
                    {job.postedDate && (() => {
                      const age = getJobAge(job.postedDate);
                      return age ? (
                        <span 
                          className="age-badge" 
                          style={{ backgroundColor: age.color }}
                          title={new Date(job.postedDate).toLocaleDateString()}
                        >
                          {age.icon} {age.text}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
                
                <p className="job-company">🏢 {job.company}</p>
                <p className="job-location">📍 {job.location || 'Location not specified'}</p>
                
                {job.description && (
                  <p className="job-description">
                    {job.description.substring(0, 120)}
                    {job.description.length > 120 ? '...' : ''}
                  </p>
                )}

                <div className="job-footer">
                  <div className="job-meta">
                    {job.type && <span className="job-type">{job.type}</span>}
                    {job.salary && <span className="job-salary">💰 {job.salary}</span>}
                  </div>
                  
                  <div className="job-actions">
                    <div 
                      className="relevance-score" 
                      style={{ color: getRelevanceColor(job.relevanceScore) }}
                      title={`Relevance: ${job.relevanceScore}%`}
                    >
                      ⭐ {job.relevanceScore}%
                    </div>
                    {/* PRIORITIZE CAREER PAGE! */}
                    {job.companyCareerPage ? (
                      <a
                        href={job.companyCareerPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn direct-apply-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🟢 GREEN BUTTON CLICKED!');
                          console.log('  Opening career page:', job.companyCareerPage);
                        }}
                        title="Apply directly at company website!"
                      >
                        ✅ Apply at {job.company} →
                      </a>
                    ) : (
                      <button 
                        className="apply-btn"
                        onClick={() => handleJobClick(job)}
                        title="View job listing"
                      >
                        View Job Details →
                      </button>
                    )}
                  </div>
                </div>
                
                {/* SECONDARY: Show job listing link */}
                {job.companyCareerPage && (
                  <div className="company-career-link">
                    <span className="career-link-label">ℹ️ Or view full job listing:</span>
                    <button 
                      className="career-link-btn secondary"
                      onClick={() => handleJobClick(job)}
                    >
                      📋 View on {job.source.charAt(0).toUpperCase() + job.source.slice(1)} →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="view-all-container">
            <button 
              className="view-all-btn"
              onClick={() => window.location.href = '/jobs'}
            >
              View All Jobs
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobSuggestions;

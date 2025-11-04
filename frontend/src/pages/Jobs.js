import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobFilters from '../components/JobFilters';
import './Jobs.css';

// Jobs page with advanced filtering
const Jobs = () => {
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: '',
    remote: false
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchSavedSearches = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/jobs/saved-searches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSearches(response.data);
    } catch (err) {
      console.error('Error fetching saved searches:', err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  const handleFilterChange = (newFilters) => {
    // Auto-search when filters change (with debounce would be better)
    if (newFilters.search || newFilters.location || newFilters.techStack.length > 0) {
      handleSearchWithFilters(newFilters);
    }
  };

  const handleSaveSearch = async (searchData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/jobs/saved-searches`,
        searchData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSavedSearches();
      alert('✅ Search saved successfully!');
    } catch (err) {
      console.error('Error saving search:', err);
      alert('❌ Failed to save search');
    }
  };

  const handleDeleteSearch = async (searchId) => {
    if (window.confirm('Delete this saved search?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/jobs/saved-searches/${searchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSavedSearches();
      } catch (err) {
        console.error('Error deleting search:', err);
      }
    }
  };

  const handleSearchWithFilters = async (searchFilters) => {
    if (!searchFilters.search && !searchFilters.techStack.length) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      
      const token = localStorage.getItem('token');
      const params = {
        keywords: searchFilters.search || searchFilters.techStack.join(' '),
        location: searchFilters.location || undefined,
        remote: searchFilters.remoteOnly || undefined,
        salaryMin: searchFilters.salaryMin || undefined,
        salaryMax: searchFilters.salaryMax || undefined,
        experienceLevel: searchFilters.experienceLevel || undefined,
        jobType: searchFilters.jobType || undefined,
        limit: 50
      };

      const response = await axios.get(`${API_URL}/api/jobs/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setJobs(response.data.data.jobs);
      }
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err.response?.data?.error || 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.keywords.trim()) {
      setError('Please enter keywords to search');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/jobs/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keywords: searchParams.keywords,
          location: searchParams.location || undefined,
          remote: searchParams.remote || undefined,
          limit: 20
        }
      });

      if (response.data.success) {
        setJobs(response.data.data.jobs);
        if (response.data.data.jobs.length === 0) {
          setError('No jobs found. Try different keywords or location.');
        }
      } else {
        setError(response.data.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to search jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (job) => {
    try {
      const token = localStorage.getItem('token');
      
      // Track the click
      await axios.post(
        `${API_URL}/api/jobs/track-click`,
        { jobId: job.id, source: job.source },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Open the job URL in a new tab
      const jobUrl = job.companyCareerPage || job.url;
      if (jobUrl) {
        window.open(jobUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Error tracking click:', err);
      // Still open the URL even if tracking fails
      const jobUrl = job.companyCareerPage || job.url;
      if (jobUrl) {
        window.open(jobUrl, '_blank', 'noopener,noreferrer');
      }
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
    if (score >= 40) return '#4CAF50';
    if (score >= 20) return '#FF9800';
    return '#757575';
  };

  return (
    <div className="jobs-page">
      <div className="page-header card">
        <div>
          <h1>🔍 Search Jobs</h1>
          <p>Find your next opportunity from thousands of job listings</p>
        </div>
        <button 
          className="btn btn-primary toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '❌ Hide Filters' : '⚙️ Show Filters'}
        </button>
      </div>

      <div className="jobs-content">
        {/* Advanced Filters Panel */}
        {showFilters && (
          <aside className="filters-sidebar">
            <JobFilters
              onFilterChange={handleFilterChange}
              onSaveSearch={handleSaveSearch}
              savedSearches={savedSearches}
              onLoadSearch={(search) => handleFilterChange(search.filters)}
              onDeleteSearch={handleDeleteSearch}
            />
          </aside>
        )}

        {/* Main Content */}
        <div className={`jobs-main ${showFilters ? '' : 'full-width'}`}>
          {/* Search Form */}
          <div className="card search-container">
            <div className="card-header">
              <h3>Search Jobs</h3>
            </div>
            <form onSubmit={handleSearch} className="card-body search-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label htmlFor="keywords">Keywords *</label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    className="form-input"
                    value={searchParams.keywords}
                    onChange={handleInputChange}
                    placeholder="e.g. React Developer, Python Engineer"
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    placeholder="e.g. New York, Remote"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={searchParams.remote}
                      onChange={handleInputChange}
                    />
                    <span>Remote jobs only</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary search-btn" disabled={loading}>
                  {loading ? '🔄 Searching...' : '🔍 Search Jobs'}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Searching across multiple job boards...</p>
            </div>
          )}

          {/* Results */}
          {!loading && searched && (
            <div className="results-container">
              <div className="results-header">
                <h2>
                  {jobs.length > 0 
                    ? `Found ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`
                    : 'No jobs found'}
                </h2>
                {jobs.length > 0 && (
                  <p>Showing results for "{searchParams.keywords}"</p>
                )}
              </div>

              {jobs.length === 0 ? (
                <div className="no-results">
                  <p>😔 No jobs found for your search criteria.</p>
                  <p>Try adjusting your keywords or location.</p>
                </div>
              ) : (
                <div className="jobs-list">
                  {jobs.map((job) => (
                    <div key={job.id} className="card job-card-large">
                      <div className="job-card-header">
                        <div className="job-title-section">
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
                        <div 
                          className="relevance-score" 
                          style={{ color: getRelevanceColor(job.relevanceScore) }}
                          title={`Relevance: ${job.relevanceScore}%`}
                        >
                          ⭐ {job.relevanceScore}%
                        </div>
                      </div>

                      <div className="job-info-row">
                        <p className="job-company">🏢 {job.company}</p>
                        <p className="job-location">📍 {job.location || 'Location not specified'}</p>
                      </div>

                      {job.description && (
                        <p className="job-description">
                          {job.description.substring(0, 250)}
                          {job.description.length > 250 ? '...' : ''}
                        </p>
                      )}

                      <div className="job-footer">
                        <div className="job-meta">
                          {job.type && <span className="badge badge-info">{job.type}</span>}
                          {job.salary && <span className="badge badge-success">💰 {job.salary}</span>}
                          {job.snippet && <span className="badge badge-info">📝 Details available</span>}
                        </div>
                        
                        <button 
                          className="apply-btn"
                          onClick={() => handleJobClick(job)}
                          title="Opens job application page in new tab"
                        >
                          🔗 View Job & Apply →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!loading && !searched && (
            <div className="card initial-state">
              <div className="search-illustration">🎯</div>
              <h3>Start Your Job Search</h3>
              <p>Enter keywords above to find jobs from multiple sources</p>
              <div className="alert alert-info search-tips">
                <h4>💡 Search Tips:</h4>
                <ul>
                  <li>Use specific job titles like "React Developer" or "Data Scientist"</li>
                  <li>Add location for more targeted results</li>
                  <li>Enable "Remote jobs only" for work-from-home opportunities</li>
                  <li>Try different keywords if you don't find what you're looking for</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;

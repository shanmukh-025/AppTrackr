import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdvancedJobFiltering.css';

const AdvancedJobFiltering = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    salaryMin: 0,
    salaryMax: 200000,
    experienceLevel: '',
    techStack: [],
    remoteTypes: [], // on-site, hybrid, remote
    jobTypes: [], // full-time, part-time, contract, internship
    companyReputation: 'all',
    datePosted: 'all' // all, 7days, 30days
  });

  const [savedFilters, setSavedFilters] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoriteJobs, setFavoriteJobs] = useState([]); // eslint-disable-line no-unused-vars
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [activeTab, setActiveTab] = useState('filters');

  const remoteOptions = [
    { value: 'on-site', label: '🏢 On-site', icon: '🏢' },
    { value: 'hybrid', label: '🔄 Hybrid', icon: '🔄' },
    { value: 'remote', label: '🏠 Remote', icon: '🏠' }
  ];

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const techOptions = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'Go',
    'TypeScript', 'JavaScript', 'C++', 'C#', '.NET',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'GraphQL', 'REST API', 'Microservices', 'DevOps'
  ];

  const companyReputations = [
    { value: 'all', label: 'All Companies' },
    { value: 'startup', label: '🚀 Startups' },
    { value: 'scale-up', label: '📈 Scale-ups' },
    { value: 'established', label: '🏛️ Established' },
    { value: 'fortune500', label: '⭐ Fortune 500' }
  ];

  const fetchSavedFilters = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/filters/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedFilters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching saved filters:', error);
    }
  }, [token, API_URL]);

  const fetchSearchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/search-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchSavedFilters();
    fetchSearchHistory();
  }, [fetchSavedFilters, fetchSearchHistory]);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/jobs/search`,
        filters,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setJobs(response.data.data || []);
      setNotification({ type: 'success', message: `Found ${response.data.data?.length || 0} jobs` });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to search jobs' });
    } finally {
      setLoading(false);
    }
  };

  const saveFilter = async () => {
    if (!filterName.trim()) {
      setNotification({ type: 'error', message: 'Please enter a filter name' });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/jobs/filters/save`,
        { name: filterName, filters },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotification({ type: 'success', message: 'Filter saved successfully!' });
      setFilterName('');
      setShowSaveDialog(false);
      fetchSavedFilters();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save filter' });
    }
  };

  const loadFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteFilter = async (filterId) => {
    try {
      await axios.delete(
        `${API_URL}/api/jobs/filters/${filterId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotification({ type: 'success', message: 'Filter deleted' });
      fetchSavedFilters();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete filter' });
    }
  };

  const toggleTech = (tech) => {
    setFilters(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const toggleRemoteType = (type) => {
    setFilters(prev => ({
      ...prev,
      remoteTypes: prev.remoteTypes.includes(type)
        ? prev.remoteTypes.filter(t => t !== type)
        : [...prev.remoteTypes, type]
    }));
  };

  const toggleJobType = (type) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter(t => t !== type)
        : [...prev.jobTypes, type]
    }));
  };

  const formatSalary = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      salaryMin: 0,
      salaryMax: 200000,
      experienceLevel: '',
      techStack: [],
      remoteTypes: [],
      jobTypes: [],
      companyReputation: 'all',
      datePosted: 'all'
    });
  };

  return (
    <div className="advanced-job-filtering">
      <div className="filtering-header">
        <h2>🔍 Advanced Job Search</h2>
        <p>Find your perfect job with powerful filtering options</p>
      </div>

      <div className="filtering-container">
        {/* Tabs */}
        <div className="filtering-tabs">
          <button 
            className={`tab ${activeTab === 'filters' ? 'active' : ''}`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
          <button 
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved ({savedFilters.length})
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        <div className="filtering-content">
          {activeTab === 'filters' && (
            <div className="filters-panel">
              {/* Search Input */}
              <div className="filter-section">
                <label>🔎 Job Title & Keywords</label>
                <input
                  type="text"
                  placeholder="e.g., Senior React Developer"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="filter-input"
                />
              </div>

              {/* Location */}
              <div className="filter-section">
                <label>📍 Location</label>
                <input
                  type="text"
                  placeholder="City, State, or Country"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="filter-input"
                />
              </div>

              {/* Remote Types */}
              <div className="filter-section">
                <label>🏢 Work Type</label>
                <div className="button-group">
                  {remoteOptions.map(option => (
                    <button
                      key={option.value}
                      className={`filter-btn ${filters.remoteTypes.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => toggleRemoteType(option.value)}
                    >
                      {option.icon} {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Types */}
              <div className="filter-section">
                <label>💼 Employment Type</label>
                <div className="button-group">
                  {jobTypeOptions.map(option => (
                    <button
                      key={option.value}
                      className={`filter-btn ${filters.jobTypes.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => toggleJobType(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="filter-section">
                <label>💰 Salary Range</label>
                <div className="salary-display">
                  {formatSalary(filters.salaryMin)} - {formatSalary(filters.salaryMax)}
                </div>
                <div className="dual-range">
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={filters.salaryMin}
                    onChange={(e) => setFilters({...filters, salaryMin: parseInt(e.target.value)})}
                    className="range-input"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={filters.salaryMax}
                    onChange={(e) => setFilters({...filters, salaryMax: parseInt(e.target.value)})}
                    className="range-input"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="filter-section">
                <label>📊 Experience Level</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
                  className="filter-select"
                >
                  <option value="">Any Experience</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior (6-10 years)</option>
                  <option value="lead">Lead/Principal (10+ years)</option>
                </select>
              </div>

              {/* Company Reputation */}
              <div className="filter-section">
                <label>🏆 Company Type</label>
                <select
                  value={filters.companyReputation}
                  onChange={(e) => setFilters({...filters, companyReputation: e.target.value})}
                  className="filter-select"
                >
                  {companyReputations.map(rep => (
                    <option key={rep.value} value={rep.value}>{rep.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Posted */}
              <div className="filter-section">
                <label>📅 Posted Within</label>
                <select
                  value={filters.datePosted}
                  onChange={(e) => setFilters({...filters, datePosted: e.target.value})}
                  className="filter-select"
                >
                  <option value="all">Any Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>

              {/* Tech Stack */}
              <div className="filter-section">
                <label>💻 Tech Stack ({filters.techStack.length} selected)</label>
                <div className="tech-grid">
                  {techOptions.map(tech => (
                    <button
                      key={tech}
                      className={`tech-tag ${filters.techStack.includes(tech) ? 'selected' : ''}`}
                      onClick={() => toggleTech(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                <button 
                  className="btn-search"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  {loading ? '⏳ Searching...' : '🔍 Search Jobs'}
                </button>
                <button 
                  className="btn-save-filter"
                  onClick={() => setShowSaveDialog(true)}
                >
                  💾 Save Filter
                </button>
                <button 
                  className="btn-clear"
                  onClick={clearFilters}
                >
                  🔄 Clear All
                </button>
              </div>

              {/* Save Dialog */}
              {showSaveDialog && (
                <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>💾 Save Filter</h3>
                    <input
                      type="text"
                      placeholder="Filter name (e.g., 'Remote React Jobs')"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="filter-input"
                      autoFocus
                    />
                    <div className="modal-actions">
                      <button className="btn-cancel" onClick={() => setShowSaveDialog(false)}>Cancel</button>
                      <button className="btn-primary" onClick={saveFilter}>Save</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="saved-filters-panel">
              <h3>📋 Saved Filters</h3>
              {savedFilters.length === 0 ? (
                <div className="empty-state">
                  <p>No saved filters yet. Create one to quickly access your favorite search combinations!</p>
                </div>
              ) : (
                <div className="filters-list">
                  {savedFilters.map(filter => (
                    <div key={filter.id} className="filter-card">
                      <div className="card-header">
                        <h4>{filter.name}</h4>
                        <button
                          className="delete-btn"
                          onClick={() => deleteFilter(filter.id)}
                        >
                          ✕
                        </button>
                      </div>
                      <p className="filter-summary">
                        {filter.filters.search && `📍 ${filter.filters.search}`}
                        {filter.filters.location && ` • 🏢 ${filter.filters.location}`}
                        {filter.filters.techStack?.length > 0 && ` • 💻 ${filter.filters.techStack.length} techs`}
                      </p>
                      <button
                        className="load-btn"
                        onClick={() => loadFilter(filter)}
                      >
                        Load Filter
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="search-history-panel">
              <h3>📜 Search History</h3>
              {searchHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No search history yet. Your searches will appear here.</p>
                </div>
              ) : (
                <div className="history-list">
                  {searchHistory.map((item, idx) => (
                    <div key={idx} className="history-item">
                      <span className="history-text">{item.query}</span>
                      <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {jobs.length > 0 && (
        <div className="search-results">
          <h3>🎯 Search Results ({jobs.length} jobs)</h3>
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <h4>{job.title}</h4>
                <p className="company">{job.company}</p>
                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {formatSalary(job.salary)}</span>
                  <span>{job.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedJobFiltering;

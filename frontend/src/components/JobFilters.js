import { useState } from 'react';
import './JobFilters.css';

function JobFilters({ onFilterChange, onSaveSearch, savedSearches, onLoadSearch, onDeleteSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    salaryMin: 0,
    salaryMax: 200000,
    experienceLevel: '',
    techStack: [],
    remoteOnly: false,
    jobType: ''
  });

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  const experienceLevels = [
    { value: '', label: 'Any Experience' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' }
  ];

  const jobTypes = [
    { value: '', label: 'Any Type' },
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const techOptions = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'Angular', 'Vue.js', 'Next.js', 'Express', 'Django', 'Flask',
    'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'Git', 'CI/CD', 'Agile', 'Scrum'
  ];

  const handleSearch = () => {
    // Only trigger search when explicitly called
    onFilterChange(filters);
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTechToggle = (tech) => {
    setFilters(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleSalaryChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch({
        name: searchName,
        filters: filters
      });
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSearch = (search) => {
    setFilters(search.filters);
    setShowSavedSearches(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      salaryMin: 0,
      salaryMax: 200000,
      experienceLevel: '',
      techStack: [],
      remoteOnly: false,
      jobType: ''
    });
  };

  const formatSalary = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <div className="job-filters">
      <div className="filters-header">
        <h3>🔍 Filter Jobs</h3>
        <div className="filter-actions">
          <button 
            className="btn-icon"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            title="Saved Searches"
          >
            📋 {savedSearches?.length || 0}
          </button>
          <button 
            className="btn-icon"
            onClick={() => setShowSaveDialog(true)}
            title="Save Current Search"
          >
            💾
          </button>
          <button 
            className="btn-clear"
            onClick={handleClearFilters}
          >
            🔄 Clear
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="filter-group">
        <label>🔎 Keywords</label>
        <input
          type="text"
          placeholder="Job title, company, keywords..."
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Location */}
      <div className="filter-group">
        <label>📍 Location</label>
        <input
          type="text"
          placeholder="City, State, or Remote"
          value={filters.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Remote Toggle */}
      <div className="filter-group">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={filters.remoteOnly}
            onChange={(e) => handleInputChange('remoteOnly', e.target.checked)}
          />
          <span className="toggle-text">🏠 Remote Only</span>
        </label>
      </div>

      {/* Salary Range */}
      <div className="filter-group">
        <label>💰 Salary Range</label>
        <div className="salary-display">
          {formatSalary(filters.salaryMin)} - {formatSalary(filters.salaryMax)}
        </div>
        <div className="dual-slider">
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={filters.salaryMin}
            onChange={(e) => handleSalaryChange('salaryMin', e.target.value)}
            className="slider slider-min"
          />
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={filters.salaryMax}
            onChange={(e) => handleSalaryChange('salaryMax', e.target.value)}
            className="slider slider-max"
          />
        </div>
      </div>

      {/* Experience Level */}
      <div className="filter-group">
        <label>📊 Experience Level</label>
        <select
          value={filters.experienceLevel}
          onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
          className="filter-select"
        >
          {experienceLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="filter-group">
        <label>💼 Job Type</label>
        <select
          value={filters.jobType}
          onChange={(e) => handleInputChange('jobType', e.target.value)}
          className="filter-select"
        >
          {jobTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Stack */}
      <div className="filter-group">
        <label>💻 Tech Stack ({filters.techStack.length} selected)</label>
        <div className="tech-stack-grid">
          {techOptions.map(tech => (
            <button
              key={tech}
              className={`tech-tag ${filters.techStack.includes(tech) ? 'selected' : ''}`}
              onClick={() => handleTechToggle(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <div className="filter-group">
        <button 
          className="btn-search-filters"
          onClick={handleSearch}
        >
          🔍 Search Jobs
        </button>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>💾 Save Search</h3>
            <input
              type="text"
              placeholder="Search name (e.g., 'Remote React Jobs')"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="filter-input"
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveSearch}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {showSavedSearches && savedSearches && savedSearches.length > 0 && (
        <div className="saved-searches">
          <h4>📋 Saved Searches</h4>
          {savedSearches.map(search => (
            <div key={search.id} className="saved-search-item">
              <button
                className="load-search-btn"
                onClick={() => handleLoadSearch(search)}
              >
                🔍 {search.name}
              </button>
              <button
                className="delete-search-btn"
                onClick={() => onDeleteSearch(search.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobFilters;

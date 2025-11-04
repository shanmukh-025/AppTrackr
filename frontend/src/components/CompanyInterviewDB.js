import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/CompanyInterviewDB.css';

const CompanyInterviewDB = ({ setNotification }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [insights, setInsights] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/resources/companies', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setCompanies(response.data.data || []);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch companies' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const selectCompany = async (company) => {
    setSelectedCompany(company);

    try {
      const [detailsRes, questionsRes, insightsRes] = await Promise.all([
        axios.get(`/api/resources/company/${company.name}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/resources/company/${company.name}/questions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/resources/company/${company.name}/insights`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setCompanyDetails(detailsRes.data.data);
      setQuestions(questionsRes.data.data || []);
      setInsights(insightsRes.data.data);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch company details' });
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="company-db">
      <h2>🏢 Company Interview Database</h2>
      <p className="subtitle">Explore interview questions from top tech companies</p>

      <div className="db-container">
        {/* Companies List */}
        <div className="companies-panel">
          <h3>Companies</h3>

          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Companies Grid */}
          <div className="companies-list">
            {loading ? (
              <div className="loading">Loading companies...</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="no-results">No companies found</div>
            ) : (
              filteredCompanies.map(company => (
                <div
                  key={company.id}
                  className={`company-item ${selectedCompany?.id === company.id ? 'active' : ''}`}
                  onClick={() => selectCompany(company)}
                >
                  <div className="company-logo">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} />
                    ) : (
                      <div className="logo-placeholder">{company.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="company-info">
                    <h4>{company.name}</h4>
                    <p className="location">{company.headquarters}</p>
                    <div className="question-counts">
                      <span>{company.dsa_count} DSA</span>
                      <span>{company.system_design_count} SD</span>
                      <span>{company.behavioral_count} BH</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Panel */}
        {selectedCompany && companyDetails ? (
          <div className="details-panel">
            {/* Company Header */}
            <div className="company-header">
              <div className="header-logo">
                {selectedCompany.logo ? (
                  <img src={selectedCompany.logo} alt={selectedCompany.name} />
                ) : (
                  <div className="logo-large">{selectedCompany.name.charAt(0)}</div>
                )}
              </div>
              <div className="header-info">
                <h2>{selectedCompany.name}</h2>
                <p>{selectedCompany.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Avg Salary</h4>
                <p className="stat-value">${selectedCompany.avgSalary}K</p>
              </div>
              <div className="stat-card">
                <h4>Interview Duration</h4>
                <p className="stat-value">45-60 mins</p>
              </div>
              <div className="stat-card">
                <h4>Rounds</h4>
                <p className="stat-value">4-5</p>
              </div>
              <div className="stat-card">
                <h4>Success Rate</h4>
                <p className="stat-value">12%</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className="tab-btn active">Questions</button>
              <button className="tab-btn">Insights</button>
              <button className="tab-btn">Roadmap</button>
            </div>

            {/* Questions */}
            <div className="questions-section">
              <h3>Interview Questions ({questions.length})</h3>

              {/* Filter */}
              <div className="question-filter">
                {['All', 'DSA', 'System Design', 'Behavioral'].map(f => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Questions List */}
              <div className="questions-list">
                {questions.map((q, idx) => (
                  <div key={idx} className="question-card">
                    <div className="question-header">
                      <h4>{q.title || q.question}</h4>
                      <span className={`type-badge ${q.type?.toLowerCase()}`}>
                        {q.type || 'General'}
                      </span>
                    </div>
                    {q.difficulty && (
                      <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    )}
                    <p>{q.description || 'No description available'}</p>
                    <button className="practice-btn">Practice This Question</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            {insights && (
              <div className="insights-section">
                <h3>Interview Insights</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>Most Asked Topics</h4>
                    <ul>
                      {insights.topics?.map(topic => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="insight-card">
                    <h4>Interview Format</h4>
                    <p>{insights.format}</p>
                  </div>
                  <div className="insight-card">
                    <h4>Tips</h4>
                    <ul>
                      {insights.tips?.map(tip => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-details">
            <div className="empty-icon">🏢</div>
            <p>Select a company to view interview details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInterviewDB;

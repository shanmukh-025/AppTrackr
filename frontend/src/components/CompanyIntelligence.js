import React, { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/CompanyIntelligence.css';

const CompanyIntelligence = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const searchCompanies = useCallback(async (query) => {
    if (!query) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/companies/search?q=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const fetchCompanyDetails = useCallback(async (companyId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/companies/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedCompany(response.data.company);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    searchCompanies(e.target.value);
  };

  const handleCompanySelect = (company) => {
    fetchCompanyDetails(company.id);
  };

  const RatingBadge = ({ rating, label }) => (
    <div className="rating-badge">
      <div className="rating-stars">
        {'⭐'.repeat(Math.round(rating))}
      </div>
      <div className="rating-value">{rating?.toFixed(1) || 'N/A'}/5</div>
      <div className="rating-label">{label}</div>
    </div>
  );

  return (
    <div className="company-intelligence">
      {/* Header */}
      <div className="ci-header">
        <h1>🕵️ Company Intelligence</h1>
        <p>Research companies and make informed career decisions</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a company..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {loading && <span className="search-loading">Searching...</span>}
        </div>

        {/* Search Results */}
        {searchTerm && companies.length > 0 && (
          <div className="search-results">
            {companies.map(company => (
              <div
                key={company.id}
                className="company-result"
                onClick={() => handleCompanySelect(company)}
              >
                <div className="company-result-logo">
                  <img src={company.logo || 'https://via.placeholder.com/50'} alt={company.name} />
                </div>
                <div className="company-result-info">
                  <h3>{company.name}</h3>
                  <p>{company.industry}</p>
                </div>
                <div className="company-result-rating">
                  <span className="rating-display">{company.overallRating?.toFixed(1)}</span>
                  <span className="stars">{'⭐'.repeat(Math.round(company.overallRating || 0))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Details Modal */}
      {showDetails && selectedCompany && (
        <div className="details-overlay" onClick={() => setShowDetails(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>

            {/* Header Section */}
            <div className="company-header">
              <img src={selectedCompany.logo || 'https://via.placeholder.com/100'} alt={selectedCompany.name} />
              <div className="company-header-info">
                <h1>{selectedCompany.name}</h1>
                <p className="company-industry">{selectedCompany.industry}</p>
                <div className="company-meta">
                  <span>👥 {selectedCompany.size || 'Unknown'} employees</span>
                  <span>📍 {selectedCompany.location || 'Unknown'}</span>
                  <span>🌐 Founded {selectedCompany.founded || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="details-tabs">
              <button 
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
              <button 
                className={`tab ${activeTab === 'salary' ? 'active' : ''}`}
                onClick={() => setActiveTab('salary')}
              >
                Salary & Comp
              </button>
              <button 
                className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
                onClick={() => setActiveTab('interview')}
              >
                Interview
              </button>
            </div>

            {/* Tab Content */}
            <div className="details-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <div className="ratings-grid">
                    <RatingBadge rating={selectedCompany.overallRating} label="Overall Rating" />
                    <RatingBadge rating={selectedCompany.cultureRating} label="Culture & Values" />
                    <RatingBadge rating={selectedCompany.wlbRating} label="Work-Life Balance" />
                    <RatingBadge rating={selectedCompany.careerRating} label="Career Growth" />
                    <RatingBadge rating={selectedCompany.compensationRating} label="Compensation" />
                    <RatingBadge rating={selectedCompany.managementRating} label="Management" />
                  </div>

                  <section className="detail-section">
                    <h2>About</h2>
                    <p>{selectedCompany.description}</p>
                  </section>

                  <section className="detail-section">
                    <h2>Key Info</h2>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Company Size:</strong> {selectedCompany.size}
                      </div>
                      <div className="info-item">
                        <strong>Founded:</strong> {selectedCompany.founded}
                      </div>
                      <div className="info-item">
                        <strong>Headquarters:</strong> {selectedCompany.location}
                      </div>
                      <div className="info-item">
                        <strong>Industry:</strong> {selectedCompany.industry}
                      </div>
                    </div>
                  </section>

                  <section className="detail-section">
                    <h2>Tech Stack</h2>
                    <div className="tech-list">
                      {selectedCompany.techStack?.map(tech => (
                        <span key={tech} className="tech-item">{tech}</span>
                      ))}
                    </div>
                  </section>

                  {selectedCompany.financialStability && (
                    <section className="detail-section">
                      <h2>Financial Stability</h2>
                      <div className="stability-card">
                        <div className="stability-score">
                          <span className="score-value">{selectedCompany.financialStability}</span>
                          <span className="score-label">Overall Health</span>
                        </div>
                        <p className="stability-insight">{selectedCompany.financialInsight}</p>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  {selectedCompany.reviews && selectedCompany.reviews.length > 0 ? (
                    <div className="reviews-list">
                      {selectedCompany.reviews.map((review, idx) => (
                        <div key={idx} className="review-card">
                          <div className="review-header">
                            <div className="review-rating">
                              <span className="stars">{'⭐'.repeat(review.rating)}</span>
                              <span className="rating-value">{review.rating}/5</span>
                            </div>
                            <span className="review-role">{review.role}</span>
                            <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <p className="review-title">{review.title}</p>
                          <p className="review-text">{review.text}</p>
                          {review.pros && (
                            <div className="review-section-item">
                              <strong>Pros:</strong> {review.pros}
                            </div>
                          )}
                          {review.cons && (
                            <div className="review-section-item">
                              <strong>Cons:</strong> {review.cons}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">No reviews available</div>
                  )}
                </div>
              )}

              {/* Salary Tab */}
              {activeTab === 'salary' && (
                <div className="salary-section">
                  {selectedCompany.salaryData && selectedCompany.salaryData.length > 0 ? (
                    <div className="salary-list">
                      {selectedCompany.salaryData.map((salary, idx) => (
                        <div key={idx} className="salary-card">
                          <h3>{salary.role}</h3>
                          <div className="salary-range">
                            <div className="salary-item">
                              <span className="label">Base Salary</span>
                              <span className="value">${salary.baseSalary?.toLocaleString()}</span>
                            </div>
                            <div className="salary-item">
                              <span className="label">Total Comp</span>
                              <span className="value">${salary.totalComp?.toLocaleString()}</span>
                            </div>
                            <div className="salary-item">
                              <span className="label">Bonus</span>
                              <span className="value">{salary.bonus}%</span>
                            </div>
                            <div className="salary-item">
                              <span className="label">Equity</span>
                              <span className="value">${salary.equity?.toLocaleString()}</span>
                            </div>
                          </div>
                          {salary.level && (
                            <span className="level-badge">{salary.level}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">No salary data available</div>
                  )}
                </div>
              )}

              {/* Interview Tab */}
              {activeTab === 'interview' && (
                <div className="interview-section">
                  {selectedCompany.interviewData ? (
                    <>
                      <section className="detail-section">
                        <h2>Interview Difficulty</h2>
                        <div className="difficulty-card">
                          <div className="difficulty-score">
                            <span className="score-value">{selectedCompany.interviewData.difficulty}/10</span>
                            <span className="score-label">Overall Difficulty</span>
                          </div>
                        </div>
                      </section>

                      <section className="detail-section">
                        <h2>Common Rounds</h2>
                        <div className="rounds-list">
                          {selectedCompany.interviewData.rounds?.map((round, idx) => (
                            <div key={idx} className="round-card">
                              <h3>{round.name}</h3>
                              <p className="round-type">Type: {round.type}</p>
                              <p className="round-duration">Duration: {round.duration}</p>
                              <p className="round-desc">{round.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {selectedCompany.interviewData.tips && (
                        <section className="detail-section">
                          <h2>Interview Tips</h2>
                          <ul className="tips-list">
                            {selectedCompany.interviewData.tips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </section>
                      )}

                      {selectedCompany.interviewData.questionTopics && (
                        <section className="detail-section">
                          <h2>Common Question Topics</h2>
                          <div className="topics-grid">
                            {selectedCompany.interviewData.questionTopics.map((topic, idx) => (
                              <span key={idx} className="topic-tag">{topic}</span>
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  ) : (
                    <div className="no-data">No interview data available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <div className="empty-state-container">
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h2>Search for companies</h2>
            <p>Enter a company name to start researching</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyIntelligence;

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Companies.css';

function Companies() {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('my-applications');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  
  // Real data states
  const [myApplications, setMyApplications] = useState([]);
  const [hiringCompanies, setHiringCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalInterviews: 0,
    totalOffers: 0,
    activeCompanies: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch real application data
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch user's applications
      const appsRes = await axios.get(`${API_URL}/api/applications`, { headers });
      const applications = appsRes.data;
      
      // Group applications by company
      const companyMap = {};
      applications.forEach(app => {
        if (!companyMap[app.company]) {
          companyMap[app.company] = {
            company: app.company,
            logoUrl: app.logoUrl,
            applications: [],
            totalApps: 0,
            interviews: 0,
            offers: 0,
            rejected: 0,
            pending: 0
          };
        }
        
        companyMap[app.company].applications.push(app);
        companyMap[app.company].totalApps++;
        
        if (app.status === 'interview') companyMap[app.company].interviews++;
        if (app.status === 'offer') companyMap[app.company].offers++;
        if (app.status === 'rejected') companyMap[app.company].rejected++;
        if (app.status === 'applied') companyMap[app.company].pending++;
      });
      
      setMyApplications(Object.values(companyMap));
      
      // Calculate stats
      setStats({
        totalApplications: applications.length,
        totalInterviews: applications.filter(a => a.status === 'interview').length,
        totalOffers: applications.filter(a => a.status === 'offer').length,
        activeCompanies: Object.keys(companyMap).length
      });
      
      // Set hiring companies (mock data - in real app, this would come from an API)
      setHiringCompanies(generateHiringCompanies());
      
    } catch (error) {
      console.error('Error fetching companies data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHiringCompanies = () => {
    return [
      {
        id: 1,
        name: 'Google',
        logo: 'https://logo.clearbit.com/google.com',
        fallbackLogo: '🔍',
        industry: 'Technology',
        location: 'Mountain View, CA',
        employees: '150,000+',
        hiringFor: [
          { role: 'Software Engineer', experience: 'Mid-Senior', count: 15, salary: '$150k - $200k' },
          { role: 'Product Manager', experience: 'Senior', count: 8, salary: '$170k - $220k' },
          { role: 'Data Scientist', experience: 'Junior-Mid', count: 12, salary: '$130k - $180k' }
        ],
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k Match'],
        rating: 4.5,
        reviews: 15234,
        activelyHiring: true
      },
      {
        id: 2,
        name: 'Amazon',
        logo: 'https://logo.clearbit.com/amazon.com',
        fallbackLogo: '🔶',
        industry: 'E-commerce',
        location: 'Seattle, WA',
        employees: '1.6M+',
        hiringFor: [
          { role: 'Backend Engineer', experience: 'Mid-Senior', count: 20, salary: '$140k - $190k' },
          { role: 'Frontend Engineer', experience: 'Mid', count: 15, salary: '$135k - $185k' },
          { role: 'DevOps Engineer', experience: 'Senior', count: 10, salary: '$155k - $205k' }
        ],
        benefits: ['Health Insurance', 'Relocation', 'Tuition Reimbursement', 'Stock'],
        rating: 4.2,
        reviews: 25678,
        activelyHiring: true
      },
      {
        id: 3,
        name: 'Microsoft',
        logo: 'https://logo.clearbit.com/microsoft.com',
        fallbackLogo: '⬜',
        industry: 'Technology',
        location: 'Redmond, WA',
        employees: '220,000+',
        hiringFor: [
          { role: 'Cloud Engineer', experience: 'Mid-Senior', count: 18, salary: '$160k - $210k' },
          { role: 'Data Engineer', experience: 'Mid', count: 14, salary: '$145k - $195k' },
          { role: 'ML Engineer', experience: 'Senior', count: 9, salary: '$175k - $225k' }
        ],
        benefits: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Parental Leave'],
        rating: 4.4,
        reviews: 18945,
        activelyHiring: true
      },
      {
        id: 4,
        name: 'Meta',
        logo: 'https://logo.clearbit.com/meta.com',
        fallbackLogo: '👤',
        industry: 'Social Media',
        location: 'Menlo Park, CA',
        employees: '86,000+',
        hiringFor: [
          { role: 'React Engineer', experience: 'Mid-Senior', count: 12, salary: '$170k - $220k' },
          { role: 'iOS Engineer', experience: 'Mid', count: 10, salary: '$165k - $215k' },
          { role: 'Backend Engineer', experience: 'Senior', count: 14, salary: '$180k - $230k' }
        ],
        benefits: ['Health Insurance', 'Free Food', 'Gym', 'Education Support'],
        rating: 4.3,
        reviews: 12456,
        activelyHiring: true
      },
      {
        id: 5,
        name: 'Netflix',
        logo: 'https://logo.clearbit.com/netflix.com',
        fallbackLogo: '🎬',
        industry: 'Entertainment',
        location: 'Los Gatos, CA',
        employees: '12,000+',
        hiringFor: [
          { role: 'Backend Engineer', experience: 'Senior', count: 8, salary: '$165k - $215k' },
          { role: 'UI Engineer', experience: 'Mid-Senior', count: 6, salary: '$160k - $210k' },
          { role: 'Data Engineer', experience: 'Mid', count: 10, salary: '$155k - $205k' }
        ],
        benefits: ['Unlimited PTO', 'Parental Leave', 'Health Insurance', 'Stock Options'],
        rating: 4.4,
        reviews: 5432,
        activelyHiring: true
      },
      {
        id: 6,
        name: 'Tesla',
        logo: 'https://logo.clearbit.com/tesla.com',
        fallbackLogo: '⚡',
        industry: 'Automotive',
        location: 'Austin, TX',
        employees: '127,000+',
        hiringFor: [
          { role: 'Embedded Engineer', experience: 'Mid-Senior', count: 16, salary: '$155k - $205k' },
          { role: 'Full Stack Engineer', experience: 'Mid', count: 12, salary: '$145k - $195k' },
          { role: 'Automation Engineer', experience: 'Junior-Mid', count: 14, salary: '$125k - $175k' }
        ],
        benefits: ['Health Insurance', 'Stock Options', 'Gym', 'Commuter'],
        rating: 4.1,
        reviews: 8765,
        activelyHiring: true
      },
      {
        id: 7,
        name: 'LinkedIn',
        logo: 'https://logo.clearbit.com/linkedin.com',
        fallbackLogo: '💼',
        industry: 'Technology',
        location: 'Sunnyvale, CA',
        employees: '20,000+',
        hiringFor: [
          { role: 'Backend Engineer', experience: 'Mid-Senior', count: 11, salary: '$145k - $195k' },
          { role: 'Frontend Engineer', experience: 'Mid', count: 9, salary: '$140k - $190k' },
          { role: 'Data Scientist', experience: 'Senior', count: 7, salary: '$165k - $215k' }
        ],
        benefits: ['Health Insurance', 'InDay', 'Learning Access', 'Parental Leave'],
        rating: 4.3,
        reviews: 6543,
        activelyHiring: true
      },
      {
        id: 8,
        name: 'Stripe',
        logo: 'https://logo.clearbit.com/stripe.com',
        fallbackLogo: '💳',
        industry: 'Fintech',
        location: 'San Francisco, CA',
        employees: '8,000+',
        hiringFor: [
          { role: 'Software Engineer', experience: 'Mid-Senior', count: 14, salary: '$165k - $215k' },
          { role: 'Security Engineer', experience: 'Senior', count: 8, salary: '$175k - $225k' },
          { role: 'Product Engineer', experience: 'Mid', count: 10, salary: '$155k - $205k' }
        ],
        benefits: ['Health Insurance', 'Equity', 'Remote Work', 'Learning Budget'],
        rating: 4.6,
        reviews: 4321,
        activelyHiring: true
      }
    ];
  };

  const industries = ['all', 'Technology', 'E-commerce', 'Social Media', 'Entertainment', 'Automotive', 'Fintech'];
  const experienceLevels = ['all', 'Junior', 'Mid', 'Senior', 'Junior-Mid', 'Mid-Senior'];
  const roles = ['all', 'Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'];

  const filteredHiringCompanies = hiringCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || company.industry === filterIndustry;
    
    // Filter by experience and role in hiring positions
    let matchesExperience = filterExperience === 'all';
    let matchesRole = filterRole === 'all';
    
    if (filterExperience !== 'all' || filterRole !== 'all') {
      matchesExperience = filterExperience === 'all' || company.hiringFor.some(h => 
        h.experience.toLowerCase().includes(filterExperience.toLowerCase())
      );
      matchesRole = filterRole === 'all' || company.hiringFor.some(h => 
        h.role === filterRole
      );
    }
    
    return matchesSearch && matchesIndustry && matchesExperience && matchesRole;
  });

  if (loading) {
    return (
      <div className="companies-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading companies data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-container">
      {/* Header */}
      <div className="companies-header-section">
        <div className="header-content">
          <div className="header-text">
            <h1>🏢 Companies</h1>
            <p>Track and manage your job applications across top companies</p>
          </div>
          <div className="header-stats-mini">
            <div className="mini-stat">
              <span className="mini-stat-value">{myApplications.length}</span>
              <span className="mini-stat-label">Companies</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{filteredHiringCompanies.length}</span>
              <span className="mini-stat-label">Hiring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="companies-tabs-section">
        <div className="tabs-wrapper">
          <button 
            className={`companies-tab ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            <span className="tab-icon">⭐</span>
            <span>Featured Companies</span>
          </button>
          <button 
            className={`companies-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <span className="tab-icon">📋</span>
            <span>My Applications</span>
          </button>
          <button 
            className={`companies-tab ${activeTab === 'interviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviews')}
          >
            <span className="tab-icon">🎤</span>
            <span>Interviews</span>
          </button>
          <button 
            className={`companies-tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <span className="tab-icon">📊</span>
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Featured Companies Tab */}
      {activeTab === 'featured' && (
        <div className="tab-content">
          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              className="filter-select"
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
            <select 
              className="filter-select"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Experience Levels' : level}
                </option>
              ))}
            </select>
            <select 
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>

          {/* Companies Grid */}
          {filteredHiringCompanies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No Companies Found</h3>
              <p>Try adjusting your filters to see more companies.</p>
            </div>
          ) : (
            <div className="companies-grid">
              {filteredHiringCompanies.map((company) => (
                <div key={company.id} className="company-card" onClick={() => setSelectedCompany(company)}>
                  <div className="company-card-header">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="company-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="company-logo-fallback" style={{ display: company.logo ? 'none' : 'flex' }}>
                      {company.fallbackLogo}
                    </div>
                    <div className="company-basic-info">
                      <h3>{company.name}</h3>
                      <p className="company-industry">{company.industry}</p>
                    </div>
                    {company.activelyHiring && (
                      <span className="hiring-badge">🔥 Actively Hiring</span>
                    )}
                  </div>
                  
                  <div className="company-stats-row">
                    <div className="stat-item">
                      <span className="stat-icon">📍</span>
                      <span>{company.location}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👥</span>
                      <span>{company.employees}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <span>{company.rating} ({company.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>

                  <div className="hiring-positions">
                    <h4>Open Positions:</h4>
                    {company.hiringFor.slice(0, 3).map((position, idx) => (
                      <div key={idx} className="position-item">
                        <span className="position-role">{position.role}</span>
                        <span className="position-details">
                          {position.experience} • {position.count} {position.count === 1 ? 'opening' : 'openings'}
                        </span>
                        <span className="position-salary">{position.salary}</span>
                      </div>
                    ))}
                    {company.hiringFor.length > 3 && (
                      <p className="more-positions">+{company.hiringFor.length - 3} more positions</p>
                    )}
                  </div>

                  <div className="company-benefits">
                    {company.benefits.slice(0, 3).map((benefit, idx) => (
                      <span key={idx} className="benefit-tag">{benefit}</span>
                    ))}
                    {company.benefits.length > 3 && (
                      <span className="benefit-tag">+{company.benefits.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Applications Tab */}
      {activeTab === 'applications' && (
        <div className="tab-content">
          {myApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Applications Yet</h3>
              <p>Start applying to companies to track your applications here.</p>
            </div>
          ) : (
            <div className="applications-list">
              {myApplications.map((companyData, idx) => (
                <div key={idx} className="application-company-card">
                  <div className="company-header-row">
                    {companyData.logoUrl && (
                      <img 
                        src={companyData.logoUrl} 
                        alt={companyData.company}
                        className="company-logo-small"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="company-info">
                      <h3>{companyData.company}</h3>
                      <p>{companyData.totalApps} {companyData.totalApps === 1 ? 'Application' : 'Applications'}</p>
                    </div>
                    <div className="application-stats">
                      <span className="stat-badge pending">{companyData.pending} Pending</span>
                      <span className="stat-badge interview">{companyData.interviews} Interviews</span>
                      <span className="stat-badge offer">{companyData.offers} Offers</span>
                      {companyData.rejected > 0 && (
                        <span className="stat-badge rejected">{companyData.rejected} Rejected</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="applications-list-inner">
                    {companyData.applications.map((app) => (
                      <div key={app.id} className="application-item">
                        <div className="app-main-info">
                          <h4>{app.position}</h4>
                          <span className={`status-badge ${app.status}`}>{app.status}</span>
                        </div>
                        <div className="app-details">
                          <span>Applied: {new Date(app.dateApplied).toLocaleDateString()}</span>
                          {app.salary && <span>Salary: {app.salary}</span>}
                          {app.location && <span>📍 {app.location}</span>}
                        </div>
                        {app.notes && (
                          <p className="app-notes">{app.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interviews Tab */}
      {activeTab === 'interviews' && (
        <div className="tab-content">
          {myApplications.filter(c => c.interviews > 0).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>No Interviews Scheduled</h3>
              <p>Your scheduled interviews will appear here.</p>
            </div>
          ) : (
            <div className="interviews-list">
              {myApplications
                .filter(companyData => companyData.interviews > 0)
                .map((companyData, idx) => (
                  <div key={idx} className="interview-company-section">
                    <h3 className="company-name-header">{companyData.company}</h3>
                    {companyData.applications
                      .filter(app => app.status === 'interview')
                      .map(app => (
                        <div key={app.id} className="interview-card">
                          <div className="interview-header">
                            <h4>{app.position}</h4>
                            <span className="interview-status">Interview Scheduled</span>
                          </div>
                          <div className="interview-details">
                            <p><strong>Applied:</strong> {new Date(app.dateApplied).toLocaleDateString()}</p>
                            {app.location && <p><strong>Location:</strong> {app.location}</p>}
                            {app.salary && <p><strong>Salary Range:</strong> {app.salary}</p>}
                            {app.notes && (
                              <div className="interview-notes">
                                <strong>Notes:</strong>
                                <p>{app.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="tab-content">
          {myApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Insights Yet</h3>
              <p>Apply to companies to see insights about your application activity.</p>
            </div>
          ) : (
            <div className="insights-grid">
              <div className="insight-card">
                <h3>Top Active Companies</h3>
                <div className="insight-list">
                  {myApplications
                    .sort((a, b) => b.totalApps - a.totalApps)
                    .slice(0, 5)
                    .map((company, idx) => (
                      <div key={idx} className="insight-item">
                        <span className="company-name">{company.company}</span>
                        <span className="company-count">{company.totalApps} applications</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="insight-card">
                <h3>Success Rates</h3>
                <div className="success-stats">
                  <div className="success-stat">
                    <span className="stat-label">Interview Rate</span>
                    <span className="stat-value">
                      {stats.totalApplications > 0 
                        ? `${Math.round((stats.totalInterviews / stats.totalApplications) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="success-stat">
                    <span className="stat-label">Offer Rate</span>
                    <span className="stat-value">
                      {stats.totalApplications > 0 
                        ? `${Math.round((stats.totalOffers / stats.totalApplications) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="insight-card">
                <h3>Application Trends</h3>
                <div className="trend-info">
                  <p>Total Applications: <strong>{stats.totalApplications}</strong></p>
                  <p>Active Companies: <strong>{stats.activeCompanies}</strong></p>
                  <p>Pending Interviews: <strong>{stats.totalInterviews}</strong></p>
                  <p>Job Offers: <strong>{stats.totalOffers}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal-content company-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCompany(null)}>✕</button>
            
            <div className="modal-header">
              {selectedCompany.logo ? (
                <img 
                  src={selectedCompany.logo} 
                  alt={selectedCompany.name}
                  className="modal-company-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="modal-logo-fallback" style={{ display: selectedCompany.logo ? 'none' : 'flex' }}>
                {selectedCompany.fallbackLogo}
              </div>
              <div>
                <h2>{selectedCompany.name}</h2>
                <p className="modal-industry">{selectedCompany.industry}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="company-info-section">
                <h3>Company Info</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span>{selectedCompany.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Employees:</span>
                    <span>{selectedCompany.employees}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rating:</span>
                    <span>⭐ {selectedCompany.rating} ({selectedCompany.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="company-positions-section">
                <h3>Open Positions ({selectedCompany.hiringFor.length})</h3>
                <div className="positions-list">
                  {selectedCompany.hiringFor.map((position, idx) => (
                    <div key={idx} className="position-card">
                      <div className="position-header">
                        <h4>{position.role}</h4>
                        <span className="position-count">{position.count} {position.count === 1 ? 'opening' : 'openings'}</span>
                      </div>
                      <div className="position-info">
                        <span className="position-experience">{position.experience}</span>
                        <span className="position-salary">{position.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="company-benefits-section">
                <h3>Benefits & Perks</h3>
                <div className="benefits-grid">
                  {selectedCompany.benefits.map((benefit, idx) => (
                    <span key={idx} className="benefit-item">{benefit}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddApplication from '../components/AddApplication';
import './Pages.css';

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAdded = (newApp) => {
    setApplications([newApp, ...applications]);
    setShowAddModal(false);
  };

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏠 Dashboard</h1>
        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          + Add Application
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-value">
              {applications.filter(app => app.status === 'applied').length}
            </div>
            <div className="stat-label">Applied</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-content">
            <div className="stat-value">
              {applications.filter(app => 
                ['phone_screen', 'technical', 'onsite'].includes(app.status)
              ).length}
            </div>
            <div className="stat-label">In Interview</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">
              {applications.filter(app => app.status === 'offer').length}
            </div>
            <div className="stat-label">Offers</div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="dashboard-section">
        <h2>Recent Applications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet. Add your first one!</p>
          </div>
        ) : (
          <div className="recent-applications">
            {recentApplications.map((app) => (
              <div key={app.id} className="recent-app-card">
                {app.logoUrl && (
                  <img 
                    src={app.logoUrl} 
                    alt={app.company}
                    className="app-logo"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="app-info">
                  <h3>{app.company}</h3>
                  <p>{app.position}</p>
                </div>
                <div className="app-meta">
                  <span className="app-status">{app.status}</span>
                  <span className="app-date">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Follow-ups Section - Coming Soon */}
      <div className="dashboard-section">
        <h2>Follow-Ups</h2>
        <div className="coming-soon">
          <p>🚧 Coming soon! Track companies you need to follow up with.</p>
        </div>
      </div>

      {showAddModal && (
        <AddApplication 
          onApplicationAdded={handleApplicationAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
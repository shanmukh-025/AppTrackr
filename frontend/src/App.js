import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup';
import AddApplication from './components/AddApplication';
import EditApplication from './components/EditApplication';
import ApplicationsList from './components/ApplicationsList';
import './App.css';

function App() {
  const { user, loading, logout, token } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch applications when user logs in
  useEffect(() => {
    if (user && token) {
      fetchApplications();
    }
  }, [user, token]);

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const response = await axios.get(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleApplicationAdded = (newApp) => {
    setApplications([newApp, ...applications]);
    setShowAddModal(false);
  };

  const handleApplicationDeleted = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const handleEditClick = (app) => {
    setEditingApplication(app);
    setShowEditModal(true);
  };

  const handleApplicationUpdated = (updatedApp) => {
    setApplications(applications.map(app => 
      app.id === updatedApp.id ? updatedApp : app
    ));
    setShowEditModal(false);
    setEditingApplication(null);
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <div className="App">
        {showLogin ? (
          <Login onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="App">
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>🎯 AppTrackr</h1>
              <p>Welcome back, {user.name || user.email}!</p>
            </div>
            <div className="header-right">
              <button 
                className="add-button"
                onClick={() => setShowAddModal(true)}
              >
                + Add Application
              </button>
              <button 
                className="logout-button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-number">{applications.length}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {applications.filter(app => app.status === 'applied').length}
              </div>
              <div className="stat-label">Applied</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {applications.filter(app => 
                  ['phone_screen', 'technical', 'onsite'].includes(app.status)
                ).length}
              </div>
              <div className="stat-label">Interviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {applications.filter(app => app.status === 'offer').length}
              </div>
              <div className="stat-label">Offers</div>
            </div>
          </div>

          <div className="search-filter-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <select 
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="wishlist">📋 Wishlist</option>
              <option value="applied">📤 Applied</option>
              <option value="phone_screen">📞 Phone Screen</option>
              <option value="technical">💻 Technical</option>
              <option value="onsite">🏢 Onsite</option>
              <option value="offer">✅ Offer</option>
              <option value="rejected">❌ Rejected</option>
              <option value="ghosted">👻 Ghosted</option>
            </select>
          </div>

          {loadingApps ? (
            <div className="loading-applications">
              <p>Loading applications...</p>
            </div>
          ) : (
            <ApplicationsList 
              applications={filteredApplications}
              onApplicationDeleted={handleApplicationDeleted}
              onApplicationUpdated={handleEditClick}
            />
          )}
        </main>
      </div>

      {showAddModal && (
        <AddApplication 
          onApplicationAdded={handleApplicationAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && editingApplication && (
        <EditApplication
          application={editingApplication}
          onApplicationUpdated={handleApplicationUpdated}
          onClose={() => {
            setShowEditModal(false);
            setEditingApplication(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
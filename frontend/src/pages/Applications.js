import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddApplication from '../components/AddApplication';
import EditApplication from '../components/EditApplication';
import ApplicationsList from '../components/ApplicationsList';
import Pipeline from '../components/Pipeline';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import './Applications.css';

function Applications() {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [toast, setToast] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApplicationAdded = (newApp) => {
    setApplications([newApp, ...applications]);
    setShowAddModal(false);
    setToast({ message: 'Application added successfully!', type: 'success' });
  };

  const handleApplicationUpdated = (updatedApp) => {
    setApplications(applications.map(app =>
      app.id === updatedApp.id ? updatedApp : app
    ));
    setShowEditModal(false);
    setEditingApplication(null);
    setToast({ message: 'Application updated!', type: 'success' });
  };

  const handleApplicationDeleted = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    setToast({ message: 'Application deleted!', type: 'success' });
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interviewing: applications.filter(app => ['phone_screen', 'technical', 'onsite'].includes(app.status)).length,
    offers: applications.filter(app => app.status === 'offer').length,
  };

  return (
    <div className="page-container">
      
      {/* Header Title */}
      <div className="page-title-row">
        <h1 className="page-title">Applications</h1>
        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>+</span>
          Add Application
        </button>
      </div>

      {/* Quick Stats - Dashboard Style Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            📊
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-footer">💼 All Submissions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🚀
          </div>
          <div className="stat-content">
            <div className="stat-label">Applications Sent</div>
            <div className="stat-value">{stats.applied}</div>
            <div className="stat-footer">✨ Awaiting Response</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🎯
          </div>
          <div className="stat-content">
            <div className="stat-label">Interview Stage</div>
            <div className="stat-value">{stats.interviewing}</div>
            <div className="stat-footer">⚡ In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🎉
          </div>
          <div className="stat-content">
            <div className="stat-label">Offers Received</div>
            <div className="stat-value">{stats.offers}</div>
            <div className="stat-footer">🏆 Success!</div>
          </div>
        </div>
      </div>

      {/* 2. Compact Inline Filters */}
      <div className="inline-filters">
        <input 
          type="text" 
          className="search-input" 
          placeholder="🔍 Search applications..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="phone_screen">Phone Screen</option>
          <option value="technical">Technical</option>
          <option value="onsite">Onsite</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="ghosted">Ghosted</option>
        </select>
        <div className="view-toggle-inline">
          <button 
            className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
            title="List View"
          >
            ☰
          </button>
          <button 
            className={`view-btn ${activeView === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveView('pipeline')}
            title="Pipeline View"
          >
            ⋮⋮⋮
          </button>
        </div>
        {(searchQuery || statusFilter !== 'all') && (
          <button 
            className="clear-btn"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      {activeView === 'list' ? (
        loading ? (
          <LoadingSkeleton />
        ) : (
          <ApplicationsList
            applications={filteredApps}
            onApplicationDeleted={handleApplicationDeleted}
            onApplicationUpdated={setEditingApplication}
          />
        )
      ) : (
        <Pipeline applications={filteredApps} />
      )}

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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Applications;
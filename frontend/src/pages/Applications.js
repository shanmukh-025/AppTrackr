import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddApplication from '../components/AddApplication';
import EditApplication from '../components/EditApplication';
import ApplicationsList from '../components/ApplicationsList';
import Pipeline from '../components/Pipeline';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import './Pages.css';

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
    setToast({ message: 'Application added successfully!', type: 'success' });
  };

  const handleApplicationDeleted = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    setToast({ message: 'Application deleted', type: 'success' });
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
    setToast({ message: 'Application updated successfully!', type: 'success' });
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Applications</h1>
        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          + Add Application
        </button>
      </div>

      {/* Search & Filter */}
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
            <button className="clear-search" onClick={() => setSearchQuery('')}>
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

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`view-tab ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          📋 List View
        </button>
        <button 
          className={`view-tab ${activeView === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveView('pipeline')}
        >
          🎯 Pipeline
        </button>
      </div>

      {/* Content */}
      {activeView === 'list' && (
        loading ? (
          <LoadingSkeleton />
        ) : (
          <ApplicationsList 
            applications={filteredApplications}
            onApplicationDeleted={handleApplicationDeleted}
            onApplicationUpdated={handleEditClick}
          />
        )
      )}

      {activeView === 'pipeline' && (
        <Pipeline applications={filteredApplications} />
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
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ApplicationPipeline.css';

const ApplicationPipeline = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [applications, setApplications] = useState({
    applied: [],
    screening: [],
    interview: [],
    offer: [],
    rejected: [],
    accepted: []
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    successRate: 0,
    avgTimeToOffer: 0,
    inProgress: 0
  });

  const stages = [
    { id: 'applied', label: 'Applied', color: '#667eea', icon: '📝' },
    { id: 'screening', label: 'Screening', color: '#f093fb', icon: '👀' },
    { id: 'interview', label: 'Interview', color: '#4facfe', icon: '🎤' },
    { id: 'offer', label: 'Offer', color: '#43e97b', icon: '🎉' },
    { id: 'rejected', label: 'Rejected', color: '#fa709a', icon: '❌' },
    { id: 'accepted', label: 'Accepted', color: '#30b0fe', icon: '✅' }
  ];

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/applications/pipeline`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.applications) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const calculateStats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/applications/statistics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchApplications();
    calculateStats();
  }, [fetchApplications, calculateStats]);

  const handleDragStart = (e, app, fromStage) => {
    setDraggedItem({ app, fromStage });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e, toStage) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedItem) return;

    const { app, fromStage } = draggedItem;

    if (fromStage === toStage) {
      setDraggedItem(null);
      return;
    }

    try {
      // Update on backend
      await axios.patch(
        `${API_URL}/api/applications/${app.id}/stage`,
        { stage: toStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedApps = {
        ...applications,
        [fromStage]: applications[fromStage].filter(a => a.id !== app.id),
        [toStage]: [...applications[toStage], { ...app, stage: toStage }]
      };

      setApplications(updatedApps);
      calculateStats();
    } catch (error) {
      console.error('Error updating application stage:', error);
    } finally {
      setDraggedItem(null);
    }
  };

  const moveApplication = async (appId, fromStage, toStage) => {
    try {
      await axios.patch(
        `${API_URL}/api/applications/${appId}/stage`,
        { stage: toStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const app = applications[fromStage].find(a => a.id === appId);
      const updatedApps = {
        ...applications,
        [fromStage]: applications[fromStage].filter(a => a.id !== appId),
        [toStage]: [...applications[toStage], { ...app, stage: toStage }]
      };

      setApplications(updatedApps);
      calculateStats();
    } catch (error) {
      console.error('Error moving application:', error);
    }
  };

  const deleteApplication = async (appId, stage) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await axios.delete(
        `${API_URL}/api/applications/${appId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedApps = {
        ...applications,
        [stage]: applications[stage].filter(a => a.id !== appId)
      };

      setApplications(updatedApps);
      calculateStats();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const updateApplicationNotes = async (appId, stage, notes) => {
    try {
      await axios.patch(
        `${API_URL}/api/applications/${appId}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedApps = {
        ...applications,
        [stage]: applications[stage].map(a => 
          a.id === appId ? { ...a, notes } : a
        )
      };

      setApplications(updatedApps);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const ApplicationCard = ({ app, stage }) => (
    <div 
      className="app-card"
      draggable
      onDragStart={(e) => handleDragStart(e, app, stage)}
      onClick={() => {
        setSelectedApp({ ...app, currentStage: stage });
        setShowDetails(true);
      }}
    >
      <div className="app-card-header">
        <h4>{app.jobTitle}</h4>
        <span className="app-priority" data-priority={app.priority}>
          {app.priority}
        </span>
      </div>

      <p className="app-company">{app.company}</p>

      <div className="app-meta">
        <span className="app-date">
          {new Date(app.appliedDate).toLocaleDateString()}
        </span>
        {app.salary && <span className="app-salary">${app.salary}</span>}
      </div>

      {app.notes && (
        <p className="app-notes-preview">{app.notes.substring(0, 60)}...</p>
      )}

      <div className="app-actions">
        <button 
          className="app-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedApp({ ...app, currentStage: stage });
            setShowDetails(true);
          }}
          title="View Details"
        >
          👁️
        </button>
        <button 
          className="app-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteApplication(app.id, stage);
          }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const StageColumn = ({ stage }) => (
    <div
      className="pipeline-stage"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, stage.id)}
    >
      <div className="stage-header">
        <span className="stage-icon">{stage.icon}</span>
        <h3>{stage.label}</h3>
        <span className="stage-count">{applications[stage.id].length}</span>
      </div>

      <div className="stage-cards">
        {applications[stage.id].length === 0 ? (
          <div className="stage-empty">No applications</div>
        ) : (
          applications[stage.id].map(app => (
            <ApplicationCard key={app.id} app={app} stage={stage.id} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="application-pipeline">
      {/* Header */}
      <div className="pipeline-header">
        <div className="header-content">
          <h1>📊 Application Pipeline</h1>
          <p>Track your job applications through each stage</p>
        </div>

        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              📋 Kanban
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              📅 Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statistics.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statistics.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statistics.successRate}%</div>
          <div className="stat-label">Success Rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statistics.avgTimeToOffer}</div>
          <div className="stat-label">Avg Days to Offer</div>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="kanban-container">
          {loading ? (
            <div className="pipeline-loading">Loading applications...</div>
          ) : (
            <div className="pipeline-stages">
              {stages.map(stage => (
                <StageColumn key={stage.id} stage={stage} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="timeline-container">
          <div className="timeline">
            {Object.values(applications).flat().sort((a, b) => 
              new Date(b.appliedDate) - new Date(a.appliedDate)
            ).map((app, idx) => (
              <div key={app.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>{app.jobTitle}</h4>
                    <span className="timeline-date">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="timeline-company">{app.company}</p>
                  <span className="timeline-stage" data-stage={app.stage}>
                    {stages.find(s => s.id === app.stage)?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedApp && (
        <div className="details-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>

            <div className="details-header">
              <h2>{selectedApp.jobTitle}</h2>
              <span className="details-stage" data-stage={selectedApp.currentStage}>
                {stages.find(s => s.id === selectedApp.currentStage)?.label}
              </span>
            </div>

            <div className="details-content">
              <section className="detail-section">
                <h3>Company</h3>
                <p>{selectedApp.company}</p>
              </section>

              <section className="detail-section">
                <h3>Job Details</h3>
                <div className="detail-grid">
                  {selectedApp.salary && (
                    <div>
                      <strong>Salary:</strong> ${selectedApp.salary}
                    </div>
                  )}
                  {selectedApp.location && (
                    <div>
                      <strong>Location:</strong> {selectedApp.location}
                    </div>
                  )}
                  {selectedApp.jobType && (
                    <div>
                      <strong>Type:</strong> {selectedApp.jobType}
                    </div>
                  )}
                </div>
              </section>

              <section className="detail-section">
                <h3>Timeline</h3>
                <div className="timeline-detail">
                  <p><strong>Applied:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                  {selectedApp.lastInteractionDate && (
                    <p><strong>Last Activity:</strong> {new Date(selectedApp.lastInteractionDate).toLocaleDateString()}</p>
                  )}
                </div>
              </section>

              <section className="detail-section">
                <h3>Notes</h3>
                <textarea
                  className="notes-input"
                  value={selectedApp.notes || ''}
                  onChange={(e) => updateApplicationNotes(
                    selectedApp.id,
                    selectedApp.currentStage,
                    e.target.value
                  )}
                  placeholder="Add notes about this application..."
                  rows="4"
                />
              </section>

              <section className="detail-section">
                <h3>Move to Stage</h3>
                <div className="stage-buttons">
                  {stages.map(stage => (
                    <button
                      key={stage.id}
                      className={`stage-move-btn ${stage.id === selectedApp.currentStage ? 'current' : ''}`}
                      onClick={() => {
                        moveApplication(selectedApp.id, selectedApp.currentStage, stage.id);
                        setShowDetails(false);
                      }}
                      disabled={stage.id === selectedApp.currentStage}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="details-actions">
              <button 
                className="btn-danger"
                onClick={() => {
                  deleteApplication(selectedApp.id, selectedApp.currentStage);
                  setShowDetails(false);
                }}
              >
                Delete Application
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPipeline;

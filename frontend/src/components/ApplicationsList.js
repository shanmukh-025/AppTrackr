import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ApplicationsList.css';

function ApplicationsList({ applications, onApplicationDeleted, onApplicationUpdated }) {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const getStatusEmoji = (status) => {
    const statusMap = {
      wishlist: '📋',
      applied: '📤',
      phone_screen: '📞',
      technical: '💻',
      onsite: '🏢',
      offer: '✅',
      rejected: '❌',
      ghosted: '👻'
    };
    return statusMap[status] || '📋';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      wishlist: 'Wishlist',
      applied: 'Applied',
      phone_screen: 'Phone Screen',
      technical: 'Technical',
      onsite: 'Onsite',
      offer: 'Offer',
      rejected: 'Rejected',
      ghosted: 'Ghosted'
    };
    return labelMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      wishlist: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
      applied: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
      phone_screen: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
      technical: 'linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%)',
      onsite: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      offer: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      rejected: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
      ghosted: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
    };
    return colorMap[status] || 'linear-gradient(135deg, #718096 0%, #4a5568 100%)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onApplicationDeleted(id);
    } catch (error) {
      alert('Failed to delete application');
    }
  };

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No applications yet</h3>
        <p>Start tracking your job applications by adding your first one!</p>
      </div>
    );
  }

  return (
    <div className="applications-grid">
      {applications.map((app) => (
        <div key={app.id} className="application-card">
          <div className="card-header">
            <div className="company-info">
              {app.logoUrl && (
                <img 
                  src={app.logoUrl} 
                  alt={`${app.company} logo`}
                  className="company-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h3>{app.company}</h3>
                <p className="position">{app.position}</p>
              </div>
            </div>
            <span 
              className="status-badge"
              style={{ background: getStatusColor(app.status) }}
            >
              {getStatusEmoji(app.status)} {getStatusLabel(app.status)}
            </span>
          </div>

          <div className="card-details">
            {app.location && (
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{app.location}</span>
              </div>
            )}
            {app.salaryRange && (
              <div className="detail-item">
                <span className="detail-icon">💰</span>
                <span>{app.salaryRange}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span>Applied {formatDate(app.dateApplied)}</span>
            </div>
          </div>

          {app.notes && (
            <div className="card-notes">
              <p>{app.notes}</p>
            </div>
          )}

          <div className="card-actions">
            {app.jobUrl && (
              <a 
                href={app.jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-button view-button"
              >
                View Job
              </a>
            )}
            <button 
              className="action-button edit-button"
              onClick={() => onApplicationUpdated(app)}
            >
              Edit
            </button>
            <button 
              className="action-button delete-button"
              onClick={() => handleDelete(app.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApplicationsList;
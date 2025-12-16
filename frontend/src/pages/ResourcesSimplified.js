import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourcesSimplified.css';

// Import all components
import LearningPaths from '../components/LearningPaths';
import MyLearningPaths from '../components/MyLearningPaths';
import DSATrackerSimple from '../components/DSATrackerSimple';

const ResourcesSimplified = () => {
  const [activeTab, setActiveTab] = useState('learning-paths');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Professional categorized tools
  const toolCategories = [
    {
      category: 'Interview Preparation',
      items: [
        { id: 'learning-paths', name: 'Learning Paths', icon: '📚', description: 'Personalized learning roadmaps', color: '#667eea' },
        { id: 'my-learning-paths', name: 'My Learning Paths', icon: '📖', description: 'Track your saved learning paths', color: '#764ba2' },
        { id: 'dsa-tracker', name: 'DSA Sheets', icon: '📝', description: 'Track DSA problem sheets', color: '#047857' },
        { id: 'behavioral', name: 'AI Video Interview', icon: '🎥', description: 'Practice with AI feedback', color: '#10b981' },
      ]
    }
  ];

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'learning-paths':
          return <LearningPaths setNotification={setNotification} />;
        case 'my-learning-paths':
          return <MyLearningPaths setNotification={setNotification} />;
        case 'dsa-tracker':
          return <DSATrackerSimple />;
        case 'behavioral':
          // Redirect to Behavioral Questions page
          navigate('/behavioral');
          return null;
        default:
          return <LearningPaths setNotification={setNotification} />;
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      return (
        <div className="error-container">
          <p>Error loading component</p>
          <small>{error.message}</small>
        </div>
      );
    }
  };

  return (
    <div className="resources-simplified">
      {/* Page Header - Match Dashboard Style */}
      <div className="page-header">
        <div>
          <h1>Resources & Learning</h1>
          <p className="dashboard-subtitle">Enhance your skills with curated learning paths and interview prep</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type || 'info'}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="close-btn">
            ✕
          </button>
        </div>
      )}

      {/* Horizontal Navigation Bar */}
      <nav className="resources-navbar">
        <div className="navbar-inner">
          {toolCategories[0].items.map(tool => (
            <button
              key={tool.id}
              className={`nav-item ${activeTab === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tool.id)}
            >
              <span className="nav-icon">{tool.icon}</span>
              <span className="nav-name">{tool.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="resources-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResourcesSimplified;

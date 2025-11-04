import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourcesSimplified.css';

// Import all components
import LearningPaths from '../components/LearningPaths';
import MyLearningPaths from '../components/MyLearningPaths';

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

  const findToolById = (id) => {
    for (let category of toolCategories) {
      const tool = category.items.find(t => t.id === id);
      if (tool) return tool;
    }
    return null;
  };

  const currentTool = findToolById(activeTab);

  return (
    <div className="resources-simplified">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type || 'info'}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="close-btn">
            ✕
          </button>
        </div>
      )}

      {/* Premium Header */}
      <header className="resources-header">
        <div className="header-inner">
          <div className="header-content">
            <h1>Interview Mastery Suite</h1>
            <p>Master every aspect of the interview process with our comprehensive platform</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">10+</span>
              <span className="stat-label">Tools</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Resources</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="resources-layout">
        {/* Sidebar Categories */}
        <div className="resources-sidebar">
          {toolCategories.map((cat, idx) => (
            <div key={idx} className="category-section">
              <div className="category-title">{cat.category}</div>
              {cat.items.map(tool => (
                <button
                  key={tool.id}
                  className={`sidebar-item ${activeTab === tool.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tool.id)}
                  style={{ '--item-color': tool.color }}
                >
                  <span className="item-icon">{tool.icon}</span>
                  <div className="item-text">
                    <div className="item-name">{tool.name}</div>
                    <div className="item-desc">{tool.description}</div>
                  </div>
                  <span className="item-arrow">›</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="resources-main">
          {/* Tool Header */}
          {currentTool && (
            <div className="tool-header">
              <div className="tool-header-icon" style={{ color: currentTool.color }}>
                {currentTool.icon}
              </div>
              <div className="tool-header-text">
                <h2>{currentTool.name}</h2>
                <p>{currentTool.description}</p>
              </div>
            </div>
          )}

          {/* Tool Content */}
          <div className="tool-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSimplified;

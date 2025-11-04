import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/MyLearningPaths.css';

const MyLearningPaths = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const [savedPaths, setSavedPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [topicResources, setTopicResources] = useState({});
  const [loadingResources, setLoadingResources] = useState(new Set());

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSavedPaths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSavedPaths = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/resources/learning-path/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedPaths(response.data.savedPaths || []);
    } catch (error) {
      console.error('Failed to fetch saved paths:', error);
      setNotification({ type: 'error', message: 'Failed to load saved learning paths' });
    } finally {
      setLoading(false);
    }
  };

  const loadPath = (path) => {
    setSelectedPath(path);
    setCompletedTopics(new Set(path.completedTopics || []));
    setTopicResources(path.savedResources || {}); // Load saved resources
    setExpandedTopics(new Set()); // Reset expanded state
  };

  const fetchTopicResources = async (topicKey, topicName) => {
    setLoadingResources(prev => new Set(prev).add(topicKey));
    
    try {
      const experienceLevel = selectedPath?.experienceLevel || 'intermediate';
      const targetRole = selectedPath?.targetRole || 'Software Developer';
      
      const response = await axios.get(
        `${API_URL}/api/resources/learning-resources`,
        {
          params: { 
            topic: topicName,
            experienceLevel: experienceLevel,
            targetRole: targetRole
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setTopicResources(prev => ({
          ...prev,
          [topicKey]: response.data.resources
        }));
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setNotification({ type: 'error', message: 'Failed to fetch resources for this topic' });
    } finally {
      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(topicKey);
        return newSet;
      });
    }
  };

  const handleToggleResources = async (phaseIdx, topicIdx, topicName) => {
    const topicKey = `${phaseIdx}-${topicIdx}`;
    const newExpanded = new Set(expandedTopics);
    
    if (newExpanded.has(topicKey)) {
      // Collapse
      newExpanded.delete(topicKey);
    } else {
      // Expand
      newExpanded.add(topicKey);
      
      // Fetch resources if not already loaded
      if (!topicResources[topicKey] || topicResources[topicKey].length === 0) {
        await fetchTopicResources(topicKey, topicName);
      }
    }
    
    setExpandedTopics(newExpanded);
  };

  const toggleTopicCompletion = async (phaseIdx, topicIdx) => {
    if (!selectedPath) return;

    const topicKey = `${phaseIdx}-${topicIdx}`;
    const newCompleted = new Set(completedTopics);
    
    if (newCompleted.has(topicKey)) {
      newCompleted.delete(topicKey);
    } else {
      newCompleted.add(topicKey);
    }
    
    setCompletedTopics(newCompleted);

    // Calculate new progress
    let totalTopics = 0;
    selectedPath.pathData.phases.forEach((phase) => {
      if (phase.topicDetails) {
        totalTopics += phase.topicDetails.length;
      }
    });
    const progressPercent = totalTopics > 0 ? Math.round((newCompleted.size / totalTopics) * 100) : 0;

    // Update backend
    try {
      await axios.patch(
        `${API_URL}/api/resources/learning-path/progress/${selectedPath.id}`,
        {
          completedTopics: [...newCompleted],
          progressPercent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setSavedPaths(prev => prev.map(p => 
        p.id === selectedPath.id 
          ? { ...p, completedTopics: [...newCompleted], progressPercent }
          : p
      ));
      setSelectedPath(prev => ({ ...prev, completedTopics: [...newCompleted], progressPercent }));
    } catch (error) {
      console.error('Failed to update progress:', error);
      setNotification({ type: 'error', message: 'Failed to save progress' });
    }
  };

  const deletePath = async (pathId) => {
    if (!window.confirm('Are you sure you want to delete this learning path?')) return;

    try {
      await axios.delete(`${API_URL}/api/resources/learning-path/saved/${pathId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedPaths(prev => prev.filter(p => p.id !== pathId));
      if (selectedPath?.id === pathId) {
        setSelectedPath(null);
      }
      setNotification({ type: 'success', message: 'Learning path deleted successfully' });
    } catch (error) {
      console.error('Failed to delete path:', error);
      setNotification({ type: 'error', message: 'Failed to delete learning path' });
    }
  };

  const calculateProgress = (path) => {
    return path.progressPercent || 0;
  };

  if (loading) {
    return (
      <div className="my-learning-paths loading-state">
        <div className="spinner-large"></div>
        <p>Loading your learning paths...</p>
      </div>
    );
  }

  return (
    <div className="my-learning-paths">
      <div className="my-paths-header">
        <h2>📚 My Learning Paths</h2>
        <p className="subtitle">Continue your personalized learning journey</p>
      </div>

      {savedPaths.length === 0 ? (
        <div className="empty-state-my-paths">
          <div className="empty-icon">📖</div>
          <h3>No Saved Learning Paths Yet</h3>
          <p>Generate a personalized learning path and save it to track your progress!</p>
        </div>
      ) : (
        <div className="my-paths-layout">
          {/* Sidebar with saved paths list */}
          <div className="saved-paths-sidebar">
            <h3>Saved Paths ({savedPaths.length})</h3>
            <div className="saved-paths-list">
              {savedPaths.map(path => (
                <div
                  key={path.id}
                  className={`saved-path-item ${selectedPath?.id === path.id ? 'active' : ''}`}
                  onClick={() => loadPath(path)}
                >
                  <div className="path-item-header">
                    <h4>{path.name}</h4>
                    <button
                      className="delete-path-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePath(path.id);
                      }}
                      title="Delete path"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="path-item-meta">
                    <span className="path-role">{path.targetRole}</span>
                    <span className="path-level">{path.experienceLevel}</span>
                  </div>
                  <div className="path-item-progress">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ width: `${calculateProgress(path)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{calculateProgress(path)}% complete</span>
                  </div>
                  <div className="path-item-footer">
                    <span>⏱️ {path.totalHours}h</span>
                    <span>📅 {path.totalPhases} phases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="path-details-content">
            {selectedPath ? (
              <>
                <div className="path-details-header">
                  <div>
                    <h3>{selectedPath.name}</h3>
                    <div className="path-details-meta">
                      <span className="meta-badge role">{selectedPath.targetRole}</span>
                      <span className="meta-badge level">{selectedPath.experienceLevel}</span>
                      <span className="meta-badge">⏱️ {selectedPath.totalHours}h</span>
                      <span className="meta-badge">📅 {selectedPath.estimatedWeeks}</span>
                    </div>
                  </div>
                  <div className="overall-progress">
                    <div className="progress-circle">
                      <span className="progress-number">{selectedPath.progressPercent || 0}%</span>
                    </div>
                    <span className="progress-label">Completed</span>
                  </div>
                </div>

                {/* Skills */}
                {selectedPath.currentSkills && selectedPath.currentSkills.length > 0 && (
                  <div className="current-skills-section">
                    <h4>Your Skills:</h4>
                    <div className="skills-tags">
                      {selectedPath.currentSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag-small">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phases */}
                <div className="phases-section-my-paths">
                  {selectedPath.pathData.phases.map((phase, idx) => (
                    <div key={idx} className="phase-card-my-paths">
                      <div className="phase-header-my-paths">
                        <div className="phase-number-my-paths">{phase.phase || idx + 1}</div>
                        <div className="phase-info">
                          <h4>{phase.name}</h4>
                          <div className="phase-meta">
                            <span>⏱️ {phase.duration}</span>
                            <span>📊 {phase.difficulty}</span>
                            <span>🕒 {phase.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>

                      {phase.topicDetails && phase.topicDetails.length > 0 && (
                        <div className="topics-checklist">
                          {phase.topicDetails.map((topic, tidx) => {
                            const topicKey = `${idx}-${tidx}`;
                            const isCompleted = completedTopics.has(topicKey);
                            const isExpanded = expandedTopics.has(topicKey);
                            const resources = topicResources[topicKey] || [];
                            const isLoadingRes = loadingResources.has(topicKey);
                            
                            return (
                              <div 
                                key={tidx} 
                                className={`topic-checklist-item ${isCompleted ? 'completed' : ''}`}
                              >
                                <div className="topic-row-with-resources">
                                  <input
                                    type="checkbox"
                                    className="topic-checkbox-my-paths"
                                    checked={isCompleted}
                                    onChange={() => toggleTopicCompletion(idx, tidx)}
                                  />
                                  <div className="topic-content">
                                    <span className={`topic-name ${isCompleted ? 'strikethrough' : ''}`}>
                                      {topic.topic}
                                    </span>
                                    <span className="topic-duration">{topic.hours}h</span>
                                  </div>
                                  <button 
                                    className="view-resources-btn-small"
                                    onClick={() => handleToggleResources(idx, tidx, topic.topic)}
                                  >
                                    {isExpanded ? '📚 Hide Resources' : '🔍 View Resources'}
                                  </button>
                                </div>

                                {/* Expanded Resources Section */}
                                {isExpanded && (
                                  <div className="topic-resources-section-my-paths">
                                    {isLoadingRes ? (
                                      <div className="resources-loading">
                                        <div className="spinner"></div>
                                        <span>Finding best resources for your level...</span>
                                      </div>
                                    ) : resources.length > 0 ? (
                                      <div className="resources-list">
                                        {resources.map((resource, ridx) => (
                                          <div key={ridx} className="resource-card">
                                            <div className="resource-header">
                                              <span className="resource-type">{resource.type}</span>
                                              <span className={`resource-level ${resource.level}`}>{resource.level}</span>
                                            </div>
                                            <h5>{resource.title}</h5>
                                            <p>{resource.description}</p>
                                            <div className="resource-footer">
                                              <span className="resource-duration">⏱️ {resource.duration}</span>
                                              <a 
                                                href={resource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="resource-link"
                                              >
                                                Access Resource →
                                              </a>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="no-resources">
                                        <p>No resources found. Try searching online for "{topic.topic}" tutorials.</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">👈</div>
                <p>Select a learning path from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningPaths;

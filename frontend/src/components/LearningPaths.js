import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/LearningPaths.css';

const LearningPaths = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [currentSkills, setCurrentSkills] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [topicResources, setTopicResources] = useState({});
  const [loadingResources, setLoadingResources] = useState(new Set());

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'System Architect'
  ];

  const generateLearningPath = async () => {
    if (!targetRole) {
      setNotification({ type: 'error', message: 'Please select a target role' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/resources/learning-path`, {
        params: {
          targetRole,
          experienceLevel,
          skills: currentSkills.join(',')
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Learning path response:', response.data);
      setLearningPath(response.data.path || response.data.data || response.data);
      setNotification({ type: 'success', message: 'Learning path generated successfully!' });
    } catch (error) {
      console.error('Learning path error:', error);
      setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to generate learning path' });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  // Progress tracking functions
  const toggleTopicCompletion = (phaseIdx, topicIdx) => {
    const topicKey = `${phaseIdx}-${topicIdx}`;
    const newCompleted = new Set(completedTopics);
    
    if (newCompleted.has(topicKey)) {
      newCompleted.delete(topicKey);
    } else {
      newCompleted.add(topicKey);
    }
    
    setCompletedTopics(newCompleted);
    
    // Save to localStorage for persistence
    localStorage.setItem('completedTopics', JSON.stringify([...newCompleted]));
  };

  // Resource fetching functions
  const toggleTopicExpansion = async (phaseIdx, topicIdx, topicName) => {
    const topicKey = `${phaseIdx}-${topicIdx}`;
    const newExpanded = new Set(expandedTopics);
    
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey);
    } else {
      newExpanded.add(topicKey);
      
      // Fetch resources if not already loaded
      if (!topicResources[topicKey]) {
        await fetchTopicResources(topicKey, topicName);
      }
    }
    
    setExpandedTopics(newExpanded);
  };

  const fetchTopicResources = async (topicKey, topicName) => {
    const newLoadingResources = new Set(loadingResources);
    newLoadingResources.add(topicKey);
    setLoadingResources(newLoadingResources);

    try {
      const response = await axios.get(`${API_URL}/api/resources/learning-resources`, {
        params: {
          topic: topicName,
          experienceLevel,
          targetRole
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setTopicResources(prev => ({
        ...prev,
        [topicKey]: response.data.resources || []
      }));
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setTopicResources(prev => ({
        ...prev,
        [topicKey]: []
      }));
    } finally {
      const newLoadingResources = new Set(loadingResources);
      newLoadingResources.delete(topicKey);
      setLoadingResources(newLoadingResources);
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (!learningPath || !learningPath.phases) return 0;
    
    let totalTopics = 0;
    learningPath.phases.forEach((phase) => {
      if (phase.topicDetails) {
        totalTopics += phase.topicDetails.length;
      }
    });
    
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics.size / totalTopics) * 100);
  };

  // Load completed topics from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('completedTopics');
    if (saved) {
      setCompletedTopics(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save learning path
  const saveLearningPath = async () => {
    if (!learningPath) {
      setNotification({ type: 'error', message: 'No learning path to save' });
      return;
    }

    if (!targetRole) {
      setNotification({ type: 'error', message: 'Please select a target role first' });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/resources/learning-path/save`,
        {
          name: `${targetRole} Path`,
          targetRole,
          experienceLevel,
          currentSkills,
          pathData: learningPath,
          completedTopics: [...completedTopics],
          progressPercent: calculateProgress(),
          savedResources: topicResources // Save the resources that were fetched
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Save response:', response.data);
      setNotification({ type: 'success', message: '✅ Learning path saved successfully!' });
    } catch (error) {
      console.error('Failed to save learning path:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save learning path';
      setNotification({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div className="learning-paths">
      <h2>📚 Personalized Learning Paths</h2>
      <p className="subtitle">Build a customized roadmap to reach your career goals</p>

      <div className="path-generator">
        {/* Role Selection */}
        <div className="form-section">
          <h3>Step 1: Select Your Target Role</h3>
          <div className="role-grid">
            {roles.map(role => (
              <button
                key={role}
                className={`role-btn ${targetRole === role ? 'active' : ''}`}
                onClick={() => setTargetRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="form-section">
          <h3>Step 2: Experience Level</h3>
          <div className="level-options">
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <label key={level} className="radio-option">
                <input
                  type="radio"
                  value={level}
                  checked={experienceLevel === level}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                />
                <span className="radio-text">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Current Skills */}
        <div className="form-section">
          <h3>Step 3: Your Current Skills</h3>
          <div className="skill-input-group">
            <input
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button onClick={addSkill} className="add-btn">Add Skill</button>
          </div>
          <div className="skills-list">
            {currentSkills.map(skill => (
              <span key={skill} className="skill-tag">
                {skill}
                <button onClick={() => removeSkill(skill)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="generate-btn"
          onClick={generateLearningPath}
          disabled={loading}
        >
          {loading ? '⏳ Generating...' : '🚀 Generate My Learning Path'}
        </button>
      </div>

      {/* Learning Path Display - CLEAN & FOCUSED */}
      {learningPath && (
        <div className="path-display">
          <div className="path-header-simple">
            <h3>🎯 Your Learning Roadmap for {targetRole}</h3>
            <div className="path-summary">
              <span className="summary-item">
                <strong>{learningPath.totalDuration || '12 weeks'}</strong>
                <small>Total Duration</small>
              </span>
              <span className="summary-item">
                <strong>{learningPath.totalEstimatedHours || 150}h</strong>
                <small>Study Hours</small>
              </span>
              <span className="summary-item">
                <strong>{learningPath.phases?.length || 4} Phases</strong>
                <small>Progressive Steps</small>
              </span>
              <span className="summary-item progress-indicator">
                <strong>{calculateProgress()}%</strong>
                <small>Completed</small>
                <div className="overall-progress-bar">
                  <div className="overall-progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
                </div>
              </span>
            </div>
          </div>

          {/* Main Learning Phases - THE CORE CONTENT */}
          <div className="phases-section-clean">
            {(learningPath.phases || []).map((phase, idx) => (
              <div key={idx} className="phase-card-clean">
                <div className="phase-header-clean">
                  <div className="phase-number-clean">{phase.phase || idx + 1}</div>
                  <div className="phase-title-section">
                    <h4>{phase.name}</h4>
                    <div className="phase-meta-clean">
                      <span>⏱️ {phase.duration}</span>
                      <span>📊 {phase.difficulty}</span>
                      <span>🕒 {phase.estimatedHours} hours</span>
                    </div>
                  </div>
                </div>

                {/* Topics to Learn */}
                {phase.topicDetails && phase.topicDetails.length > 0 ? (
                  <div className="topics-list-clean">
                    {phase.topicDetails.map((topic, tidx) => {
                      const topicKey = `${idx}-${tidx}`;
                      const isCompleted = completedTopics.has(topicKey);
                      const isExpanded = expandedTopics.has(topicKey);
                      const resources = topicResources[topicKey] || [];
                      const isLoadingRes = loadingResources.has(topicKey);
                      
                      return (
                        <div key={tidx} className={`topic-row-clean ${isCompleted ? 'completed' : ''}`}>
                          <div className="topic-info-clean">
                            <div className="topic-header-with-checkbox">
                              <input
                                type="checkbox"
                                className="topic-checkbox"
                                checked={isCompleted}
                                onChange={() => toggleTopicCompletion(idx, tidx)}
                              />
                              <span className={`topic-name-clean ${isCompleted ? 'strikethrough' : ''}`}>
                                📖 {topic.topic}
                              </span>
                            </div>
                            <div className="topic-actions">
                              <span className="topic-meta-clean">{topic.hours}h • {topic.resources} resources</span>
                              <button 
                                className="view-resources-btn"
                                onClick={() => toggleTopicExpansion(idx, tidx, topic.topic)}
                              >
                                {isExpanded ? '📚 Hide Resources' : '🔍 View Resources'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Expanded Resources Section */}
                          {isExpanded && (
                            <div className="topic-resources-section">
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
                ) : (
                  <div className="topics-simple">
                    {phase.topics?.map((topic, tidx) => (
                      <span key={tidx} className="topic-badge">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="path-actions-clean">
            <button className="btn-primary-clean" onClick={saveLearningPath}>
              💾 Save Learning Path
            </button>
            <button className="btn-secondary-clean" onClick={() => window.print()}>
              📥 Download Roadmap
            </button>
            <button className="btn-secondary-clean" onClick={generateLearningPath}>
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!learningPath && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Generate your personalized learning path to get started</p>
        </div>
      )}
    </div>
  );
};

export default LearningPaths;

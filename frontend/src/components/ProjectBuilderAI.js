import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProjectBuilderAI.css';

const ProjectBuilderAI = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // GitHub State
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoAnalysis, setRepoAnalysis] = useState(null);
  
  // Project Creation State
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [projectFeatures, setProjectFeatures] = useState(['']);
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [generatedProject, setGeneratedProject] = useState(null);
  
  // Improvement State
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [improvementCode, setImprovementCode] = useState(null);
  const [implementationStep, setImplementationStep] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const techStackOptions = [
    'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 
    'Python', 'Django', 'Flask', 'FastAPI',
    'TypeScript', 'Next.js', 'Vue.js', 'Angular',
    'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Redis', 'GraphQL', 'REST API', 'Socket.io',
    'TailwindCSS', 'Material-UI', 'Bootstrap'
  ];

  useEffect(() => {
    checkGitHubStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if GitHub is connected
  const checkGitHubStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/github/status`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      
      setGithubConnected(data.connected);
      if (data.connected) {
        setGithubUsername(data.username);
        fetchRepositories();
      }
    } catch (error) {
      console.error('Error checking GitHub status:', error);
    }
  };

  // Connect to GitHub
  const connectGitHub = async () => {
    try {
      const response = await fetch(`${API_URL}/api/github/auth-url`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert('❌ GitHub OAuth Setup Required\n\n' + error.error + '\n\nPlease check GITHUB_SETUP_QUICK.md in the project root for setup instructions.');
        return;
      }
      
      const data = await response.json();
      
      // Open GitHub OAuth in popup
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const popup = window.open(
        data.authUrl,
        'GitHub OAuth',
        'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
      );

      // Listen for OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'github-auth') {
          if (popup) popup.close();
          
          // Exchange code for token
          const callbackResponse = await fetch(`${API_URL}/api/github/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ code: event.data.code })
          });
          
          const callbackData = await callbackResponse.json();
          
          if (callbackData.success) {
            setGithubConnected(true);
            setGithubUsername(callbackData.username);
            fetchRepositories();
          }
        }
      });
    } catch (error) {
      console.error('Error connecting GitHub:', error);
    }
  };

  // Fetch user repositories
  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/github/repositories`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      
      setRepositories(data.repositories || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
    setLoading(false);
  };

  // Analyze repository
  const analyzeRepository = async (repo) => {
    setLoading(true);
    setSelectedRepo(repo);
    setActiveTab('analysis');
    
    try {
      const parts = repo.fullName.split('/');
      const owner = parts[0];
      const repoName = parts[1];
      
      const response = await fetch(`${API_URL}/api/github/analyze-repository`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ owner, repo: repoName })
      });
      
      const data = await response.json();
      setRepoAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing repository:', error);
    }
    setLoading(false);
  };

  // Generate improvement code
  const generateImprovement = async (improvement) => {
    setLoading(true);
    setSelectedImprovement(improvement);
    
    try {
      const parts = selectedRepo.fullName.split('/');
      const owner = parts[0];
      const repoName = parts[1];
      
      const response = await fetch(`${API_URL}/api/github/generate-improvement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          owner,
          repo: repoName,
          improvement,
          filePath: improvement.files[0]
        })
      });
      
      const data = await response.json();
      setImprovementCode(data.improvementCode);
      setImplementationStep(0);
      setActiveTab('implement');
    } catch (error) {
      console.error('Error generating improvement:', error);
    }
    setLoading(false);
  };

  // Commit improvement to GitHub
  const commitImprovement = async () => {
    setLoading(true);
    
    try {
      const parts = selectedRepo.fullName.split('/');
      const owner = parts[0];
      const repoName = parts[1];
      
      const response = await fetch(`${API_URL}/api/github/commit-improvement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          owner,
          repo: repoName,
          files: improvementCode.files,
          commitMessage: improvementCode.commitMessage
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Improvement committed successfully!');
        setActiveTab('analysis');
        analyzeRepository(selectedRepo);
      }
    } catch (error) {
      console.error('Error committing improvement:', error);
      alert('❌ Failed to commit improvement');
    }
    setLoading(false);
  };

  // Generate new project
  const generateProject = async () => {
    if (!projectName || !projectDescription || techStack.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/github/generate-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          techStack,
          features: projectFeatures.filter(f => f.trim()),
          skillLevel
        })
      });
      
      const data = await response.json();
      setGeneratedProject(data.project);
      setActiveTab('review');
    } catch (error) {
      console.error('Error generating project:', error);
    }
    setLoading(false);
  };

  // Push project to GitHub
  const pushToGitHub = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/github/create-repository`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ projectData: generatedProject })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Project pushed to GitHub!\n\n' + data.repoUrl);
        window.open(data.repoUrl, '_blank');
        fetchRepositories();
        resetProjectCreation();
      }
    } catch (error) {
      console.error('Error pushing to GitHub:', error);
      alert('❌ Failed to push project');
    }
    setLoading(false);
  };

  const resetProjectCreation = () => {
    setProjectName('');
    setProjectDescription('');
    setTechStack([]);
    setProjectFeatures(['']);
    setGeneratedProject(null);
    setActiveTab('overview');
  };

  const toggleTechStack = (tech) => {
    setTechStack(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const addFeature = () => {
    setProjectFeatures([...projectFeatures, '']);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...projectFeatures];
    newFeatures[index] = value;
    setProjectFeatures(newFeatures);
  };

  const removeFeature = (index) => {
    setProjectFeatures(projectFeatures.filter((_, i) => i !== index));
  };

  return (
    <div className="project-builder-container">
      <div className="project-builder-header">
        <h1>🛠️ AI Project Builder</h1>
        <p>Build impressive projects or improve existing ones with AI assistance</p>
      </div>

      {/* GitHub Connection Status */}
      <div className={'github-status ' + (githubConnected ? 'connected' : 'disconnected')}>
        {githubConnected ? (
          <div className="status-connected">
            <span className="github-icon">✅</span>
            <span>Connected as <strong>{githubUsername}</strong></span>
            <button onClick={() => window.open('https://github.com/' + githubUsername, '_blank')}>
              View Profile
            </button>
          </div>
        ) : (
          <div className="status-disconnected">
            <span className="github-icon">⚠️</span>
            <span>Connect GitHub to analyze and improve your projects</span>
            <button onClick={connectGitHub} className="connect-btn">
              🔗 Connect GitHub
            </button>
          </div>
        )}
      </div>

      {githubConnected && (
        <>
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={'tab-btn ' + (activeTab === 'overview' ? 'active' : '')}
              onClick={() => setActiveTab('overview')}
            >
              📊 My Projects
            </button>
            <button
              className={'tab-btn ' + (activeTab === 'create' ? 'active' : '')}
              onClick={() => setActiveTab('create')}
            >
              ✨ Create New
            </button>
            {selectedRepo && (
              <button
                className={'tab-btn ' + (activeTab === 'analysis' ? 'active' : '')}
                onClick={() => setActiveTab('analysis')}
              >
                🔍 Analysis
              </button>
            )}
            {improvementCode && (
              <button
                className={'tab-btn ' + (activeTab === 'implement' ? 'active' : '')}
                onClick={() => setActiveTab('implement')}
              >
                💻 Implement
              </button>
            )}
            {generatedProject && (
              <button
                className={'tab-btn ' + (activeTab === 'review' ? 'active' : '')}
                onClick={() => setActiveTab('review')}
              >
                👀 Review
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="section-header">
                  <h2>Your GitHub Repositories</h2>
                  <button onClick={fetchRepositories} disabled={loading}>
                    🔄 Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="loading">Fetching repositories...</div>
                ) : (
                  <div className="repositories-grid">
                    {repositories.map((repo) => (
                      <div key={repo.id} className="repo-card">
                        <div className="repo-header">
                          <h3>{repo.name}</h3>
                          <span className="language-badge">{repo.language || 'N/A'}</span>
                        </div>
                        <p className="repo-description">
                          {repo.description || 'No description available'}
                        </p>
                        <div className="repo-stats">
                          <span>⭐ {repo.stars}</span>
                          <span>🍴 {repo.forks}</span>
                          <span>📦 {(repo.size / 1024).toFixed(1)} MB</span>
                        </div>
                        <div className="repo-actions">
                          <button onClick={() => analyzeRepository(repo)} className="analyze-btn">
                            🔍 Analyze & Improve
                          </button>
                          <button onClick={() => window.open(repo.url, '_blank')} className="view-btn">
                            View on GitHub
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CREATE NEW PROJECT TAB */}
            {activeTab === 'create' && (
              <div className="create-tab">
                <div className="section-header">
                  <h2>Create New Project</h2>
                  <p>AI will generate a complete project with code and push to GitHub</p>
                </div>

                <div className="create-form">
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., task-manager-app"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe what your project does..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tech Stack * (Select all that apply)</label>
                    <div className="tech-stack-grid">
                      {techStackOptions.map((tech) => (
                        <button
                          key={tech}
                          className={'tech-chip ' + (techStack.includes(tech) ? 'selected' : '')}
                          onClick={() => toggleTechStack(tech)}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Features</label>
                    {projectFeatures.map((feature, index) => (
                      <div key={index} className="feature-input">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="e.g., User authentication"
                        />
                        {projectFeatures.length > 1 && (
                          <button onClick={() => removeFeature(index)} className="remove-btn">
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={addFeature} className="add-feature-btn">
                      + Add Feature
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Skill Level</label>
                    <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                      <option value="beginner">Beginner - Simple & well-commented</option>
                      <option value="intermediate">Intermediate - Standard patterns</option>
                      <option value="advanced">Advanced - Complex architecture</option>
                    </select>
                  </div>

                  <button
                    onClick={generateProject}
                    disabled={loading}
                    className="generate-btn"
                  >
                    {loading ? 'Generating...' : '✨ Generate Project'}
                  </button>
                </div>
              </div>
            )}

            {/* ANALYSIS TAB */}
            {activeTab === 'analysis' && repoAnalysis && (
              <div className="analysis-tab">
                <div className="analysis-header">
                  <h2>Analysis: {selectedRepo && selectedRepo.name}</h2>
                  <div className="overall-score">
                    <span className="score-label">Overall Score</span>
                    <span className="score-value">{repoAnalysis.overallScore}/100</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="scores-grid">
                  {Object.entries(repoAnalysis).map(([key, value]) => {
                    if (typeof value === 'object' && value.score) {
                      return (
                        <div key={key} className="score-card">
                          <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                          <div className="score-bar">
                            <div className="score-fill" style={{ width: value.score + '%' }}>
                              {value.score}/100
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Improvements */}
                {repoAnalysis.improvements && repoAnalysis.improvements.length > 0 && (
                  <div className="improvements-section">
                    <h3>🎯 Recommended Improvements</h3>
                    <div className="improvements-list">
                      {repoAnalysis.improvements.map((improvement, index) => (
                        <div key={index} className="improvement-card">
                          <div className="improvement-header">
                            <h4>{improvement.title}</h4>
                            <span className={'priority-badge ' + improvement.priority.toLowerCase()}>
                              {improvement.priority}
                            </span>
                          </div>
                          <p className="improvement-description">{improvement.description}</p>
                          <div className="improvement-meta">
                            <span className="category">{improvement.category}</span>
                            <span className="time">⏱️ {improvement.estimatedTime}</span>
                          </div>
                          <button
                            onClick={() => generateImprovement(improvement)}
                            className="implement-btn"
                          >
                            🚀 Generate Code & Implement
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Readiness */}
                {repoAnalysis.interviewReadiness && (
                  <div className="interview-readiness">
                    <h3>📝 Interview Readiness</h3>
                    <div className="readiness-score">
                      Score: {repoAnalysis.interviewReadiness.score}/100
                    </div>
                    <div className="readiness-details">
                      <div className="strengths">
                        <h4>✅ Strengths</h4>
                        <ul>
                          {repoAnalysis.interviewReadiness.strengths && repoAnalysis.interviewReadiness.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="additions">
                        <h4>➕ Add Before Interviews</h4>
                        <ul>
                          {repoAnalysis.interviewReadiness.additions && repoAnalysis.interviewReadiness.additions.map((addition, i) => (
                            <li key={i}>{addition}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IMPLEMENTATION TAB */}
            {activeTab === 'implement' && improvementCode && (
              <div className="implement-tab">
                <h2>Implementation Guide: {selectedImprovement && selectedImprovement.title}</h2>

                {/* Step-by-step implementation */}
                <div className="implementation-steps">
                  {improvementCode.steps && improvementCode.steps.map((step, index) => (
                    <div
                      key={index}
                      className={'step-card ' + (index === implementationStep ? 'active' : '') + ' ' + (index < implementationStep ? 'completed' : '')}
                    >
                      <div className="step-header">
                        <span className="step-number">Step {step.step}</span>
                        <h3>{step.title}</h3>
                      </div>
                      <p className="step-description">{step.description}</p>
                      {step.code && (
                        <pre className="code-block">
                          <code>{step.code}</code>
                        </pre>
                      )}
                      <p className="step-explanation">{step.explanation}</p>
                      {index === implementationStep && (
                        <div className="step-actions">
                          {index > 0 && (
                            <button onClick={() => setImplementationStep(index - 1)}>
                              ← Previous
                            </button>
                          )}
                          {index < improvementCode.steps.length - 1 ? (
                            <button onClick={() => setImplementationStep(index + 1)}>
                              Next →
                            </button>
                          ) : (
                            <button onClick={commitImprovement} className="commit-btn">
                              ✅ Commit to GitHub
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Files to be modified */}
                {improvementCode.files && (
                  <div className="files-section">
                    <h3>📁 Files to be Modified</h3>
                    {improvementCode.files.map((file, index) => (
                      <div key={index} className="file-card">
                        <h4>{file.path}</h4>
                        <p className="file-changes">{file.changes}</p>
                        <details>
                          <summary>View Code</summary>
                          <pre className="code-block">
                            <code>{file.content}</code>
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEW PROJECT TAB */}
            {activeTab === 'review' && generatedProject && (
              <div className="review-tab">
                <h2>Review Your Project</h2>

                <div className="project-overview">
                  <h3>{generatedProject.projectName}</h3>
                  <p>{generatedProject.description}</p>
                </div>

                {/* Project Structure */}
                <div className="project-structure">
                  <h3>📂 Project Structure</h3>
                  <div className="file-tree">
                    {generatedProject.structure && generatedProject.structure.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-path">📄 {file.path}</span>
                        <details>
                          <summary>View Code</summary>
                          <pre className="code-block">
                            <code>{file.content}</code>
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>

                {/* README Preview */}
                {generatedProject.readme && (
                  <div className="readme-preview">
                    <h3>📖 README.md</h3>
                    <pre className="readme-content">{generatedProject.readme}</pre>
                  </div>
                )}

                {/* Setup Instructions */}
                {generatedProject.setupSteps && (
                  <div className="setup-instructions">
                    <h3>🚀 Setup Instructions</h3>
                    <ol>
                      {generatedProject.setupSteps.map((step, index) => (
                        <li key={index}>
                          <code>{step}</code>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Actions */}
                <div className="review-actions">
                  <button onClick={pushToGitHub} disabled={loading} className="push-btn">
                    {loading ? 'Pushing...' : '🚀 Push to GitHub'}
                  </button>
                  <button onClick={resetProjectCreation} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {loading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
};

export default ProjectBuilderAI;

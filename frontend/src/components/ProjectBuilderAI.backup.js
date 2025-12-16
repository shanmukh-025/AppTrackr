import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ProjectBuilderAI.css';

const ProjectBuilderAI = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [projectSteps, setProjectSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [techStack, setTechStack] = useState([]);
  const [projectType, setProjectType] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiAssistanceChat, setAiAssistanceChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [projectPortfolio, setProjectPortfolio] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const techStackOptions = [
    { name: 'React', icon: '⚛️', category: 'Frontend' },
    { name: 'Node.js', icon: '🟢', category: 'Backend' },
    { name: 'Python', icon: '🐍', category: 'Backend' },
    { name: 'TypeScript', icon: '📘', category: 'Language' },
    { name: 'MongoDB', icon: '🍃', category: 'Database' },
    { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
    { name: 'Docker', icon: '🐳', category: 'DevOps' },
    { name: 'AWS', icon: '☁️', category: 'Cloud' },
    { name: 'Next.js', icon: '▲', category: 'Framework' },
    { name: 'GraphQL', icon: '◈', category: 'API' },
    { name: 'Redis', icon: '🔴', category: 'Cache' },
    { name: 'Kubernetes', icon: '☸️', category: 'DevOps' }
  ];

  const projectTypeOptions = [
    { type: 'web-app', label: 'Web Application', icon: '🌐' },
    { type: 'api', label: 'REST API', icon: '🔌' },
    { type: 'mobile', label: 'Mobile App', icon: '📱' },
    { type: 'cli', label: 'CLI Tool', icon: '⌨️' },
    { type: 'data-science', label: 'Data Science', icon: '📊' },
    { type: 'ml', label: 'Machine Learning', icon: '🤖' },
    { type: 'blockchain', label: 'Blockchain', icon: '⛓️' },
    { type: 'game', label: 'Game Development', icon: '🎮' }
  ];

  useEffect(() => {
    loadProjectPortfolio();
  }, []);

  const loadProjectPortfolio = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectPortfolio(response.data.projects || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setProjectPortfolio([
        { id: 1, name: 'E-commerce Platform', progress: 75, status: 'In Progress', tech: ['React', 'Node.js', 'MongoDB'] },
        { id: 2, name: 'Weather Dashboard', progress: 100, status: 'Completed', tech: ['React', 'API'] },
        { id: 3, name: 'Task Manager API', progress: 45, status: 'In Progress', tech: ['Node.js', 'PostgreSQL'] }
      ]);
    }
  };

  const generateProjectIdeas = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/projects/generate-ideas`,
        { skillLevel, techStack, projectType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectIdeas(response.data.ideas || []);
    } catch (error) {
      console.error('Error generating ideas:', error);
      // Mock comprehensive project ideas
      setProjectIdeas([
        {
          id: 1,
          title: 'AI-Powered Job Recommendation Engine',
          description: 'Build a machine learning system that analyzes user profiles and recommends personalized job opportunities',
          difficulty: 'Advanced',
          estimatedTime: '3-4 weeks',
          skillsToLearn: ['Machine Learning', 'Natural Language Processing', 'Python', 'FastAPI', 'TensorFlow'],
          marketValue: 'High',
          portfolioImpact: 95,
          features: [
            'User profile analysis',
            'ML-based job matching',
            'Real-time recommendations',
            'Skill gap analysis',
            'Career path predictions'
          ]
        },
        {
          id: 2,
          title: 'Real-Time Collaborative Code Editor',
          description: 'Create a web-based code editor with real-time collaboration features similar to Google Docs',
          difficulty: 'Advanced',
          estimatedTime: '2-3 weeks',
          skillsToLearn: ['WebSockets', 'Operational Transform', 'React', 'Node.js', 'MongoDB'],
          marketValue: 'Very High',
          portfolioImpact: 92,
          features: [
            'Real-time collaboration',
            'Syntax highlighting',
            'Code execution',
            'Version control',
            'Chat integration'
          ]
        },
        {
          id: 3,
          title: 'Microservices E-Commerce Platform',
          description: 'Design and implement a scalable e-commerce system using microservices architecture',
          difficulty: 'Expert',
          estimatedTime: '4-6 weeks',
          skillsToLearn: ['Microservices', 'Docker', 'Kubernetes', 'API Gateway', 'Message Queues'],
          marketValue: 'Very High',
          portfolioImpact: 98,
          features: [
            'Product catalog service',
            'Order management',
            'Payment gateway',
            'Inventory tracking',
            'Event-driven architecture'
          ]
        },
        {
          id: 4,
          title: 'Social Media Analytics Dashboard',
          description: 'Build a comprehensive dashboard that aggregates and visualizes social media metrics',
          difficulty: 'Intermediate',
          estimatedTime: '2-3 weeks',
          skillsToLearn: ['Data Visualization', 'API Integration', 'React', 'D3.js', 'PostgreSQL'],
          marketValue: 'High',
          portfolioImpact: 88,
          features: [
            'Multi-platform integration',
            'Real-time analytics',
            'Custom dashboards',
            'Export reports',
            'Trend analysis'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startProject = async (project) => {
    try {
      setLoading(true);
      setActiveProject(project);
      
      const response = await axios.post(
        `${API_URL}/api/projects/start`,
        { projectId: project.id, skillLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProjectSteps(response.data.steps || []);
      setCodeSnippets(response.data.codeSnippets || []);
      setLearningResources(response.data.resources || []);
    } catch (error) {
      console.error('Error starting project:', error);
      // Mock detailed project breakdown
      setProjectSteps([
        {
          id: 1,
          phase: 'Setup & Planning',
          title: 'Project Initialization',
          description: 'Set up project structure, install dependencies, and configure development environment',
          tasks: [
            'Create project folder structure',
            'Initialize Git repository',
            'Set up package.json and install dependencies',
            'Configure ESLint and Prettier',
            'Create README and documentation'
          ],
          estimatedTime: '2 hours',
          completed: false
        },
        {
          id: 2,
          phase: 'Backend Development',
          title: 'API Development',
          description: 'Build RESTful API endpoints with authentication and database integration',
          tasks: [
            'Design database schema',
            'Set up Express server',
            'Implement authentication middleware',
            'Create CRUD endpoints',
            'Add input validation'
          ],
          estimatedTime: '8 hours',
          completed: false
        },
        {
          id: 3,
          phase: 'Frontend Development',
          title: 'UI Implementation',
          description: 'Create responsive user interface with React components',
          tasks: [
            'Set up React application',
            'Create reusable components',
            'Implement state management',
            'Connect to backend API',
            'Add responsive styling'
          ],
          estimatedTime: '10 hours',
          completed: false
        },
        {
          id: 4,
          phase: 'Advanced Features',
          title: 'Core Functionality',
          description: 'Implement main features and business logic',
          tasks: [
            'Build main feature components',
            'Add real-time updates',
            'Implement search/filter',
            'Add file upload',
            'Create notification system'
          ],
          estimatedTime: '12 hours',
          completed: false
        },
        {
          id: 5,
          phase: 'Testing & Deployment',
          title: 'Quality Assurance',
          description: 'Write tests, optimize performance, and deploy to production',
          tasks: [
            'Write unit tests',
            'Add integration tests',
            'Performance optimization',
            'Deploy to cloud platform',
            'Set up CI/CD pipeline'
          ],
          estimatedTime: '6 hours',
          completed: false
        }
      ]);

      setCodeSnippets([
        {
          title: 'Express Server Setup',
          language: 'javascript',
          code: `const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
          explanation: 'Basic Express.js server configuration with CORS and JSON middleware'
        },
        {
          title: 'React Component Structure',
          language: 'javascript',
          code: `import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {loading ? <Spinner /> : <DataGrid data={data} />}
    </div>
  );
};

export default Dashboard;`,
          explanation: 'Modern React component with hooks, API integration, and loading states'
        },
        {
          title: 'Database Schema (Prisma)',
          language: 'prisma',
          code: `model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}`,
          explanation: 'Prisma schema defining User and Post models with relationships'
        }
      ]);

      setLearningResources([
        {
          type: 'Documentation',
          title: 'Express.js Official Docs',
          url: 'https://expressjs.com/en/guide/routing.html',
          description: 'Complete guide to routing and middleware in Express'
        },
        {
          type: 'Video Tutorial',
          title: 'Full Stack React & Node Tutorial',
          url: 'https://youtube.com/watch?v=example',
          description: '4-hour comprehensive tutorial building a full-stack app'
        },
        {
          type: 'Article',
          title: 'REST API Best Practices',
          url: 'https://example.com/rest-api-best-practices',
          description: 'Industry-standard patterns for designing RESTful APIs'
        },
        {
          type: 'GitHub Repo',
          title: 'MERN Stack Boilerplate',
          url: 'https://github.com/example/mern-boilerplate',
          description: 'Production-ready boilerplate with authentication and best practices'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStepComplete = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const askAIAssistance = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setAiAssistanceChat([...aiAssistanceChat, userMessage]);
    setChatInput('');

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/projects/ai-assist`,
        { 
          message: chatInput, 
          projectContext: activeProject,
          currentStep: projectSteps.find(s => !completedSteps.includes(s.id))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const aiMessage = { role: 'assistant', content: response.data.response };
      setAiAssistanceChat(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      const aiMessage = { 
        role: 'assistant', 
        content: `I can help you with that! For ${activeProject?.title}, here's my suggestion:\n\n1. Start by reviewing the current step's requirements\n2. Break down complex tasks into smaller sub-tasks\n3. Use the code snippets provided as starting templates\n4. Test each component individually before integration\n\nNeed specific code examples or clarification on any concept?` 
      };
      setAiAssistanceChat(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const getProgressPercentage = () => {
    if (projectSteps.length === 0) return 0;
    return Math.round((completedSteps.length / projectSteps.length) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#3b82f6';
      case 'advanced': return '#f59e0b';
      case 'expert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="project-builder">
      <div className="builder-header">
        <div className="header-content">
          <div className="ai-badge-builder">
            <span className="builder-icon">🛠️</span>
            <span className="badge-text">AI-Guided Project Builder</span>
          </div>
          <h1>Interactive Project Builder</h1>
          <p className="builder-subtitle">
            Learn by building • Step-by-step guidance • Real-world projects
          </p>
        </div>
      </div>

      <div className="builder-container">
        {/* Project Portfolio Overview */}
        {!activeProject && (
          <>
            <div className="portfolio-section">
              <h2>📂 Your Project Portfolio</h2>
              <div className="portfolio-grid">
                {projectPortfolio.map((project) => (
                  <div key={project.id} className="portfolio-card">
                    <div className="portfolio-header">
                      <h3>{project.name}</h3>
                      <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="portfolio-progress">
                      <div className="progress-bar-builder">
                        <div 
                          className="progress-fill-builder"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{project.progress}% Complete</span>
                    </div>
                    <div className="portfolio-tech">
                      {project.tech.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="config-section">
              <h2>🎯 Configure Your Next Project</h2>
              
              <div className="config-group">
                <label>Skill Level</label>
                <div className="skill-level-selector">
                  {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                    <button
                      key={level}
                      className={`level-btn ${skillLevel === level ? 'active' : ''}`}
                      onClick={() => setSkillLevel(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <label>Project Type</label>
                <div className="project-type-grid">
                  {projectTypeOptions.map((option) => (
                    <button
                      key={option.type}
                      className={`type-card ${projectType === option.type ? 'active' : ''}`}
                      onClick={() => setProjectType(option.type)}
                    >
                      <span className="type-icon">{option.icon}</span>
                      <span className="type-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <label>Tech Stack (Select multiple)</label>
                <div className="tech-stack-selector">
                  {techStackOptions.map((tech) => (
                    <button
                      key={tech.name}
                      className={`tech-btn ${techStack.includes(tech.name) ? 'active' : ''}`}
                      onClick={() => {
                        if (techStack.includes(tech.name)) {
                          setTechStack(techStack.filter(t => t !== tech.name));
                        } else {
                          setTechStack([...techStack, tech.name]);
                        }
                      }}
                    >
                      <span className="tech-icon">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={generateProjectIdeas} 
                className="generate-projects-btn"
                disabled={loading || !projectType}
              >
                {loading ? '🔄 Generating...' : '✨ Generate Project Ideas'}
              </button>
            </div>

            {/* Project Ideas */}
            {projectIdeas.length > 0 && (
              <div className="ideas-section">
                <h2>💡 Personalized Project Ideas</h2>
                <div className="ideas-grid">
                  {projectIdeas.map((idea) => (
                    <div key={idea.id} className="idea-card">
                      <div className="idea-header">
                        <h3>{idea.title}</h3>
                        <span 
                          className="difficulty-badge-builder"
                          style={{ background: getDifficultyColor(idea.difficulty) }}
                        >
                          {idea.difficulty}
                        </span>
                      </div>
                      
                      <p className="idea-description">{idea.description}</p>
                      
                      <div className="idea-meta">
                        <div className="meta-item">
                          <span className="meta-label">⏱️ Time:</span>
                          <span className="meta-value">{idea.estimatedTime}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">💼 Market Value:</span>
                          <span className="meta-value">{idea.marketValue}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">⭐ Portfolio Impact:</span>
                          <span className="meta-value">{idea.portfolioImpact}/100</span>
                        </div>
                      </div>

                      <div className="idea-skills">
                        <h4>Skills You'll Learn:</h4>
                        <div className="skills-tags">
                          {idea.skillsToLearn.map((skill, idx) => (
                            <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="idea-features">
                        <h4>Key Features:</h4>
                        <ul>
                          {idea.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        onClick={() => startProject(idea)}
                        className="start-project-btn"
                      >
                        🚀 Start Building
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Active Project View */}
        {activeProject && (
          <div className="active-project-view">
            {/* Project Header */}
            <div className="active-project-header">
              <button 
                onClick={() => {
                  setActiveProject(null);
                  setProjectSteps([]);
                  setCompletedSteps([]);
                }}
                className="back-btn"
              >
                ← Back to Projects
              </button>
              <div className="project-title-section">
                <h2>{activeProject.title}</h2>
                <p>{activeProject.description}</p>
              </div>
              <div className="project-progress-header">
                <div className="progress-circle-builder">
                  <svg width="120" height="120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={`${getProgressPercentage() * 3.14} 314`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <text
                      x="60"
                      y="65"
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="bold"
                      fill="#10b981"
                    >
                      {getProgressPercentage()}%
                    </text>
                  </svg>
                </div>
                <div className="progress-info">
                  <p>{completedSteps.length} of {projectSteps.length} steps completed</p>
                </div>
              </div>
            </div>

            <div className="project-content-grid">
              {/* Left Column - Steps */}
              <div className="steps-column">
                <h3>📋 Build Steps</h3>
                <div className="steps-list">
                  {projectSteps.map((step, idx) => (
                    <div 
                      key={step.id} 
                      className={`step-card ${completedSteps.includes(step.id) ? 'completed' : ''}`}
                    >
                      <div className="step-number">{idx + 1}</div>
                      <div className="step-content">
                        <div className="step-phase">{step.phase}</div>
                        <h4>{step.title}</h4>
                        <p>{step.description}</p>
                        
                        <div className="step-tasks">
                          <h5>Tasks:</h5>
                          <ul>
                            {step.tasks.map((task, taskIdx) => (
                              <li key={taskIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="step-footer">
                          <span className="step-time">⏱️ {step.estimatedTime}</span>
                          <button
                            onClick={() => toggleStepComplete(step.id)}
                            className={`complete-btn ${completedSteps.includes(step.id) ? 'completed' : ''}`}
                          >
                            {completedSteps.includes(step.id) ? '✓ Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Resources & AI */}
              <div className="resources-column">
                {/* Code Snippets */}
                <div className="resource-section">
                  <h3>💻 Code Snippets</h3>
                  <div className="snippets-list">
                    {codeSnippets.map((snippet, idx) => (
                      <div key={idx} className="snippet-card">
                        <div className="snippet-header">
                          <h4>{snippet.title}</h4>
                          <button 
                            onClick={() => copyToClipboard(snippet.code)}
                            className="copy-btn"
                          >
                            📋 Copy
                          </button>
                        </div>
                        <pre className="code-block">
                          <code>{snippet.code}</code>
                        </pre>
                        <p className="snippet-explanation">{snippet.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Resources */}
                <div className="resource-section">
                  <h3>📚 Learning Resources</h3>
                  <div className="resources-list">
                    {learningResources.map((resource, idx) => (
                      <a 
                        key={idx} 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        <div className="resource-type">{resource.type}</div>
                        <h4>{resource.title}</h4>
                        <p>{resource.description}</p>
                        <span className="link-arrow">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* AI Assistant Chat */}
                <div className="resource-section ai-chat-section">
                  <h3>🤖 AI Assistant</h3>
                  <div className="chat-container-builder">
                    <div className="chat-messages">
                      {aiAssistanceChat.length === 0 ? (
                        <div className="chat-empty">
                          <p>👋 Ask me anything about this project!</p>
                          <div className="chat-suggestions">
                            <button onClick={() => setChatInput("How do I implement authentication?")}>
                              How do I implement authentication?
                            </button>
                            <button onClick={() => setChatInput("Explain the database schema")}>
                              Explain the database schema
                            </button>
                            <button onClick={() => setChatInput("What's the best way to structure this?")}>
                              Best practices for structure?
                            </button>
                          </div>
                        </div>
                      ) : (
                        aiAssistanceChat.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`chat-message ${msg.role}`}
                          >
                            <div className="message-content">{msg.content}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="chat-input-container">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askAIAssistance()}
                        placeholder="Ask for help..."
                        className="chat-input-builder"
                      />
                      <button 
                        onClick={askAIAssistance}
                        className="send-btn"
                        disabled={!chatInput.trim()}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBuilderAI;

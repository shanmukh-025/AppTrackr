import React, { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/SkillGapAnalyzer.css';

// Skill categories for matching - EXPANDED
const SKILL_CATEGORIES = {
  'frontend': ['React', 'ReactJS', 'Vue', 'Vue.js', 'Angular', 'JavaScript', 'JS', 'TypeScript', 'TS', 'HTML', 'HTML5', 'CSS', 'CSS3', 'SCSS', 'SASS', 'Redux', 'Next.js', 'NextJS', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'Material-UI', 'MUI', 'Webpack', 'Vite'],
  'backend': ['Node.js', 'Node', 'NodeJS', 'Express', 'ExpressJS', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring', 'Spring Boot', 'C#', '.NET', 'ASP.NET', 'Ruby', 'Ruby on Rails', 'Rails', 'PHP', 'Laravel', 'Go', 'Golang', 'Rust'],
  'database': ['SQL', 'NoSQL', 'MongoDB', 'Mongo', 'PostgreSQL', 'Postgres', 'MySQL', 'Redis', 'Firebase', 'Firestore', 'DynamoDB', 'Elasticsearch', 'Cassandra', 'SQLite', 'Oracle', 'MS SQL'],
  'devops': ['Docker', 'Kubernetes', 'K8s', 'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'GCP', 'Google Cloud', 'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Ansible', 'Linux', 'Unix', 'Bash', 'Shell'],
  'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Xamarin', 'Ionic', 'Cordova'],
  'ai_ml': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'NLP', 'Computer Vision', 'Machine Learning', 'ML', 'Deep Learning', 'AI', 'Artificial Intelligence', 'Data Science'],
  'tools': ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Postman', 'Jira', 'Confluence', 'Linux', 'Webpack', 'Babel', 'npm', 'yarn', 'pnpm', 'VS Code', 'Visual Studio', 'IntelliJ', 'Eclipse'],
  'testing': ['Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Testing Library', 'JUnit', 'PyTest', 'Unit Testing', 'Integration Testing', 'E2E Testing'],
  'api': ['REST', 'RESTful', 'GraphQL', 'API', 'Microservices', 'gRPC', 'WebSocket', 'SOAP'],
  'other': ['Agile', 'Scrum', 'Kanban', 'OOP', 'Design Patterns', 'Algorithms', 'Data Structures', 'System Design', 'Problem Solving']
};

const SkillGapAnalyzer = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('analyze');
  const [jobInput, setJobInput] = useState('');
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'text'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  // Extract skills from text
  const extractSkills = useCallback((text) => {
    const foundSkills = new Set();
    const textLower = text.toLowerCase();

    Object.values(SKILL_CATEGORIES).forEach(skills => {
      skills.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
          foundSkills.add(skill);
        }
      });
    });

    return Array.from(foundSkills);
  }, []);

  // Fetch user profile skills
  const fetchUserSkills = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profile/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.skills || [];
    } catch (err) {
      console.log('Using default user skills');
      return ['JavaScript', 'React', 'Node.js', 'SQL'];
    }
  }, [token, API_URL]);

  // Fetch learning resources from APIs
  const fetchLearningResources = useCallback(async (skillName) => {
    try {
      const response = await axios.get(`${API_URL}/api/learning/resources`, {
        params: { skill: skillName },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.resources || [];
    } catch (err) {
      // Mock resources if API fails
      const mockResources = {
        'React': [
          { title: 'React Official Docs', platform: 'React', url: 'https://react.dev', type: 'Documentation', duration: '10 hours' },
          { title: 'React Complete Guide', platform: 'Udemy', url: '#', price: '$14.99', type: 'Course', duration: '40 hours' },
          { title: 'React Patterns', platform: 'YouTube', url: '#', type: 'Video', duration: '20 hours' }
        ],
        'Python': [
          { title: 'Python for Beginners', platform: 'Codecademy', url: '#', type: 'Interactive', duration: '15 hours' },
          { title: 'Complete Python Bootcamp', platform: 'Udemy', url: '#', price: '$14.99', type: 'Course', duration: '22 hours' },
          { title: 'Python Crash Course', platform: 'Book', url: '#', type: 'Book', duration: '25 hours' }
        ],
        'Docker': [
          { title: 'Docker for Beginners', platform: 'Linux Academy', url: '#', type: 'Course', duration: '12 hours' },
          { title: 'Complete Docker Course', platform: 'Udemy', url: '#', price: '$11.99', type: 'Course', duration: '18 hours' },
          { title: 'Docker Deep Dive', platform: 'YouTube', url: '#', type: 'Video', duration: '15 hours' }
        ]
      };
      return mockResources[skillName] || [];
    }
  }, [token, API_URL]);

  // Analyze job description
  const handleAnalyzeJob = useCallback(async () => {
    if (!jobInput.trim()) {
      setError('Please enter a job description or URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch job content if URL
      let jobText = jobInput;
      if (inputMethod === 'url') {
        try {
          const response = await axios.post(`${API_URL}/api/skill-gap/parse-job`, 
            { url: jobInput },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          jobText = response.data.content;
        } catch (err) {
          setError('Could not fetch job description. Please paste the job text instead.');
          setLoading(false);
          return;
        }
      }

      // Extract required skills from job
      const requiredSkills = extractSkills(jobText);
      
      console.log('📊 Required skills from job:', requiredSkills);

      // Fetch user's current skills
      const userSkills = await fetchUserSkills();
      
      console.log('👤 User skills:', userSkills);

      // Calculate gaps - improved matching (case-insensitive + partial match)
      const userSkillsNormalized = userSkills.map(s => s.toLowerCase().trim());
      
      const matched = requiredSkills.filter(reqSkill => {
        const reqLower = reqSkill.toLowerCase().trim();
        return userSkillsNormalized.some(userSkill => 
          userSkill === reqLower || 
          userSkill.includes(reqLower) || 
          reqLower.includes(userSkill)
        );
      });
      
      const gaps = requiredSkills.filter(reqSkill => {
        const reqLower = reqSkill.toLowerCase().trim();
        return !userSkillsNormalized.some(userSkill => 
          userSkill === reqLower || 
          userSkill.includes(reqLower) || 
          reqLower.includes(userSkill)
        );
      });
      
      console.log('✅ Matched skills:', matched);
      console.log('❌ Gap skills:', gaps);

      // Calculate proficiency scores
      const skillProficiency = {};
      for (const skill of requiredSkills) {
        const skillLower = skill.toLowerCase();
        const isMatched = userSkillsNormalized.some(us => 
          us === skillLower || us.includes(skillLower) || skillLower.includes(us)
        );
        skillProficiency[skill] = isMatched ? 80 : 0;
      }

      const matchPercentage = requiredSkills.length > 0 
        ? Math.round((matched.length / requiredSkills.length) * 100)
        : 0;

      const results = {
        requiredSkills,
        userSkills,
        matched,
        gaps,
        matchPercentage,
        skillProficiency,
        jobTitle: extractJobTitle(jobText),
        company: extractCompany(jobText),
        timestamp: new Date().toLocaleDateString()
      };
      
      console.log('📈 Match percentage:', matchPercentage + '%');

      setAnalysisResults(results);
      setSavedAnalyses(prev => [results, ...prev]);
      setActiveTab('results');
    } catch (err) {
      setError('Error analyzing job description: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [jobInput, inputMethod, token, API_URL, extractSkills, fetchUserSkills]);

  // Generate learning path
  const generateLearningPath = useCallback(async (skillsToLearn) => {
    try {
      const paths = [];

      for (const skill of skillsToLearn) {
        const resources = await fetchLearningResources(skill);
        
        // Find category
        let category = 'Other';
        for (const [cat, skills] of Object.entries(SKILL_CATEGORIES)) {
          if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            category = cat;
            break;
          }
        }

        paths.push({
          skill,
          category,
          resources,
          estimatedHours: Math.floor(Math.random() * 20) + 15,
          difficulty: getDifficulty(skill),
          prerequisites: getPrerequisites(skill)
        });
      }

      setLearningPaths(paths);
      setActiveTab('learning');
    } catch (err) {
      setError('Error generating learning path: ' + err.message);
    }
  }, [fetchLearningResources]);

  // Helper functions
  const extractJobTitle = (text) => {
    const match = text.match(/(?:position|role|job title)[:\s]+([^\n.]+)/i);
    return match ? match[1].trim() : 'Job Position';
  };

  const extractCompany = (text) => {
    const match = text.match(/(?:company|about us)[:\s]+([^\n.]+)/i);
    return match ? match[1].trim() : 'Company';
  };

  const getDifficulty = (skill) => {
    const advancedSkills = ['Kubernetes', 'TensorFlow', 'AWS', 'Machine Learning', 'Elasticsearch'];
    return advancedSkills.includes(skill) ? 'Advanced' : 'Intermediate';
  };

  const getPrerequisites = (skill) => {
    const prerequisites = {
      'React': ['JavaScript', 'HTML', 'CSS'],
      'Docker': ['Linux', 'Command Line'],
      'Python': ['Programming Basics'],
      'Kubernetes': ['Docker', 'Linux']
    };
    return prerequisites[skill] || [];
  };

  // Save analysis to database
  const saveAnalysis = useCallback(async () => {
    if (!analysisResults) return;

    try {
      await axios.post(`${API_URL}/api/skill-gap/analyses`, analysisResults, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('');
    } catch (err) {
      console.log('Analysis saved locally');
    }
  }, [analysisResults, token, API_URL]);

  // Calculate statistics
  const getStatistics = () => {
    if (!analysisResults) return null;

    return {
      totalRequired: analysisResults.requiredSkills.length,
      currentlyHave: analysisResults.matched.length,
      needToLearn: analysisResults.gaps.length,
      estimatedMonths: Math.ceil(analysisResults.gaps.length * 0.5)
    };
  };

  const stats = getStatistics();

  return (
    <div className="skill-gap-analyzer">
      {/* Header */}
      <div className="sga-header">
        <h1>🎯 Skill Gap Analyzer</h1>
        <p>Discover what skills you need to land your dream job</p>
      </div>

      {/* Navigation Tabs */}
      <div className="sga-tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          📋 Analyze Job
        </button>
        <button 
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!analysisResults}
        >
          📊 Results
        </button>
        <button 
          className={`tab ${activeTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('learning')}
          disabled={learningPaths.length === 0}
        >
          📚 Learning Path
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📝 History
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Tab Content */}
      <div className="sga-content">
        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="analyze-section">
            <div className="input-method-toggle">
              <button 
                className={`method-btn ${inputMethod === 'url' ? 'active' : ''}`}
                onClick={() => setInputMethod('url')}
              >
                🔗 Job URL
              </button>
              <button 
                className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                onClick={() => setInputMethod('text')}
              >
                📝 Paste Description
              </button>
            </div>

            {inputMethod === 'url' ? (
              <div className="input-group">
                <label>Job Posting URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/... or https://indeed.com/jobs/..."
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                  disabled={loading}
                />
                <p className="helper-text">Paste any job posting URL from LinkedIn, Indeed, or similar platforms</p>
              </div>
            ) : (
              <div className="input-group">
                <label>Job Description</label>
                <textarea
                  placeholder="Paste the full job description here. Include job title, requirements, responsibilities, and nice-to-haves..."
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                  disabled={loading}
                  rows="10"
                />
                <p className="helper-text">The more details you provide, the more accurate the analysis</p>
              </div>
            )}

            <button 
              className="analyze-btn"
              onClick={handleAnalyzeJob}
              disabled={loading || !jobInput.trim()}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Skills'}
            </button>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && analysisResults && (
          <div className="results-section">
            <div className="job-header">
              <div>
                <h2>{analysisResults.jobTitle}</h2>
                <p className="company">{analysisResults.company}</p>
              </div>
              <div className="match-badge">
                <div className="match-percentage">{analysisResults.matchPercentage}%</div>
                <div className="match-label">Match</div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalRequired}</div>
                <div className="stat-label">Required Skills</div>
              </div>
              <div className="stat-card success">
                <div className="stat-number">{stats.currentlyHave}</div>
                <div className="stat-label">You Have</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-number">{stats.needToLearn}</div>
                <div className="stat-label">Need to Learn</div>
              </div>
              <div className="stat-card info">
                <div className="stat-number">{stats.estimatedMonths}m</div>
                <div className="stat-label">Estimated Time</div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="skills-breakdown">
              {/* Matched Skills */}
              {analysisResults.matched.length > 0 && (
                <div className="skills-section">
                  <h3>✅ Skills You Have ({analysisResults.matched.length})</h3>
                  <div className="skills-grid">
                    {analysisResults.matched.map(skill => (
                      <div key={skill} className="skill-badge matched">
                        <span className="skill-icon">✓</span>
                        <span className="skill-name">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gap Skills */}
              {analysisResults.gaps.length > 0 && (
                <div className="skills-section">
                  <h3>⚠️ Skills to Learn ({analysisResults.gaps.length})</h3>
                  <div className="skills-grid">
                    {analysisResults.gaps.map(skill => (
                      <div key={skill} className="skill-badge gap">
                        <span className="skill-icon">+</span>
                        <span className="skill-name">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="primary-btn"
                onClick={() => generateLearningPath(analysisResults.gaps)}
              >
                📚 Generate Learning Path
              </button>
              <button 
                className="secondary-btn"
                onClick={saveAnalysis}
              >
                💾 Save Analysis
              </button>
            </div>
          </div>
        )}

        {/* Learning Path Tab */}
        {activeTab === 'learning' && learningPaths.length > 0 && (
          <div className="learning-section">
            <div className="learning-header">
              <h2>Your Personalized Learning Path</h2>
              <p>Complete these skills to match the job requirements</p>
            </div>

            <div className="learning-timeline">
              {learningPaths.map((path, index) => (
                <div key={index} className="learning-card" onClick={() => setSelectedPath(index)}>
                  <div className="card-header">
                    <h3>{path.skill}</h3>
                    <span className={`difficulty ${path.difficulty.toLowerCase()}`}>
                      {path.difficulty}
                    </span>
                  </div>

                  <div className="card-details">
                    <div className="detail">
                      <span className="label">Category:</span>
                      <span className="value">{path.category}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Time:</span>
                      <span className="value">{path.estimatedHours} hours</span>
                    </div>
                  </div>

                  {path.prerequisites.length > 0 && (
                    <div className="prerequisites">
                      <span className="label">Prerequisites:</span>
                      <div className="prereq-list">
                        {path.prerequisites.map(prereq => (
                          <span key={prereq} className="prereq-tag">{prereq}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="resources-preview">
                    <span className="resource-count">{path.resources.length} Resources Available</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Resource View */}
            {selectedPath !== null && learningPaths[selectedPath] && (
              <div className="resources-detail">
                <div className="detail-header">
                  <h3>{learningPaths[selectedPath].skill} - Learning Resources</h3>
                  <button className="close-btn" onClick={() => setSelectedPath(null)}>✕</button>
                </div>

                <div className="resources-list">
                  {learningPaths[selectedPath].resources.map((resource, idx) => (
                    <div key={idx} className="resource-card">
                      <div className="resource-badge">{resource.platform}</div>
                      <h4>{resource.title}</h4>
                      <div className="resource-meta">
                        <span className="type">{resource.type}</span>
                        <span className="duration">⏱️ {resource.duration}</span>
                        {resource.price && <span className="price">{resource.price}</span>}
                      </div>
                      {resource.url && (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                          Learn More →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Learning Path */}
            <div className="export-section">
              <button className="export-btn">📥 Export Learning Plan</button>
              <button className="export-btn">📧 Email Plan</button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            {savedAnalyses.length > 0 ? (
              <div className="analyses-list">
                {savedAnalyses.map((analysis, index) => (
                  <div key={index} className="history-card">
                    <div className="card-content">
                      <h3>{analysis.jobTitle}</h3>
                      <p className="company-name">{analysis.company}</p>
                      <div className="analysis-meta">
                        <span>📊 {analysis.matchPercentage}% Match</span>
                        <span>📋 {analysis.requiredSkills.length} Skills Required</span>
                        <span>📅 {analysis.timestamp}</span>
                      </div>
                    </div>
                    <button 
                      className="view-btn"
                      onClick={() => {
                        setAnalysisResults(analysis);
                        setActiveTab('results');
                      }}
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Analysis History</h3>
                <p>Analyze your first job to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalyzer;

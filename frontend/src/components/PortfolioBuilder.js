import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/PortfolioBuilder.css';

const PortfolioBuilder = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [portfolioStats, setPortfolioStats] = useState({
    totalVisitors: 0,
    projectViews: 0,
    avgTimeOnSite: 0,
    socialShares: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    demoLink: '',
    githubLink: '',
    category: 'web',
    featured: false,
    startDate: '',
    endDate: '',
    skills: [],
    results: ''
  });

  const themes = [
    { id: 'modern', name: 'Modern', description: 'Clean and minimalist' },
    { id: 'dark', name: 'Dark', description: 'Dark mode professional' },
    { id: 'colorful', name: 'Colorful', description: 'Vibrant and creative' },
    { id: 'minimal', name: 'Minimal', description: 'Ultra-minimalist' },
    { id: 'gradient', name: 'Gradient', description: 'Gradient accents' }
  ];

  const categories = ['Web Development', 'Mobile App', 'Data Science', 'AI/ML', 'DevOps', 'UI/UX', 'Other'];

  const techStack = [
    'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Express',
    'MongoDB', 'PostgreSQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API',
    'HTML/CSS', 'Tailwind CSS', 'Material-UI', 'Redux', 'Next.js', 'Django', 'Flask', 'TensorFlow'
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/portfolio/projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/portfolio/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolioStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchProjects();
    if (activeTab === 'analytics') fetchStats();
  }, [fetchProjects, fetchStats, activeTab]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTechToggle = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.includes(tech)
        ? formData.technologies.filter(t => t !== tech)
        : [...formData.technologies, tech]
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const saveProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.technologies.length === 0) {
      alert('Please fill in required fields');
      return;
    }

    try {
      if (editingProject) {
        // Update project
        const response = await axios.patch(
          `${API_URL}/api/portfolio/projects/${editingProject.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(projects.map(p => p.id === editingProject.id ? response.data.project : p));
      } else {
        // Create project
        const response = await axios.post(
          `${API_URL}/api/portfolio/projects`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects([...projects, response.data.project]);
      }
      resetForm();
    } catch (error) {
      alert('Error saving project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      imageUrl: '',
      demoLink: '',
      githubLink: '',
      category: 'web',
      featured: false,
      startDate: '',
      endDate: '',
      skills: [],
      results: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(
        `${API_URL}/api/portfolio/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const editProject = (project) => {
    setFormData(project);
    setEditingProject(project);
    setShowForm(true);
  };

  const toggleFeatured = async (project) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/portfolio/projects/${project.id}/featured`,
        { featured: !project.featured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.map(p => p.id === project.id ? response.data.project : p));
    } catch (error) {
      alert('Error updating project');
    }
  };

  const ProjectCard = ({ project, isPreview = false }) => (
    <div className={`project-card ${project.featured ? 'featured' : ''} theme-${selectedTheme}`}>
      {project.imageUrl && (
        <div className="project-image">
          <img src={project.imageUrl} alt={project.title} />
          {project.featured && <span className="featured-badge">⭐ FEATURED</span>}
        </div>
      )}

      <div className="project-content">
        <div className="project-header">
          <h3>{project.title}</h3>
          <span className="category-badge">{project.category}</span>
        </div>

        <p className="project-description">{project.description}</p>

        <div className="project-meta">
          {project.startDate && (
            <span className="date-range">
              {new Date(project.startDate).toLocaleDateString()} - 
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
            </span>
          )}
        </div>

        <div className="project-technologies">
          {project.technologies?.map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>

        {project.results && (
          <div className="project-results">
            <strong>Results:</strong> {project.results}
          </div>
        )}

        <div className="project-skills">
          {project.skills?.map(skill => (
            <span key={skill} className="skill-highlight">{skill}</span>
          ))}
        </div>

        {!isPreview && (
          <div className="project-actions">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn-link">
                🔗 Demo
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-link">
                💻 GitHub
              </a>
            )}
            <button className="btn-edit" onClick={() => editProject(project)}>✏️ Edit</button>
            <button className="btn-star" onClick={() => toggleFeatured(project)}>
              {project.featured ? '⭐ Unfeature' : '☆ Feature'}
            </button>
            <button className="btn-delete" onClick={() => deleteProject(project.id)}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="portfolio-builder">
      {/* Header */}
      <div className="portfolio-header">
        <div>
          <h1>🎨 Portfolio Builder</h1>
          <p>Showcase your best projects and skills</p>
        </div>
        <button className="btn-new-project" onClick={() => {
          resetForm();
          setShowForm(true);
        }}>
          ✨ New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="portfolio-tabs">
        <button 
          className={`portfolio-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
        <button 
          className={`portfolio-tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          Theme
        </button>
        <button 
          className={`portfolio-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`portfolio-tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="projects-container">
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Start showcasing your work!</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                Create First Project
              </button>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="theme-selector">
          <h2>Choose Your Portfolio Theme</h2>
          <div className="themes-grid">
            {themes.map(theme => (
              <div 
                key={theme.id}
                className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className={`theme-preview theme-${theme.id}`}></div>
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="analytics-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-value">{portfolioStats.totalVisitors || 0}</div>
              <div className="stat-label">Portfolio Visitors</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{portfolioStats.projectViews || 0}</div>
              <div className="stat-label">Project Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{portfolioStats.avgTimeOnSite || 0}s</div>
              <div className="stat-label">Avg Time on Site</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div className="stat-value">{portfolioStats.socialShares || 0}</div>
              <div className="stat-label">Social Shares</div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className={`portfolio-preview theme-${selectedTheme}`}>
          <div className="preview-header">
            <h2>Portfolio Preview</h2>
            <p>This is how your portfolio will look to visitors</p>
          </div>
          <div className="preview-projects">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>Add projects to preview your portfolio</p>
              </div>
            ) : (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} isPreview={true} />
              ))
            )}
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <div className="form-overlay" onClick={() => resetForm()}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => resetForm()}>✕</button>
            <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>

            <form onSubmit={saveProject} className="project-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., E-Commerce Platform"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Demo Link</label>
                  <input 
                    type="url"
                    name="demoLink"
                    value={formData.demoLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Link</label>
                  <input 
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Technologies Used *</label>
                <div className="tech-selector">
                  {techStack.map(tech => (
                    <button
                      key={tech}
                      type="button"
                      className={`tech-btn ${formData.technologies.includes(tech) ? 'selected' : ''}`}
                      onClick={() => handleTechToggle(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Key Skills Demonstrated</label>
                <div className="skill-selector">
                  {['Problem Solving', 'System Design', 'Performance Optimization', 'User Experience', 'Code Quality', 'Testing', 'Deployment', 'Security'].map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`skill-btn ${formData.skills.includes(skill) ? 'selected' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Results/Metrics</label>
                <input 
                  type="text"
                  name="results"
                  value={formData.results}
                  onChange={handleInputChange}
                  placeholder="e.g., 10k+ users, 99.9% uptime, 40% performance improvement"
                />
              </div>

              <div className="form-checkbox">
                <input 
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <label htmlFor="featured">Mark as featured project</label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => resetForm()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/CoverLetterTemplates.css';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Consulting', 'Retail', 'Marketing', 'Other'];
const TONES = ['Professional', 'Casual', 'Enthusiastic'];

const CoverLetterTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    tone: 'Professional',
    opening: '',
    bodyParagraph1: '',
    bodyParagraph2: '',
    bodyParagraph3: '',
    closing: '',
    isDefault: false
  });

  const [applyData, setApplyData] = useState({
    company: '',
    position: '',
    skills: ''
  });

  const token = localStorage.getItem('token');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/templates/cover-letter', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateNew = () => {
    setFormData({
      name: '',
      industry: 'Technology',
      tone: 'Professional',
      opening: '',
      bodyParagraph1: '',
      bodyParagraph2: '',
      bodyParagraph3: '',
      closing: '',
      isDefault: false
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    setFormData(selectedTemplate);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.opening || !formData.closing) {
      alert('Please fill in name, opening, and closing sections');
      return;
    }

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating 
        ? '/api/templates/cover-letter'
        : `/api/templates/cover-letter/${selectedTemplate.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(isCreating ? 'Template created!' : 'Template updated!');
        fetchTemplates();
        setIsCreating(false);
        setIsEditing(false);
        setSelectedTemplate(null);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save template');
      }
    } catch (err) {
      alert('Error saving template');
      console.error(err);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate || !window.confirm('Delete this template?')) return;

    try {
      const response = await fetch(`/api/templates/cover-letter/${selectedTemplate.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Template deleted');
        fetchTemplates();
        setSelectedTemplate(null);
      }
    } catch (err) {
      alert('Error deleting template');
      console.error(err);
    }
  };

  const handleApplyTemplate = async () => {
    if (!applyData.company || !applyData.position) {
      alert('Please enter company and position');
      return;
    }

    try {
      const skillsArray = applyData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const response = await fetch(`/api/templates/cover-letter/${selectedTemplate.id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: applyData.company,
          position: applyData.position,
          skills: skillsArray
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewContent(data.coverLetter);
      } else {
        alert('Failed to generate cover letter');
      }
    } catch (err) {
      alert('Error applying template');
      console.error(err);
    }
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewContent);
    alert('Cover letter copied to clipboard!');
  };

  const handleDownloadPreview = () => {
    const element = document.createElement('a');
    const file = new Blob([previewContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${applyData.company}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h1>📝 Cover Letter Templates</h1>
        <p>Create and manage reusable cover letter templates by industry</p>
        <button className="create-btn" onClick={handleCreateNew}>
          + New Template
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading templates...</div>}

      <div className="templates-grid">
        <div className="templates-list">
          <h2>Your Templates</h2>
          {templates.length === 0 ? (
            <div className="empty-state">
              <p>No templates yet. Create one to get started!</p>
            </div>
          ) : (
            templates.map(template => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsCreating(false);
                  setIsEditing(false);
                }}
              >
                <div className="template-item-header">
                  <h3>{template.name}</h3>
                  {template.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="template-item-meta">
                  <span className="industry-tag">{template.industry}</span>
                  <span className="tone-tag">{template.tone}</span>
                </div>
                <small>Created: {new Date(template.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>

        <div className="templates-main">
          {isCreating || isEditing ? (
            <div className="template-form">
              <h2>{isCreating ? 'Create New Template' : 'Edit Template'}</h2>
              
              <div className="form-group">
                <label>Template Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Tech Company Standard"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tone *</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  >
                    {TONES.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Opening *</label>
                <textarea
                  placeholder="Opening paragraph (use [COMPANY], [POSITION] for placeholders)"
                  value={formData.opening}
                  onChange={(e) => setFormData({...formData, opening: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Body Paragraph 1</label>
                <textarea
                  placeholder="First body paragraph"
                  value={formData.bodyParagraph1}
                  onChange={(e) => setFormData({...formData, bodyParagraph1: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Body Paragraph 2</label>
                <textarea
                  placeholder="Second body paragraph"
                  value={formData.bodyParagraph2}
                  onChange={(e) => setFormData({...formData, bodyParagraph2: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Body Paragraph 3</label>
                <textarea
                  placeholder="Third body paragraph"
                  value={formData.bodyParagraph3}
                  onChange={(e) => setFormData({...formData, bodyParagraph3: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Closing *</label>
                <textarea
                  placeholder="Closing paragraph"
                  value={formData.closing}
                  onChange={(e) => setFormData({...formData, closing: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                />
                <label>Set as default template</label>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={handleSaveTemplate}>
                  Save Template
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedTemplate ? (
            <div className="template-view">
              <div className="view-header">
                <div>
                  <h2>{selectedTemplate.name}</h2>
                  <div className="view-tags">
                    <span className="industry-tag">{selectedTemplate.industry}</span>
                    <span className="tone-tag">{selectedTemplate.tone}</span>
                    {selectedTemplate.isDefault && <span className="default-badge">Default</span>}
                  </div>
                </div>
                <div className="view-actions">
                  <button className="edit-btn" onClick={handleEditTemplate}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={handleDeleteTemplate}>
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <button 
                className="apply-btn"
                onClick={() => setShowApplyForm(!showApplyForm)}
              >
                🚀 Generate Cover Letter
              </button>

              {showApplyForm && (
                <div className="apply-form">
                  <h3>Generate Cover Letter</h3>
                  <input
                    type="text"
                    placeholder="Company name (e.g., Google)"
                    value={applyData.company}
                    onChange={(e) => setApplyData({...applyData, company: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Position (e.g., Senior Engineer)"
                    value={applyData.position}
                    onChange={(e) => setApplyData({...applyData, position: e.target.value})}
                  />
                  <textarea
                    placeholder="Key skills (comma-separated, e.g., React, Node.js, AWS)"
                    value={applyData.skills}
                    onChange={(e) => setApplyData({...applyData, skills: e.target.value})}
                    rows={3}
                  />
                  <button className="generate-btn" onClick={handleApplyTemplate}>
                    Generate
                  </button>
                </div>
              )}

              {previewContent && (
                <div className="preview-section">
                  <h3>Generated Cover Letter</h3>
                  <div className="letter-preview">
                    {previewContent.split('\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                  <div className="preview-actions">
                    <button className="copy-btn" onClick={handleCopyPreview}>
                      📋 Copy to Clipboard
                    </button>
                    <button className="download-btn" onClick={handleDownloadPreview}>
                      ⬇️ Download as Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-selection">
              <p>Select a template or create a new one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTemplates;

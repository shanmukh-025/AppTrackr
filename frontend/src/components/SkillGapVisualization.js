import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './SkillGapVisualization.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SkillGapVisualization = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [expandedSkill, setExpandedSkill] = useState(null);

  const analyzeGap = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please enter both resume and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/skill-gap/text',
        { resumeText, jobDescription },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze skill gap');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <div className="skill-gap-container">
      <h2>🎯 Skill Gap Visualization</h2>

      <div className="input-section">
        <div className="input-group">
          <label>Your Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            rows="6"
            className="textarea"
          />
        </div>

        <div className="input-group">
          <label>Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            rows="6"
            className="textarea"
          />
        </div>

        <button
          onClick={analyzeGap}
          disabled={loading}
          className="btn-analyze"
        >
          {loading ? 'Analyzing...' : 'Analyze Gap'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          {/* Match Score Section */}
          <div className="score-section">
            <div className="score-card">
              <div className="score-number">{analysis.skillGap.matchPercentage}%</div>
              <div className="score-label">Match Score</div>
              <div className="score-details">
                {analysis.skillGap.totalMatched}/{analysis.skillGap.totalRequired} skills matched
              </div>
            </div>

            {/* Pie Chart */}
            <div className="chart-container">
              <h4>Skills Distribution</h4>
              <Pie
                data={{
                  labels: analysis.chartData.matchChart.labels,
                  datasets: [{
                    data: analysis.chartData.matchChart.data,
                    backgroundColor: analysis.chartData.matchChart.backgroundColor,
                    borderColor: analysis.chartData.matchChart.borderColor,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>

          {/* Bar Chart - Skills by Category */}
          <div className="chart-full">
            <h3>Skills by Category</h3>
            <Bar
              data={{
                labels: analysis.chartData.skillsByCategory.labels,
                datasets: [
                  {
                    label: 'Matched',
                    data: analysis.chartData.skillsByCategory.matched,
                    backgroundColor: '#4CAF50'
                  },
                  {
                    label: 'Missing',
                    data: analysis.chartData.skillsByCategory.missing,
                    backgroundColor: '#ff6b6b'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true }
                }
              }}
            />
          </div>

          {/* Matched Skills */}
          <div className="skills-section">
            <h3>✅ Matched Skills ({analysis.skillGap.matched.length})</h3>
            <div className="skills-grid">
              {analysis.skillGap.matched.map((skill, i) => (
                <span key={i} className="skill-tag matched">{skill}</span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="skills-section">
            <h3>🔴 Missing Skills ({analysis.skillGap.missing.length})</h3>
            <div className="skills-grid">
              {analysis.skillGap.missing.map((skill, i) => (
                <span key={i} className="skill-tag missing">{skill}</span>
              ))}
            </div>
          </div>

          {/* Extra Skills */}
          {analysis.skillGap.extra.length > 0 && (
            <div className="skills-section">
              <h3>💎 Your Extra Skills ({analysis.skillGap.extra.length})</h3>
              <div className="skills-grid">
                {analysis.skillGap.extra.map((skill, i) => (
                  <span key={i} className="skill-tag extra">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="recommendations-section">
            <h3>💡 Recommendations</h3>
            <div className="recommendations-list">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="recommendation-item" style={{ borderLeftColor: getPriorityColor(rec.priority) }}>
                  <div className="rec-header">
                    <h5>{rec.category}</h5>
                    <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
                  </div>
                  <p className="rec-message">{rec.message}</p>
                  <div className="rec-skills">
                    {rec.skills.map((skill, j) => (
                      <span key={j} className="rec-skill">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          {analysis.learningResources.length > 0 && (
            <div className="resources-section">
              <h3>📚 Learning Resources</h3>
              <div className="resources-grid">
                {analysis.learningResources.map((resource, i) => (
                  <div key={i} className="resource-card">
                    <button
                      className="resource-header"
                      onClick={() => setExpandedSkill(expandedSkill === i ? null : i)}
                    >
                      <h4>{resource.skill}</h4>
                      <span className="time-badge">⏱️ {resource.estimatedWeeks} weeks</span>
                      <span className="toggle-icon">{expandedSkill === i ? '▼' : '▶'}</span>
                    </button>
                    {expandedSkill === i && (
                      <div className="resource-content">
                        <p className="resource-platforms">
                          <strong>Recommended Platforms:</strong>
                        </p>
                        <ul>
                          {resource.resources.map((platform, j) => (
                            <li key={j}>{platform}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary">📥 Create Learning Plan</button>
            <button className="btn-secondary">📊 Save Analysis</button>
            <button className="btn-secondary">🔄 Analyze Another Job</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapVisualization;

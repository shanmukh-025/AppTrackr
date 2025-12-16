import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AICareerDNA.css';

const AICareerDNA = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [activeSection, setActiveSection] = useState('scan');
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [careerDNA, setCareerDNA] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // DNA Analysis Data
  const [dnaData, setDnaData] = useState({
    personalityTraits: [],
    strengthsProfile: [],
    careerArchetype: '',
    learningStyle: '',
    workStylePreference: '',
    communicationStyle: '',
    leadershipPotential: 0,
    innovationScore: 0,
    collaborationScore: 0,
    technicalAptitude: 0,
    emotionalIntelligence: 0,
    adaptabilityScore: 0
  });

  // Real-time Insights
  const [liveInsights, setLiveInsights] = useState([]);
  const [opportunityMatches, setOpportunityMatches] = useState([]);
  const [growthPath, setGrowthPath] = useState([]);

  // Scan career profile
  const startCareerScan = async () => {
    setAnalyzing(true);
    setScanProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      
      // Simulate progressive scanning
      const stages = [
        { progress: 15, message: '🔍 Analyzing your application history...' },
        { progress: 30, message: '📊 Evaluating skill patterns...' },
        { progress: 45, message: '🎯 Identifying career strengths...' },
        { progress: 60, message: '🧬 Mapping personality traits...' },
        { progress: 75, message: '💡 Discovering hidden potential...' },
        { progress: 90, message: '🚀 Generating career DNA profile...' },
        { progress: 100, message: '✅ Analysis complete!' }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setScanProgress(stage.progress);
        setLiveInsights(prev => [...prev, stage.message]);
      }

      // Get comprehensive analysis from backend
      const response = await axios.post(
        `${API_URL}/api/ai/career-dna-analysis`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCareerDNA(response.data);
      setDnaData(response.data.dnaProfile);
      setOpportunityMatches(response.data.opportunities || []);
      setGrowthPath(response.data.growthPath || []);
      setActiveSection('results');
    } catch (error) {
      console.error('Career DNA scan error:', error);
      alert('Failed to complete career scan. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // DNA Visualization Component
  const DNAHelix = ({ score, label, color }) => (
    <div className="dna-helix-item">
      <div className="dna-helix-visual">
        <div className="dna-strand" style={{ '--helix-color': color }}>
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="dna-base"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                opacity: i < (score / 100) * 12 ? 1 : 0.2
              }}
            />
          ))}
        </div>
        <div className="dna-score">{score}%</div>
      </div>
      <div className="dna-label">{label}</div>
    </div>
  );

  return (
    <div className="career-dna-container">
      {/* Hero Header */}
      <div className="dna-hero">
        <div className="dna-hero-content">
          <div className="dna-icon-large">🧬</div>
          <h1 className="dna-title">AI Career DNA Analyzer</h1>
          <p className="dna-subtitle">
            Unlock your unique career genetic code with advanced AI analysis
          </p>
          <div className="dna-stats-row">
            <div className="dna-stat-badge">
              <span className="stat-icon">🎯</span>
              <span>98% Accuracy</span>
            </div>
            <div className="dna-stat-badge">
              <span className="stat-icon">⚡</span>
              <span>Real-time Analysis</span>
            </div>
            <div className="dna-stat-badge">
              <span className="stat-icon">🔮</span>
              <span>Predictive Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dna-tabs">
        <button
          className={`dna-tab ${activeSection === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveSection('scan')}
        >
          <span className="tab-icon">🔬</span>
          DNA Scan
        </button>
        <button
          className={`dna-tab ${activeSection === 'results' ? 'active' : ''}`}
          onClick={() => setActiveSection('results')}
          disabled={!careerDNA}
        >
          <span className="tab-icon">🧬</span>
          Your DNA Profile
        </button>
        <button
          className={`dna-tab ${activeSection === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveSection('insights')}
          disabled={!careerDNA}
        >
          <span className="tab-icon">💡</span>
          AI Insights
        </button>
        <button
          className={`dna-tab ${activeSection === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveSection('opportunities')}
          disabled={!careerDNA}
        >
          <span className="tab-icon">🎯</span>
          Matched Opportunities
        </button>
      </div>

      {/* Scan Section */}
      {activeSection === 'scan' && (
        <div className="dna-section scan-section">
          <div className="scan-card">
            <h2>🔬 Start Your Career DNA Analysis</h2>
            <p>
              Our advanced AI will analyze your entire career profile including applications, 
              skills, interview performance, and behavioral patterns to create your unique 
              Career DNA profile.
            </p>
            
            <div className="scan-features">
              <div className="scan-feature">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Personality Mapping</h4>
                  <p>Discover your unique career personality traits</p>
                </div>
              </div>
              <div className="scan-feature">
                <span className="feature-icon">💪</span>
                <div>
                  <h4>Strengths Analysis</h4>
                  <p>Identify your core professional strengths</p>
                </div>
              </div>
              <div className="scan-feature">
                <span className="feature-icon">🚀</span>
                <div>
                  <h4>Growth Potential</h4>
                  <p>Unlock hidden career opportunities</p>
                </div>
              </div>
              <div className="scan-feature">
                <span className="feature-icon">🎨</span>
                <div>
                  <h4>Career Archetype</h4>
                  <p>Find your ideal career archetype match</p>
                </div>
              </div>
            </div>

            {analyzing && (
              <div className="scan-progress-container">
                <div className="scan-progress-bar">
                  <div 
                    className="scan-progress-fill"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="scan-percentage">{scanProgress}%</div>
                <div className="live-insights">
                  {liveInsights.map((insight, index) => (
                    <div key={index} className="insight-message animate-in">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="start-scan-btn"
              onClick={startCareerScan}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <span className="btn-spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  🧬 Start DNA Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* DNA Profile Results */}
      {activeSection === 'results' && careerDNA && (
        <div className="dna-section results-section">
          {/* Career Archetype Card */}
          <div className="archetype-card">
            <div className="archetype-badge">Your Career Archetype</div>
            <h2 className="archetype-title">{dnaData.careerArchetype || 'The Innovator'}</h2>
            <p className="archetype-description">
              You are a natural problem-solver who thrives in dynamic environments. 
              Your innovative mindset and technical prowess make you ideal for roles 
              that challenge the status quo.
            </p>
          </div>

          {/* DNA Helix Visualization */}
          <div className="dna-helix-grid">
            <h3 className="section-title">🧬 Your Career DNA Strands</h3>
            <div className="helix-container">
              <DNAHelix 
                score={dnaData.technicalAptitude || 85} 
                label="Technical Aptitude" 
                color="#3b82f6"
              />
              <DNAHelix 
                score={dnaData.leadershipPotential || 72} 
                label="Leadership Potential" 
                color="#8b5cf6"
              />
              <DNAHelix 
                score={dnaData.innovationScore || 91} 
                label="Innovation Score" 
                color="#f59e0b"
              />
              <DNAHelix 
                score={dnaData.emotionalIntelligence || 78} 
                label="Emotional Intelligence" 
                color="#10b981"
              />
              <DNAHelix 
                score={dnaData.collaborationScore || 88} 
                label="Collaboration" 
                color="#ec4899"
              />
              <DNAHelix 
                score={dnaData.adaptabilityScore || 82} 
                label="Adaptability" 
                color="#14b8a6"
              />
            </div>
          </div>

          {/* Personality Traits */}
          <div className="traits-section">
            <h3 className="section-title">✨ Dominant Personality Traits</h3>
            <div className="traits-grid">
              {(dnaData.personalityTraits || [
                { name: 'Analytical Thinker', strength: 92, icon: '🧠' },
                { name: 'Creative Problem-Solver', strength: 88, icon: '💡' },
                { name: 'Detail-Oriented', strength: 85, icon: '🔍' },
                { name: 'Strategic Planner', strength: 79, icon: '🎯' }
              ]).map((trait, index) => (
                <div key={index} className="trait-card">
                  <span className="trait-icon">{trait.icon}</span>
                  <div className="trait-info">
                    <h4>{trait.name}</h4>
                    <div className="trait-strength-bar">
                      <div 
                        className="trait-strength-fill"
                        style={{ width: `${trait.strength}%` }}
                      />
                    </div>
                    <span className="trait-percentage">{trait.strength}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Style Profile */}
          <div className="work-style-grid">
            <div className="work-style-card">
              <h4>🎨 Learning Style</h4>
              <p className="style-value">{dnaData.learningStyle || 'Visual & Hands-on'}</p>
            </div>
            <div className="work-style-card">
              <h4>💼 Work Preference</h4>
              <p className="style-value">{dnaData.workStylePreference || 'Hybrid Collaboration'}</p>
            </div>
            <div className="work-style-card">
              <h4>💬 Communication</h4>
              <p className="style-value">{dnaData.communicationStyle || 'Direct & Analytical'}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Section */}
      {activeSection === 'insights' && careerDNA && (
        <div className="dna-section insights-section">
          <h2 className="section-title">💡 AI-Powered Career Insights</h2>
          
          <div className="insight-cards">
            <div className="insight-card strength">
              <div className="insight-header">
                <span className="insight-icon">💪</span>
                <h3>Your Superpowers</h3>
              </div>
              <ul className="insight-list">
                {(dnaData.strengthsProfile || [
                  'Exceptional problem-solving abilities',
                  'Strong technical foundation',
                  'Adaptive learning mindset',
                  'Collaborative team player'
                ]).map((strength, idx) => (
                  <li key={idx}>✓ {strength}</li>
                ))}
              </ul>
            </div>

            <div className="insight-card opportunity">
              <div className="insight-header">
                <span className="insight-icon">🚀</span>
                <h3>Growth Opportunities</h3>
              </div>
              <ul className="insight-list">
                {growthPath.map((growth, idx) => (
                  <li key={idx}>→ {growth}</li>
                ))}
              </ul>
            </div>

            <div className="insight-card recommendation">
              <div className="insight-header">
                <span className="insight-icon">🎯</span>
                <h3>AI Recommendations</h3>
              </div>
              <div className="recommendation-items">
                <div className="recommendation-item">
                  <span className="rec-badge">High Priority</span>
                  <p>Focus on cloud architecture certifications to boost your technical leadership profile</p>
                </div>
                <div className="recommendation-item">
                  <span className="rec-badge">Quick Win</span>
                  <p>Showcase your problem-solving skills through open-source contributions</p>
                </div>
                <div className="recommendation-item">
                  <span className="rec-badge">Career Move</span>
                  <p>Target senior engineering roles at mid-stage startups for maximum growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matched Opportunities */}
      {activeSection === 'opportunities' && careerDNA && (
        <div className="dna-section opportunities-section">
          <h2 className="section-title">🎯 DNA-Matched Opportunities</h2>
          <p className="section-subtitle">
            Jobs and companies perfectly aligned with your Career DNA profile
          </p>
          
          <div className="opportunity-filters">
            <button className="filter-chip active">All Matches</button>
            <button className="filter-chip">Perfect Fit (95%+)</button>
            <button className="filter-chip">Strong Fit (80-94%)</button>
            <button className="filter-chip">Good Fit (70-79%)</button>
          </div>

          <div className="opportunities-grid">
            {(opportunityMatches.length > 0 ? opportunityMatches : [
              {
                company: 'TechCorp',
                role: 'Senior Software Engineer',
                match: 96,
                reason: 'Perfect alignment with your technical leadership DNA',
                salary: '$140K - $180K',
                location: 'Remote'
              },
              {
                company: 'InnovateLabs',
                role: 'Tech Lead',
                match: 92,
                reason: 'Matches your innovation and collaboration strengths',
                salary: '$150K - $200K',
                location: 'San Francisco'
              },
              {
                company: 'DataStream',
                role: 'Principal Engineer',
                match: 88,
                reason: 'Aligns with your problem-solving archetype',
                salary: '$160K - $220K',
                location: 'New York'
              }
            ]).map((opp, index) => (
              <div key={index} className="opportunity-card">
                <div className="opp-match-badge" data-match={opp.match >= 90 ? 'perfect' : 'strong'}>
                  {opp.match}% DNA Match
                </div>
                <h3 className="opp-role">{opp.role}</h3>
                <p className="opp-company">🏢 {opp.company}</p>
                <p className="opp-reason">{opp.reason}</p>
                <div className="opp-details">
                  <span className="opp-detail">💰 {opp.salary}</span>
                  <span className="opp-detail">📍 {opp.location}</span>
                </div>
                <button className="apply-dna-btn">Apply with DNA Profile</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICareerDNA;

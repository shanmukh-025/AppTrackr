import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuantumLearning.css';

const QuantumLearning = () => {
  const [quantumState, setQuantumState] = useState(null);
  const [aiPersona, setAIPersona] = useState(null);
  const [brainSyncActive, setBrainSyncActive] = useState(false);
  const [activeTab, setActiveTab] = useState('quantum');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState({
    focusScore: 0,
    comprehensionRate: 0,
    flowState: false
  });

  useEffect(() => {
    loadQuantumState();
    loadAIPersona();
  }, []);

  // Quantum Neural Scan
  const performQuantumScan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/futuristic-learning/quantum-scan', {
        activityType: 'learning',
        duration: 30
      });
      setQuantumState(response.data.quantumState);
      alert(response.data.insights.primaryInsight);
    } catch (error) {
      console.error('Quantum scan error:', error);
      alert('Failed to perform quantum scan');
    }
    setLoading(false);
  };

  const loadQuantumState = async () => {
    try {
      const response = await axios.get('/api/futuristic-learning/quantum-state');
      if (!response.data.needsScan) {
        setQuantumState(response.data);
      }
    } catch (error) {
      console.error('Load quantum state error:', error);
    }
  };

  const loadAIPersona = async () => {
    try {
      const response = await axios.get('/api/futuristic-learning/ai-persona');
      if (!response.data.needsSetup) {
        setAIPersona(response.data);
      }
    } catch (error) {
      console.error('Load AI persona error:', error);
    }
  };

  // Brain Sync Session
  const startBrainSync = async () => {
    try {
      const response = await axios.post('/api/futuristic-learning/brain-sync/start', {
        sessionType: 'deep-learning'
      });
      setSessionId(response.data.sessionId);
      setBrainSyncActive(true);
      
      // Simulate real-time updates
      startSessionUpdates(response.data.sessionId);
    } catch (error) {
      console.error('Start brain sync error:', error);
    }
  };

  const startSessionUpdates = (id) => {
    const interval = setInterval(async () => {
      // Simulate changing metrics
      const focus = 60 + Math.random() * 40;
      const comprehension = 50 + Math.random() * 50;
      const flowState = focus > 85 && comprehension > 80;

      setSessionData({
        focusScore: Math.round(focus),
        comprehensionRate: Math.round(comprehension),
        flowState
      });

      try {
        await axios.post(`/api/futuristic-learning/brain-sync/${id}/update`, {
          focusScore: focus,
          comprehensionRate: comprehension,
          flowStateDetected: flowState,
          distractionDetected: focus < 60
        });
      } catch (error) {
        console.error('Update error:', error);
      }
    }, 2000);

    // Store interval to clear later
    window.brainSyncInterval = interval;
  };

  const stopBrainSync = async () => {
    if (window.brainSyncInterval) {
      clearInterval(window.brainSyncInterval);
    }

    try {
      const response = await axios.post(`/api/futuristic-learning/brain-sync/${sessionId}/end`, {
        heartRateAvg: 72,
        stressLevel: 25,
        energyLevel: 78
      });
      
      alert(`Session complete! Performance: ${response.data.insights.overallPerformance}%`);
      setBrainSyncActive(false);
      setSessionId(null);
    } catch (error) {
      console.error('Stop brain sync error:', error);
    }
  };

  const createAIPersona = async () => {
    try {
      const response = await axios.post('/api/futuristic-learning/ai-persona', {
        personaName: 'My Learning Twin',
        mentorPersonality: 'socratic',
        teachingStyle: 'challenge-based'
      });
      setAIPersona(response.data.persona);
      alert('AI Persona created! Your digital twin is ready.');
    } catch (error) {
      console.error('Create AI persona error:', error);
    }
  };

  const simulateFutureSelf = async (timeframe) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/futuristic-learning/future-self/simulate', {
        timeframe
      });
      
      const sim = response.data.simulation;
      alert(`🔮 Future You (${timeframe}):\n\n` +
            `Role: ${sim.projectedRole}\n` +
            `Salary: $${sim.projectedSalary?.toLocaleString()}\n` +
            `Satisfaction: ${sim.satisfactionScore}%\n` +
            `Accuracy: ${sim.accuracyScore}% confidence`);
    } catch (error) {
      console.error('Future simulation error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="quantum-learning">
      <div className="quantum-header">
        <h1 className="quantum-title">
          <span className="quantum-icon">⚛️</span>
          Quantum Learning Interface
          <span className="quantum-badge">200 YEARS FROM NOW</span>
        </h1>
        <p className="quantum-subtitle">
          Neural mapping • AI predictions • Parallel timelines • Collective intelligence
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="quantum-tabs">
        <button 
          className={activeTab === 'quantum' ? 'tab-active' : ''}
          onClick={() => setActiveTab('quantum')}
        >
          🧠 Quantum State
        </button>
        <button 
          className={activeTab === 'persona' ? 'tab-active' : ''}
          onClick={() => setActiveTab('persona')}
        >
          🤖 AI Persona
        </button>
        <button 
          className={activeTab === 'brainsync' ? 'tab-active' : ''}
          onClick={() => setActiveTab('brainsync')}
        >
          🧬 Brain Sync
        </button>
        <button 
          className={activeTab === 'future' ? 'tab-active' : ''}
          onClick={() => setActiveTab('future')}
        >
          🔮 Future Self
        </button>
      </div>

      {/* Quantum State Tab */}
      {activeTab === 'quantum' && (
        <div className="quantum-content">
          {!quantumState ? (
            <div className="quantum-empty">
              <div className="quantum-empty-icon">⚛️</div>
              <h3>Perform Your First Quantum Neural Scan</h3>
              <p>Analyze your brain waves, cognitive load, and future career trajectory</p>
              <button 
                className="quantum-scan-btn" 
                onClick={performQuantumScan}
                disabled={loading}
              >
                {loading ? 'Scanning Neural Patterns...' : '🔬 Start Quantum Scan'}
              </button>
            </div>
          ) : (
            <div className="quantum-dashboard">
              {/* Brain Wave Patterns */}
              <div className="quantum-card glass-card">
                <h3>🌊 Brain Wave Patterns</h3>
                <div className="brain-waves">
                  <div className="wave-bar">
                    <span className="wave-label">Alpha (Relaxed Focus)</span>
                    <div className="wave-progress">
                      <div 
                        className="wave-fill alpha" 
                        style={{width: `${quantumState.brainWavePattern.alpha}%`}}
                      >
                        {Math.round(quantumState.brainWavePattern.alpha)}%
                      </div>
                    </div>
                  </div>
                  <div className="wave-bar">
                    <span className="wave-label">Beta (Active Thinking)</span>
                    <div className="wave-progress">
                      <div 
                        className="wave-fill beta" 
                        style={{width: `${quantumState.brainWavePattern.beta}%`}}
                      >
                        {Math.round(quantumState.brainWavePattern.beta)}%
                      </div>
                    </div>
                  </div>
                  <div className="wave-bar">
                    <span className="wave-label">Theta (Creativity)</span>
                    <div className="wave-progress">
                      <div 
                        className="wave-fill theta" 
                        style={{width: `${quantumState.brainWavePattern.theta}%`}}
                      >
                        {Math.round(quantumState.brainWavePattern.theta)}%
                      </div>
                    </div>
                  </div>
                  <div className="wave-bar">
                    <span className="wave-label">Gamma (Peak Performance)</span>
                    <div className="wave-progress">
                      <div 
                        className="wave-fill gamma" 
                        style={{width: `${quantumState.brainWavePattern.gamma}%`}}
                      >
                        {Math.round(quantumState.brainWavePattern.gamma)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural Metrics */}
              <div className="quantum-card glass-card">
                <h3>🎯 Neural Metrics</h3>
                <div className="neural-metrics">
                  <div className="metric">
                    <div className="metric-value">{Math.round(quantumState.cognitiveLoad)}%</div>
                    <div className="metric-label">Cognitive Load</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{Math.round(quantumState.focusIntensity)}%</div>
                    <div className="metric-label">Focus Intensity</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{Math.round(quantumState.creativityIndex)}%</div>
                    <div className="metric-label">Creativity Index</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{Math.round(quantumState.neuralPlasticity)}%</div>
                    <div className="metric-label">Neural Plasticity</div>
                  </div>
                </div>
              </div>

              {/* Future Projections */}
              <div className="quantum-card glass-card">
                <h3>🚀 Future Self Projection</h3>
                <div className="future-projection">
                  {quantumState.futureSelfProjection && (
                    <>
                      <div className="projection-item">
                        <strong>6 Months:</strong> 
                        <span>{quantumState.futureSelfProjection.sixMonths?.proficiencyIncrease}</span>
                        <div className="projection-skills">
                          {quantumState.futureSelfProjection.sixMonths?.skills?.join(', ')}
                        </div>
                      </div>
                      <div className="projection-item">
                        <strong>1 Year:</strong> 
                        <span>{quantumState.futureSelfProjection.oneYear?.proficiencyIncrease}</span>
                        <div className="projection-skills">
                          {quantumState.futureSelfProjection.oneYear?.skills?.join(', ')}
                        </div>
                      </div>
                      <div className="projection-item">
                        <strong>5 Years:</strong> 
                        <span>{quantumState.futureSelfProjection.fiveYears?.proficiencyIncrease}</span>
                        <div className="projection-skills">
                          {quantumState.futureSelfProjection.fiveYears?.skills?.join(', ')}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Parallel Universe Paths */}
              <div className="quantum-card glass-card">
                <h3>🌌 Parallel Universe Career Paths</h3>
                <div className="parallel-paths">
                  {quantumState.parallelUniversePaths && 
                    Object.entries(quantumState.parallelUniversePaths).map(([universe, path]) => (
                      <div key={universe} className="universe-card">
                        <div className="universe-name">{universe}</div>
                        <div className="universe-path">{path}</div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Optimal Learning Windows */}
              <div className="quantum-card glass-card">
                <h3>⏰ Optimal Learning Windows</h3>
                <div className="learning-windows">
                  <div className="window-item best">
                    <span className="window-icon">🔥</span>
                    <div>
                      <strong>Best Time</strong>
                      <p>{quantumState.optimalLearningWindows?.bestTime}</p>
                    </div>
                  </div>
                  <div className="window-item good">
                    <span className="window-icon">✨</span>
                    <div>
                      <strong>Good Times</strong>
                      <p>{quantumState.optimalLearningWindows?.goodTimes?.join(' • ')}</p>
                    </div>
                  </div>
                  <div className="window-item avoid">
                    <span className="window-icon">⚠️</span>
                    <div>
                      <strong>Avoid</strong>
                      <p>{quantumState.optimalLearningWindows?.avoidTimes?.join(' • ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="quantum-rescan-btn" 
                onClick={performQuantumScan}
                disabled={loading}
              >
                🔄 Re-scan Neural State
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Persona Tab */}
      {activeTab === 'persona' && (
        <div className="quantum-content">
          {!aiPersona ? (
            <div className="quantum-empty">
              <div className="quantum-empty-icon">🤖</div>
              <h3>Create Your AI Digital Twin</h3>
              <p>Build an AI persona that knows you better than yourself</p>
              <button 
                className="quantum-scan-btn" 
                onClick={createAIPersona}
              >
                🧬 Generate AI Persona
              </button>
            </div>
          ) : (
            <div className="quantum-dashboard">
              <div className="quantum-card glass-card">
                <h3>🤖 {aiPersona.personaName}</h3>
                <div className="persona-info">
                  <p><strong>Mentor Style:</strong> {aiPersona.mentorPersonality}</p>
                  <p><strong>Teaching Method:</strong> {aiPersona.teachingStyle}</p>
                  <p><strong>Job Switch Probability:</strong> {Math.round(aiPersona.jobSwitchProbability)}%</p>
                  <p><strong>Burnout Risk:</strong> {Math.round(aiPersona.burnoutRiskScore)}%</p>
                </div>
              </div>

              {aiPersona.nextSkillPrediction && (
                <div className="quantum-card glass-card">
                  <h3>🎯 Next Skill Prediction (98% Accuracy)</h3>
                  <div className="skill-prediction">
                    <div className="prediction-skill">{aiPersona.nextSkillPrediction.mostLikely}</div>
                    <div className="prediction-confidence">
                      Confidence: {Math.round(aiPersona.nextSkillPrediction.probability * 100)}%
                    </div>
                    <p className="prediction-reason">{aiPersona.nextSkillPrediction.reason}</p>
                    <p className="prediction-timeframe">Timeframe: {aiPersona.nextSkillPrediction.timeframe}</p>
                  </div>
                </div>
              )}

              {aiPersona.alternateCareerSelves && (
                <div className="quantum-card glass-card">
                  <h3>🌈 Alternate Career Selves (Parallel Universes)</h3>
                  <div className="alternate-selves">
                    {aiPersona.alternateCareerSelves.map((self, idx) => (
                      <div key={idx} className="alt-self-card">
                        <div className="alt-universe">Universe {self.universe}</div>
                        <div className="alt-role">{self.role}</div>
                        <div className="alt-stats">
                          <span>😊 Happiness: {self.happiness}%</span>
                          <span>💰 ${self.salary.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Brain Sync Tab */}
      {activeTab === 'brainsync' && (
        <div className="quantum-content">
          {!brainSyncActive ? (
            <div className="quantum-empty">
              <div className="quantum-empty-icon">🧬</div>
              <h3>Connect Neural Interface</h3>
              <p>Real-time brain wave monitoring and flow state detection</p>
              <button 
                className="quantum-scan-btn" 
                onClick={startBrainSync}
              >
                🔗 Connect Brain Sync
              </button>
            </div>
          ) : (
            <div className="quantum-dashboard">
              <div className="brain-sync-active">
                <div className="sync-indicator pulsing">
                  <span className="sync-dot"></span>
                  Neural Interface Active
                </div>

                <div className="quantum-card glass-card">
                  <h3>📊 Real-Time Neural Activity</h3>
                  <div className="neural-metrics">
                    <div className="metric">
                      <div className="metric-value">{sessionData.focusScore}%</div>
                      <div className="metric-label">Focus Score</div>
                    </div>
                    <div className="metric">
                      <div className="metric-value">{sessionData.comprehensionRate}%</div>
                      <div className="metric-label">Comprehension</div>
                    </div>
                    <div className="metric">
                      <div className={`metric-value ${sessionData.flowState ? 'flow-active' : ''}`}>
                        {sessionData.flowState ? '🔥' : '💤'}
                      </div>
                      <div className="metric-label">
                        {sessionData.flowState ? 'FLOW STATE!' : 'Not in Flow'}
                      </div>
                    </div>
                  </div>
                </div>

                {sessionData.flowState && (
                  <div className="flow-state-alert">
                    <div className="flow-state-icon">🔥</div>
                    <div>
                      <h4>Flow State Achieved!</h4>
                      <p>You're in the zone. Peak learning capacity activated.</p>
                    </div>
                  </div>
                )}

                <button 
                  className="quantum-stop-btn" 
                  onClick={stopBrainSync}
                >
                  ⏹️ Disconnect Brain Sync
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Future Self Tab */}
      {activeTab === 'future' && (
        <div className="quantum-content">
          <div className="quantum-empty">
            <div className="quantum-empty-icon">🔮</div>
            <h3>Simulate Your Future Self</h3>
            <p>AI-powered predictions with 78% accuracy</p>
            <div className="future-buttons">
              <button 
                className="quantum-scan-btn" 
                onClick={() => simulateFutureSelf('6months')}
                disabled={loading}
              >
                📅 6 Months
              </button>
              <button 
                className="quantum-scan-btn" 
                onClick={() => simulateFutureSelf('1year')}
                disabled={loading}
              >
                📅 1 Year
              </button>
              <button 
                className="quantum-scan-btn" 
                onClick={() => simulateFutureSelf('5years')}
                disabled={loading}
              >
                📅 5 Years
              </button>
              <button 
                className="quantum-scan-btn" 
                onClick={() => simulateFutureSelf('10years')}
                disabled={loading}
              >
                📅 10 Years
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumLearning;

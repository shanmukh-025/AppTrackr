import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext'; // eslint-disable-line no-unused-vars
import '../styles/AdvancedSalaryCoach.css';

// Mock market data
const MOCK_MARKET_DATA = {
  'Software Engineer': {
    'San Francisco, CA': { min: 140000, avg: 170000, max: 210000, percentile25: 150000, percentile75: 190000 },
    'New York, NY': { min: 130000, avg: 160000, max: 200000, percentile25: 140000, percentile75: 180000 },
    'Remote': { min: 110000, avg: 140000, max: 180000, percentile25: 120000, percentile75: 160000 }
  }
};

const AdvancedSalaryCoach = ({ setNotification: externalSetNotification = null }) => {
  // eslint-disable-next-line no-unused-vars
  const { token } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Create setNotification function - either use external or internal fallback
  const setNotification = useCallback((message) => {
    if (typeof externalSetNotification === 'function') {
      externalSetNotification(message);
    }
    // If no external function, silently ignore (component has fallback)
  }, [externalSetNotification]);

  const [activeTab, setActiveTab] = useState('market-data');
  const [role, setRole] = useState('Software Engineer');
  const [experience, setExperience] = useState('5');
  const [location, setLocation] = useState('San Francisco, CA');
  const [marketData, setMarketData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  
  // Negotiation state
  const [currentOffer, setCurrentOffer] = useState({ base: 150000, bonus: 20, stocks: 100000, pto: 20 });
  const [desiredOffer, setDesiredOffer] = useState({ base: 180000, bonus: 25, stocks: 150000, pto: 25 });
  const [negotiationStrategy, setNegotiationStrategy] = useState(null);
  
  // Offer comparison
  const [offers] = useState([
    {
      id: 1,
      company: 'Company A',
      base: 160000,
      bonus: 20,
      stocks: 120000,
      pto: 20,
      benefits: ['Health', 'Dental', 'Vision']
    },
    {
      id: 2,
      company: 'Company B',
      base: 180000,
      bonus: 25,
      stocks: 150000,
      pto: 25,
      benefits: ['Health', 'Dental', 'Vision', 'Gym']
    },
    {
      id: 3,
      company: 'Company C',
      base: 170000,
      bonus: 22,
      stocks: 130000,
      pto: 22,
      benefits: ['Health', 'Dental']
    }
  ]);

  const roles = [
    'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
    'Product Manager', 'Data Scientist', 'DevOps Engineer',
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Denver, CO', 'Remote', 'India', 'Canada'
  ];

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setLoadingData(true);
    try {
      // Mock API call
      const data = MOCK_MARKET_DATA[role]?.[location] || {
        min: 130000,
        avg: 160000,
        max: 200000,
        percentile25: 140000,
        percentile75: 180000
      };
      
      setMarketData({
        ...data,
        experience,
        adjustedMin: Math.round(data.min * (1 + (parseInt(experience) / 10))),
        adjustedMax: Math.round(data.max * (1 + (parseInt(experience) / 10)))
      });

      setNotification({ type: 'success', message: 'Market data updated!' });
    } catch (error) {
      console.error('Error fetching market data:', error);
      setNotification({ type: 'error', message: 'Failed to fetch market data' });
    } finally {
      setLoadingData(false);
    }
  }, [role, location, experience, setNotification]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Calculate negotiation strategy
  const calculateStrategy = () => {
    const currentTotal = currentOffer.base + (currentOffer.base * currentOffer.bonus / 100) + currentOffer.stocks;
    const desiredTotal = desiredOffer.base + (desiredOffer.base * desiredOffer.bonus / 100) + desiredOffer.stocks;
    const gap = desiredTotal - currentTotal;
    const gapPercent = ((gap / currentTotal) * 100).toFixed(1);

    let strategy = {
      currentTotal,
      desiredTotal,
      gap,
      gapPercent,
      feasible: marketData && desiredOffer.base >= marketData.min && desiredOffer.base <= marketData.max,
      recommendations: []
    };

    // Generate recommendations
    if (gapPercent > 20) {
      strategy.recommendations.push({
        priority: 'HIGH',
        text: 'Large gap detected. Focus on base salary negotiation first.',
        icon: '⚠️'
      });
    }

    if (marketData && desiredOffer.base > marketData.max) {
      strategy.recommendations.push({
        priority: 'MEDIUM',
        text: 'Desired base exceeds market average. Counter offer or request performance bonus.',
        icon: '📊'
      });
    } else if (marketData && desiredOffer.base >= marketData.percentile75) {
      strategy.recommendations.push({
        priority: 'GOOD',
        text: 'Asking price is at 75th percentile - reasonable to negotiate.',
        icon: '✓'
      });
    }

    if (desiredOffer.bonus < 20) {
      strategy.recommendations.push({
        priority: 'MEDIUM',
        text: 'Bonus is below market average. Negotiate for 20-25%.',
        icon: '💰'
      });
    }

    if (desiredOffer.stocks < 100000) {
      strategy.recommendations.push({
        priority: 'MEDIUM',
        text: 'Equity package is below market. Request more stock options.',
        icon: '📈'
      });
    }

    setNegotiationStrategy(strategy);
  };

  // Calculate total compensation
  const calculateTotal = (offer) => {
    return offer.base + (offer.base * offer.bonus / 100) + offer.stocks;
  };

  // Negotiation tactics
  const TACTICS = [
    {
      title: '🎯 Anchoring',
      description: 'Start with your desired number, be specific and confident. Most negotiators anchor slightly higher.',
      steps: [
        'Research market rates thoroughly',
        'Add 10-15% to market average as initial ask',
        'Be ready to justify your number with market data',
        'Stay calm and confident'
      ]
    },
    {
      title: '💼 Bundling',
      description: 'If they resist on base, negotiate other components (bonus, equity, PTO).',
      steps: [
        'Identify what matters most to you',
        'Be flexible on lower priority items',
        'Use equity/bonus to offset base salary requests',
        'Negotiate benefits and flexibility'
      ]
    },
    {
      title: '⏰ Timing',
      description: 'Negotiate after you have competing offers or positive performance review.',
      steps: [
        'Have alternative offers in hand',
        'Negotiate after proving value',
        'Mention competing offers (tactfully)',
        'Don\'t accept first offer immediately'
      ]
    },
    {
      title: '📢 Communication',
      description: 'Use data-driven language and focus on value, not personal needs.',
      steps: [
        'Use "we" language (collaborative tone)',
        'Reference market data and your achievements',
        'Express enthusiasm for the role',
        'Ask "what would it take?" questions'
      ]
    }
  ];

  return (
    <div className="salary-coach">
      <div className="salary-header">
        <h2>💼 Advanced Salary Negotiation Coach</h2>
        <p>Negotiate with confidence using data-driven strategies</p>
      </div>

      <div className="salary-tabs">
        <button
          className={`tab ${activeTab === 'market-data' ? 'active' : ''}`}
          onClick={() => setActiveTab('market-data')}
        >
          📊 Market Data
        </button>
        <button
          className={`tab ${activeTab === 'strategy' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategy')}
        >
          🎯 Strategy
        </button>
        <button
          className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          ⚖️ Compare Offers
        </button>
        <button
          className={`tab ${activeTab === 'tactics' ? 'active' : ''}`}
          onClick={() => setActiveTab('tactics')}
        >
          📚 Tactics
        </button>
      </div>

      <div className="salary-content">
        {/* Market Data Tab */}
        {activeTab === 'market-data' && (
          <div className="market-data-panel">
            <div className="controls-section">
              <div className="input-group">
                <label>💼 Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>📅 Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>📍 Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <button
                className="fetch-btn"
                onClick={fetchMarketData}
                disabled={loadingData}
              >
                {loadingData ? '⏳ Fetching...' : '🔍 Get Market Data'}
              </button>
            </div>

            {marketData && (
              <div className="market-insights">
                <h3>Salary Benchmarks for {role} ({experience} years)</h3>

                <div className="salary-range">
                  <div className="range-bar">
                    <div className="range-label">Low</div>
                    <div className="range-track">
                      <div
                        className="range-min"
                        style={{ left: '0%' }}
                      >
                        ${marketData.min.toLocaleString()}
                      </div>
                      <div
                        className="range-avg"
                        style={{ left: '50%' }}
                      >
                        ${marketData.avg.toLocaleString()}
                      </div>
                      <div
                        className="range-max"
                        style={{ left: '100%' }}
                      >
                        ${marketData.max.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="salary-metrics">
                  <div className="metric">
                    <div className="metric-label">25th Percentile</div>
                    <div className="metric-value">${marketData.percentile25.toLocaleString()}</div>
                  </div>
                  <div className="metric highlight">
                    <div className="metric-label">Average</div>
                    <div className="metric-value">${marketData.avg.toLocaleString()}</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">75th Percentile</div>
                    <div className="metric-value">${marketData.percentile75.toLocaleString()}</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Adjusted (with exp)</div>
                    <div className="metric-value">${marketData.adjustedMin.toLocaleString()} - ${marketData.adjustedMax.toLocaleString()}</div>
                  </div>
                </div>

                <div className="insights-box">
                  <h4>💡 Key Insights</h4>
                  <ul>
                    <li>Market average for {role} is <strong>${marketData.avg.toLocaleString()}</strong></li>
                    <li>With {experience} years experience, target <strong>${marketData.adjustedMin.toLocaleString()} - ${marketData.adjustedMax.toLocaleString()}</strong></li>
                    <li>Top performers in this market earn <strong>${marketData.max.toLocaleString()}+</strong></li>
                    <li>Don't accept less than <strong>75th percentile</strong> unless justified</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Strategy Tab */}
        {activeTab === 'strategy' && (
          <div className="strategy-panel">
            <div className="offer-section">
              <h3>Current Offer</h3>
              <div className="offer-inputs">
                <div className="input-group">
                  <label>Base Salary</label>
                  <input
                    type="number"
                    value={currentOffer.base}
                    onChange={(e) => setCurrentOffer({...currentOffer, base: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Bonus (%)</label>
                  <input
                    type="number"
                    value={currentOffer.bonus}
                    onChange={(e) => setCurrentOffer({...currentOffer, bonus: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Equity ($)</label>
                  <input
                    type="number"
                    value={currentOffer.stocks}
                    onChange={(e) => setCurrentOffer({...currentOffer, stocks: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>PTO (days)</label>
                  <input
                    type="number"
                    value={currentOffer.pto}
                    onChange={(e) => setCurrentOffer({...currentOffer, pto: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="total-comp">
                Total Compensation: <span className="total">${calculateTotal(currentOffer).toLocaleString()}</span>
              </div>
            </div>

            <div className="offer-section">
              <h3>Desired Offer</h3>
              <div className="offer-inputs">
                <div className="input-group">
                  <label>Base Salary</label>
                  <input
                    type="number"
                    value={desiredOffer.base}
                    onChange={(e) => setDesiredOffer({...desiredOffer, base: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Bonus (%)</label>
                  <input
                    type="number"
                    value={desiredOffer.bonus}
                    onChange={(e) => setDesiredOffer({...desiredOffer, bonus: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Equity ($)</label>
                  <input
                    type="number"
                    value={desiredOffer.stocks}
                    onChange={(e) => setDesiredOffer({...desiredOffer, stocks: parseInt(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>PTO (days)</label>
                  <input
                    type="number"
                    value={desiredOffer.pto}
                    onChange={(e) => setDesiredOffer({...desiredOffer, pto: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="total-comp">
                Total Compensation: <span className="total">${calculateTotal(desiredOffer).toLocaleString()}</span>
              </div>
            </div>

            <button className="analyze-btn" onClick={calculateStrategy}>
              🔍 Analyze Strategy
            </button>

            {negotiationStrategy && (
              <div className="strategy-results">
                <div className="gap-analysis">
                  <div className={`gap-card ${negotiationStrategy.gap > 0 ? 'positive' : 'negative'}`}>
                    <div className="gap-label">Gap</div>
                    <div className="gap-value">${Math.abs(negotiationStrategy.gap).toLocaleString()}</div>
                    <div className="gap-percent">{negotiationStrategy.gapPercent}%</div>
                  </div>
                  <div className={`gap-card ${negotiationStrategy.feasible ? 'feasible' : 'aggressive'}`}>
                    <div className="gap-label">Feasibility</div>
                    <div className="gap-value">{negotiationStrategy.feasible ? '✓ Feasible' : '⚠️ Aggressive'}</div>
                    <div className="gap-percent">{marketData ? `vs Market` : 'No Data'}</div>
                  </div>
                </div>

                <div className="recommendations">
                  <h4>📋 Recommendations</h4>
                  {negotiationStrategy.recommendations.map((rec, idx) => (
                    <div key={idx} className={`recommendation ${rec.priority.toLowerCase()}`}>
                      <span className="icon">{rec.icon}</span>
                      <div className="rec-content">
                        <span className="priority">[{rec.priority}]</span>
                        <p>{rec.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="comparison-panel">
            <h3>Offer Comparison</h3>
            
            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-company">{offer.company}</div>
                  
                  <div className="offer-details">
                    <div className="detail-row">
                      <span className="label">Base Salary</span>
                      <span className="value">${offer.base.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Bonus</span>
                      <span className="value">{offer.bonus}%</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Equity</span>
                      <span className="value">${offer.stocks.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">PTO</span>
                      <span className="value">{offer.pto} days</span>
                    </div>
                  </div>

                  <div className="offer-total">
                    <span className="label">Total Comp</span>
                    <span className="value">${(offer.base + (offer.base * offer.bonus / 100) + offer.stocks).toLocaleString()}</span>
                  </div>

                  <div className="offer-benefits">
                    <h5>Benefits</h5>
                    <div className="benefits-list">
                      {offer.benefits.map((benefit, idx) => (
                        <span key={idx} className="benefit-tag">{benefit}</span>
                      ))}
                    </div>
                  </div>

                  <button className="compare-btn">Select Offer</button>
                </div>
              ))}
            </div>

            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    {offers.map(offer => (
                      <th key={offer.id}>{offer.company}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Salary</td>
                    {offers.map(offer => (
                      <td key={offer.id}>${offer.base.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Bonus</td>
                    {offers.map(offer => (
                      <td key={offer.id}>{offer.bonus}%</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Total Comp</td>
                    {offers.map(offer => (
                      <td key={offer.id} className="total-cell">
                        ${(offer.base + (offer.base * offer.bonus / 100) + offer.stocks).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tactics Tab */}
        {activeTab === 'tactics' && (
          <div className="tactics-panel">
            <h3>Negotiation Tactics</h3>
            <div className="tactics-grid">
              {TACTICS.map((tactic, idx) => (
                <div key={idx} className="tactic-card">
                  <h4>{tactic.title}</h4>
                  <p className="tactic-description">{tactic.description}</p>
                  
                  <div className="steps">
                    <h5>Steps:</h5>
                    <ol>
                      {tactic.steps.map((step, stepIdx) => (
                        <li key={stepIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-tips">
              <h3>🎓 Pro Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <h4>📝 Before the Call</h4>
                  <ul>
                    <li>Research company culture and pay bands</li>
                    <li>Prepare 3-5 reasons you deserve more</li>
                    <li>Know your BATNA (best alternative)</li>
                    <li>Practice your pitch out loud</li>
                  </ul>
                </div>
                <div className="tip-card">
                  <h4>💬 During the Call</h4>
                  <ul>
                    <li>Let them make first offer if possible</li>
                    <li>Listen more than you talk</li>
                    <li>Ask "What would it take?" questions</li>
                    <li>Emphasize your value, not your needs</li>
                  </ul>
                </div>
                <div className="tip-card">
                  <h4>✅ After the Call</h4>
                  <ul>
                    <li>Get counteroffers in writing</li>
                    <li>Take 24-48 hours to respond</li>
                    <li>Continue negotiations email</li>
                    <li>Document all agreements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSalaryCoach;

import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/SalaryNegotiationTool.css';

const SalaryNegotiationTool = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('calculator');
  const [roleData, setRoleData] = useState({
    role: 'Software Engineer',
    level: 'Mid',
    location: 'San Francisco, CA',
    yearsExperience: 5,
    baseSalary: 150000
  });

  const [benefitsData, setBenefitsData] = useState({
    bonus: 20,
    stocks: 100000,
    pto: 20,
    insurance: true,
    retirement: true,
    healthBenefits: true
  });

  const [marketData, setMarketData] = useState(null);
  const [negotiationTips, setNegotiationTips] = useState([]);
  const [equityCalculator, setEquityCalculator] = useState({
    strikePrice: 10,
    shareCount: 10000,
    currentPrice: 25,
    yearsVesting: 4
  });

  const [totalCompensation, setTotalCompensation] = useState(0);

  const roles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Staff Engineer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer'
  ];

  const levels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Denver, CO',
    'Remote',
    'India',
    'Canada'
  ];

  const calculateTotalCompensation = useCallback(() => {
    const bonus = (roleData.baseSalary * benefitsData.bonus) / 100;
    const stockValue = benefitsData.stocks;
    
    const total = roleData.baseSalary + bonus + stockValue;
    return total;
  }, [roleData, benefitsData]);

  const calculateEquityValue = () => {
    const vestingSchedule = (benefitsData.stocks / equityCalculator.yearsVesting) / 12;
    const vestingValue = vestingSchedule * equityCalculator.currentPrice;
    return vestingValue;
  };

  useEffect(() => {
    setTotalCompensation(calculateTotalCompensation());
  }, [calculateTotalCompensation]);

  const fetchMarketData = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/resources/salary-tool/market-research`,
        {
          role: roleData.role,
          level: roleData.level,
          location: roleData.location,
          yearsExperience: roleData.yearsExperience
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMarketData(response.data.data || generateMarketData());
      setNotification({ type: 'success', message: 'Market data updated!' });
    } catch (error) {
      // Fallback data
      setMarketData(generateMarketData());
      setNotification({ type: 'info', message: 'Using sample market data' });
    }
  };

  const generateMarketData = () => {
    return {
      medianSalary: 180000,
      p25Salary: 150000,
      p75Salary: 220000,
      averageBonus: 22,
      averageEquity: 120000,
      salaryTrend: 'up',
      competitiveness: 85
    };
  };

  const generateNegotiationTips = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/resources/salary-tool/negotiation-tips`,
        {
          currentOffer: {
            baseSalary: roleData.baseSalary,
            bonus: benefitsData.bonus,
            equity: benefitsData.stocks
          },
          marketData: marketData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNegotiationTips(response.data.tips || generateDefaultTips());
    } catch (error) {
      setNegotiationTips(generateDefaultTips());
    }
  };

  const generateDefaultTips = () => {
    return [
      {
        category: 'Base Salary',
        tip: 'Ask for 10-15% above their initial offer. Reference market data and your experience level.',
        impact: 'high'
      },
      {
        category: 'Bonus Structure',
        tip: 'Negotiate for 15-25% annual bonus and clarify how it\'s calculated.',
        impact: 'medium'
      },
      {
        category: 'Equity',
        tip: 'Request vesting schedule details and ask for a sign-on bonus to offset new job equity loss.',
        impact: 'high'
      },
      {
        category: 'Timeline',
        tip: 'Ask for 1-2 weeks to make a decision. This shows you\'re serious and gives you time to negotiate.',
        impact: 'low'
      },
      {
        category: 'Benefits',
        tip: 'Negotiate for unlimited PTO, work from home flexibility, and professional development budget.',
        impact: 'medium'
      }
    ];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="salary-negotiation-tool">
      <div className="tool-header">
        <h2>💰 Salary Negotiation Tool</h2>
        <p>Negotiate better compensation with data-driven insights</p>
      </div>

      <div className="tool-container">
        {/* Tabs */}
        <div className="tool-tabs">
          <button
            className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Salary Calculator
          </button>
          <button
            className={`tab ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            Market Analysis
          </button>
          <button
            className={`tab ${activeTab === 'equity' ? 'active' : ''}`}
            onClick={() => setActiveTab('equity')}
          >
            Equity Calculator
          </button>
          <button
            className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            Negotiation Tips
          </button>
        </div>

        <div className="tool-content">
          {activeTab === 'calculator' && (
            <div className="calculator-panel">
              <div className="input-grid">
                {/* Role */}
                <div className="input-group">
                  <label>💼 Job Role</label>
                  <select
                    value={roleData.role}
                    onChange={(e) => setRoleData({...roleData, role: e.target.value})}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div className="input-group">
                  <label>⭐ Seniority Level</label>
                  <select
                    value={roleData.level}
                    onChange={(e) => setRoleData({...roleData, level: e.target.value})}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="input-group">
                  <label>📍 Location</label>
                  <select
                    value={roleData.location}
                    onChange={(e) => setRoleData({...roleData, location: e.target.value})}
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="input-group">
                  <label>📅 Years Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={roleData.yearsExperience}
                    onChange={(e) => setRoleData({...roleData, yearsExperience: parseInt(e.target.value)})}
                  />
                </div>

                {/* Base Salary */}
                <div className="input-group">
                  <label>💵 Base Salary</label>
                  <div className="salary-input-wrapper">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={roleData.baseSalary}
                      onChange={(e) => setRoleData({...roleData, baseSalary: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Bonus */}
                <div className="input-group">
                  <label>📊 Bonus %</label>
                  <div className="bonus-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={benefitsData.bonus}
                      onChange={(e) => setBenefitsData({...benefitsData, bonus: parseInt(e.target.value)})}
                    />
                    <span className="unit">%</span>
                  </div>
                </div>

                {/* Stocks */}
                <div className="input-group">
                  <label>📈 Stock Options</label>
                  <div className="salary-input-wrapper">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={benefitsData.stocks}
                      onChange={(e) => setBenefitsData({...benefitsData, stocks: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                {/* PTO */}
                <div className="input-group">
                  <label>🏖️ PTO Days</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={benefitsData.pto}
                    onChange={(e) => setBenefitsData({...benefitsData, pto: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* Total Compensation */}
              <div className="compensation-summary">
                <h3>Total Compensation Breakdown</h3>
                <div className="compensation-boxes">
                  <div className="comp-box">
                    <span className="label">Base Salary</span>
                    <span className="value">{formatCurrency(roleData.baseSalary)}</span>
                  </div>
                  <div className="comp-box">
                    <span className="label">Annual Bonus</span>
                    <span className="value">{formatCurrency((roleData.baseSalary * benefitsData.bonus) / 100)}</span>
                  </div>
                  <div className="comp-box">
                    <span className="label">Stock Options</span>
                    <span className="value">{formatCurrency(benefitsData.stocks)}</span>
                  </div>
                  <div className="comp-box total">
                    <span className="label">Total</span>
                    <span className="value">{formatCurrency(totalCompensation)}</span>
                  </div>
                </div>
              </div>

              <button className="btn-fetch-market" onClick={fetchMarketData}>
                📊 Fetch Market Data
              </button>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="market-panel">
              <h3>📈 Market Analysis</h3>
              {marketData ? (
                <div className="market-data">
                  <div className="market-card">
                    <h4>Salary Range for {roleData.role}</h4>
                    <div className="range-display">
                      <div className="range-item">
                        <span className="label">25th Percentile</span>
                        <span className="value">{formatCurrency(marketData.p25Salary)}</span>
                      </div>
                      <div className="range-item median">
                        <span className="label">Median</span>
                        <span className="value">{formatCurrency(marketData.medianSalary)}</span>
                      </div>
                      <div className="range-item">
                        <span className="label">75th Percentile</span>
                        <span className="value">{formatCurrency(marketData.p75Salary)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="market-card">
                    <h4>Industry Benchmarks</h4>
                    <div className="benchmark-item">
                      <span className="label">Average Bonus</span>
                      <span className="value">{marketData.averageBonus}%</span>
                    </div>
                    <div className="benchmark-item">
                      <span className="label">Average Equity</span>
                      <span className="value">{formatCurrency(marketData.averageEquity)}</span>
                    </div>
                    <div className="benchmark-item">
                      <span className="label">Market Trend</span>
                      <span className={`trend ${marketData.salaryTrend}`}>
                        {marketData.salaryTrend === 'up' ? '📈 Upward' : '📉 Downward'}
                      </span>
                    </div>
                  </div>

                  <div className="market-comparison">
                    <h4>Your Offer vs Market</h4>
                    <div className="comparison-bars">
                      <div className="comparison-item">
                        <span className="label">Your Offer</span>
                        <div className="bar-container">
                          <div
                            className="bar your-offer"
                            style={{
                              width: `${Math.min((roleData.baseSalary / marketData.p75Salary) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <span className="amount">{formatCurrency(roleData.baseSalary)}</span>
                      </div>
                      <div className="comparison-item">
                        <span className="label">Market Median</span>
                        <div className="bar-container">
                          <div className="bar market-median" style={{ width: '100%' }}></div>
                        </div>
                        <span className="amount">{formatCurrency(marketData.medianSalary)}</span>
                      </div>
                    </div>
                    <p className="comparison-insight">
                      {roleData.baseSalary >= marketData.medianSalary
                        ? '✅ Your offer is at or above market median!'
                        : `⚠️ Consider negotiating for ${formatCurrency(marketData.medianSalary - roleData.baseSalary)} more to match market median.`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Click "Fetch Market Data" in the Calculator tab to see market analysis</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'equity' && (
            <div className="equity-panel">
              <h3>📊 Stock Options Calculator</h3>
              <div className="equity-inputs">
                <div className="input-group">
                  <label>Strike Price</label>
                  <div className="salary-input-wrapper">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={equityCalculator.strikePrice}
                      onChange={(e) => setEquityCalculator({...equityCalculator, strikePrice: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Share Count</label>
                  <input
                    type="number"
                    step="1000"
                    value={equityCalculator.shareCount}
                    onChange={(e) => setEquityCalculator({...equityCalculator, shareCount: parseInt(e.target.value)})}
                  />
                </div>

                <div className="input-group">
                  <label>Current Stock Price</label>
                  <div className="salary-input-wrapper">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={equityCalculator.currentPrice}
                      onChange={(e) => setEquityCalculator({...equityCalculator, currentPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Vesting Years</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={equityCalculator.yearsVesting}
                    onChange={(e) => setEquityCalculator({...equityCalculator, yearsVesting: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="equity-results">
                <div className="result-card">
                  <span className="label">Strike Price Value</span>
                  <span className="value">
                    {formatCurrency(equityCalculator.strikePrice * equityCalculator.shareCount)}
                  </span>
                </div>

                <div className="result-card">
                  <span className="label">Current Market Value</span>
                  <span className="value">
                    {formatCurrency(equityCalculator.currentPrice * equityCalculator.shareCount)}
                  </span>
                </div>

                <div className="result-card highlight">
                  <span className="label">Your Gain (if fully vested)</span>
                  <span className="value">
                    {formatCurrency((equityCalculator.currentPrice - equityCalculator.strikePrice) * equityCalculator.shareCount)}
                  </span>
                </div>

                <div className="result-card">
                  <span className="label">Monthly Vesting Value</span>
                  <span className="value">
                    {formatCurrency(calculateEquityValue())}
                  </span>
                </div>
              </div>

              <div className="equity-info">
                <h4>📋 Equity Terms to Negotiate</h4>
                <ul>
                  <li>✓ <strong>Vesting Schedule:</strong> Typically 4 years with 1-year cliff. Negotiate for accelerated vesting.</li>
                  <li>✓ <strong>Sign-on Bonus:</strong> Ask for cash bonus to offset unvested options from previous employer.</li>
                  <li>✓ <strong>Refresh Grants:</strong> Negotiate for annual refresh grants to maintain equity stake.</li>
                  <li>✓ <strong>Exercise Period:</strong> Request extended post-departure exercise window (typically 90 days).</li>
                  <li>✓ <strong>Double-Trigger Acceleration:</strong> Include clause for equity acceleration upon acquisition + termination.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-panel">
              <div className="tips-header">
                <h3>💡 Negotiation Tips & Strategies</h3>
                <button className="btn-generate-tips" onClick={generateNegotiationTips}>
                  🤖 Generate Personalized Tips
                </button>
              </div>

              {negotiationTips.length > 0 ? (
                <div className="tips-list">
                  {negotiationTips.map((tip, idx) => (
                    <div key={idx} className={`tip-card impact-${tip.impact}`}>
                      <div className="tip-header">
                        <h4>{tip.category}</h4>
                        <span className={`impact-badge ${tip.impact}`}>
                          {tip.impact === 'high' ? '🔴 High Impact' : tip.impact === 'medium' ? '🟡 Medium Impact' : '🟢 Low Impact'}
                        </span>
                      </div>
                      <p>{tip.tip}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Generate personalized tips based on your offer</p>
                </div>
              )}

              <div className="negotiation-framework">
                <h4>📋 STAR Method for Negotiation</h4>
                <div className="framework-items">
                  <div className="framework-item">
                    <strong>S - Situation</strong>
                    <p>Research market data and your value. Know your worth before negotiating.</p>
                  </div>
                  <div className="framework-item">
                    <strong>T - Target</strong>
                    <p>Have a specific number in mind. Ask for 10-20% above initial offer based on market research.</p>
                  </div>
                  <div className="framework-item">
                    <strong>A - Ask</strong>
                    <p>Confidently ask for what you want. "Based on my experience and market research, I'm seeking $X"</p>
                  </div>
                  <div className="framework-item">
                    <strong>R - Rationale</strong>
                    <p>Provide data-backed justification. Reference industry benchmarks, your skills, and contributions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryNegotiationTool;

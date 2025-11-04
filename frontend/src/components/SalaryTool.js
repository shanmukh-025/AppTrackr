import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SalaryTool.css';

const SalaryTool = ({ setNotification }) => {
  const [role, setRole] = useState('Backend Developer');
  const [experience, setExperience] = useState('5');
  const [location, setLocation] = useState('US');
  const [salaryRange, setSalaryRange] = useState(null);
  const [comparing, setComparing] = useState(false); // eslint-disable-line no-unused-vars
  const [companies, setCompanies] = useState('Google, Amazon, Microsoft');
  const [comparison, setComparison] = useState(null);
  const [baseSalary, setBaseSalary] = useState(150000);
  const [benefits, setBenefits] = useState({
    stocks: 50000,
    bonus: 20000,
    pto: 20,
    healthcare: true
  });
  const [totalCompensation, setTotalCompensation] = useState(0);
  const [loading, setLoading] = useState(false);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager'
  ];

  const getSalaryRange = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/resources/salary', {
        params: { role, experience, location },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSalaryRange(response.data.data);
      setNotification({ type: 'success', message: 'Salary data loaded!' });
    } catch (error) {
      setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to fetch salary data' });
    } finally {
      setLoading(false);
    }
  };

  const compareSalaries = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/resources/salary/compare',
        {
          role,
          experience,
          companies: companies.split(',').map(c => c.trim())
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setComparison(response.data.data);
      setNotification({ type: 'success', message: 'Comparison complete!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Comparison failed' });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompensation = () => {
    const total = baseSalary + (benefits.stocks || 0) + (benefits.bonus || 0);
    setTotalCompensation(total);
  };

  return (
    <div className="salary-tool">
      <h2>💰 Salary & Negotiation Tool</h2>
      <p className="subtitle">Research market rates and negotiate your compensation</p>

      {/* Tabs */}
      <div className="tool-tabs">
        <button className="tab-btn active">Salary Research</button>
        <button className="tab-btn">Company Comparison</button>
        <button className="tab-btn">Benefits Calculator</button>
      </div>

      {/* Salary Research */}
      <div className="tool-section">
        <h3>Salary Research by Role & Location</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
              max="30"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>US</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>India</option>
            </select>
          </div>
          <button className="get-btn" onClick={getSalaryRange} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔍 Get Salary Range'}
          </button>
        </div>

        {/* Salary Range Display */}
        {salaryRange && (
          <div className="salary-display">
            <div className="range-cards">
              <div className="range-card low">
                <h4>25th Percentile</h4>
                <p className="salary">${salaryRange.p25 || 100}K</p>
              </div>
              <div className="range-card median">
                <h4>Median Salary</h4>
                <p className="salary">${salaryRange.median || 150}K</p>
                <p className="highlight">Most Common</p>
              </div>
              <div className="range-card high">
                <h4>75th Percentile</h4>
                <p className="salary">${salaryRange.p75 || 200}K</p>
              </div>
              <div className="range-card max">
                <h4>Maximum</h4>
                <p className="salary">${salaryRange.max || 300}K</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Company Comparison */}
      <div className="tool-section">
        <h3>Company Salary Comparison</h3>
        <div className="comparison-inputs">
          <input
            type="text"
            placeholder="Enter companies (comma-separated)"
            value={companies}
            onChange={(e) => setCompanies(e.target.value)}
            className="companies-input"
          />
          <button className="compare-btn" onClick={compareSalaries} disabled={loading}>
            {loading ? '⏳ Comparing...' : '📊 Compare'}
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="comparison-results">
            <div className="companies-grid">
              {comparison.map((company, idx) => (
                <div key={idx} className="company-salary">
                  <h4>{company.name}</h4>
                  <div className="salary-bar">
                    <div
                      className="salary-fill"
                      style={{
                        width: `${(company.avgSalary / comparison.reduce((max, c) => Math.max(max, c.avgSalary), 0)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p>${company.avgSalary}K</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Benefits Calculator */}
      <div className="tool-section">
        <h3>Total Compensation Calculator</h3>
        <div className="calc-form">
          <div className="form-group">
            <label>Base Salary</label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(parseFloat(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Stock Options (Annual)</label>
            <input
              type="number"
              value={benefits.stocks}
              onChange={(e) => setBenefits({ ...benefits, stocks: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Bonus</label>
            <input
              type="number"
              value={benefits.bonus}
              onChange={(e) => setBenefits({ ...benefits, bonus: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>PTO Days</label>
            <input
              type="number"
              value={benefits.pto}
              onChange={(e) => setBenefits({ ...benefits, pto: parseInt(e.target.value) })}
            />
          </div>
          <button className="calc-btn" onClick={calculateCompensation}>
            💻 Calculate Total
          </button>
        </div>

        {totalCompensation > 0 && (
          <div className="calc-results">
            <div className="comp-card">
              <h4>Base Salary</h4>
              <p>${baseSalary.toLocaleString()}</p>
            </div>
            <div className="comp-card">
              <h4>Stock Options</h4>
              <p>${benefits.stocks.toLocaleString()}</p>
            </div>
            <div className="comp-card">
              <h4>Bonus</h4>
              <p>${benefits.bonus.toLocaleString()}</p>
            </div>
            <div className="comp-card total">
              <h4>Total Compensation</h4>
              <p>${totalCompensation.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Negotiation Tips */}
      <div className="tips-section">
        <h3>💡 Negotiation Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>Research First</h4>
            <p>Know the market rate for your role and experience level</p>
          </div>
          <div className="tip">
            <h4>Anchor High</h4>
            <p>Make the first offer slightly above market rate</p>
          </div>
          <div className="tip">
            <h4>Negotiate Beyond Salary</h4>
            <p>Consider stocks, bonus, flexible work, and professional development</p>
          </div>
          <div className="tip">
            <h4>Get It In Writing</h4>
            <p>Always get the final offer in writing before accepting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryTool;

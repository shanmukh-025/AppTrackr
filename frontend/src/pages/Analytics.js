import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './AnalyticsNew.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState(null);
  const [topCompanies, setTopCompanies] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [salaryInsights, setSalaryInsights] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAllAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      console.log('🔍 Fetching analytics from:', API_URL);
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

      const [
        overviewRes,
        timelineRes,
        statusRes,
        companiesRes,
        skillsRes,
        salaryRes,
        responseRes,
        weeklyRes
      ] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/overview`, { headers }),
        axios.get(`${API_URL}/api/analytics/timeline`, { headers }),
        axios.get(`${API_URL}/api/analytics/status-distribution`, { headers }),
        axios.get(`${API_URL}/api/analytics/top-companies?limit=5`, { headers }),
        axios.get(`${API_URL}/api/analytics/trending-skills`, { headers }),
        axios.get(`${API_URL}/api/analytics/salary-insights`, { headers }),
        axios.get(`${API_URL}/api/analytics/response-times`, { headers }),
        axios.get(`${API_URL}/api/analytics/weekly-activity`, { headers })
      ]);

      console.log('✅ Overview data:', overviewRes.data);
      console.log('✅ Timeline data:', timelineRes.data);
      console.log('✅ Status distribution:', statusRes.data);

      setOverview(overviewRes.data);
      setTimeline(timelineRes.data);
      setStatusDistribution(statusRes.data);
      setTopCompanies(companiesRes.data);
      setTrendingSkills(skillsRes.data);
      setSalaryInsights(salaryRes.data);
      setResponseTime(responseRes.data);
      setWeeklyActivity(weeklyRes.data);
    } catch (err) {
      console.error('❌ Failed to fetch analytics:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
        </div>
        <div className="loading-state">Loading your insights...</div>
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Failed to Load Analytics</h2>
          <p>{error}</p>
          <div className="empty-actions">
            <button onClick={fetchAllAnalytics} className="primary-button">
              🔄 Retry
            </button>
          </div>
          <p style={{ marginTop: '2rem', color: '#999', fontSize: '0.9rem' }}>
            Check the browser console (F12) for more details
          </p>
        </div>
      </div>
    );
  }

  // Check if user has no applications
  const hasNoData = !overview || overview.total === 0;

  // Show empty state if no data
  if (hasNoData) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your job search progress and insights</p>
        </div>

        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No Analytics Data Yet</h2>
          <p>Start tracking your job applications to see insightful analytics!</p>
          <div className="empty-actions">
            <a href="/applications" className="primary-button">
              ➕ Add Your First Application
            </a>
            <a href="/jobs" className="secondary-button">
              🔍 Search Jobs
            </a>
          </div>
          <div className="empty-features">
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Track Success Rates</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>Salary Insights</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔥</span>
              <span>Trending Skills</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <span>Response Times</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chart configurations
  const statusColors = {
    applied: '#2196F3',
    screening: '#FF9800',
    interview: '#9C27B0',
    offer: '#4CAF50',
    accepted: '#8BC34A',
    rejected: '#F44336'
  };

  const statusChartData = statusDistribution ? {
    labels: statusDistribution.labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      data: statusDistribution.data,
      backgroundColor: statusDistribution.labels.map(label => statusColors[label]),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  } : null;

  const timelineChartData = timeline ? {
    labels: timeline.labels,
    datasets: [{
      label: 'Applications',
      data: timeline.data,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  } : null;

  const weeklyChartData = weeklyActivity ? {
    labels: weeklyActivity.labels,
    datasets: [{
      label: 'Applications per Week',
      data: weeklyActivity.data,
      backgroundColor: '#764ba2',
      borderColor: '#667eea',
      borderWidth: 2
    }]
  } : null;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Track your job search progress and insights</p>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{overview.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{overview.active}</div>
              <div className="stat-label">Active Applications</div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{overview.successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <div className="stat-value">{overview.interviewRate}%</div>
              <div className="stat-label">Interview Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Status Distribution */}
        {statusChartData && (
          <div className="chart-card">
            <h3>Application Status Distribution</h3>
            <div className="chart-wrapper doughnut">
              <Doughnut 
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="chart-card">
          <h3>Application Timeline (6 Months)</h3>
          {timelineChartData && timelineChartData.labels && timelineChartData.labels.length > 0 ? (
            <div className="chart-wrapper">
              <Line
                data={timelineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                  }
                }}
              />
            </div>
          ) : (
            <div className="empty-chart">
              <p>📅 No application data in the last 6 months</p>
              <p className="text-muted">Start applying to jobs to see your timeline!</p>
            </div>
          )}
        </div>

        {/* Weekly Activity */}
        {weeklyChartData && (
          <div className="chart-card">
            <h3>Weekly Activity (Last 12 Weeks)</h3>
            <div className="chart-wrapper">
              <Bar
                data={weeklyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <div className="chart-card">
            <h3>Top Companies Applied</h3>
            <div className="list-content">
              {topCompanies.map((company, idx) => (
                <div key={idx} className="list-item">
                  <span className="rank">#{idx + 1}</span>
                  <span className="company-name">{company.company}</span>
                  <span className="count-badge">{company.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="insights-grid">
        {/* Response Time */}
        {responseTime && (
          <div className="insight-card">
            <h3>⏱️ Response Time</h3>
            <div className="insight-value">{responseTime.averageResponseTime} days</div>
            <p className="insight-description">
              Average time to hear back from companies
            </p>
            <div className="insight-stats">
              <span>✅ {responseTime.responsesReceived} responses</span>
              <span>⏳ {responseTime.noResponse} pending</span>
            </div>
          </div>
        )}

        {/* Salary Insights */}
        {salaryInsights && salaryInsights.count > 0 && (
          <div className="insight-card">
            <h3>💰 Salary Insights</h3>
            <div className="insight-value">
              ${(salaryInsights.average / 1000).toFixed(0)}K
            </div>
            <p className="insight-description">Average salary from listings</p>
            <div className="insight-stats">
              <span>📊 ${(salaryInsights.min / 1000).toFixed(0)}K - ${(salaryInsights.max / 1000).toFixed(0)}K range</span>
              <span>📈 {salaryInsights.count} listings analyzed</span>
            </div>
          </div>
        )}

        {/* Trending Skills */}
        {trendingSkills.length > 0 && (
          <div className="insight-card wide">
            <h3>🔥 Trending Skills in Your Applications</h3>
            <div className="skills-cloud">
              {trendingSkills.slice(0, 10).map((skill, idx) => (
                <span
                  key={idx}
                  className="skill-tag"
                  style={{
                    fontSize: `${Math.max(0.9, 1.5 - idx * 0.1)}rem`,
                    opacity: Math.max(0.6, 1 - idx * 0.05)
                  }}
                >
                  {skill.skill} ({skill.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
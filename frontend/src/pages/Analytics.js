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
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Container, Box, Card, Typography, Button } from '@mui/material';
import './Analytics.css';

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
  const [topCompanies, setTopCompanies] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState(null);

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
      const [
        overviewRes,
        timelineRes,
        companiesRes,
        weeklyRes,
        statusRes
      ] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/overview`, { headers }),
        axios.get(`${API_URL}/api/analytics/timeline`, { headers }),
        axios.get(`${API_URL}/api/analytics/top-companies?limit=5`, { headers }),
        axios.get(`${API_URL}/api/analytics/weekly-activity`, { headers }),
        axios.get(`${API_URL}/api/analytics/status-distribution`, { headers }).catch(() => ({ data: null }))
      ]);

      setOverview(overviewRes.data);
      setTimeline(timelineRes.data);
      setTopCompanies(companiesRes.data);
      setWeeklyActivity(weeklyRes.data);
      setStatusDistribution(statusRes.data);
    } catch (err) {
      console.error('❌ Failed to fetch analytics:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading your insights...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button onClick={fetchAllAnalytics} sx={{ mt: 2 }}>Retry</Button>
      </Container>
    );
  }

  // Chart configurations
  const timelineChartData = timeline ? {
    labels: timeline.labels,
    datasets: [{
      label: 'Applications',
      data: timeline.data,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  } : null;

  const weeklyChartData = weeklyActivity ? {
    labels: weeklyActivity.labels,
    datasets: [{
      label: 'Applications',
      data: weeklyActivity.data,
      backgroundColor: '#667eea',
      borderRadius: 6,
      borderSkipped: false
    }]
  } : null;

  const statusChartData = statusDistribution ? {
    labels: statusDistribution.labels ? statusDistribution.labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)) : [],
    datasets: [{
      data: statusDistribution.data || [],
      backgroundColor: ['#667eea', '#FF9800', '#9C27B0', '#4CAF50', '#8BC34A', '#F44336'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  } : null;

  return (
    <Container maxWidth={false} sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh', px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Analytics Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Track your job search progress</Typography>
      </Box>

      {/* Key Stats Cards */}
      {overview && (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 4, width: '100%' }}>
          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#666', fontSize: '0.9rem' }}>Total Applications</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', color: '#333' }}>{overview.total}</Typography>
              </Box>
              <Box sx={{ color: '#667eea', fontSize: '1.5rem' }}>📋</Box>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#666', fontSize: '0.9rem' }}>Total Applied</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', color: '#333' }}>{overview.active || 0}</Typography>
              </Box>
              <Box sx={{ color: '#FF9800', fontSize: '1.5rem' }}>🔄</Box>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#666', fontSize: '0.9rem' }}>Total Interviews</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', color: '#333' }}>{overview.interviews || 0}</Typography>
              </Box>
              <Box sx={{ color: '#9C27B0', fontSize: '1.5rem' }}>🎯</Box>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#666', fontSize: '0.9rem' }}>Total Offers</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', color: '#333' }}>{overview.offers || 0}</Typography>
              </Box>
              <Box sx={{ color: '#4CAF50', fontSize: '1.5rem' }}>💰</Box>
            </Box>
          </Card>
        </Box>
      )}

      {/* Charts Grid */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, width: '100%' }}>
        {/* Application Timeline */}
        <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 450, display: 'flex', flexDirection: 'column', flex: '1.4' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>Application Timeline</Typography>
            {timelineChartData && timelineChartData.labels && timelineChartData.labels.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Line
                  data={timelineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No application data available
              </Typography>
            )}
          </Card>

        {/* Weekly Activity */}
        <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 450, display: 'flex', flexDirection: 'column', flex: '1' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>Weekly Activity</Typography>
            {weeklyChartData ? (
              <Box sx={{ height: 300 }}>
                <Bar
                  data={weeklyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 1 } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No activity data available
              </Typography>
            )}
          </Card>
      </Box>

      {/* Bottom Grid - Pie Chart and Top Companies */}
      <Box sx={{ display: 'flex', gap: 0, mb: 4, width: '100%' }}>
        {/* Status Distribution Pie Chart */}
        <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 450, display: 'flex', flexDirection: 'column', flex: '0 0 calc(58.33% - 0px)', mr: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>Application Status Distribution</Typography>
          {statusChartData && statusChartData.labels && statusChartData.labels.length > 0 ? (
            <Box sx={{ height: 300 }}>
              <Pie
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No status data available
            </Typography>
          )}
        </Card>

        {/* Top Companies */}
        <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', background: '#fff', minHeight: 450, display: 'flex', flexDirection: 'column', flex: '0 0 calc(41.67% - 0px)', ml: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>Top Applied Companies</Typography>
          <Box>
            {topCompanies && topCompanies.length > 0 ? (
              topCompanies.map((company, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: idx < topCompanies.length - 1 ? '1px solid #f0f0f0' : 'none', px: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {idx + 1}. {company.company}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {company.count}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No company data
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default Analytics;
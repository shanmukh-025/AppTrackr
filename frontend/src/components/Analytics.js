import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

function Analytics({ applications }) {
  // Prepare data for applications over time chart
  const getApplicationsByDate = () => {
    const dateMap = {};
    
    applications.forEach(app => {
      const date = new Date(app.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .slice(-14); // Last 14 days
  };

  // Status distribution for pie chart
  const getStatusDistribution = () => {
    const statusMap = {};
    
    applications.forEach(app => {
      statusMap[app.status] = (statusMap[app.status] || 0) + 1;
    });

    const statusLabels = {
      wishlist: 'Wishlist',
      applied: 'Applied',
      phone_screen: 'Phone Screen',
      technical: 'Technical',
      onsite: 'Onsite',
      offer: 'Offer',
      rejected: 'Rejected',
      ghosted: 'Ghosted'
    };

    return Object.entries(statusMap).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count
    }));
  };

  // Calculate response rate
  const calculateResponseRate = () => {
    // eslint-disable-next-line no-unused-vars
    const applied = applications.filter(app => app.status === 'applied' || 
                                              app.status === 'wishlist').length;
    const responded = applications.filter(app => 
      ['phone_screen', 'technical', 'onsite', 'offer'].includes(app.status)
    ).length;
    
    if (applications.length === 0) return 0;
    return ((responded / applications.length) * 100).toFixed(1);
  };

  // Average days in each stage
  const calculateAverageDays = () => {
    if (applications.length === 0) return 0;
    
    const totalDays = applications.reduce((sum, app) => {
      const days = Math.floor((new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    
    return Math.round(totalDays / applications.length);
  };

  const lineData = getApplicationsByDate();
  const pieData = getStatusDistribution();
  const responseRate = calculateResponseRate();
  const avgDays = calculateAverageDays();

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

  if (applications.length === 0) {
    return (
      <div className="analytics-empty">
        <p>📊 Add some applications to see analytics!</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Your Job Search Analytics</h2>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-value">{responseRate}%</div>
          <div className="metric-label">Response Rate</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-value">{avgDays}</div>
          <div className="metric-label">Avg Days per App</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">
            {applications.filter(app => ['phone_screen', 'technical', 'onsite'].includes(app.status)).length}
          </div>
          <div className="metric-label">Active Interviews</div>
        </div>
      </div>

      {/* Applications Over Time Chart */}
      <div className="chart-card">
        <h3>Applications Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#718096"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#718096"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="chart-card">
        <h3>Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
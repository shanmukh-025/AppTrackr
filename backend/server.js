
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { initializeStaticCompanies } = require('./utils/companyCareerPages');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'AppTrackr API is running!',
    timestamp: new Date().toISOString(),
    features: ['Job Tracking', 'Job Suggestions', 'Profile Management', 'Hybrid Career Pages Cache']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'AppTrackr API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Application routes
app.use('/api/applications', applicationRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Job suggestion routes
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize static companies in database on startup
  await initializeStaticCompanies();
});
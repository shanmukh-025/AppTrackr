
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const resumeRoutes = require('./routes/resumes');
const skillGapRoutes = require('./routes/skillGap');
const bookmarkRoutes = require('./routes/bookmarks');
const notesRoutes = require('./routes/notes');
const exportRoutes = require('./routes/export');
const preferencesRoutes = require('./routes/preferences');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { initializeStaticCompanies } = require('./utils/companyCareerPages');
// const emailService = require('./services/emailService'); // Email service disabled
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

// AI routes (Resume Analyzer, Cover Letter Generator, Interview Prep)
app.use('/api/ai', aiRoutes);

// Notification routes (Email settings, saved searches)
app.use('/api/notifications', notificationRoutes);

// Analytics routes (Dashboard stats, insights, trends)
app.use('/api/analytics', analyticsRoutes);

// Resume upload routes
app.use('/api/resumes', resumeRoutes);

// Skill gap analysis routes
app.use('/api/skill-gap', skillGapRoutes);

// Bookmark routes
app.use('/api/bookmarks', bookmarkRoutes);

// Notes routes
app.use('/api/notes', notesRoutes);

// Export routes
app.use('/api/export', exportRoutes);

// Preferences routes
app.use('/api/preferences', preferencesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize static companies in database on startup
  await initializeStaticCompanies();
  
  // Email service disabled
  // emailService.initializeTransporter();
  // emailService.scheduleDailyDigest();
  // emailService.scheduleDeadlineReminders();
});

require('dotenv').config();

const express = require('express');
const cors = require('cors');
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
const resourceRoutes = require('./routes/resources');
const dsaRoutes = require('./routes/dsa');
const interviewRoutes = require('./routes/interviews');
const learningRoutes = require('./routes/learning');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const templateRoutes = require('./routes/templates');
const jobCloneDetectorRoutes = require('./routes/jobCloneDetector');
const smartNotificationsRoutes = require('./routes/smartNotifications');
const githubRoutes = require('./routes/github');
const { initializeStaticCompanies } = require('./utils/companyCareerPages');
const app = express();

// Request queue middleware - limit concurrent requests to prevent connection pool exhaustion
// DISABLED: Causing 503 errors. Using Prisma connection pool instead
const requestQueue = [];
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 50; // Increased from 5 to allow more concurrent requests

app.use((req, res, next) => {
  // Only queue for heavy operations
  if (req.path.includes('/api/resumes/upload') || req.path.includes('/api/export')) {
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      activeRequests++;
      res.on('finish', () => {
        activeRequests--;
        if (requestQueue.length > 0) {
          const callback = requestQueue.shift();
          callback();
        }
      });
      next();
    } else {
      // Queue the request
      requestQueue.push(() => {
        activeRequests++;
        res.on('finish', () => {
          activeRequests--;
          if (requestQueue.length > 0) {
            const cb = requestQueue.shift();
            cb();
          }
        });
        next();
      });
    }
  } else {
    // All other requests bypass queue
    next();
  }
});

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

// Health check routes
app.use('/api/health', healthRoutes);

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

// Job Clone Detector routes
app.use('/api/job-clone-detector', jobCloneDetectorRoutes);

// Smart Notifications routes
app.use('/api/smart-notifications', smartNotificationsRoutes);

// GitHub Integration routes
app.use('/api/github', githubRoutes);

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

// Resources hub routes (Resume templates, Cover letter, Interview prep, etc)
app.use('/api/resources', resourceRoutes);

// DSA questions routes (Striver's SDE + AI + Google Drive integration)
app.use('/api/dsa', dsaRoutes);

// Interview sessions routes (Mock interviews, feedback, history)
app.use('/api/interviews', interviewRoutes);

// Learning resources routes (Skill-specific learning paths)
app.use('/api/learning', learningRoutes);

// Templates routes (Cover letter templates, resume templates)
app.use('/api/templates', templateRoutes);

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught Exception:', error);
  // Don't crash - just log and continue
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash - just log and continue
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize static companies in database on startup (non-blocking)
  // DISABLED: Skip initialization to preserve database connections for user requests
  // try {
  //   await initializeStaticCompanies();
  // } catch (error) {
  //   console.warn('⚠️ Database initialization skipped (database may be temporarily unavailable)');
  //   console.warn('Server will continue running - database-dependent features may be limited');
  // }
  
  // Email service disabled
  // emailService.initializeTransporter();
  // emailService.scheduleDailyDigest();
  // emailService.scheduleDeadlineReminders();
});
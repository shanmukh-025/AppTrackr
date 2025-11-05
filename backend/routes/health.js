const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint with environment variable status
 */
router.get('/', (req, res) => {
  const envCheck = {
    server: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    
    // Database
    database: {
      configured: !!process.env.DATABASE_URL,
      status: process.env.DATABASE_URL ? 'connected' : 'missing'
    },
    
    // Authentication
    auth: {
      jwtSecret: !!process.env.JWT_SECRET ? 'configured' : 'missing'
    },
    
    // AI Services
    ai: {
      gemini: !!process.env.GEMINI_API_KEY ? 'configured' : 'missing'
    },
    
    // Job APIs
    jobAPIs: {
      jooble: {
        apiKey: !!process.env.JOOBLE_API_KEY ? 'configured' : 'missing',
        apiUrl: !!process.env.JOOBLE_API_URL ? 'configured' : 'missing'
      },
      apijobs: {
        apiKey: !!process.env.APIJOBS_API_KEY ? 'configured' : 'missing',
        apiUrl: !!process.env.APIJOBS_API_URL ? 'configured' : 'missing'
      },
      arbeitnow: {
        apiUrl: !!process.env.ARBEITNOW_API_URL ? 'configured' : 'missing'
      }
    },
    
    // Google Drive
    googleDrive: {
      folderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID ? 'configured' : 'missing'
    },
    
    // Cache Settings
    cache: {
      ttl: process.env.CACHE_TTL || '1800',
      maxSize: process.env.MAX_CACHE_SIZE || '100'
    },
    
    // Rate Limits
    rateLimits: {
      joobleDaily: process.env.JOOBLE_DAILY_LIMIT || '500',
      apijobsMonthly: process.env.APIJOBS_MONTHLY_LIMIT || '50'
    }
  };
  
  // Check if all critical services are configured
  const allConfigured = 
    envCheck.database.configured &&
    envCheck.auth.jwtSecret !== 'missing' &&
    envCheck.ai.gemini !== 'missing' &&
    envCheck.jobAPIs.jooble.apiKey !== 'missing' &&
    envCheck.jobAPIs.jooble.apiUrl !== 'missing';
  
  res.status(200).json({
    status: allConfigured ? 'healthy' : 'degraded',
    message: allConfigured 
      ? 'All services configured correctly' 
      : 'Some environment variables are missing',
    ...envCheck
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with actual API key validation
 */
router.get('/detailed', (req, res) => {
  const detailed = {
    server: {
      status: 'running',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version
    },
    
    environmentVariables: {
      // Critical
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing',
      
      // Job APIs
      JOOBLE_API_KEY: process.env.JOOBLE_API_KEY ? '✅ Set' : '❌ Missing',
      JOOBLE_API_URL: process.env.JOOBLE_API_URL ? '✅ Set' : '❌ Missing',
      APIJOBS_API_KEY: process.env.APIJOBS_API_KEY ? '✅ Set' : '❌ Missing',
      APIJOBS_API_URL: process.env.APIJOBS_API_URL ? '✅ Set' : '❌ Missing',
      ARBEITNOW_API_URL: process.env.ARBEITNOW_API_URL ? '✅ Set' : '❌ Missing',
      
      // Optional
      GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '⚠️  Optional',
      CACHE_TTL: process.env.CACHE_TTL || 'default (1800)',
      MAX_CACHE_SIZE: process.env.MAX_CACHE_SIZE || 'default (100)',
      
      // Other
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '5000'
    },
    
    apis: {
      gemini: process.env.GEMINI_API_KEY ? {
        status: '✅ Configured',
        keyLength: process.env.GEMINI_API_KEY.length,
        keyPrefix: process.env.GEMINI_API_KEY.substring(0, 10) + '...'
      } : '❌ Not configured',
      
      jooble: process.env.JOOBLE_API_KEY ? {
        status: '✅ Configured',
        url: process.env.JOOBLE_API_URL,
        keyPrefix: process.env.JOOBLE_API_KEY.substring(0, 8) + '...'
      } : '❌ Not configured',
      
      apijobs: process.env.APIJOBS_API_KEY ? {
        status: '✅ Configured',
        url: process.env.APIJOBS_API_URL,
        keyPrefix: process.env.APIJOBS_API_KEY.substring(0, 8) + '...'
      } : '❌ Not configured'
    },
    
    timestamp: new Date().toISOString()
  };
  
  res.json(detailed);
});

module.exports = router;

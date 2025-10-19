/**
 * Jobs Routes
 * API endpoints for job suggestions
 */

const express = require('express');
const router = express.Router();
const jobService = require('../services/jobService');
const auth = require('../middleware/auth');
const { extractSkillsFromProfile } = require('../utils/skillNormalizer');
const prisma = require('../prisma/client');

/**
 * GET /api/jobs/suggestions
 * Get personalized job suggestions based on user skills
 */
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { userId } = req;
    const { location, limit, remote, complex } = req.query;

    // Fetch full user profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Extract skills from user profile
    let skills = extractSkillsFromProfile(user);

    // Allow manual skill override via query
    if (req.query.skills) {
      const manualSkills = req.query.skills.split(',').map(s => s.trim());
      skills = [...new Set([...skills, ...manualSkills])]; // Remove duplicates
    }

    // If still no skills, provide helpful message
    if (skills.length === 0) {
      return res.json({
        success: true,
        data: {
          jobs: [],
          count: 0,
          skills: [],
          message: 'No skills found in your profile. Please add skills to get personalized job suggestions.',
          filters: { location: location || '', limit: parseInt(limit) || 50, remote: remote === 'true' }
        }
      });
    }

    // Search options
    const options = {
      location: location || '',
      limit: parseInt(limit) || 50,
      remote: remote === 'true',
      complex: complex === 'true'
    };

    console.log(`🔍 Fetching job suggestions for user with skills: ${skills.join(', ')}`);

    const jobs = await jobService.searchJobs(skills, options);

    // DEBUG: Log first job to see what we're sending
    if (jobs.length > 0) {
      console.log('\n📋 Sample job being sent to frontend:');
      console.log('  Company:', jobs[0].company);
      console.log('  Career Page:', jobs[0].companyCareerPage);
      console.log('  URL:', jobs[0].url);
      console.log('  Direct URL:', jobs[0].directApplicationUrl);
    }

    res.json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
        skills: skills,
        filters: options
      }
    });

  } catch (error) {
    console.error('Error fetching job suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job suggestions',
      error: error.message
    });
  }
});

/**
 * GET /api/jobs/search
 * Search jobs by keywords (public search)
 */
router.get('/search', auth, async (req, res) => {
  try {
    const { keywords, location, limit, remote } = req.query;

    if (!keywords) {
      return res.status(400).json({
        success: false,
        message: 'Keywords are required'
      });
    }

    const skills = keywords.split(',').map(s => s.trim());
    const options = {
      location: location || '',
      limit: parseInt(limit) || 50,
      remote: remote === 'true'
    };

    const jobs = await jobService.searchJobs(skills, options);

    res.json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
        keywords: skills,
        filters: options
      }
    });

  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search jobs',
      error: error.message
    });
  }
});

/**
 * GET /api/jobs/stats
 * Get API usage statistics
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = jobService.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

/**
 * POST /api/jobs/track-click
 * Track when user clicks on a job (for future ML improvements)
 */
router.post('/track-click', auth, async (req, res) => {
  try {
    const { jobId, source, title, company } = req.body;
    const userId = req.userId; // Changed from req.user.id

    // TODO: Store in database for ML feedback loop
    console.log(`📊 Job clicked - User: ${userId}, Job: ${jobId}, Source: ${source}`);

    res.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track click',
      error: error.message
    });
  }
});

/**
 * POST /api/jobs/save
 * Save a job for later
 */
router.post('/save', auth, async (req, res) => {
  try {
    const { job } = req.body;
    const userId = req.userId; // Changed from req.user.id

    // TODO: Store in database
    console.log(`💾 Job saved - User: ${userId}, Job: ${job.id}`);

    res.json({
      success: true,
      message: 'Job saved successfully',
      data: job
    });

  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save job',
      error: error.message
    });
  }
});

module.exports = router;

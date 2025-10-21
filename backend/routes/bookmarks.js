const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const bookmarkService = require('../services/bookmarkService');

const router = express.Router();

// Add bookmark
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { company, position, jobUrl, logoUrl, salaryRange, location, jobDescription } = req.body;

    if (!company || !position || !jobUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company, position, and jobUrl are required' 
      });
    }

    const result = await bookmarkService.bookmarkJob(req.userId, {
      company,
      position,
      jobUrl,
      logoUrl,
      salaryRange,
      location,
      jobDescription,
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(409).json(result);
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding bookmark',
      error: error.message 
    });
  }
});

// Remove bookmark
router.delete('/remove', authenticateToken, async (req, res) => {
  try {
    const { jobUrl } = req.body;

    if (!jobUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'jobUrl is required' 
      });
    }

    const result = await bookmarkService.removeBookmark(req.userId, jobUrl);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing bookmark',
      error: error.message 
    });
  }
});

// Toggle bookmark
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { company, position, jobUrl, logoUrl, salaryRange, location, jobDescription } = req.body;

    if (!company || !position || !jobUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company, position, and jobUrl are required' 
      });
    }

    const result = await bookmarkService.toggleBookmark(req.userId, {
      company,
      position,
      jobUrl,
      logoUrl,
      salaryRange,
      location,
      jobDescription,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error toggling bookmark',
      error: error.message 
    });
  }
});

// Get all bookmarks
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc', limit = 50, skip = 0 } = req.query;

    const result = await bookmarkService.getUserBookmarks(req.userId, {
      sortBy,
      order,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookmarks',
      error: error.message 
    });
  }
});

// Check if job is bookmarked
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const { jobUrl } = req.body;

    if (!jobUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'jobUrl is required' 
      });
    }

    const result = await bookmarkService.isJobBookmarked(req.userId, jobUrl);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking bookmark',
      error: error.message 
    });
  }
});

// Get bookmark count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const result = await bookmarkService.getBookmarkCount(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting bookmark count:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookmark count',
      error: error.message 
    });
  }
});

module.exports = router;

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const exportService = require('../services/exportService');

const router = express.Router();

// Helper to send CSV as download
function sendCSV(res, csv, filename) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
}

// Export applications
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const result = await exportService.exportApplicationsToCSV(req.userId);

    if (result.success) {
      sendCSV(res, result.csv, result.filename);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error exporting applications',
      });
    }
  } catch (error) {
    console.error('Error in export applications route:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting applications',
      error: error.message,
    });
  }
});

// Export bookmarks
router.get('/bookmarks', authenticateToken, async (req, res) => {
  try {
    const result = await exportService.exportBookmarksToCSV(req.userId);

    if (result.success) {
      sendCSV(res, result.csv, result.filename);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error exporting bookmarks',
      });
    }
  } catch (error) {
    console.error('Error in export bookmarks route:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting bookmarks',
      error: error.message,
    });
  }
});

// Export resumes
router.get('/resumes', authenticateToken, async (req, res) => {
  try {
    const result = await exportService.exportResumesToCSV(req.userId);

    if (result.success) {
      sendCSV(res, result.csv, result.filename);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error exporting resumes',
      });
    }
  } catch (error) {
    console.error('Error in export resumes route:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting resumes',
      error: error.message,
    });
  }
});

// Export notes
router.get('/notes', authenticateToken, async (req, res) => {
  try {
    const result = await exportService.exportNotesToCSV(req.userId);

    if (result.success) {
      sendCSV(res, result.csv, result.filename);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error exporting notes',
      });
    }
  } catch (error) {
    console.error('Error in export notes route:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting notes',
      error: error.message,
    });
  }
});

// Export all data (summary)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const result = await exportService.exportAllDataToCSV(req.userId);

    if (result.success) {
      sendCSV(res, result.csv, result.filename);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error exporting data',
      });
    }
  } catch (error) {
    console.error('Error in export all route:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message,
    });
  }
});

module.exports = router;

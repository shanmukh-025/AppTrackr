const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const preferencesService = require('../services/preferencesService');

const router = express.Router();

// Get user preferences
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await preferencesService.getUserPreferences(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message,
    });
  }
});

// Update preferences
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { theme, language } = req.body;
    const updates = {};

    if (theme) updates.theme = theme;
    if (language) updates.language = language;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one preference field is required',
      });
    }

    const result = await preferencesService.updateUserPreferences(req.userId, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message,
    });
  }
});

// Update theme
router.put('/theme', authenticateToken, async (req, res) => {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: 'theme is required',
      });
    }

    const result = await preferencesService.updateTheme(req.userId, theme);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme',
      error: error.message,
    });
  }
});

// Get theme
router.get('/theme', authenticateToken, async (req, res) => {
  try {
    const result = await preferencesService.getTheme(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching theme',
      error: error.message,
    });
  }
});

module.exports = router;

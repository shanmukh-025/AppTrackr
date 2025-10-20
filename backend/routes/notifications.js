const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prisma = require('../prisma/client');
const emailService = require('../services/emailService');

// ============================================
// EMAIL NOTIFICATION SETTINGS
// ============================================

/**
 * GET /api/notifications/settings
 * Get user's notification preferences
 */
router.get('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailNotifications: true,
        dailyDigest: true,
        instantAlerts: true,
        applicationReminders: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/notifications/settings
 * Update notification preferences
 */
router.patch('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, dailyDigest, instantAlerts, applicationReminders } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        emailNotifications: emailNotifications !== undefined ? emailNotifications : undefined,
        dailyDigest: dailyDigest !== undefined ? dailyDigest : undefined,
        instantAlerts: instantAlerts !== undefined ? instantAlerts : undefined,
        applicationReminders: applicationReminders !== undefined ? applicationReminders : undefined
      },
      select: {
        emailNotifications: true,
        dailyDigest: true,
        instantAlerts: true,
        applicationReminders: true
      }
    });

    res.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/notifications/test
 * Send a test email to verify configuration
 */
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await emailService.sendEmail(
      user.email,
      '✅ AppTrackr Email Test',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">✅ Email Configuration Test</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>This is a test email from AppTrackr. If you're seeing this, email notifications are working correctly!</p>
        <p style="margin-top: 20px; color: #666;">
          <small>Sent from AppTrackr</small>
        </p>
      </div>`
    );

    if (result.success) {
      res.json({ success: true, message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ success: false, error: result.error || result.message });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SAVED SEARCHES
// ============================================

/**
 * GET /api/notifications/saved-searches
 * Get all saved searches for current user
 */
router.get('/saved-searches', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const formattedSearches = searches.map(search => ({
      ...search,
      techStack: search.techStack ? JSON.parse(search.techStack) : null
    }));

    res.json(formattedSearches);
  } catch (error) {
    console.error('Get saved searches error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/notifications/saved-searches
 * Create a new saved search
 */
router.post('/saved-searches', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      query,
      location,
      salaryMin,
      salaryMax,
      experienceLevel,
      techStack,
      remoteOnly,
      jobType,
      emailAlerts,
      alertFrequency
    } = req.body;

    if (!name || !query) {
      return res.status(400).json({ error: 'Name and query are required' });
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId,
        name,
        query,
        location,
        salaryMin,
        salaryMax,
        experienceLevel,
        techStack: techStack ? JSON.stringify(techStack) : null,
        remoteOnly: remoteOnly || false,
        jobType,
        emailAlerts: emailAlerts || false,
        alertFrequency: alertFrequency || 'daily'
      }
    });

    res.json({
      success: true,
      savedSearch: {
        ...savedSearch,
        techStack: savedSearch.techStack ? JSON.parse(savedSearch.techStack) : null
      }
    });
  } catch (error) {
    console.error('Create saved search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/notifications/saved-searches/:id
 * Update a saved search
 */
router.patch('/saved-searches/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    // Convert techStack to JSON string if provided
    if (updates.techStack) {
      updates.techStack = JSON.stringify(updates.techStack);
    }

    const updated = await prisma.savedSearch.updateMany({
      where: { id, userId },
      data: updates
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json({ success: true, message: 'Saved search updated' });
  } catch (error) {
    console.error('Update saved search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/notifications/saved-searches/:id
 * Delete a saved search
 */
router.delete('/saved-searches/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.savedSearch.deleteMany({
      where: { id, userId }
    });

    res.json({ success: true, message: 'Saved search deleted' });
  } catch (error) {
    console.error('Delete saved search error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import Gemini AI
let genAI, model;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
} catch (error) {
  console.log('Gemini AI not configured');
}

// ===========================
// GET ALL SMART NOTIFICATIONS
// ===========================
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { unreadOnly } = req.query;
    
    const where = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }
    
    const notifications = await prisma.smartNotification.findMany({
      where,
      orderBy: [
        { priority: 'desc' }, // High priority first
        { createdAt: 'desc' }
      ],
      take: 50 // Limit to 50 notifications
    });
    
    const unreadCount = await prisma.smartNotification.count({
      where: { userId, isRead: false }
    });
    
    res.json({
      success: true,
      notifications,
      unreadCount
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// ===========================
// MARK NOTIFICATION AS READ
// ===========================
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await prisma.smartNotification.update({
      where: { id, userId },
      data: { isRead: true }
    });
    
    res.json({
      success: true,
      notification
    });
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// ===========================
// DELETE NOTIFICATION
// ===========================
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await prisma.smartNotification.delete({
      where: { id, userId }
    });
    
    res.json({
      success: true,
      message: 'Notification deleted'
    });
    
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
});

// ===========================
// GET AUTOMATION RULES
// ===========================
router.get('/rules', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const rules = await prisma.automationRule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      rules
    });
    
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation rules'
    });
  }
});

// ===========================
// CREATE AUTOMATION RULE
// ===========================
router.post('/rules', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      conditionType,
      conditionValue,
      actionType,
      actionParams,
      isEnabled
    } = req.body;
    
    const rule = await prisma.automationRule.create({
      data: {
        userId,
        name,
        description,
        conditionType,
        conditionValue: JSON.stringify(conditionValue),
        actionType,
        actionParams: JSON.stringify(actionParams),
        isEnabled: isEnabled !== undefined ? isEnabled : true
      }
    });
    
    res.json({
      success: true,
      rule
    });
    
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create automation rule'
    });
  }
});

// ===========================
// UPDATE AUTOMATION RULE
// ===========================
router.patch('/rules/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert objects to JSON strings if needed
    if (updateData.conditionValue && typeof updateData.conditionValue === 'object') {
      updateData.conditionValue = JSON.stringify(updateData.conditionValue);
    }
    if (updateData.actionParams && typeof updateData.actionParams === 'object') {
      updateData.actionParams = JSON.stringify(updateData.actionParams);
    }
    
    const rule = await prisma.automationRule.update({
      where: { id, userId },
      data: updateData
    });
    
    res.json({
      success: true,
      rule
    });
    
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update automation rule'
    });
  }
});

// ===========================
// TOGGLE AUTOMATION RULE
// ===========================
router.patch('/rules/:id/toggle', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const rule = await prisma.automationRule.findUnique({
      where: { id, userId }
    });
    
    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }
    
    const updated = await prisma.automationRule.update({
      where: { id },
      data: { isEnabled: !rule.isEnabled }
    });
    
    res.json({
      success: true,
      rule: updated
    });
    
  } catch (error) {
    console.error('Error toggling rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle automation rule'
    });
  }
});

// ===========================
// DELETE AUTOMATION RULE
// ===========================
router.delete('/rules/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await prisma.automationRule.delete({
      where: { id, userId }
    });
    
    res.json({
      success: true,
      message: 'Automation rule deleted'
    });
    
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete automation rule'
    });
  }
});

// ===========================
// GET AI INSIGHTS & PREDICTIONS
// ===========================
router.get('/ai-insights', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's applications for analysis
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { dateApplied: 'desc' },
      take: 50
    });
    
    // Calculate insights
    const insights = {
      predictions: [],
      marketTrends: [],
      timingRecommendations: []
    };
    
    // Application outcome predictions
    for (const app of applications.slice(0, 10)) {
      const daysSinceApplied = Math.floor(
        (new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceApplied > 7 && app.status === 'applied') {
        const confidence = Math.min(0.9, 0.5 + (daysSinceApplied / 30));
        
        insights.predictions.push({
          type: 'application_outcome',
          applicationId: app.id,
          company: app.company,
          position: app.position,
          prediction: daysSinceApplied > 21 ? 'likely_rejected' : 'needs_followup',
          confidence: confidence,
          reasoning: daysSinceApplied > 21 
            ? `No response in ${daysSinceApplied} days typically indicates rejection`
            : `${daysSinceApplied} days without response - follow-up recommended`,
          actionable: daysSinceApplied <= 21
        });
      }
    }
    
    // Market trends (based on user's skills and applications)
    const skillsMap = {};
    applications.forEach(app => {
      if (app.requiredSkills) {
        try {
          const skills = JSON.parse(app.requiredSkills);
          skills.forEach(skill => {
            skillsMap[skill] = (skillsMap[skill] || 0) + 1;
          });
        } catch (e) {}
      }
    });
    
    Object.entries(skillsMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([skill, count]) => {
        insights.marketTrends.push({
          skill,
          demand: count,
          growth: Math.floor(Math.random() * 50) + 10, // Mock growth %
          reason: `${count} job postings require ${skill}`
        });
      });
    
    // Timing recommendations
    const recentApps = applications.filter(app => {
      const days = Math.floor((new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24));
      return days <= 7;
    });
    
    if (recentApps.length >= 5) {
      insights.timingRecommendations.push({
        type: 'slow_down',
        message: 'You\'ve applied to many jobs recently. Quality > Quantity!',
        confidence: 0.85,
        suggestion: 'Focus on tailoring fewer applications'
      });
    } else if (recentApps.length === 0) {
      insights.timingRecommendations.push({
        type: 'increase_activity',
        message: 'No applications this week. Stay active!',
        confidence: 0.75,
        suggestion: 'Apply to 3-5 jobs this week'
      });
    }
    
    res.json({
      success: true,
      insights
    });
    
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights'
    });
  }
});

// ===========================
// GENERATE PREDICTIVE NOTIFICATIONS (Background Job)
// ===========================
router.post('/generate-predictions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const [applications, rules] = await Promise.all([
      prisma.application.findMany({
        where: { userId },
        orderBy: { dateApplied: 'desc' }
      }),
      prisma.automationRule.findMany({
        where: { userId, isEnabled: true }
      })
    ]);
    
    const generatedNotifications = [];
    
    // Check each rule and generate notifications
    for (const rule of rules) {
      const condition = JSON.parse(rule.conditionValue);
      const action = JSON.parse(rule.actionParams);
      
      // Evaluate rule against applications
      for (const app of applications) {
        let shouldTrigger = false;
        
        // Example rule evaluation
        if (rule.conditionType === 'no_response') {
          const daysSinceApplied = Math.floor(
            (new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSinceApplied >= condition.days && app.status === 'applied') {
            shouldTrigger = true;
          }
        }
        
        if (shouldTrigger) {
          // Create notification
          const notification = await prisma.smartNotification.create({
            data: {
              userId,
              type: 'automated',
              title: `Rule triggered: ${rule.name}`,
              message: action.message || `Automation rule "${rule.name}" has been triggered for ${app.company}`,
              priority: 'medium',
              confidence: 0.8,
              relatedApplicationId: app.id,
              relatedCompany: app.company
            }
          });
          
          generatedNotifications.push(notification);
          
          // Update rule trigger count
          await prisma.automationRule.update({
            where: { id: rule.id },
            data: {
              triggerCount: rule.triggerCount + 1,
              lastTriggered: new Date()
            }
          });
        }
      }
    }
    
    res.json({
      success: true,
      generatedCount: generatedNotifications.length,
      notifications: generatedNotifications
    });
    
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate predictions'
    });
  }
});

module.exports = router;

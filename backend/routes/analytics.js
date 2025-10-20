const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prisma = require('../prisma/client');

// ============================================
// APPLICATION ANALYTICS
// ============================================

/**
 * GET /api/analytics/overview
 * Get overall application statistics
 */
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId }
    });

    const total = applications.length;
    const byStatus = {
      applied: applications.filter(a => a.status === 'applied').length,
      screening: applications.filter(a => a.status === 'screening').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offer: applications.filter(a => a.status === 'offer').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };

    const active = byStatus.applied + byStatus.screening + byStatus.interview;
    const successRate = total > 0 ? ((byStatus.offer + byStatus.accepted) / total * 100).toFixed(1) : 0;
    const interviewRate = total > 0 ? (byStatus.interview / total * 100).toFixed(1) : 0;

    res.json({
      total,
      active,
      byStatus,
      successRate: parseFloat(successRate),
      interviewRate: parseFloat(interviewRate)
    });
  } catch (error) {
    console.error('Overview analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/timeline
 * Get applications over time (last 6 months)
 */
router.get('/timeline', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applications = await prisma.application.findMany({
      where: {
        userId,
        createdAt: { gte: sixMonthsAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by month
    const timeline = {};
    applications.forEach(app => {
      const month = new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      timeline[month] = (timeline[month] || 0) + 1;
    });

    // If no data, return empty arrays (not empty object)
    const labels = Object.keys(timeline);
    const data = Object.values(timeline);

    console.log('Timeline data:', { labels, data, applicationsCount: applications.length });

    res.json({
      labels,
      data
    });
  } catch (error) {
    console.error('Timeline analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

  /**
 * GET /api/analytics/response-times
 * Calculate average response times
 */
router.get('/response-times', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId }
    });

    let totalResponseTime = 0;
    let responsesReceived = 0;

    applications.forEach(app => {
      if (app.screeningDate || app.interviewDate || app.offerDate || app.rejectedDate) {
        const appliedDate = new Date(app.dateApplied || app.createdAt);
        const responseDate = new Date(
          app.offerDate || app.interviewDate || app.screeningDate || app.rejectedDate
        );
        const daysDiff = Math.floor((responseDate - appliedDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff < 365) { // Sanity check
          totalResponseTime += daysDiff;
          responsesReceived++;
        }
      }
    });

    const averageResponseTime = responsesReceived > 0 
      ? Math.round(totalResponseTime / responsesReceived) 
      : 0;

    res.json({
      averageResponseTime,
      responsesReceived,
      noResponse: applications.length - responsesReceived
    });
  } catch (error) {
    console.error('Response times analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/top-companies
 * Get top companies by application count
 */
router.get('/top-companies', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;

    const applications = await prisma.application.findMany({
      where: { userId }
    });

    // Count by company
    const companyCounts = {};
    applications.forEach(app => {
      companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
    });

    // Sort and limit
    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    res.json(topCompanies);
  } catch (error) {
    console.error('Top companies analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/status-distribution
 * Get distribution of applications by status
 */
router.get('/status-distribution', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId }
    });

    const distribution = {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      accepted: 0,
      rejected: 0
    };

    applications.forEach(app => {
      if (distribution.hasOwnProperty(app.status)) {
        distribution[app.status]++;
      }
    });

    res.json({
      labels: Object.keys(distribution),
      data: Object.values(distribution),
      total: applications.length
    });
  } catch (error) {
    console.error('Status distribution error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// JOB MARKET INTELLIGENCE
// ============================================

/**
 * GET /api/analytics/trending-skills
 * Get trending skills from recent applications
 */
router.get('/trending-skills', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { 
        userId,
        requiredSkills: { not: null }
      },
      select: { requiredSkills: true }
    });

    // Count skills
    const skillCounts = {};
    applications.forEach(app => {
      try {
        const skills = JSON.parse(app.requiredSkills || '[]');
        skills.forEach(skill => {
          const normalizedSkill = skill.trim();
          skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
        });
      } catch (e) {
        // Skip invalid JSON
      }
    });

    // Sort and get top 15
    const trending = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    res.json(trending);
  } catch (error) {
    console.error('Trending skills error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/salary-insights
 * Get salary statistics from applications
 */
router.get('/salary-insights', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { 
        userId,
        salaryRange: { not: null }
      },
      select: { salaryRange: true, position: true }
    });

    // Extract salary numbers
    const salaries = [];
    applications.forEach(app => {
      const match = app.salaryRange?.match(/\$?(\d+)[kK]?/g);
      if (match) {
        match.forEach(m => {
          const num = parseInt(m.replace(/[^0-9]/g, ''));
          if (num > 20 && num < 500) { // Assume it's in thousands
            salaries.push(num * 1000);
          } else if (num >= 20000 && num <= 500000) {
            salaries.push(num);
          }
        });
      }
    });

    if (salaries.length === 0) {
      return res.json({
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        count: 0
      });
    }

    salaries.sort((a, b) => a - b);
    const average = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
    const min = salaries[0];
    const max = salaries[salaries.length - 1];
    const median = salaries[Math.floor(salaries.length / 2)];

    res.json({
      average,
      min,
      max,
      median,
      count: salaries.length
    });
  } catch (error) {
    console.error('Salary insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/weekly-activity
 * Get applications per week (last 12 weeks)
 */
router.get('/weekly-activity', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks

    const applications = await prisma.application.findMany({
      where: {
        userId,
        createdAt: { gte: twelveWeeksAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by week
    const weeklyData = {};
    applications.forEach(app => {
      const weekStart = new Date(app.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
      const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      weeklyData[weekLabel] = (weeklyData[weekLabel] || 0) + 1;
    });

    res.json({
      labels: Object.keys(weeklyData),
      data: Object.values(weeklyData)
    });
  } catch (error) {
    console.error('Weekly activity error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/success-patterns
 * Identify patterns in successful applications
 */
router.get('/success-patterns', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId }
    });

    const successful = applications.filter(a => 
      a.status === 'offer' || a.status === 'accepted'
    );

    // Analyze patterns
    const patterns = {
      byDay: {},
      byMonth: {},
      averageTimeToOffer: 0
    };

    // Day of week pattern
    applications.forEach(app => {
      const day = new Date(app.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (!patterns.byDay[day]) {
        patterns.byDay[day] = { total: 0, successful: 0 };
      }
      patterns.byDay[day].total++;
      if (app.status === 'offer' || app.status === 'accepted') {
        patterns.byDay[day].successful++;
      }
    });

    // Month pattern
    applications.forEach(app => {
      const month = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!patterns.byMonth[month]) {
        patterns.byMonth[month] = { total: 0, successful: 0 };
      }
      patterns.byMonth[month].total++;
      if (app.status === 'offer' || app.status === 'accepted') {
        patterns.byMonth[month].successful++;
      }
    });

    // Time to offer
    let totalDays = 0;
    let offerCount = 0;
    successful.forEach(app => {
      if (app.offerDate) {
        const appliedDate = new Date(app.dateApplied || app.createdAt);
        const offerDate = new Date(app.offerDate);
        const days = Math.floor((offerDate - appliedDate) / (1000 * 60 * 60 * 24));
        if (days >= 0 && days < 365) {
          totalDays += days;
          offerCount++;
        }
      }
    });

    patterns.averageTimeToOffer = offerCount > 0 ? Math.round(totalDays / offerCount) : 0;

    res.json(patterns);
  } catch (error) {
    console.error('Success patterns error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

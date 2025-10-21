const express = require('express');
const router = express.Router();
const skillGapService = require('../services/skillGapService');
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../prisma/client');

/**
 * POST /api/skill-gap/analyze
 * Analyze skill gap between resume and job description
 */
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Get resume if provided
    let userSkills = [];
    if (resumeId) {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId }
      });

      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      userSkills = JSON.parse(resume.skills || '[]');
    }

    // Extract required skills from job description
    const requiredSkills = skillGapService.extractSkills(jobDescription);

    // Calculate skill gap
    const skillGap = skillGapService.calculateSkillGap(userSkills, requiredSkills);

    // Get recommendations
    const recommendations = skillGapService.getRecommendations(skillGap, userSkills);

    // Generate chart data
    const chartData = skillGapService.generateChartData(skillGap);

    // Get learning resources
    const learningResources = skillGapService.getLearningResources(skillGap.missing);

    res.json({
      success: true,
      skillGap,
      recommendations,
      chartData,
      learningResources
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/skill-gap/text
 * Analyze skill gap from plain text (resume text and job description)
 */
router.post('/text', authenticateToken, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resume text and job description are required' });
    }

    // Extract skills from both texts
    const userSkills = skillGapService.extractSkills(resumeText);
    const requiredSkills = skillGapService.extractSkills(jobDescription);

    // Calculate skill gap
    const skillGap = skillGapService.calculateSkillGap(userSkills, requiredSkills);

    // Get recommendations
    const recommendations = skillGapService.getRecommendations(skillGap, userSkills);

    // Generate chart data
    const chartData = skillGapService.generateChartData(skillGap);

    // Get learning resources
    const learningResources = skillGapService.getLearningResources(skillGap.missing);

    res.json({
      success: true,
      userSkills,
      requiredSkills,
      skillGap,
      recommendations,
      chartData,
      learningResources
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/skill-gap/learning-resources/:skill
 * Get learning resources for a specific skill
 */
router.get('/learning-resources/:skill', authenticateToken, async (req, res) => {
  try {
    const { skill } = req.params;
    const resources = skillGapService.getLearningResources([skill]);

    res.json({ success: true, resources: resources[0] });
  } catch (error) {
    console.error('Get learning resources error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

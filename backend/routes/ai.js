const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');
const prisma = require('../prisma/client');

// ============================================
// RESUME ANALYSIS
// ============================================

/**
 * POST /api/ai/analyze-resume
 * Analyze resume against job description
 */
router.post('/analyze-resume', auth, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const userId = req.user.id;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // Call AI service
    const analysis = await aiService.analyzeResume(resumeText, jobDescription);

    // Save to database
    const savedAnalysis = await prisma.resumeAnalysis.create({
      data: {
        userId,
        resumeText,
        jobDescription,
        overallScore: analysis.overallScore,
        matchScore: analysis.matchScore || null,
        skillsMatched: JSON.stringify(analysis.skillsMatched || []),
        skillsGaps: JSON.stringify(analysis.skillsGaps || []),
        suggestions: JSON.stringify(analysis.suggestions || []),
        strengths: JSON.stringify(analysis.strengths || []),
        weaknesses: JSON.stringify(analysis.weaknesses || []),
      }
    });

    res.json({
      success: true,
      analysis: {
        id: savedAnalysis.id,
        overallScore: savedAnalysis.overallScore,
        matchScore: savedAnalysis.matchScore,
        skillsMatched: JSON.parse(savedAnalysis.skillsMatched),
        skillsGaps: JSON.parse(savedAnalysis.skillsGaps),
        suggestions: JSON.parse(savedAnalysis.suggestions),
        strengths: JSON.parse(savedAnalysis.strengths),
        weaknesses: JSON.parse(savedAnalysis.weaknesses),
        createdAt: savedAnalysis.createdAt
      }
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/resume-analyses
 * Get all resume analyses for current user
 */
router.get('/resume-analyses', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const analyses = await prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedAnalyses = analyses.map(analysis => ({
      id: analysis.id,
      overallScore: analysis.overallScore,
      matchScore: analysis.matchScore,
      skillsMatched: JSON.parse(analysis.skillsMatched),
      skillsGaps: JSON.parse(analysis.skillsGaps),
      suggestions: JSON.parse(analysis.suggestions),
      strengths: JSON.parse(analysis.strengths),
      weaknesses: JSON.parse(analysis.weaknesses),
      createdAt: analysis.createdAt
    }));

    res.json(formattedAnalyses);
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// COVER LETTER GENERATION
// ============================================

/**
 * POST /api/ai/generate-cover-letter
 * Generate custom cover letter
 */
router.post('/generate-cover-letter', auth, async (req, res) => {
  try {
    const { company, position, jobDescription, tone } = req.body;
    const userId = req.user.id;

    if (!company || !position || !jobDescription) {
      return res.status(400).json({ error: 'Company, position, and job description are required' });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      name: user.name,
      currentRole: user.currentRole,
      experience: user.experience,
      skills: user.skills,
      education: user.education,
      bio: user.bio
    };

    // Generate cover letter
    const content = await aiService.generateCoverLetter(
      userProfile,
      jobDescription,
      company,
      position,
      tone || 'professional'
    );

    // Save to database
    const savedLetter = await prisma.coverLetter.create({
      data: {
        userId,
        company,
        position,
        jobDescription,
        content,
        tone: tone || 'professional'
      }
    });

    res.json({
      success: true,
      coverLetter: {
        id: savedLetter.id,
        company: savedLetter.company,
        position: savedLetter.position,
        content: savedLetter.content,
        tone: savedLetter.tone,
        createdAt: savedLetter.createdAt
      }
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/cover-letters
 * Get all cover letters for current user
 */
router.get('/cover-letters', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const letters = await prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(letters);
  } catch (error) {
    console.error('Get cover letters error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/ai/cover-letters/:id
 * Delete a cover letter
 */
router.delete('/cover-letters/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.coverLetter.deleteMany({
      where: { id, userId }
    });

    res.json({ success: true, message: 'Cover letter deleted' });
  } catch (error) {
    console.error('Delete cover letter error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// INTERVIEW PREPARATION
// ============================================

/**
 * POST /api/ai/generate-interview-prep
 * Generate interview questions and answers
 */
router.post('/generate-interview-prep', auth, async (req, res) => {
  try {
    const { company, position, jobDescription } = req.body;
    const userId = req.user.id;

    if (!company || !position || !jobDescription) {
      return res.status(400).json({ error: 'Company, position, and job description are required' });
    }

    // Generate interview prep
    const prepData = await aiService.generateInterviewPrep(company, position, jobDescription);

    // Save to database
    const savedPrep = await prisma.interviewPrep.create({
      data: {
        userId,
        company,
        position,
        jobDescription,
        questions: JSON.stringify(prepData.questions || []),
        answers: JSON.stringify(prepData.questions || []), // Same data, kept for compatibility
        tips: JSON.stringify(prepData.tips || [])
      }
    });

    res.json({
      success: true,
      interviewPrep: {
        id: savedPrep.id,
        company: savedPrep.company,
        position: savedPrep.position,
        questions: JSON.parse(savedPrep.questions),
        tips: JSON.parse(savedPrep.tips),
        confidence: savedPrep.confidence,
        createdAt: savedPrep.createdAt
      }
    });
  } catch (error) {
    console.error('Interview prep generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/interview-preps
 * Get all interview preps for current user
 */
router.get('/interview-preps', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const preps = await prisma.interviewPrep.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPreps = preps.map(prep => ({
      id: prep.id,
      company: prep.company,
      position: prep.position,
      questions: JSON.parse(prep.questions),
      tips: JSON.parse(prep.tips),
      confidence: prep.confidence,
      preparedQuestions: prep.preparedQuestions ? JSON.parse(prep.preparedQuestions) : [],
      createdAt: prep.createdAt
    }));

    res.json(formattedPreps);
  } catch (error) {
    console.error('Get interview preps error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/ai/interview-preps/:id
 * Update interview prep progress
 */
router.patch('/interview-preps/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { preparedQuestions, confidence } = req.body;

    const updated = await prisma.interviewPrep.updateMany({
      where: { id, userId },
      data: {
        preparedQuestions: preparedQuestions ? JSON.stringify(preparedQuestions) : undefined,
        confidence: confidence !== undefined ? confidence : undefined
      }
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Interview prep not found' });
    }

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Update interview prep error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

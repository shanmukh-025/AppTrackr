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
    console.log('📄 Resume Analysis Started');
    console.log('req.userId:', req.userId);

    const { resumeText, jobDescription } = req.body;
    const userId = req.userId;

    if (!userId) {
      console.error('❌ userId is missing!');
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // Call AI service
    const analysis = await aiService.analyzeResume(resumeText, jobDescription);

    // Return response immediately, save to database in background (non-blocking)
    const responseData = {
      success: true,
      analysis: {
        id: 'pending',
        overallScore: analysis.overallScore,
        matchScore: analysis.matchScore,
        skillsMatched: analysis.skillsMatched || [],
        skillsGaps: analysis.skillsGaps || [],
        suggestions: analysis.suggestions || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        createdAt: new Date()
      }
    };

    // Fire-and-forget: Save to database without blocking response
    setImmediate(() => {
      prisma.resumeAnalysis.create({
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
      }).then(savedAnalysis => {
        console.log('✅ Resume analysis saved with id:', savedAnalysis.id);
        responseData.analysis.id = savedAnalysis.id;
      }).catch(dbError => {
        console.error('⚠️ Database error saving analysis (non-blocking):', dbError.message);
      });
    });

    res.json(responseData);
  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

/**
 * GET /api/ai/resume-analyses
 * Get all resume analyses for current user
 */
router.get('/resume-analyses', auth, async (req, res) => {
  try {
    const userId = req.userId;

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
// RESUME GENERATION
// ============================================

/**
 * POST /api/ai/generate-resume
 * Generate AI-powered resume
 */
router.post('/generate-resume', auth, async (req, res) => {
  try {
    console.log('📄 Resume Generation Started');
    const { fullName, email, phone, targetRole, experience, skills } = req.body;
    const userId = req.userId;

    if (!fullName || !targetRole || !skills) {
      return res.status(400).json({ error: 'Name, target role, and skills are required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    // Generate resume using AI
    const resumeContent = await aiService.generateResume({
      fullName,
      email,
      phone,
      targetRole,
      experience,
      skills
    });

    const responseData = {
      success: true,
      resume: {
        id: 'generated',
        content: resumeContent,
        createdAt: new Date()
      }
    };

    res.json(responseData);
    console.log('✅ Resume generated successfully');
  } catch (error) {
    console.error('❌ Resume generation error:', error);
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
    console.log('📝 Cover Letter Generation Started');
    console.log('req.userId:', req.userId);
    console.log('req.body:', req.body);

    const { company, position, jobDescription, tone } = req.body;
    const userId = req.userId;

    if (!company || !position || !jobDescription) {
      return res.status(400).json({ error: 'Company, position, and job description are required' });
    }

    if (!userId) {
      console.error('❌ userId is missing!');
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    // Generate cover letter immediately with minimal data
    console.log('🤖 Calling AI service...');
    const content = await aiService.generateCoverLetter(
      { name: 'Candidate', skills: '', experience: '', education: '' },
      jobDescription,
      company,
      position,
      tone || 'professional'
    );

    // Return response immediately, save to database and fetch user profile in background (non-blocking)
    const responseData = {
      success: true,
      coverLetter: {
        id: 'pending',
        company,
        position,
        content,
        tone: tone || 'professional',
        createdAt: new Date()
      }
    };

    // Fire-and-forget: Fetch user profile and save to database without blocking response
    setImmediate(async () => {
      try {
        console.log('🔍 [Background] Looking up user with id:', userId);
        
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (user) {
          console.log('👤 [Background] User found');
        }

        await prisma.coverLetter.create({
          data: {
            userId,
            company,
            position,
            jobDescription,
            content,
            tone: tone || 'professional'
          }
        }).then(savedLetter => {
          console.log('✅ [Background] Cover letter saved with id:', savedLetter.id);
        });
      } catch (err) {
        console.error('⚠️ [Background] Database operation failed:', err.message);
      }
    });

    res.json(responseData);
  } catch (error) {
    console.error('❌ Cover letter generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

/**
 * GET /api/ai/cover-letters
 * Get all cover letters for current user
 */
router.get('/cover-letters', auth, async (req, res) => {
  try {
    const userId = req.userId;

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
    const userId = req.userId;
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
    console.log('💼 Interview Prep Generation Started');
    console.log('req.userId:', req.userId);

    const { company, position, jobDescription } = req.body;
    const userId = req.userId;

    if (!userId) {
      console.error('❌ userId is missing!');
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    if (!company || !position || !jobDescription) {
      return res.status(400).json({ error: 'Company, position, and job description are required' });
    }

    // Generate interview prep
    const prepData = await aiService.generateInterviewPrep(company, position, jobDescription);

    // Return response immediately, save to database in background (non-blocking)
    const responseData = {
      success: true,
      interviewPrep: {
        id: 'pending',
        company,
        position,
        questions: prepData.questions || [],
        tips: prepData.tips || [],
        confidence: 0,
        createdAt: new Date()
      }
    };

    // Fire-and-forget: Save to database without blocking response
    setImmediate(() => {
      prisma.interviewPrep.create({
        data: {
          userId,
          company,
          position,
          jobDescription,
          questions: JSON.stringify(prepData.questions || []),
          answers: JSON.stringify(prepData.questions || []), // Same data, kept for compatibility
          tips: JSON.stringify(prepData.tips || [])
        }
      }).then(savedPrep => {
        console.log('✅ Interview prep saved with id:', savedPrep.id);
        responseData.interviewPrep.id = savedPrep.id;
      }).catch(dbError => {
        console.error('⚠️ Database error saving interview prep (non-blocking):', dbError.message);
      });
    });

    res.json(responseData);
  } catch (error) {
    console.error('❌ Interview prep generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

/**
 * GET /api/ai/interview-preps
 * Get all interview preps for current user
 */
router.get('/interview-preps', auth, async (req, res) => {
  try {
    const userId = req.userId;

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
    const userId = req.userId;
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

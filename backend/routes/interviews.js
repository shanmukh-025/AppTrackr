const express = require('express');
const prisma = require('../prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected - must be logged in
router.use(authMiddleware);

/**
 * GET /api/interviews
 * Get all interview sessions for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        responses: true
      }
    });

    res.json({ 
      sessions,
      count: sessions.length 
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/interviews/:id
 * Get a specific interview session
 */
router.get('/:id', async (req, res) => {
  try {
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        responses: true
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/interviews/save
 * Save interview feedback and session
 */
router.post('/save', async (req, res) => {
  try {
    const { interviewType, company, position, responses, timestamp, feedback } = req.body;

    // Validate required fields
    if (!interviewType || !company || !position) {
      return res.status(400).json({ 
        message: 'Missing required fields: interviewType, company, position' 
      });
    }

    // Create interview session
    const session = await prisma.interviewSession.create({
      data: {
        userId: req.userId,
        interviewType,
        company,
        position,
        feedback: feedback || null,
        responses: {
          create: responses ? responses.map(r => ({
            question: r.question,
            answer: r.answer || null,
            videoURL: r.videoURL || null,
            duration: r.duration || 0,
            timestamp: new Date()
          })) : []
        }
      },
      include: {
        responses: true
      }
    });

    res.status(201).json({ 
      message: 'Interview session saved',
      session 
    });
  } catch (error) {
    console.error('Save interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/interviews/:id/feedback
 * Save feedback for an interview session
 */
router.post('/:id/feedback', async (req, res) => {
  try {
    const { scores, strengths, improvements, tips, recommendations, overallScore } = req.body;

    // Check if session exists and belongs to user
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Update with feedback
    const updatedSession = await prisma.interviewSession.update({
      where: { id: req.params.id },
      data: {
        feedback: {
          scores,
          strengths,
          improvements,
          tips,
          recommendations,
          overallScore
        }
      },
      include: {
        responses: true
      }
    });

    res.json({ 
      message: 'Feedback saved',
      session: updatedSession 
    });
  } catch (error) {
    console.error('Save feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/interviews/:id
 * Delete an interview session
 */
router.delete('/:id', async (req, res) => {
  try {
    // Check if session exists and belongs to user
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Delete responses first (due to foreign key)
    await prisma.interviewResponse.deleteMany({
      where: {
        sessionId: req.params.id
      }
    });

    // Delete session
    await prisma.interviewSession.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Interview session deleted' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/interviews/:id
 * Update interview session notes/metadata
 */
router.put('/:id', async (req, res) => {
  try {
    const { notes, tags } = req.body;

    // Check if session exists and belongs to user
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Update session
    const updatedSession = await prisma.interviewSession.update({
      where: { id: req.params.id },
      data: {
        notes: notes || session.notes,
        tags: tags || session.tags
      },
      include: {
        responses: true
      }
    });

    res.json({ 
      message: 'Interview session updated',
      session: updatedSession 
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/interviews/stats/overview
 * Get interview statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: {
        userId: req.userId
      }
    });

    const types = {};
    const companies = {};
    
    sessions.forEach(session => {
      types[session.interviewType] = (types[session.interviewType] || 0) + 1;
      companies[session.company] = (companies[session.company] || 0) + 1;
    });

    res.json({
      totalSessions: sessions.length,
      byType: types,
      byCompany: companies,
      recentSessions: sessions.slice(0, 5)
    });
  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

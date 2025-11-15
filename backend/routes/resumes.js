const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const resumeUploadService = require('../services/resumeUploadService');
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../prisma/client');

/**
 * POST /api/resumes/upload
 * Upload and parse resume file
 */
router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📄 Processing resume: ${req.file.originalname}`);

    // Process the resume file
    const parsedResume = await resumeUploadService.processResumeFile(req.file);

    // Parse structured data
    const personalInfo = {
      fullName: parsedResume.fullName || '',
      email: parsedResume.email || '',
      phone: parsedResume.phone || ''
    };

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: req.userId,
        name: `${parsedResume.fullName || 'Resume'} - ${new Date().toLocaleDateString()}`,
        personalInfo: JSON.stringify(personalInfo),
        summary: parsedResume.summary || '',
        experience: JSON.stringify(parsedResume.experience),
        education: JSON.stringify(parsedResume.education),
        skills: JSON.stringify(parsedResume.skills),
        certifications: JSON.stringify(parsedResume.certifications),
        fileName: parsedResume.fileName,
        filePath: parsedResume.filePath,
        fileSize: parsedResume.fileSize,
        uploadedFrom: 'upload',
        rawText: parsedResume.rawText
      }
    });

    console.log(`✅ Resume saved: ID ${resume.id}`);

    res.json({
      success: true,
      resume: {
        id: resume.id,
        name: resume.name,
        personalInfo: JSON.parse(resume.personalInfo),
        summary: resume.summary,
        skills: JSON.parse(resume.skills),
        experience: JSON.parse(resume.experience),
        education: JSON.parse(resume.education),
        certifications: JSON.parse(resume.certifications),
        uploadedAt: resume.createdAt
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resumes
 * Get all resumes for user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedResumes = resumes.map(r => ({
      id: r.id,
      name: r.name,
      personalInfo: JSON.parse(r.personalInfo || '{}'),
      summary: r.summary,
      skills: JSON.parse(r.skills || '[]'),
      experience: JSON.parse(r.experience || '[]'),
      education: JSON.parse(r.education || '[]'),
      certifications: JSON.parse(r.certifications || '[]'),
      uploadedAt: r.createdAt,
      isActive: r.isActive
    }));

    res.json({ resumes: formattedResumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resumes/analysis-history
 * Get resume analysis history with scores
 */
router.get('/analysis-history', authenticateToken, async (req, res) => {
  try {
    const analyses = await prisma.resumeAnalysis.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Last 20 analyses
    });

    const formattedAnalyses = analyses.map(a => ({
      id: a.id,
      score: a.overallScore,
      atsScore: a.matchScore || a.overallScore,
      formattingScore: Math.floor(a.overallScore * 0.95), // Approximate from overall
      keywordScore: Math.floor(a.overallScore * 0.9), // Approximate from overall
      date: a.createdAt,
      strengths: JSON.parse(a.strengths || '[]'),
      weaknesses: JSON.parse(a.weaknesses || '[]'),
      suggestions: JSON.parse(a.suggestions || '[]')
    }));

    res.json({ history: formattedAnalyses });
  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/resumes/analysis/:id
 * Delete a resume analysis
 */
router.delete('/analysis/:id', authenticateToken, async (req, res) => {
  try {
    const analysisId = req.params.id;
    
    // Check if analysis exists and belongs to user
    const analysis = await prisma.resumeAnalysis.findUnique({
      where: { id: analysisId }
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    if (analysis.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this analysis' });
    }

    // Delete the analysis
    await prisma.resumeAnalysis.delete({
      where: { id: analysisId }
    });

    console.log(`✅ Analysis deleted: ${analysisId}`);
    res.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resumes/:id
 * Get specific resume
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id }
    });

    if (!resume || resume.userId !== req.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      id: resume.id,
      name: resume.name,
      personalInfo: JSON.parse(resume.personalInfo || '{}'),
      summary: resume.summary,
      skills: JSON.parse(resume.skills || '[]'),
      experience: JSON.parse(resume.experience || '[]'),
      education: JSON.parse(resume.education || '[]'),
      certifications: JSON.parse(resume.certifications || '[]'),
      rawText: resume.rawText,
      uploadedAt: resume.createdAt
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/resumes/:id
 * Delete resume
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const resumeId = req.params.id;
    console.log(`🗑️  Deleting resume: ${resumeId} for user: ${req.userId}`);

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      console.log(`Resume not found: ${resumeId}`);
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.userId !== req.userId) {
      console.log(`User mismatch: ${resume.userId} !== ${req.userId}`);
      return res.status(403).json({ error: 'Unauthorized to delete this resume' });
    }

    // Delete file from disk if it exists
    if (resume.filePath) {
      try {
        resumeUploadService.deleteResumeFile(resume.filePath);
        console.log(`📁 File deleted: ${resume.filePath}`);
      } catch (fileError) {
        console.warn(`File deletion warning:`, fileError.message);
      }
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id: resumeId }
    });

    console.log(`✅ Resume deleted: ${resumeId}`);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    console.error('❌ Delete resume error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete resume' });
  }
});

/**
 * POST /api/resumes/:id/analyze
 * Analyze resume against job description
 */
router.post('/:id/analyze', authenticateToken, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeId = req.params.id;
    
    console.log(`🔍 Analyzing resume: ${resumeId} for user: ${req.userId}`);

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    let resume;
    try {
      resume = await prisma.resume.findUnique({
        where: { id: resumeId }
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return res.status(503).json({ 
        error: 'Database connection failed. Please ensure Supabase is running and DATABASE_URL is correct.',
        details: dbError.message
      });
    }

    console.log(`Resume found:`, resume ? `Yes (ID: ${resume.id})` : 'No');
    console.log(`Resume userId: ${resume?.userId}, Request userId: ${req.userId}`);

    if (!resume || resume.userId !== req.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Use AI service to analyze
    const AIService = require('../services/aiService');
    const analysis = await AIService.analyzeResume(resume.rawText, jobDescription);

    res.json({
      resumeId: resume.id,
      analysis,
      skillsFromResume: JSON.parse(resume.skills || '[]')
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resumes/analyze-score
 * Comprehensive resume analysis and scoring (no job description needed)
 */
router.post('/analyze-score', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';
    let resumeId = null;

    // Handle file upload or text paste
    if (req.file) {
      console.log(`📄 Processing uploaded resume: ${req.file.originalname}`);
      const parsedResume = await resumeUploadService.processResumeFile(req.file);
      resumeText = parsedResume.rawText;
      
      // Save to database
      const resume = await prisma.resume.create({
        data: {
          userId: req.userId,
          name: `${parsedResume.fullName || 'Resume'} - ${new Date().toLocaleDateString()}`,
          personalInfo: JSON.stringify({
            fullName: parsedResume.fullName || '',
            email: parsedResume.email || '',
            phone: parsedResume.phone || ''
          }),
          summary: parsedResume.summary || '',
          experience: JSON.stringify(parsedResume.experience),
          education: JSON.stringify(parsedResume.education),
          skills: JSON.stringify(parsedResume.skills),
          certifications: JSON.stringify(parsedResume.certifications),
          fileName: parsedResume.fileName,
          filePath: parsedResume.filePath,
          fileSize: parsedResume.fileSize,
          uploadedFrom: 'score-optimizer',
          rawText: parsedResume.rawText
        }
      });
      resumeId = resume.id;
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      
      // Create a resume record for pasted text too
      const resume = await prisma.resume.create({
        data: {
          userId: req.userId,
          name: `Resume - ${new Date().toLocaleDateString()}`,
          personalInfo: JSON.stringify({}),
          summary: '',
          experience: JSON.stringify([]),
          education: JSON.stringify([]),
          skills: JSON.stringify([]),
          certifications: JSON.stringify([]),
          uploadedFrom: 'paste-text',
          rawText: resumeText
        }
      });
      resumeId = resume.id;
    } else {
      return res.status(400).json({ error: 'Please provide resume file or text' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text is too short or empty' });
    }

    console.log(`🤖 Analyzing resume (${resumeText.length} characters)...`);

    // Use AI service for comprehensive analysis
    const resumeAIService = require('../services/resumeAIService');
    
    // Get comprehensive analysis
    const analysis = await resumeAIService.comprehensiveResumeAnalysis(resumeText);

    // Save analysis results to ResumeAnalysis table
    await prisma.resumeAnalysis.create({
      data: {
        userId: req.userId,
        resumeText: resumeText.substring(0, 5000), // Store first 5000 chars
        overallScore: analysis.overallScore,
        matchScore: analysis.atsScore,
        skillsMatched: JSON.stringify(analysis.sections?.present || []),
        skillsGaps: JSON.stringify(analysis.sections?.missing || []),
        suggestions: JSON.stringify(analysis.improvements || []),
        strengths: JSON.stringify(analysis.strengths || []),
        weaknesses: JSON.stringify(analysis.weaknesses || [])
      }
    });

    console.log(`✅ Analysis saved for user ${req.userId}`);

    res.json({
      success: true,
      resumeId,
      analysis: {
        overallScore: analysis.overallScore,
        atsScore: analysis.atsScore,
        formattingScore: analysis.formattingScore,
        contentScore: analysis.contentScore,
        keywordScore: analysis.keywordScore,
        sections: analysis.sections,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        improvements: analysis.improvements
      }
    });

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
});

// ============================================
// RESUME VERSION CONTROL ENDPOINTS
// ============================================

/**
 * GET /api/resumes/:id/versions
 * Get all versions of a resume with company tracking
 */
router.get('/:id/versions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Parse companies sent to
    let companiesSentTo = [];
    if (resume.companiesSentTo) {
      try {
        companiesSentTo = JSON.parse(resume.companiesSentTo);
      } catch (e) {
        companiesSentTo = [];
      }
    }

    res.json({
      success: true,
      resumeId: resume.id,
      name: resume.name,
      version: resume.version,
      description: resume.description,
      companiesSentTo: companiesSentTo,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    });
  } catch (error) {
    console.error('Error fetching resume versions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resumes/:id/save-version
 * Save current resume as a new version
 */
router.post('/:id/save-version', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Check ownership
    const originalResume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!originalResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Create new version
    const newVersion = await prisma.resume.create({
      data: {
        userId: req.userId,
        name: originalResume.name,
        template: originalResume.template,
        description: description || `Version ${originalResume.version + 1}`,
        version: originalResume.version + 1,
        isActive: false,
        personalInfo: originalResume.personalInfo,
        summary: originalResume.summary,
        experience: originalResume.experience,
        education: originalResume.education,
        skills: originalResume.skills,
        certifications: originalResume.certifications,
        rawText: originalResume.rawText
      }
    });

    res.json({
      success: true,
      message: 'Version saved successfully',
      newVersion: {
        id: newVersion.id,
        version: newVersion.version,
        description: newVersion.description,
        createdAt: newVersion.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving resume version:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resumes/:id/mark-sent
 * Track which company this resume was sent to
 */
router.post('/:id/mark-sent', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check ownership
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Parse existing companies
    let companiesSentTo = [];
    if (resume.companiesSentTo) {
      try {
        companiesSentTo = JSON.parse(resume.companiesSentTo);
      } catch (e) {
        companiesSentTo = [];
      }
    }

    // Check if already sent to this company
    const alreadySent = companiesSentTo.some(c => c.company === company);
    if (alreadySent) {
      return res.status(400).json({ error: 'Resume already marked as sent to this company' });
    }

    // Add new company
    companiesSentTo.push({
      company,
      position: position || 'Not specified',
      sentDate: new Date().toISOString()
    });

    // Update resume
    const updated = await prisma.resume.update({
      where: { id },
      data: {
        companiesSentTo: JSON.stringify(companiesSentTo)
      }
    });

    res.json({
      success: true,
      message: `Resume marked as sent to ${company}`,
      companiesSentTo: companiesSentTo
    });
  } catch (error) {
    console.error('Error marking resume sent:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/resumes/:id/remove-company-sent
 * Remove a company from the sent list
 */
router.delete('/:id/remove-company-sent', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check ownership
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Parse existing companies
    let companiesSentTo = [];
    if (resume.companiesSentTo) {
      try {
        companiesSentTo = JSON.parse(resume.companiesSentTo);
      } catch (e) {
        companiesSentTo = [];
      }
    }

    // Remove company
    companiesSentTo = companiesSentTo.filter(c => c.company !== company);

    // Update resume
    await prisma.resume.update({
      where: { id },
      data: {
        companiesSentTo: JSON.stringify(companiesSentTo)
      }
    });

    res.json({
      success: true,
      message: `${company} removed from sent list`,
      companiesSentTo: companiesSentTo
    });
  } catch (error) {
    console.error('Error removing company:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

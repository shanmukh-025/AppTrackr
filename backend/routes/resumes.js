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

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

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

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../prisma/client');

// ============================================
// COVER LETTER TEMPLATES
// ============================================

/**
 * POST /api/templates/cover-letter
 * Create a new cover letter template
 */
router.post('/cover-letter', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      industry,
      tone = 'professional',
      opening,
      bodyParagraph1,
      bodyParagraph2,
      bodyParagraph3,
      closing,
      isDefault = false
    } = req.body;

    // Validate required fields
    if (!name || !industry || !opening || !closing) {
      return res.status(400).json({
        error: 'Name, industry, opening, and closing are required'
      });
    }

    // If marking as default, unmark others
    if (isDefault) {
      await prisma.coverLetterTemplate.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Create template
    const template = await prisma.coverLetterTemplate.create({
      data: {
        userId,
        name,
        industry,
        tone,
        opening,
        bodyParagraph1: bodyParagraph1 || '',
        bodyParagraph2: bodyParagraph2 || '',
        bodyParagraph3: bodyParagraph3 || '',
        closing,
        isDefault
      }
    });

    res.json({
      success: true,
      message: 'Template created successfully',
      template: {
        id: template.id,
        name: template.name,
        industry: template.industry,
        createdAt: template.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/templates/cover-letter
 * Get all cover letter templates for user
 */
router.get('/cover-letter', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const templates = await prisma.coverLetterTemplate.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        industry: true,
        tone: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/templates/cover-letter/:id
 * Get a specific cover letter template
 */
router.get('/cover-letter/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const template = await prisma.coverLetterTemplate.findFirst({
      where: { id, userId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/templates/cover-letter/:id
 * Update a cover letter template
 */
router.put('/cover-letter/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const {
      name,
      industry,
      tone,
      opening,
      bodyParagraph1,
      bodyParagraph2,
      bodyParagraph3,
      closing,
      isDefault
    } = req.body;

    // Check ownership
    const template = await prisma.coverLetterTemplate.findFirst({
      where: { id, userId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // If marking as default, unmark others
    if (isDefault && !template.isDefault) {
      await prisma.coverLetterTemplate.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Update template
    const updated = await prisma.coverLetterTemplate.update({
      where: { id },
      data: {
        name: name || template.name,
        industry: industry || template.industry,
        tone: tone || template.tone,
        opening: opening !== undefined ? opening : template.opening,
        bodyParagraph1: bodyParagraph1 !== undefined ? bodyParagraph1 : template.bodyParagraph1,
        bodyParagraph2: bodyParagraph2 !== undefined ? bodyParagraph2 : template.bodyParagraph2,
        bodyParagraph3: bodyParagraph3 !== undefined ? bodyParagraph3 : template.bodyParagraph3,
        closing: closing !== undefined ? closing : template.closing,
        isDefault: isDefault !== undefined ? isDefault : template.isDefault,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Template updated successfully',
      template: {
        id: updated.id,
        name: updated.name
      }
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/templates/cover-letter/:id
 * Delete a cover letter template
 */
router.delete('/cover-letter/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check ownership
    const template = await prisma.coverLetterTemplate.findFirst({
      where: { id, userId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Delete template
    await prisma.coverLetterTemplate.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/templates/cover-letter/:id/apply
 * Apply template with company/position replacements
 */
router.post('/cover-letter/:id/apply', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { company, position, skills = [] } = req.body;

    if (!company || !position) {
      return res.status(400).json({ error: 'Company and position are required' });
    }

    // Get template
    const template = await prisma.coverLetterTemplate.findFirst({
      where: { id, userId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Replace placeholders
    const skillsStr = skills.join(', ');
    const replacements = {
      '[COMPANY]': company,
      '[POSITION]': position,
      '[SKILLS]': skillsStr
    };

    const replaceText = (text) => {
      let result = text;
      Object.keys(replacements).forEach(key => {
        result = result.replace(new RegExp(key, 'g'), replacements[key]);
      });
      return result;
    };

    // Build complete letter
    const letterContent = `${replaceText(template.opening)}

${replaceText(template.bodyParagraph1)}

${replaceText(template.bodyParagraph2)}

${replaceText(template.bodyParagraph3)}

${replaceText(template.closing)}`;

    res.json({
      success: true,
      coverLetter: letterContent,
      metadata: {
        templateId: template.id,
        company,
        position,
        industry: template.industry,
        tone: template.tone,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error applying template:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/templates/cover-letter/default
 * Get default cover letter template
 */
router.get('/cover-letter/default', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const template = await prisma.coverLetterTemplate.findFirst({
      where: { userId, isDefault: true }
    });

    if (!template) {
      return res.json({
        success: true,
        template: null,
        message: 'No default template set'
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error fetching default template:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

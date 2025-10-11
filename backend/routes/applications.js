const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected - must be logged in
router.use(authMiddleware);

// GET all applications for logged-in user
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single application
router.get('/:id', async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId // Ensure user owns this application
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new application
router.post(
  '/',
  [
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('status').optional().isIn(['wishlist', 'applied', 'phone_screen', 'technical', 'onsite', 'offer', 'rejected', 'ghosted']),
    body('jobUrl').optional().isURL().withMessage('Must be a valid URL'),
    body('salaryRange').optional().trim(),
    body('location').optional().trim(),
    body('notes').optional().trim()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { company, position, status, jobUrl, salaryRange, location, notes } = req.body;

      // Fetch company logo from Clearbit
      let logoUrl = null;
      try {
        const companyDomain = company.toLowerCase().replace(/\s+/g, '') + '.com';
        logoUrl = `https://logo.clearbit.com/${companyDomain}`;
      } catch (logoError) {
        console.log('Logo fetch failed, continuing without logo');
      }

      // Create application
      const application = await prisma.application.create({
        data: {
          company,
          position,
          status: status || 'applied',
          jobUrl: jobUrl || null,
          salaryRange: salaryRange || null,
          location: location || null,
          notes: notes || null,
          logoUrl,
          userId: req.userId
        }
      });

      res.status(201).json({
        message: 'Application created successfully',
        application
      });
    } catch (error) {
      console.error('Create application error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT update application
router.put('/:id', async (req, res) => {
  try {
    const { company, position, status, jobUrl, salaryRange, location, notes } = req.body;

    // Check if application exists and user owns it
    const existingApp = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!existingApp) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application
    const application = await prisma.application.update({
      where: {
        id: req.params.id
      },
      data: {
        company: company || existingApp.company,
        position: position || existingApp.position,
        status: status || existingApp.status,
        jobUrl: jobUrl !== undefined ? jobUrl : existingApp.jobUrl,
        salaryRange: salaryRange !== undefined ? salaryRange : existingApp.salaryRange,
        location: location !== undefined ? location : existingApp.location,
        notes: notes !== undefined ? notes : existingApp.notes
      }
    });

    res.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  try {
    // Check if application exists and user owns it
    const application = await prisma.application.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Delete application
    await prisma.application.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
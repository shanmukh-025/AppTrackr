const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET user profile
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        bio: true,
        profilePicture: true,
        currentRole: true,
        experience: true,
        targetRole: true,
        targetSalary: true,
        skills: true,
        education: true,
        university: true,
        graduationYear: true,
        jobType: true,
        workMode: true,
        availability: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user skills only
router.get('/skills', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        skills: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse skills from JSON string or return as array
    let skills = [];
    if (user.skills) {
      try {
        skills = typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills;
      } catch (e) {
        // If skills is already a comma-separated string, split it
        skills = user.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error', skills: [] });
  }
});

// PUT update user profile
router.put('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      profilePicture,
      currentRole,
      experience,
      targetRole,
      targetSalary,
      skills,
      education,
      university,
      graduationYear,
      jobType,
      workMode,
      availability
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name: name || null,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        profilePicture: profilePicture || null,
        currentRole: currentRole || null,
        experience: experience || null,
        targetRole: targetRole || null,
        targetSalary: targetSalary || null,
        skills: skills || null,
        education: education || null,
        university: university || null,
        graduationYear: graduationYear || null,
        jobType: jobType || null,
        workMode: workMode || null,
        availability: availability || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        bio: true,
        profilePicture: true,
        currentRole: true,
        experience: true,
        targetRole: true,
        targetSalary: true,
        skills: true,
        education: true,
        university: true,
        graduationYear: true,
        jobType: true,
        workMode: true,
        availability: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
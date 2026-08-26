const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma/client');

const router = express.Router();

const DATABASE_UNAVAILABLE_MESSAGE = 'Database services are temporarily unavailable. Please try again later.';

function isDatabaseUnavailableError(error) {
  if (!error) return false;

  const text = `${error.code || ''} ${error.message || ''}`.toLowerCase();
  const dbErrorHints = [
    'p1001',
    'p1002',
    'database',
    'connection',
    'timeout',
    'timed out',
    'econnrefused',
    'pool'
  ];

  return dbErrorHints.some((hint) => text.includes(hint));
}

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null
        }
      });

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      if (isDatabaseUnavailableError(error)) {
        return res.status(503).json({ message: DATABASE_UNAVAILABLE_MESSAGE });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      let user;
      try {
        user = await prisma.user.findUnique({
          where: { email }
        });
      } catch (dbError) {
        console.error('❌ Database error finding user:', dbError.message);
        return res.status(503).json({ message: DATABASE_UNAVAILABLE_MESSAGE });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
      } catch (bcryptError) {
        console.error('❌ Bcrypt error:', bcryptError.message);
        return res.status(500).json({ message: 'Authentication service error' });
      }

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      let token;
      try {
        token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
      } catch (tokenError) {
        console.error('❌ Token generation error:', tokenError.message);
        return res.status(500).json({ message: 'Token generation failed' });
      }

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user (protected route)
router.get('/me', async (req, res) => {
  let decoded;

  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);

    if (isDatabaseUnavailableError(error)) {
      return res.status(503).json({ message: DATABASE_UNAVAILABLE_MESSAGE });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
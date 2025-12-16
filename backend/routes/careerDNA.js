const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import Gemini AI
let genAI, model;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
} catch (error) {
  console.log('Gemini AI not configured');
}

// ===========================
// CAREER DNA PROFILING
// ===========================

// Create or Update Career DNA Profile
router.post('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      learningStyle,
      timeAvailable,
      budget,
      preferredPace,
      motivation,
      currentLevel,
      preferredFormat,
      bestLearningTime,
      targetRole,
      targetCompany,
      timelineWeeks
    } = req.body;

    const careerDNA = await prisma.careerDNA.upsert({
      where: { userId },
      update: {
        learningStyle,
        timeAvailable,
        budget: budget || 0,
        preferredPace,
        motivation,
        currentLevel,
        preferredFormat,
        bestLearningTime,
        targetRole,
        targetCompany,
        timelineWeeks
      },
      create: {
        userId,
        learningStyle,
        timeAvailable,
        budget: budget || 0,
        preferredPace,
        motivation,
        currentLevel,
        preferredFormat: preferredFormat || 'video',
        bestLearningTime: bestLearningTime || 'evening',
        targetRole,
        targetCompany,
        timelineWeeks
      }
    });

    res.json({
      success: true,
      careerDNA,
      dnaCode: generateDNACode(careerDNA)
    });

  } catch (error) {
    console.error('Error creating career DNA:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create career DNA profile'
    });
  }
});

// Get Career DNA Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const careerDNA = await prisma.careerDNA.findUnique({
      where: { userId }
    });

    if (!careerDNA) {
      return res.json({
        success: true,
        careerDNA: null,
        needsSetup: true
      });
    }

    res.json({
      success: true,
      careerDNA,
      dnaCode: generateDNACode(careerDNA)
    });

  } catch (error) {
    console.error('Error fetching career DNA:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch career DNA'
    });
  }
});

// ===========================
// LEARNING FEED
// ===========================

// Get Personalized Learning Feed
router.get('/feed', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, filter } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Get user's career DNA
    const careerDNA = await prisma.careerDNA.findUnique({
      where: { userId }
    });

    // Get user's feedback history to filter out
    const feedback = await prisma.resourceFeedback.findMany({
      where: {
        userId,
        feedbackType: 'not-interested'
      },
      select: { resourceId: true }
    });
    
    const excludedIds = feedback.map(f => f.resourceId);

    // Build filter criteria
    const where = {
      id: { notIn: excludedIds }
    };

    if (filter) {
      where.type = filter;
    }

    // Get resources with AI matching
    let resources = await prisma.learningResource.findMany({
      where,
      orderBy: [
        { trendingScore: 'desc' },
        { rating: 'desc' }
      ],
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    // Calculate match score for each resource
    resources = resources.map(resource => ({
      ...resource,
      matchScore: calculateMatchScore(resource, careerDNA),
      skillTags: JSON.parse(resource.skillTags || '[]')
    }));

    // Sort by match score
    resources.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      resources,
      page: parseInt(page),
      hasMore: resources.length === parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching learning feed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning feed'
    });
  }
});

// Save Resource (Bookmark)
router.post('/resources/:id/save', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: resourceId } = req.params;

    const progress = await prisma.userResourceProgress.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      },
      update: {
        bookmarked: true
      },
      create: {
        userId,
        resourceId,
        status: 'saved',
        bookmarked: true
      }
    });

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error saving resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save resource'
    });
  }
});

// Start Resource
router.post('/resources/:id/start', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: resourceId } = req.params;

    const progress = await prisma.userResourceProgress.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      },
      update: {
        status: 'started',
        startedAt: new Date()
      },
      create: {
        userId,
        resourceId,
        status: 'started',
        startedAt: new Date()
      }
    });

    // Update learning streak
    await updateLearningStreak(userId);

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error starting resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start resource'
    });
  }
});

// Update Progress
router.patch('/resources/:id/progress', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: resourceId } = req.params;
    const { progressPercent, timeSpent } = req.body;

    const existingProgress = await prisma.userResourceProgress.findUnique({
      where: {
        userId_resourceId: { userId, resourceId }
      }
    });

    const status = progressPercent >= 100 ? 'completed' : 
                   progressPercent > 0 ? 'in-progress' : 'started';

    const progress = await prisma.userResourceProgress.upsert({
      where: {
        userId_resourceId: { userId, resourceId }
      },
      update: {
        progressPercent: progressPercent || 0,
        timeSpent: (existingProgress?.timeSpent || 0) + (timeSpent || 0),
        status,
        completedAt: status === 'completed' ? new Date() : null,
        lastAccessedAt: new Date()
      },
      create: {
        userId,
        resourceId,
        status,
        progressPercent: progressPercent || 0,
        timeSpent: timeSpent || 0,
        startedAt: new Date(),
        completedAt: status === 'completed' ? new Date() : null
      }
    });

    // Update completion rate in Career DNA
    await updateCompletionRate(userId);

    // Check for achievements
    if (status === 'completed') {
      await checkAchievements(userId);
    }

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

// Provide Feedback
router.post('/resources/:id/feedback', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: resourceId } = req.params;
    const { feedbackType, reason } = req.body;

    await prisma.resourceFeedback.create({
      data: {
        userId,
        resourceId,
        feedbackType,
        reason
      }
    });

    res.json({
      success: true,
      message: 'Feedback recorded'
    });

  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback'
    });
  }
});

// ===========================
// LEARNING PATHS
// ===========================

// Generate AI Learning Path
router.post('/learning-path/generate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetRole, currentSkills, timelineWeeks } = req.body;

    let pathData = null;

    if (model) {
      try {
        const prompt = `Generate a learning path for someone who wants to become a ${targetRole}.
        Current skills: ${currentSkills || 'beginner'}
        Timeline: ${timelineWeeks || 12} weeks
        
        Provide a JSON response with this structure:
        {
          "name": "Path to ${targetRole}",
          "description": "Detailed description",
          "resources": [
            {
              "week": 1,
              "title": "Resource title",
              "type": "video/article/course",
              "duration": "10h",
              "skills": ["skill1", "skill2"]
            }
          ],
          "estimatedWeeks": 12,
          "totalHours": 100,
          "difficulty": "intermediate"
        }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          pathData = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.error('AI generation error:', aiError);
      }
    }

    // Fallback path data
    if (!pathData) {
      pathData = {
        name: `Path to ${targetRole}`,
        description: `Comprehensive learning path to become a ${targetRole}`,
        resources: generateDefaultPath(targetRole),
        estimatedWeeks: timelineWeeks || 12,
        totalHours: (timelineWeeks || 12) * 10,
        difficulty: 'intermediate'
      };
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        userId,
        name: pathData.name,
        description: pathData.description,
        targetRole,
        resources: JSON.stringify(pathData.resources),
        estimatedWeeks: pathData.estimatedWeeks,
        totalHours: pathData.totalHours,
        difficulty: pathData.difficulty,
        isAIGenerated: true
      }
    });

    res.json({
      success: true,
      learningPath: {
        ...learningPath,
        resources: JSON.parse(learningPath.resources)
      }
    });

  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate learning path'
    });
  }
});

// Get User's Learning Paths
router.get('/learning-paths', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const paths = await prisma.learningPath.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const pathsWithResources = paths.map(path => ({
      ...path,
      resources: JSON.parse(path.resources)
    }));

    res.json({
      success: true,
      learningPaths: pathsWithResources
    });

  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning paths'
    });
  }
});

// ===========================
// MICRO OPPORTUNITIES
// ===========================

// Get Micro Opportunities
router.get('/opportunities', auth, async (req, res) => {
  try {
    const { type, difficulty } = req.query;

    const where = {
      status: 'active'
    };

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const opportunities = await prisma.microOpportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const opportunitiesWithSkills = opportunities.map(opp => ({
      ...opp,
      requiredSkills: JSON.parse(opp.requiredSkills)
    }));

    res.json({
      success: true,
      opportunities: opportunitiesWithSkills
    });

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch opportunities'
    });
  }
});

// ===========================
// GAMIFICATION
// ===========================

// Get Learning Streak
router.get('/streak', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    let streak = await prisma.learningStreak.findUnique({
      where: { userId }
    });

    if (!streak) {
      streak = await prisma.learningStreak.create({
        data: { userId }
      });
    }

    res.json({
      success: true,
      streak
    });

  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning streak'
    });
  }
});

// Get Achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = await prisma.learningAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' }
    });

    res.json({
      success: true,
      achievements
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements'
    });
  }
});

// Get Dashboard Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      completedCount,
      inProgressCount,
      totalTimeSpent,
      streak,
      achievements
    ] = await Promise.all([
      prisma.userResourceProgress.count({
        where: { userId, status: 'completed' }
      }),
      prisma.userResourceProgress.count({
        where: { userId, status: 'in-progress' }
      }),
      prisma.userResourceProgress.aggregate({
        where: { userId },
        _sum: { timeSpent: true }
      }),
      prisma.learningStreak.findUnique({
        where: { userId }
      }),
      prisma.learningAchievement.count({
        where: { userId }
      })
    ]);

    res.json({
      success: true,
      stats: {
        completedResources: completedCount,
        inProgressResources: inProgressCount,
        totalHoursLearned: Math.round((totalTimeSpent._sum.timeSpent || 0) / 60),
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
        totalAchievements: achievements
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// ===========================
// HELPER FUNCTIONS
// ===========================

function generateDNACode(careerDNA) {
  const style = careerDNA.learningStyle.substring(0, 2).toUpperCase();
  const time = careerDNA.timeAvailable.substring(0, 2).toUpperCase();
  const budget = `B${careerDNA.budget}`;
  const pace = careerDNA.preferredPace.substring(0, 1).toUpperCase();
  const level = careerDNA.currentLevel.substring(0, 3).toUpperCase();
  
  return `${style}-${time}-${budget}-${pace}-${level}`;
}

function calculateMatchScore(resource, careerDNA) {
  if (!careerDNA) return 50;
  
  let score = 0;
  
  // Format preference (30%)
  if (resource.type === careerDNA.preferredFormat) {
    score += 30;
  }
  
  // Difficulty match (25%)
  if (resource.difficulty === careerDNA.currentLevel) {
    score += 25;
  } else if (
    (resource.difficulty === 'intermediate' && careerDNA.currentLevel === 'beginner') ||
    (resource.difficulty === 'advanced' && careerDNA.currentLevel === 'intermediate')
  ) {
    score += 15; // Next level
  }
  
  // Price match (20%)
  if (resource.price === 0) {
    score += 10;
  } else if (resource.price <= careerDNA.budget) {
    score += 20;
  }
  
  // Quality (15%)
  score += Math.min(15, (resource.rating / 5) * 15);
  
  // Trending (10%)
  score += Math.min(10, resource.trendingScore);
  
  return Math.round(score);
}

async function updateLearningStreak(userId) {
  try {
    const streak = await prisma.learningStreak.findUnique({
      where: { userId }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!streak) {
      await prisma.learningStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalDays: 1,
          lastActivityDate: new Date()
        }
      });
      return;
    }

    const lastActivity = new Date(streak.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, just update timestamp
      await prisma.learningStreak.update({
        where: { userId },
        data: { lastActivityDate: new Date() }
      });
    } else if (daysDiff === 1) {
      // Next day, increment streak
      const newStreak = streak.currentStreak + 1;
      await prisma.learningStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          totalDays: streak.totalDays + 1,
          lastActivityDate: new Date()
        }
      });
    } else {
      // Streak broken
      await prisma.learningStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          totalDays: streak.totalDays + 1,
          lastActivityDate: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

async function updateCompletionRate(userId) {
  try {
    const stats = await prisma.userResourceProgress.aggregate({
      where: { userId },
      _avg: { progressPercent: true },
      _count: true
    });

    if (stats._count > 0) {
      await prisma.careerDNA.update({
        where: { userId },
        data: {
          avgCompletionRate: stats._avg.progressPercent / 100
        }
      });
    }
  } catch (error) {
    console.error('Error updating completion rate:', error);
  }
}

async function checkAchievements(userId) {
  try {
    const completed = await prisma.userResourceProgress.count({
      where: { userId, status: 'completed' }
    });

    const achievements = [];

    // Fast Learner (5 completions)
    if (completed === 5) {
      achievements.push({
        userId,
        achievementType: 'completion',
        title: 'Fast Learner',
        description: 'Completed 5 learning resources',
        icon: '🚀'
      });
    }

    // Knowledge Seeker (10 completions)
    if (completed === 10) {
      achievements.push({
        userId,
        achievementType: 'completion',
        title: 'Knowledge Seeker',
        description: 'Completed 10 learning resources',
        icon: '📚'
      });
    }

    // Learning Master (25 completions)
    if (completed === 25) {
      achievements.push({
        userId,
        achievementType: 'completion',
        title: 'Learning Master',
        description: 'Completed 25 learning resources',
        icon: '🎓'
      });
    }

    if (achievements.length > 0) {
      await prisma.learningAchievement.createMany({
        data: achievements,
        skipDuplicates: true
      });
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

function generateDefaultPath(targetRole) {
  const paths = {
    'React Developer': [
      { week: 1, title: 'JavaScript Fundamentals', type: 'video', duration: '10h', skills: ['JavaScript', 'ES6'] },
      { week: 2, title: 'React Basics', type: 'course', duration: '12h', skills: ['React', 'Components'] },
      { week: 3, title: 'React Hooks', type: 'video', duration: '8h', skills: ['Hooks', 'State'] },
      { week: 4, title: 'State Management', type: 'course', duration: '10h', skills: ['Redux', 'Context'] }
    ],
    'Full Stack Developer': [
      { week: 1, title: 'Frontend Basics', type: 'course', duration: '15h', skills: ['HTML', 'CSS', 'JavaScript'] },
      { week: 2, title: 'React Framework', type: 'course', duration: '12h', skills: ['React'] },
      { week: 3, title: 'Node.js Backend', type: 'course', duration: '14h', skills: ['Node.js', 'Express'] },
      { week: 4, title: 'Databases', type: 'course', duration: '10h', skills: ['SQL', 'MongoDB'] }
    ]
  };

  return paths[targetRole] || paths['React Developer'];
}

module.exports = router;

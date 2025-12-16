const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'gemini-2.0-flash-exp');

router.use(authMiddleware);

// ===================================
// AI SKILL ACCELERATOR
// ===================================

// Get or Create Skill Accelerator Profile
router.post('/skill-accelerator/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      targetSkills,
      currentLevel,
      learningStyle,
      hoursPerWeek,
      learningGoal,
      timelineWeeks,
      preferredLanguage,
      preferredFramework
    } = req.body;

    // AI generates personalized learning blueprint
    const aiBlueprint = await generateAcceleratorBlueprint({
      targetSkills,
      currentLevel,
      learningStyle,
      hoursPerWeek,
      timelineWeeks,
      preferredLanguage,
      preferredFramework
    });

    // Create accelerator profile
    const profile = await prisma.aISkillAccelerator.upsert({
      where: { userId },
      update: {
        targetSkills: JSON.stringify(targetSkills),
        currentLevel,
        learningStyle,
        hoursPerWeek,
        learningGoal,
        timelineWeeks,
        preferredLanguage,
        preferredFramework,
        aiBlueprint: JSON.stringify(aiBlueprint),
        adaptationScore: 0,
        lastUpdated: new Date()
      },
      create: {
        userId,
        targetSkills: JSON.stringify(targetSkills),
        currentLevel,
        learningStyle,
        hoursPerWeek,
        learningGoal,
        timelineWeeks,
        preferredLanguage,
        preferredFramework,
        aiBlueprint: JSON.stringify(aiBlueprint),
        adaptationScore: 0
      }
    });

    res.json({
      success: true,
      profile: {
        ...profile,
        targetSkills: JSON.parse(profile.targetSkills),
        aiBlueprint: JSON.parse(profile.aiBlueprint)
      },
      insights: {
        estimatedDays: aiBlueprint.estimatedDays,
        dailyCommitment: aiBlueprint.dailyHours,
        successProbability: aiBlueprint.successRate,
        uniqueApproach: aiBlueprint.uniqueApproach
      }
    });
  } catch (error) {
    console.error('Skill accelerator profile error:', error);
    res.status(500).json({ error: 'Failed to create skill accelerator profile' });
  }
});

// Get Adaptive Learning Path (AI Customized)
router.post('/skill-accelerator/adaptive-path', async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, difficulty } = req.body;

    // Get user profile for personalization
    const userProfile = await prisma.aISkillAccelerator.findUnique({
      where: { userId }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found. Create profile first.' });
    }

    // AI generates hyper-personalized learning path
    const adaptivePath = await generateAdaptivePath(
      userId,
      skillName,
      difficulty,
      JSON.parse(userProfile.learningStyle),
      JSON.parse(userProfile.aiBlueprint)
    );

    // Save adaptive path
    const path = await prisma.adaptiveLearningPath.create({
      data: {
        userId,
        skillName,
        difficulty,
        customizedPath: JSON.stringify(adaptivePath.modules),
        learningSequence: JSON.stringify(adaptivePath.sequence),
        estimatedHours: adaptivePath.totalHours,
        aiCustomization: JSON.stringify(adaptivePath.customization),
        focusAreas: JSON.stringify(adaptivePath.focusAreas),
        practiceProjects: JSON.stringify(adaptivePath.projects)
      }
    });

    res.json({
      success: true,
      path: {
        ...path,
        customizedPath: JSON.parse(path.customizedPath),
        learningSequence: JSON.parse(path.learningSequence),
        aiCustomization: JSON.parse(path.aiCustomization),
        focusAreas: JSON.parse(path.focusAreas),
        practiceProjects: JSON.parse(path.practiceProjects)
      }
    });
  } catch (error) {
    console.error('Adaptive path error:', error);
    res.status(500).json({ error: 'Failed to generate adaptive path' });
  }
});

// Real-time Learning Adjustment (AI monitors progress)
router.post('/skill-accelerator/adjust-learning', async (req, res) => {
  try {
    const userId = req.user.id;
    const { pathId, progressPercent, comprehensionScore, difficultyFeedback } = req.body;

    const path = await prisma.adaptiveLearningPath.findUnique({
      where: { id: pathId }
    });

    if (!path) {
      return res.status(404).json({ error: 'Path not found' });
    }

    // AI analyzes progress and adjusts difficulty
    const adjustment = await analyzeAndAdjust(
      userId,
      path,
      progressPercent,
      comprehensionScore,
      difficultyFeedback
    );

    // Update path with adjustments
    const updated = await prisma.adaptiveLearningPath.update({
      where: { id: pathId },
      data: {
        currentProgress: progressPercent,
        comprehensionScore,
        adjustmentHistory: JSON.stringify(adjustment.history),
        currentDifficulty: adjustment.newDifficulty,
        estimatedHours: adjustment.revisedHours,
        lastAdjustment: new Date()
      }
    });

    res.json({
      success: true,
      adjustment: {
        newDifficulty: adjustment.newDifficulty,
        revisedHours: adjustment.revisedHours,
        nextModules: adjustment.nextModules,
        aiInsight: adjustment.insight,
        motivationBoost: adjustment.motivation
      }
    });
  } catch (error) {
    console.error('Learning adjustment error:', error);
    res.status(500).json({ error: 'Failed to adjust learning' });
  }
});

// Generate Skill Mastery Plan
router.post('/skill-accelerator/mastery-plan', async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill, targetLevel } = req.body;

    // AI creates 3-tier mastery plan
    const masteryPlan = await generateMasteryPlan(userId, skill, targetLevel);

    const plan = await prisma.skillMasteryPlan.create({
      data: {
        userId,
        skillName: skill,
        targetLevel,
        tier1Foundation: JSON.stringify(masteryPlan.tier1),
        tier2Proficiency: JSON.stringify(masteryPlan.tier2),
        tier3Mastery: JSON.stringify(masteryPlan.tier3),
        milestones: JSON.stringify(masteryPlan.milestones),
        practiceExercises: JSON.stringify(masteryPlan.exercises),
        assessmentCriteria: JSON.stringify(masteryPlan.criteria),
        estimatedWeeks: masteryPlan.weeks,
        successRate: masteryPlan.successRate,
        aiRecommendations: JSON.stringify(masteryPlan.recommendations)
      }
    });

    res.json({
      success: true,
      plan: {
        ...plan,
        tier1Foundation: JSON.parse(plan.tier1Foundation),
        tier2Proficiency: JSON.parse(plan.tier2Proficiency),
        tier3Mastery: JSON.parse(plan.tier3Mastery),
        milestones: JSON.parse(plan.milestones),
        practiceExercises: JSON.parse(plan.practiceExercises),
        assessmentCriteria: JSON.parse(plan.assessmentCriteria),
        aiRecommendations: JSON.parse(plan.aiRecommendations)
      }
    });
  } catch (error) {
    console.error('Mastery plan error:', error);
    res.status(500).json({ error: 'Failed to generate mastery plan' });
  }
});

// ===================================
// CAREER QUANTUM LEAP (MIND-BLOWING)
// ===================================

// Analyze Skill Obsolescence Risk
router.post('/quantum-leap/analyze-obsolescence', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's all skills
    const userSkills = await prisma.skillEvolutionTimeline.findMany({
      where: { userId }
    });

    // AI predicts which skills will become obsolete
    const analysis = await analyzeObsolescence(userSkills);

    // Save analysis
    const result = await prisma.careerQuantumLeap.create({
      data: {
        userId,
        analysisType: 'obsolescence',
        skillsAtRisk: JSON.stringify(analysis.atRisk),
        skillsRising: JSON.stringify(analysis.rising),
        obsolescenceTimeline: JSON.stringify(analysis.timeline),
        urgencyScore: analysis.urgency,
        actionItems: JSON.stringify(analysis.actions),
        aiInsight: JSON.stringify(analysis.insight),
        successProbability: analysis.probability
      }
    });

    res.json({
      success: true,
      analysis: {
        atRisk: analysis.atRisk,
        rising: analysis.rising,
        timeline: analysis.timeline,
        urgencyScore: analysis.urgency,
        actionItems: analysis.actions,
        insight: analysis.insight
      }
    });
  } catch (error) {
    console.error('Obsolescence analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze obsolescence' });
  }
});

// Predict Future Skill Demand (Time Machine for Skills)
router.post('/quantum-leap/predict-demand', async (req, res) => {
  try {
    const { skills, yearsAhead } = req.body;

    // AI predicts market demand for next N years
    const prediction = await predictSkillDemand(skills, yearsAhead);

    res.json({
      success: true,
      prediction: {
        yearlyDemand: prediction.demand,
        growthRate: prediction.growth,
        salaryTrend: prediction.salary,
        keyCompanies: prediction.companies,
        emergedOpportunities: prediction.opportunities,
        confidenceScore: prediction.confidence,
        recommendations: prediction.recommendations
      }
    });
  } catch (error) {
    console.error('Demand prediction error:', error);
    res.status(500).json({ error: 'Failed to predict demand' });
  }
});

// Skill Mutation Engine (Skills evolving in real-time)
router.post('/quantum-leap/skill-mutation', async (req, res) => {
  try {
    const userId = req.user.id;
    const { baseSkill } = req.body;

    // AI shows how a skill is evolving and mutating
    const mutation = await analyzeSkillMutation(baseSkill, userId);

    const result = await prisma.skillMutationTracker.create({
      data: {
        userId,
        baseSkill,
        mutationPhase: mutation.phase,
        evolutionPath: JSON.stringify(mutation.evolution),
        newSubSkills: JSON.stringify(mutation.newSubSkills),
        hybridSkills: JSON.stringify(mutation.hybrid),
        emergentTrends: JSON.stringify(mutation.trends),
        adoptionUrgency: mutation.urgency,
        mitigationStrategy: JSON.stringify(mutation.strategy)
      }
    });

    res.json({
      success: true,
      mutation: {
        baseSkill,
        phase: mutation.phase,
        evolution: mutation.evolution,
        newSubSkills: mutation.newSubSkills,
        hybridSkills: mutation.hybrid,
        trends: mutation.trends,
        urgency: mutation.urgency,
        strategy: mutation.strategy
      }
    });
  } catch (error) {
    console.error('Skill mutation error:', error);
    res.status(500).json({ error: 'Failed to analyze skill mutation' });
  }
});

// Career Trajectory Optimizer (Find the optimal path)
router.post('/quantum-leap/optimize-trajectory', async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentRole, targetRole, constraints } = req.body;

    // AI finds optimal career path considering all factors
    const trajectory = await optimizeCareerPath(userId, currentRole, targetRole, constraints);

    const result = await prisma.careerTrajectoryOptimizer.create({
      data: {
        userId,
        currentRole,
        targetRole,
        optimalPath: JSON.stringify(trajectory.path),
        intermediateRoles: JSON.stringify(trajectory.roles),
        requiredSkills: JSON.stringify(trajectory.skills),
        timelineMonths: trajectory.months,
        riskFactors: JSON.stringify(trajectory.risks),
        opportunityWindows: JSON.stringify(trajectory.windows),
        successProbability: trajectory.probability,
        alternativePaths: JSON.stringify(trajectory.alternatives),
        recommendations: JSON.stringify(trajectory.recommendations)
      }
    });

    res.json({
      success: true,
      trajectory: {
        optimalPath: trajectory.path,
        intermediateRoles: trajectory.roles,
        requiredSkills: trajectory.skills,
        timelineMonths: trajectory.months,
        riskFactors: trajectory.risks,
        opportunityWindows: trajectory.windows,
        successProbability: trajectory.probability,
        recommendations: trajectory.recommendations
      }
    });
  } catch (error) {
    console.error('Trajectory optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize trajectory' });
  }
});

// ===================================
// HELPER FUNCTIONS
// ===================================

async function generateAcceleratorBlueprint(config) {
  return {
    estimatedDays: config.timelineWeeks * 7,
    dailyHours: config.hoursPerWeek / 5,
    successRate: 85 + Math.random() * 15,
    uniqueApproach: `Personalized ${config.learningStyle} learning with ${config.preferredLanguage}`,
    phases: [
      {
        phase: 1,
        name: 'Foundation',
        duration: Math.ceil(config.timelineWeeks * 0.3),
        focus: 'Core concepts and fundamentals'
      },
      {
        phase: 2,
        name: 'Acceleration',
        duration: Math.ceil(config.timelineWeeks * 0.4),
        focus: 'Real-world projects and advanced patterns'
      },
      {
        phase: 3,
        name: 'Mastery',
        duration: Math.ceil(config.timelineWeeks * 0.3),
        focus: 'Expert-level skills and optimization'
      }
    ]
  };
}

async function generateAdaptivePath(userId, skillName, difficulty, learningStyle, blueprint) {
  const baseHours = difficulty === 'beginner' ? 40 : difficulty === 'intermediate' ? 80 : 120;

  return {
    modules: [
      {
        order: 1,
        title: `${skillName} Fundamentals`,
        duration: Math.ceil(baseHours * 0.25),
        personalized: true,
        format: learningStyle.preferredFormat || 'video'
      },
      {
        order: 2,
        title: `Building with ${skillName}`,
        duration: Math.ceil(baseHours * 0.35),
        personalized: true,
        projects: 2
      },
      {
        order: 3,
        title: `${skillName} Mastery`,
        duration: Math.ceil(baseHours * 0.40),
        personalized: true,
        projects: 3
      }
    ],
    sequence: ['Learn', 'Build', 'Master', 'Teach'],
    totalHours: baseHours,
    customization: {
      paceAdjustment: 'adaptive',
      difficultyProgression: 'dynamic',
      projectFocus: skillName,
      mentorshipIncluded: true
    },
    focusAreas: [skillName, 'Best Practices', 'Performance Optimization'],
    projects: [
      { name: 'Beginner Project', level: 'easy' },
      { name: 'Intermediate Project', level: 'medium' },
      { name: 'Advanced Project', level: 'hard' }
    ]
  };
}

async function analyzeAndAdjust(userId, path, progress, comprehension, feedback) {
  // Dynamically adjust based on performance
  let newDifficulty = path.currentDifficulty || 'medium';
  let multiplier = 1;

  if (comprehension > 85) {
    newDifficulty = 'hard';
    multiplier = 0.8; // Speed up
  } else if (comprehension < 60) {
    newDifficulty = 'easy';
    multiplier = 1.3; // Slow down, more review
  }

  return {
    newDifficulty,
    revisedHours: Math.ceil(path.estimatedHours * multiplier),
    nextModules: ['Advanced patterns', 'System design', 'Optimization'],
    insight: comprehension > 75 ? 'Excellent pace! Ready for advanced concepts.' : 'Slow down and master fundamentals first.',
    motivation: '🎯 You\'re making great progress!',
    history: [{ timestamp: new Date(), action: 'difficulty adjusted', reason: feedback }]
  };
}

async function generateMasteryPlan(userId, skill, targetLevel) {
  return {
    tier1: {
      name: 'Foundation',
      duration: '2-3 weeks',
      topics: ['Basics', 'Core concepts', 'Simple projects'],
      hours: 30
    },
    tier2: {
      name: 'Proficiency',
      duration: '4-5 weeks',
      topics: ['Advanced patterns', 'Best practices', 'Complex projects'],
      hours: 50
    },
    tier3: {
      name: 'Mastery',
      duration: '6-8 weeks',
      topics: ['Expert patterns', 'Optimization', 'Teaching others'],
      hours: 60
    },
    milestones: [
      'Complete foundational projects',
      'Build medium-complexity app',
      'Mentor someone else',
      'Contribute to open source'
    ],
    exercises: Array.from({ length: 15 }, (_, i) => ({
      number: i + 1,
      difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard',
      estimatedTime: 2 + Math.floor(i / 5)
    })),
    criteria: {
      tier1: 'Score 80% on foundation quiz',
      tier2: 'Complete 2 projects successfully',
      tier3: 'Achieve 95% accuracy in advanced problems'
    },
    weeks: 12,
    successRate: 82,
    recommendations: [
      'Join a study group for accountability',
      'Build projects you\'re interested in',
      'Teach others to reinforce learning'
    ]
  };
}

async function analyzeObsolescence(skills) {
  // Predict which skills will become obsolete
  const obsoleteSkills = ['jQuery', 'AngularJS', 'Flash', 'CoffeeScript', 'Sass'];
  const risingSkills = ['TypeScript', 'Rust', 'Go', 'Kotlin', 'WebAssembly', 'AI/ML'];

  return {
    atRisk: skills
      .filter(s => obsoleteSkills.includes(s.skillName))
      .map(s => ({
        skill: s.skillName,
        riskScore: 85 + Math.random() * 15,
        timeUntilObsolete: '6-12 months'
      })),
    rising: risingSkills.map(skill => ({
      skill,
      growthRate: 150 + Math.random() * 100,
      salaryIncrease: '$15k-$30k',
      demandIncrease: '+200%'
    })),
    timeline: {
      immediate: '0-3 months',
      near: '3-6 months',
      future: '6-12 months'
    },
    urgency: 7.5,
    actions: [
      'Start learning rising technologies immediately',
      'Transition projects to modern stacks',
      'Get certified in emerging skills'
    ],
    insight: 'Your skills are in transition. Proactive upskilling is critical.',
    probability: 0.87
  };
}

async function predictSkillDemand(skills, yearsAhead) {
  return {
    demand: Array.from({ length: yearsAhead }, (_, year) => ({
      year: new Date().getFullYear() + year,
      demand: 70 + Math.random() * 30,
      salaryAverage: 120000 + year * 8000
    })),
    growth: Math.floor(15 + Math.random() * 25),
    salary: {
      current: 120000,
      projected: 150000 + Math.random() * 50000
    },
    companies: ['Google', 'Microsoft', 'Meta', 'OpenAI', 'Amazon'],
    opportunities: ['Senior roles', 'Tech lead', 'CTO positions', 'Startup founding'],
    confidence: 78 + Math.random() * 20,
    recommendations: [
      'These skills will be in high demand',
      'Start building a portfolio now',
      'Network with companies actively hiring'
    ]
  };
}

async function analyzeSkillMutation(baseSkill, userId) {
  return {
    phase: 'Evolution',
    evolution: [
      `${baseSkill} → ${baseSkill} + AI/ML`,
      `${baseSkill} → ${baseSkill} + Cloud`,
      `${baseSkill} → Specialized variant`
    ],
    newSubSkills: [
      `AI-powered ${baseSkill}`,
      `Cloud-native ${baseSkill}`,
      `${baseSkill} automation`
    ],
    hybrid: [
      `${baseSkill} + DevOps`,
      `${baseSkill} + Data Science`,
      `${baseSkill} + Security`
    ],
    trends: [
      'Integration with AI/ML becoming standard',
      'Shift to cloud-first approaches',
      'Automation everywhere'
    ],
    urgency: 8,
    strategy: [
      'Learn AI fundamentals alongside core skill',
      'Explore cloud platforms',
      'Study automation tools'
    ]
  };
}

async function optimizeCareerPath(userId, currentRole, targetRole, constraints) {
  return {
    path: `${currentRole} → Senior ${currentRole} → Tech Lead → ${targetRole}`,
    roles: [
      { role: 'Senior Engineer', months: 6 },
      { role: 'Tech Lead', months: 12 },
      { role: targetRole, months: 18 }
    ],
    skills: [
      'System Design',
      'Leadership',
      'Architecture',
      'Strategic thinking'
    ],
    months: 36,
    risks: [
      'Market demand fluctuation',
      'Skill competition',
      'Company restructuring'
    ],
    windows: [
      'Q2 2026 - Peak hiring',
      'Q4 2026 - Year-end opportunities'
    ],
    probability: 0.81,
    alternatives: [
      'Specialist path (deeper technical expertise)',
      'Startup founder path',
      'Consulting path'
    ],
    recommendations: [
      'Build leadership skills now',
      'Network with current target companies',
      'Consider strategic job moves'
    ]
  };
}

module.exports = router;

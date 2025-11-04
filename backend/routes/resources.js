/**
 * Resources Routes - ULTIMATE FEATURES
 * Complete backend API for all 10 world-class features:
 * 1. Learning Paths, 2. Code Editor, 3. Mock Interviews, 4. Resume AI,
 * 5. Company DB, 6. DSA Tracker, 7. System Design, 8. Behavioral Coach,
 * 9. Salary Tool, 10. Resource Library
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

// Import all services
const LearningPathService = require('../services/learningPathService');
const CodeEditorService = require('../services/codeEditorService');
const MockInterviewService = require('../services/mockInterviewService');
const ResumeAIService = require('../services/resumeAIService');
const CompanyInterviewService = require('../services/companyInterviewService');
const DSATrackerService = require('../services/dsaTrackerService');
const SystemDesignService = require('../services/systemDesignService');
const BehavioralCoachService = require('../services/behavioralCoachService');
const SalaryNegotiationService = require('../services/salaryNegotiationService');
const ResourceLibraryService = require('../services/resourceLibraryService');

// ==================== FEATURE 1: LEARNING PATHS ====================

router.get('/learning-path', authMiddleware, async (req, res) => {
  try {
    const { targetRole, experienceLevel = 'intermediate' } = req.query;
    const currentSkills = req.query.skills ? req.query.skills.split(',') : [];

    if (!targetRole) {
      return res.status(400).json({ success: false, error: 'targetRole is required' });
    }

    const result = await LearningPathService.generateLearningPath(
      req.userId || req.user?.id || 'anonymous',
      targetRole,
      currentSkills,
      experienceLevel
    );

    // Standardize response format for frontend
    if (result.success) {
      res.json({
        success: true,
        data: result.path || result,
        path: result.path,
        phases: result.phases || result.path?.phases || []
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Learning path error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/learning-path/milestones', authMiddleware, async (req, res) => {
  try {
    const { targetRole = 'Backend Developer' } = req.query;
    const result = await LearningPathService.getLearningMilestones(targetRole);
    
    // Standardize response
    if (result.success) {
      res.json({
        success: true,
        data: result.milestones || [],
        milestones: result.milestones || []
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Milestones error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/learning-path/resources', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty = 'Medium' } = req.query;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'topic is required' });
    }

    const result = await LearningPathService.getResourcesForTopic(topic, difficulty);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: AI-powered learning resources with experience level
router.get('/learning-resources', authMiddleware, async (req, res) => {
  try {
    const { topic, experienceLevel = 'intermediate', targetRole = 'Software Developer' } = req.query;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'topic is required' });
    }

    const result = await LearningPathService.getAILearningResources(topic, experienceLevel, targetRole);
    res.json(result);
  } catch (error) {
    console.error('Learning resources error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Save learning path
router.post('/learning-path/save', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { name, targetRole, experienceLevel, currentSkills, pathData, completedTopics, progressPercent, savedResources } = req.body;

    if (!targetRole || !pathData) {
      return res.status(400).json({ success: false, error: 'targetRole and pathData are required' });
    }

    const totalPhases = pathData.phases?.length || 0;
    const totalHours = pathData.totalEstimatedHours || 0;
    const estimatedWeeks = pathData.totalDuration || '';

    const savedPath = await prisma.savedLearningPath.create({
      data: {
        userId,
        name: name || `${targetRole} Path`,
        targetRole,
        experienceLevel: experienceLevel || 'intermediate',
        currentSkills: JSON.stringify(currentSkills || []),
        pathData: JSON.stringify(pathData),
        completedTopics: JSON.stringify(completedTopics || []),
        savedResources: JSON.stringify(savedResources || {}), // Save the resources
        progressPercent: progressPercent || 0,
        totalPhases,
        totalHours,
        estimatedWeeks,
        lastAccessedAt: new Date()
      }
    });

    res.json({ success: true, savedPath });
  } catch (error) {
    console.error('Save learning path error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Get all saved learning paths for user
router.get('/learning-path/saved', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    const savedPaths = await prisma.savedLearningPath.findMany({
      where: { userId },
      orderBy: { lastAccessedAt: 'desc' }
    });

    // Parse JSON fields
    const parsedPaths = savedPaths.map(path => ({
      ...path,
      pathData: JSON.parse(path.pathData),
      currentSkills: JSON.parse(path.currentSkills || '[]'),
      completedTopics: JSON.parse(path.completedTopics || '[]'),
      savedResources: JSON.parse(path.savedResources || '{}') // Parse saved resources
    }));

    res.json({ success: true, savedPaths: parsedPaths });
  } catch (error) {
    console.error('Get saved paths error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Update learning path progress
router.patch('/learning-path/progress/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { id } = req.params;
    const { completedTopics, progressPercent } = req.body;

    const updatedPath = await prisma.savedLearningPath.update({
      where: { 
        id,
        userId // Ensure user owns this path
      },
      data: {
        completedTopics: JSON.stringify(completedTopics),
        progressPercent,
        lastAccessedAt: new Date()
      }
    });

    res.json({ success: true, updatedPath });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEW: Delete saved learning path
router.delete('/learning-path/saved/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const { id } = req.params;

    await prisma.savedLearningPath.delete({
      where: { 
        id,
        userId
      }
    });

    res.json({ success: true, message: 'Learning path deleted successfully' });
  } catch (error) {
    console.error('Delete path error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 2: CODE EDITOR ====================

router.get('/code-editor/problems', authMiddleware, async (req, res) => {
  try {
    const filters = {
      difficulty: req.query.difficulty,
      topic: req.query.topic,
      company: req.query.company,
      search: req.query.search
    };

    const result = await CodeEditorService.getAllProblems(filters);
    
    // Standardize response format
    if (result.success) {
      res.json({
        success: true,
        data: result.problems || [],
        problems: result.problems || [],
        count: result.count || 0
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/code-editor/problem/:problemId', authMiddleware, async (req, res) => {
  try {
    const result = await CodeEditorService.getProblem(req.params.problemId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/code-editor/problems/difficulty/:difficulty', authMiddleware, async (req, res) => {
  try {
    const result = await CodeEditorService.getProblemsByDifficulty(req.params.difficulty);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/code-editor/problems/topic/:topic', authMiddleware, async (req, res) => {
  try {
    const result = await CodeEditorService.getProblemsByTopic(req.params.topic);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/code-editor/execute', authMiddleware, async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, error: 'code and language required' });
    }

    const result = await CodeEditorService.executeCode(code, language, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/code-editor/statistics', authMiddleware, async (req, res) => {
  try {
    const result = await CodeEditorService.getProblemStatistics();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 3: MOCK INTERVIEWS ====================

router.post('/mock-interview/start', authMiddleware, async (req, res) => {
  try {
    const { interviewType, role, difficulty, duration = 60 } = req.body;

    if (!interviewType || !role || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'interviewType, role, and difficulty are required'
      });
    }

    const result = await MockInterviewService.startMockInterview(
      req.userId || req.user?.id || 'anonymous',
      interviewType,
      role,
      difficulty,
      duration
    );

    console.log('Mock interview result:', result);

    // Standardize response
    if (result.success) {
      res.json({
        success: true,
        data: result.session || result.data || result,
        session: result.session || result.data,
        sessionId: result.sessionId || result.session?.sessionId
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Mock interview start error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/mock-interview/:sessionId/submit', authMiddleware, async (req, res) => {
  try {
    const { questionNumber, response } = req.body;

    if (!questionNumber || !response) {
      return res.status(400).json({
        success: false,
        error: 'questionNumber and response are required'
      });
    }

    const result = await MockInterviewService.submitResponse(
      req.params.sessionId,
      questionNumber,
      response
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/mock-interview/:sessionId/end', authMiddleware, async (req, res) => {
  try {
    const { session } = req.body;

    const result = await MockInterviewService.endInterviewSession(
      req.params.sessionId,
      session
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/mock-interview/next-question', authMiddleware, async (req, res) => {
  try {
    const { interviewType, role, difficulty } = req.query;

    const result = await MockInterviewService.getNextQuestion(
      null,
      interviewType,
      role,
      difficulty
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 4: RESUME & COVER LETTER AI ====================

router.post('/resume/generate', authMiddleware, async (req, res) => {
  try {
    const { userProfile, targetRole, targetCompany } = req.body;

    if (!userProfile || !targetRole) {
      return res.status(400).json({
        success: false,
        error: 'userProfile and targetRole are required'
      });
    }

    const result = await ResumeAIService.generateOptimizedResume(
      userProfile,
      targetRole,
      targetCompany
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/cover-letter/generate', authMiddleware, async (req, res) => {
  try {
    const { userProfile, targetRole, targetCompany, jobDescription } = req.body;

    if (!userProfile || !targetRole || !targetCompany) {
      return res.status(400).json({
        success: false,
        error: 'userProfile, targetRole, and targetCompany are required'
      });
    }

    const result = await ResumeAIService.generateCoverLetter(
      userProfile,
      targetRole,
      targetCompany,
      jobDescription
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/resume/optimize-ats', authMiddleware, async (req, res) => {
  try {
    const { resume } = req.body;

    if (!resume) {
      return res.status(400).json({ success: false, error: 'resume is required' });
    }

    const result = await ResumeAIService.optimizeForATS(resume);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/resume/templates', authMiddleware, async (req, res) => {
  try {
    const result = await ResumeAIService.getResumeTemplates();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/resume/parse', authMiddleware, async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, error: 'resumeText is required' });
    }

    const result = await ResumeAIService.parseResumeText(resumeText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 5: COMPANY INTERVIEW DATABASE ====================

router.get('/company/:company', authMiddleware, async (req, res) => {
  try {
    const result = await CompanyInterviewService.getCompanyDetails(req.params.company);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/company/:company/questions', authMiddleware, async (req, res) => {
  try {
    const filters = { difficulty: req.query.difficulty };
    const result = await CompanyInterviewService.getInterviewQuestions(
      req.params.company,
      filters
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/company/:company/insights', authMiddleware, async (req, res) => {
  try {
    const result = await CompanyInterviewService.getInterviewInsights(req.params.company);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/company/:company/roadmap', authMiddleware, async (req, res) => {
  try {
    const { weeks = 4 } = req.query;
    const result = await CompanyInterviewService.getPreparationRoadmap(
      req.params.company,
      parseInt(weeks)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/companies', authMiddleware, async (req, res) => {
  try {
    const result = await CompanyInterviewService.getAllCompanies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 6: DSA TRACKER ====================

router.post('/dsa/track', authMiddleware, async (req, res) => {
  try {
    const { problemId, problemData, result } = req.body;

    if (!problemId || !problemData || !result) {
      return res.status(400).json({
        success: false,
        error: 'problemId, problemData, and result are required'
      });
    }

    const trackResult = await DSATrackerService.logProblemAttempt(
      req.user.id,
      problemId,
      problemData,
      result
    );

    res.json(trackResult);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dsa/progress', authMiddleware, async (req, res) => {
  try {
    const result = await DSATrackerService.getUserProgressSummary(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dsa/mastery', authMiddleware, async (req, res) => {
  try {
    const result = await DSATrackerService.getTopicMastery(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dsa/next-problem', authMiddleware, async (req, res) => {
  try {
    const result = await DSATrackerService.getNextRecommendedProblem(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dsa/complexity/:problemId', authMiddleware, async (req, res) => {
  try {
    const result = await DSATrackerService.getComplexityAnalysis(req.params.problemId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dsa/progression', authMiddleware, async (req, res) => {
  try {
    const result = await DSATrackerService.getDifficultyProgression();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 7: SYSTEM DESIGN ====================

router.get('/system-design/cases', authMiddleware, async (req, res) => {
  try {
    const result = await SystemDesignService.getAllCaseStudies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/system-design/case/:caseId', authMiddleware, async (req, res) => {
  try {
    const result = await SystemDesignService.getCaseStudy(req.params.caseId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/system-design/patterns/:systemType', authMiddleware, async (req, res) => {
  try {
    const result = await SystemDesignService.getDesignPatterns(req.params.systemType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/system-design/analyze-tradeoffs', authMiddleware, async (req, res) => {
  try {
    const { component, option1, option2 } = req.body;

    if (!component || !option1 || !option2) {
      return res.status(400).json({
        success: false,
        error: 'component, option1, and option2 are required'
      });
    }

    const result = await SystemDesignService.analyzeTradeoffs(component, option1, option2);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/system-design/diagram/:systemType', authMiddleware, async (req, res) => {
  try {
    const result = await SystemDesignService.getArchitectureDiagram(req.params.systemType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/system-design/scalability/:systemType', authMiddleware, async (req, res) => {
  try {
    const result = await SystemDesignService.getScalabilityStrategies(req.params.systemType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 8: BEHAVIORAL COACH ====================

router.get('/behavioral/star-method', authMiddleware, async (req, res) => {
  try {
    const result = await BehavioralCoachService.learnSTARMethod();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/behavioral/questions', authMiddleware, async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      difficulty: req.query.difficulty,
      company: req.query.company
    };

    const result = await BehavioralCoachService.getBehavioralQuestions(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/behavioral/evaluate', authMiddleware, async (req, res) => {
  try {
    const { question, response } = req.body;

    if (!question || !response) {
      return res.status(400).json({
        success: false,
        error: 'question and response are required'
      });
    }

    const result = await BehavioralCoachService.evaluateBehavioralResponse(question, response);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/behavioral/stories/:category', authMiddleware, async (req, res) => {
  try {
    const result = await BehavioralCoachService.getSuccessStories(req.params.category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/behavioral/practice', authMiddleware, async (req, res) => {
  try {
    const { difficulty = 'Medium' } = req.body;
    const result = await BehavioralCoachService.practiceBehavioralInterview(difficulty);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/behavioral/categories', authMiddleware, async (req, res) => {
  try {
    const result = await BehavioralCoachService.getQuestionCategories();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 9: SALARY & NEGOTIATION ====================

router.get('/salary', authMiddleware, async (req, res) => {
  try {
    const { role, experience, location = 'US' } = req.query;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        error: 'role and experience are required'
      });
    }

    const result = await SalaryNegotiationService.getSalaryRange(role, experience, location);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/salary/compare', authMiddleware, async (req, res) => {
  try {
    const { role, experience, companies } = req.body;

    if (!role || !experience || !companies) {
      return res.status(400).json({
        success: false,
        error: 'role, experience, and companies are required'
      });
    }

    const result = await SalaryNegotiationService.compareSalaries(
      role,
      experience,
      companies
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/salary/negotiation-script', authMiddleware, async (req, res) => {
  try {
    const { scenario, offerAmount, marketRate } = req.body;

    if (!scenario || !offerAmount || !marketRate) {
      return res.status(400).json({
        success: false,
        error: 'scenario, offerAmount, and marketRate are required'
      });
    }

    const result = await SalaryNegotiationService.getNegotiationScript(
      scenario,
      offerAmount,
      marketRate
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/salary/benefits-calculator', authMiddleware, async (req, res) => {
  try {
    const { baseSalary, benefits } = req.body;

    if (!baseSalary || !benefits) {
      return res.status(400).json({
        success: false,
        error: 'baseSalary and benefits are required'
      });
    }

    const result = await SalaryNegotiationService.benefitsCalculator(baseSalary, benefits);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/salary/market-insights', authMiddleware, async (req, res) => {
  try {
    const { role, experience } = req.query;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        error: 'role and experience are required'
      });
    }

    const result = await SalaryNegotiationService.getMarketInsights(role, experience);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FEATURE 10: RESOURCE LIBRARY ====================

router.get('/library/search', authMiddleware, async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, error: 'query is required' });
    }

    const result = await ResourceLibraryService.searchResources(query, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/topic/:topic', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getResourcesByTopic(req.params.topic);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/difficulty/:difficulty', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getResourcesByDifficulty(req.params.difficulty);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/trending', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getTrendingResources();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/topics', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getAllTopics();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/type/:type', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getResourcesByType(req.params.type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/collections', authMiddleware, async (req, res) => {
  try {
    const result = await ResourceLibraryService.getCuratedCollections();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/library/learning-path', authMiddleware, async (req, res) => {
  try {
    const { role, level = 'beginner' } = req.query;

    if (!role) {
      return res.status(400).json({ success: false, error: 'role is required' });
    }

    const result = await ResourceLibraryService.getRecommendedLearningPath(role, level);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLER ====================

router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Resources endpoint not found',
    availableEndpoints: {
      learningPaths: 'GET /api/resources/learning-path',
      codeEditor: 'GET /api/resources/code-editor/problems',
      mockInterview: 'POST /api/resources/mock-interview/start',
      resumeAI: 'POST /api/resources/resume/generate',
      companyDB: 'GET /api/resources/company/:company',
      dsaTracker: 'GET /api/resources/dsa/progress',
      systemDesign: 'GET /api/resources/system-design/cases',
      behavioralCoach: 'GET /api/resources/behavioral/questions',
      salaryTool: 'GET /api/resources/salary',
      resourceLibrary: 'GET /api/resources/library/search'
    }
  });
});

module.exports = router;

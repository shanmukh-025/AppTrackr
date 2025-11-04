/**
 * DSA Questions Routes with AI Suggestions
 * Endpoints for fetching DSA questions from multiple sources:
 * - Popular sheets (Striver SDE, Love Babbar 450)
 * - Company-specific questions
 * - AI-ranked questions
 * - Google Drive integration
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const DSAQuestionsDatabase = require('../services/dsaQuestionsDatabase');
const AIQuestionService = require('../services/aiQuestionService');
const GoogleDriveService = require('../services/googleDriveService');

// ========== TOP REPEATED QUESTIONS ==========

/**
 * GET /api/dsa/top-repeated
 * Get most repeated questions across all sheets
 * Query: ?limit=20
 */
router.get('/top-repeated', authMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const topQuestions = DSAQuestionsDatabase.getTopRepeatedQuestions(limit);

    res.json({
      success: true,
      message: 'Top repeated questions from popular sheets',
      count: topQuestions.length,
      source: 'Striver SDE Sheet + Love Babbar 450 + LeetCode Top',
      data: topQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== COMPANY-SPECIFIC QUESTIONS ==========

/**
 * GET /api/dsa/company/:company
 * Get DSA questions for specific company with AI ranking
 * Uses:
 * 1. Built-in database (frequency-based)
 * 2. Google Drive data if available
 * 3. AI suggestions
 */
router.get('/company/:company', authMiddleware, async (req, res) => {
  try {
    const companyName = decodeURIComponent(req.params.company);

    // Get questions from built-in database
    const builtinQuestions = DSAQuestionsDatabase.getQuestionsForCompany(companyName);

    if (builtinQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No questions found for ${companyName}`,
        suggestion: 'Try: Google, Amazon, Microsoft, Apple, Meta, etc.',
        availableCompanies: [
          'Google',
          'Amazon',
          'Microsoft',
          'Apple',
          'Meta',
          'Bloomberg',
          'Uber',
        ],
      });
    }

    // Try to merge with Google Drive data if available
    const mergedResult = await GoogleDriveService.mergeWithBuiltinDatabase(
      companyName,
      builtinQuestions
    );

    // Get AI ranking
    const rankedResult = await AIQuestionService.rankQuestionsForCompany(companyName, DSAQuestionsDatabase);

    res.json({
      success: true,
      company: companyName,
      timestamp: new Date().toISOString(),
      source: mergedResult.source,
      totalQuestions: mergedResult.questions.length,
      ranking: rankedResult,
      topQuestions: mergedResult.questions.slice(0, 20),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== QUESTION FREQUENCY ANALYSIS ==========

/**
 * GET /api/dsa/question/:questionId/analysis
 * Get AI analysis of why this question is frequently asked
 */
router.get('/question/:questionId/analysis', authMiddleware, async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const allQuestions = DSAQuestionsDatabase.getAllQuestions();
    const question = allQuestions[questionId];

    if (!question) {
      return res.status(404).json({
        success: false,
        error: `Question not found: ${questionId}`,
      });
    }

    // Get AI analysis
    const analysis = await AIQuestionService.getQuestionFrequencyAnalysis(question);
    const approach = await AIQuestionService.getSolvingApproach(question);

    res.json({
      success: true,
      question: {
        id: question.id,
        title: question.title,
        difficulty: question.difficulty,
        frequency: question.frequency,
        companies: question.companies,
      },
      analysis: analysis.analysis,
      approach: approach.approach,
      aiSource: analysis.source,
      url: question.url,
      complexity: {
        time: question.timeComplexity,
        space: question.spaceComplexity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== INTERVIEW PREP ROADMAP ==========

/**
 * POST /api/dsa/generate-roadmap
 * Generate personalized interview prep roadmap
 * Body: { company, difficulty: 'easy|medium|hard|comprehensive', durationWeeks: number }
 */
router.post('/generate-roadmap', authMiddleware, async (req, res) => {
  try {
    const { company, difficulty = 'comprehensive', durationWeeks = 4 } = req.body;

    if (!company || !durationWeeks) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: company, durationWeeks',
      });
    }

    const roadmap = await AIQuestionService.generateInterviewRoadmap(
      company,
      difficulty,
      durationWeeks,
      DSAQuestionsDatabase
    );

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== QUESTIONS BY DIFFICULTY ==========

/**
 * GET /api/dsa/by-difficulty/:difficulty
 * Get questions by difficulty level
 * Params: easy, medium, hard
 */
router.get('/by-difficulty/:difficulty', authMiddleware, (req, res) => {
  try {
    const difficulty = req.params.difficulty.toLowerCase();

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: 'Difficulty must be: easy, medium, or hard',
      });
    }

    const questions = DSAQuestionsDatabase.getQuestionsByDifficulty(difficulty);

    res.json({
      success: true,
      difficulty,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== QUESTIONS BY TOPIC ==========

/**
 * GET /api/dsa/by-topic/:topic
 * Get questions by topic
 * Examples: Array, Tree, LinkedList, DynamicProgramming, etc.
 */
router.get('/by-topic/:topic', authMiddleware, (req, res) => {
  try {
    const topic = decodeURIComponent(req.params.topic);
    const questions = DSAQuestionsDatabase.getQuestionsByTopic(topic);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No questions found for topic: ${topic}`,
        availableTopics: [
          'Array',
          'String',
          'Tree',
          'Linked List',
          'Graph',
          'Hash Table',
          'Stack',
          'Queue',
          'Dynamic Programming',
          'Heap',
        ],
      });
    }

    res.json({
      success: true,
      topic,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== SEARCH QUESTIONS ==========

/**
 * GET /api/dsa/search
 * Search questions by keyword
 * Query: ?q=keyword
 */
router.get('/search', authMiddleware, (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters',
      });
    }

    const results = DSAQuestionsDatabase.searchQuestions(keyword);

    res.json({
      success: true,
      keyword,
      count: results.length,
      data: results.slice(0, 20), // Limit to 20 results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== DATABASE STATISTICS ==========

/**
 * GET /api/dsa/statistics
 * Get statistics about the database
 */
router.get('/statistics', authMiddleware, (req, res) => {
  try {
    const stats = DSAQuestionsDatabase.getStatistics();

    res.json({
      success: true,
      statistics: stats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== INTERVIEW PREP PATH ==========

/**
 * GET /api/dsa/interview-path
 * Get interview prep path (easy -> medium -> hard progression)
 * Query: ?company=optional
 */
router.get('/interview-path', authMiddleware, (req, res) => {
  try {
    const company = req.query.company;
    const path = DSAQuestionsDatabase.getInterviewPrepPath(company);

    res.json({
      success: true,
      company: company || 'General',
      path,
      totalQuestions: path.easy.length + path.medium.length + path.hard.length,
      recommendation: `Start with ${path.easy.length} easy questions, then ${path.medium.length} medium, then ${path.hard.length} hard.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== GOOGLE DRIVE INTEGRATION ==========

/**
 * GET /api/dsa/google-drive/companies
 * List all companies available from Google Drive
 */
router.get('/google-drive/companies', authMiddleware, async (req, res) => {
  try {
    const companies = await GoogleDriveService.getAllCompaniesFromDrive();

    res.json({
      success: true,
      message: 'Companies from Google Drive',
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/dsa/google-drive/refresh
 * Force refresh Google Drive cache for a company
 * Body: { fileId?: optional specific file }
 */
router.post('/google-drive/refresh', authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.body;
    const result = await GoogleDriveService.clearCache(fileId);

    res.json({
      success: result.success,
      message: result.message || result.error,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========== ERROR HANDLERS ==========

router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'DSA questions endpoint not found',
    availableEndpoints: [
      'GET /api/dsa/top-repeated',
      'GET /api/dsa/company/:company',
      'GET /api/dsa/question/:questionId/analysis',
      'POST /api/dsa/generate-roadmap',
      'GET /api/dsa/by-difficulty/:difficulty',
      'GET /api/dsa/by-topic/:topic',
      'GET /api/dsa/search?q=keyword',
      'GET /api/dsa/statistics',
      'GET /api/dsa/interview-path',
      'GET /api/dsa/google-drive/companies',
      'POST /api/dsa/google-drive/refresh',
    ],
  });
});

module.exports = router;

/**
 * AI Question Ranking Service
 * Uses Claude API to:
 * 1. Identify most repeated questions across sheets
 * 2. Provide reasoning for why each question is frequently asked
 * 3. Suggest personalized question list based on company and difficulty
 * 4. Generate tips and explanations for solving each question
 */

const axios = require('axios');

class AIQuestionService {
  static CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  static CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';
  static CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

  /**
   * Analyze why a question is frequently asked
   * Returns AI-generated reasoning
   */
  static async getQuestionFrequencyAnalysis(question) {
    if (!this.CLAUDE_API_KEY) {
      console.warn('⚠️  Claude API key not found. Using fallback analysis.');
      return this.getFallbackFrequencyAnalysis(question);
    }

    try {
      const prompt = `
Analyze why this DSA question is frequently asked in tech interviews:

Question: ${question.title}
Description: ${question.description}
Difficulty: ${question.difficulty}
Asked by companies: ${question.companies.join(', ')}
Topics: ${question.topics.join(', ')}
Frequency: Asked by ${question.frequency}% of companies

Provide a brief 2-3 sentence analysis explaining:
1. Why this question is important for interview preparation
2. What core concepts it tests
3. Why major tech companies frequently ask it

Keep it concise and actionable.`;

      const response = await axios.post(
        this.CLAUDE_API_URL,
        {
          model: this.CLAUDE_MODEL,
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      return {
        success: true,
        analysis: response.data.content[0].text,
        source: 'Claude AI',
      };
    } catch (error) {
      console.error('❌ Claude API error:', error.message);
      return this.getFallbackFrequencyAnalysis(question);
    }
  }

  /**
   * Fallback analysis when API is not available
   */
  static getFallbackFrequencyAnalysis(question) {
    const analysisMap = {
      'two-sum': 'This is the most fundamental problem testing hash table knowledge. It teaches the critical optimization technique of trading space for time. Asked by almost all tech companies as a warm-up or baseline question.',
      'contains-duplicate': 'Tests understanding of hash sets and collision handling. It\'s a quick problem used to assess coding speed and basic data structure knowledge in interviews.',
      'reverse-linked-list': 'Core linked list operation that tests pointer manipulation. Essential foundation for complex linked list problems. Every company asks linked list variations.',
      'lru-cache': 'Tests design skills, data structure knowledge (hash map + doubly linked list), and optimization thinking. Highly valued by FAANG companies for senior positions.',
      'number-of-islands': 'Classic graph traversal problem (DFS/BFS/Union-Find). Tests multiple approaches to same problem. Frequently modified for follow-ups, making it highly valuable.',
      'longest-substring-without-repeating': 'Teaches the important sliding window technique. Tests hash table usage and optimization thinking. Used across multiple companies.',
      'coin-change': 'Perfect introduction to DP problems. Tests bottom-up approach and space optimization. Helps assess DP fundamentals across companies.',
    };

    const defaultAnalysis =
      `This problem is frequently asked because it tests ${question.topics[0] || 'core DSA'} concepts that are fundamental to solving complex problems. Companies use it to assess your problem-solving approach and coding efficiency.`;

    return {
      success: true,
      analysis: analysisMap[question.id] || defaultAnalysis,
      source: 'Fallback Analysis',
    };
  }

  /**
   * Generate solving tips and approach for a question
   */
  static async getSolvingApproach(question) {
    if (!this.CLAUDE_API_KEY) {
      return this.getFallbackSolvingApproach(question);
    }

    try {
      const prompt = `
You are an expert coding interviewer. Provide a concise solving approach for this problem.

Problem: ${question.title}
Description: ${question.description}

Provide:
1. Key insight (1 sentence)
2. Approach (2-3 sentences)
3. Data structure to use
4. Time & Space complexity

Format as bullet points. Be concise.`;

      const response = await axios.post(
        this.CLAUDE_API_URL,
        {
          model: this.CLAUDE_MODEL,
          max_tokens: 400,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
          },
        }
      );

      return {
        success: true,
        approach: response.data.content[0].text,
        source: 'Claude AI',
      };
    } catch (error) {
      console.error('❌ Claude API error:', error.message);
      return this.getFallbackSolvingApproach(question);
    }
  }

  /**
   * Fallback approach
   */
  static getFallbackSolvingApproach(question) {
    const approachMap = {
      'two-sum': `
• Key Insight: Use hash map to store seen numbers for O(1) lookup
• Approach: Iterate through array, for each number check if (target - current) exists in hash map
• Data Structure: Hash Map (Map/Object)
• Complexity: O(n) time, O(n) space`,
      'lru-cache': `
• Key Insight: Combine hash map with doubly linked list for O(1) access and modification
• Approach: Use hash map for quick access, linked list for LRU ordering
• Data Structure: Hash Map + Doubly Linked List
• Complexity: O(1) time for both get and put, O(capacity) space`,
    };

    return {
      success: true,
      approach: approachMap[question.id] || `Study time and space complexity: ${question.timeComplexity} / ${question.spaceComplexity}. Focus on ${question.topics[0] || 'core concepts'}.`,
      source: 'Fallback Approach',
    };
  }

  /**
   * Rank questions for a specific company
   * Uses frequency data + AI reasoning
   */
  static async rankQuestionsForCompany(companyName, dsaDatabase) {
    const companyQuestions = dsaDatabase.getQuestionsForCompany(companyName);

    if (companyQuestions.length === 0) {
      return {
        success: false,
        message: `No specific questions found for ${companyName}. Try: Google, Amazon, Microsoft, etc.`,
        topGeneral: dsaDatabase.getTopRepeatedQuestions(10),
      };
    }

    // Sort by frequency and return top 15
    const topQuestions = companyQuestions.slice(0, 15).map(q => ({
      ...q,
      frequencyPercentage: `${q.frequency}%`,
      importance: this.getImportanceLevel(q.frequency),
      tags: q.topics.slice(0, 3),
    }));

    return {
      success: true,
      company: companyName,
      totalQuestionsForCompany: companyQuestions.length,
      topQuestions,
      breakdown: {
        easy: companyQuestions.filter(q => q.difficulty === 'easy').length,
        medium: companyQuestions.filter(q => q.difficulty === 'medium').length,
        hard: companyQuestions.filter(q => q.difficulty === 'hard').length,
      },
      recommendation: `Focus on the top 10 questions first. They represent ${companyQuestions
        .slice(0, 10)
        .reduce((sum, q) => sum + q.frequency, 0) / 10} average frequency across this company's interviews.`,
    };
  }

  /**
   * Get importance level based on frequency
   */
  static getImportanceLevel(frequency) {
    if (frequency >= 90) return '🔴 CRITICAL';
    if (frequency >= 75) return '🟠 VERY HIGH';
    if (frequency >= 60) return '🟡 HIGH';
    return '🟢 MEDIUM';
  }

  /**
   * Generate personalized interview prep roadmap
   */
  static async generateInterviewRoadmap(companyName, difficulty, durationWeeks, dsaDatabase) {
    const questions = dsaDatabase.getInterviewPrepPath(companyName);

    // Filter by difficulty if specified
    let prepQuestions = [];
    if (difficulty === 'comprehensive') {
      prepQuestions = [...questions.easy, ...questions.medium, ...questions.hard];
    } else {
      prepQuestions = questions[difficulty.toLowerCase()] || [];
    }

    const questionsPerWeek = Math.ceil(prepQuestions.length / durationWeeks);
    const roadmap = [];

    for (let week = 1; week <= durationWeeks; week++) {
      const start = (week - 1) * questionsPerWeek;
      const end = start + questionsPerWeek;
      const weekQuestions = prepQuestions.slice(start, end);

      roadmap.push({
        week,
        targetQuestions: weekQuestions.length,
        questions: weekQuestions.map(q => ({
          title: q.title,
          difficulty: q.difficulty,
          url: q.url,
        })),
        focusArea: this.getWeekFocus(week, durationWeeks),
      });
    }

    return {
      success: true,
      company: companyName,
      durationWeeks,
      difficulty,
      questionsPerWeek,
      totalQuestions: prepQuestions.length,
      roadmap,
      tips: [
        '⏱️ Spend 30 mins per problem initially, aim for 15 mins by the end',
        '📝 Focus on explaining your approach out loud',
        '🔄 Review and redo problems every 2 weeks',
        '💡 Understand patterns, not just solutions',
      ],
    };
  }

  /**
   * Get focus area for each week
   */
  static getWeekFocus(week, totalWeeks) {
    if (week <= totalWeeks / 3) return '🟢 Foundation - Easy Problems';
    if (week <= (2 * totalWeeks) / 3) return '🟡 Intermediate - Medium Problems';
    return '🔴 Advanced - Hard Problems & Patterns';
  }

  /**
   * Batch analyze multiple questions
   * Used for company interview prep page
   */
  static async analyzeQuestionsForDisplay(questions) {
    // Return questions with basic analysis (don't call API for every question)
    return questions.map(q => ({
      ...q,
      importance: this.getImportanceLevel(q.frequency),
      keyTopic: q.topics[0],
      quickTip: `Focus on ${q.topics[0]} and aim for ${q.timeComplexity} solution`,
    }));
  }
}

module.exports = AIQuestionService;

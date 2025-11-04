/**
 * DSA Tracker Service
 * Tracks DSA problem-solving progress with difficulty progression
 * Maintains topic mastery and provides complexity guidance
 */

class DSATrackerService {
  constructor() {
    this.problemStats = {};
    this.topicMastery = {};
    this.userProgress = {};
  }

  /**
   * Initialize user DSA tracking
   */
  async initializeUserTracking(userId) {
    try {
      this.userProgress[userId] = {
        totalProblems: 0,
        solvedProblems: 0,
        attemptedProblems: 0,
        topics: {},
        difficulty: {
          easy: { total: 0, solved: 0 },
          medium: { total: 0, solved: 0 },
          hard: { total: 0, solved: 0 }
        },
        streaks: { current: 0, longest: 0 },
        lastActivity: null
      };

      return {
        success: true,
        message: 'User tracking initialized',
        userId
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Log problem attempt
   */
  async logProblemAttempt(userId, problemId, problemData, result) {
    try {
      if (!this.userProgress[userId]) {
        await this.initializeUserTracking(userId);
      }

      const userProgress = this.userProgress[userId];
      const { difficulty, topic, title } = problemData;

      // Update tracking
      if (!userProgress.topics[topic]) {
        userProgress.topics[topic] = { total: 0, solved: 0, problems: [] };
      }

      userProgress.topics[topic].total += 1;
      userProgress.difficulty[difficulty.toLowerCase()].total += 1;
      userProgress.totalProblems += 1;
      userProgress.attemptedProblems += 1;

      // If solved
      if (result.status === 'Accepted') {
        userProgress.topics[topic].solved += 1;
        userProgress.difficulty[difficulty.toLowerCase()].solved += 1;
        userProgress.solvedProblems += 1;
        userProgress.streaks.current += 1;
        if (userProgress.streaks.current > userProgress.streaks.longest) {
          userProgress.streaks.longest = userProgress.streaks.current;
        }
      } else {
        userProgress.streaks.current = 0;
      }

      userProgress.lastActivity = new Date();

      return {
        success: true,
        message: 'Problem attempt logged',
        updated: true,
        stats: this.calculateStats(userProgress)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate user statistics
   */
  calculateStats(userProgress) {
    const totalSolved = userProgress.solvedProblems;
    const totalAttempted = userProgress.attemptedProblems;
    const successRate = totalAttempted > 0 ? ((totalSolved / totalAttempted) * 100).toFixed(1) : 0;

    return {
      totalSolved,
      totalAttempted,
      successRate: `${successRate}%`,
      streak: userProgress.streaks.current,
      longestStreak: userProgress.streaks.longest,
      difficultyBreakdown: {
        easy: `${userProgress.difficulty.easy.solved}/${userProgress.difficulty.easy.total}`,
        medium: `${userProgress.difficulty.medium.solved}/${userProgress.difficulty.medium.total}`,
        hard: `${userProgress.difficulty.hard.solved}/${userProgress.difficulty.hard.total}`
      }
    };
  }

  /**
   * Get topic mastery
   */
  async getTopicMastery(userId) {
    try {
      if (!this.userProgress[userId]) {
        return { success: false, error: 'User not found' };
      }

      const topics = this.userProgress[userId].topics;
      const mastery = {};

      for (const [topic, data] of Object.entries(topics)) {
        const percentage = data.total > 0 ? ((data.solved / data.total) * 100).toFixed(1) : 0;
        mastery[topic] = {
          solved: data.solved,
          total: data.total,
          percentage: `${percentage}%`,
          level: this.getMasteryLevel(percentage)
        };
      }

      return {
        success: true,
        userId,
        mastery
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Determine mastery level based on percentage
   */
  getMasteryLevel(percentage) {
    const percent = parseFloat(percentage);
    if (percent === 0) return 'Not Started';
    if (percent < 25) return 'Beginner';
    if (percent < 50) return 'Intermediate';
    if (percent < 75) return 'Advanced';
    if (percent < 100) return 'Expert';
    return 'Master';
  }

  /**
   * Get next recommended problem
   */
  async getNextRecommendedProblem(userId) {
    try {
      if (!this.userProgress[userId]) {
        return { success: false, error: 'User not found' };
      }

      const userProgress = this.userProgress[userId];

      // Find weakest area
      const topics = userProgress.topics;
      let weakestTopic = null;
      let lowestRate = 100;

      for (const [topic, data] of Object.entries(topics)) {
        if (data.total > 0) {
          const rate = (data.solved / data.total) * 100;
          if (rate < lowestRate) {
            lowestRate = rate;
            weakestTopic = topic;
          }
        }
      }

      // Recommend next difficulty level
      const easyRate = (userProgress.difficulty.easy.solved / userProgress.difficulty.easy.total) * 100;
      const recommendedDifficulty = easyRate < 50 ? 'Easy' : 'Medium';

      return {
        success: true,
        recommendation: {
          topic: weakestTopic || 'Random',
          difficulty: recommendedDifficulty,
          reason: `Focus on ${weakestTopic} - you need more practice here`
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user progress summary
   */
  async getUserProgressSummary(userId) {
    try {
      if (!this.userProgress[userId]) {
        return { success: false, error: 'User not found' };
      }

      const progress = this.userProgress[userId];
      const stats = this.calculateStats(progress);

      return {
        success: true,
        summary: {
          ...stats,
          topics: progress.topics,
          recentActivity: progress.lastActivity,
          goalProgress: {
            solved: progress.solvedProblems,
            target: 150,
            percentage: ((progress.solvedProblems / 150) * 100).toFixed(1)
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get complexity analysis for a problem
   */
  async getComplexityAnalysis(problemId) {
    try {
      return {
        success: true,
        analysis: {
          problemId,
          timeComplexity: {
            worst: 'O(n^2)',
            average: 'O(n log n)',
            best: 'O(n)',
            explanation: 'The solution uses sorting which is O(n log n) on average'
          },
          spaceComplexity: {
            worst: 'O(n)',
            average: 'O(1)',
            explanation: 'Space varies based on algorithm approach'
          },
          tips: [
            'Consider edge cases for large inputs',
            'Optimize for time complexity first',
            'Then optimize for space if needed'
          ],
          relatedComplexities: [
            { complexity: 'O(1)', description: 'Constant time - Most efficient' },
            { complexity: 'O(log n)', description: 'Logarithmic - Very efficient' },
            { complexity: 'O(n)', description: 'Linear - Efficient' }
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get difficulty progression guide
   */
  async getDifficultyProgression() {
    return {
      success: true,
      progression: [
        {
          level: 1,
          difficulty: 'Easy',
          targetSolved: 30,
          topics: ['Array basics', 'String manipulation', 'Simple loops'],
          timeEstimate: '1-2 weeks',
          description: 'Build foundation with basic problems'
        },
        {
          level: 2,
          difficulty: 'Medium',
          targetSolved: 50,
          topics: ['Data structures', 'Algorithms', 'Two pointers'],
          timeEstimate: '3-4 weeks',
          description: 'Master core algorithms and data structures'
        },
        {
          level: 3,
          difficulty: 'Hard',
          targetSolved: 30,
          topics: ['Dynamic Programming', 'Graphs', 'Advanced techniques'],
          timeEstimate: '2-3 weeks',
          description: 'Tackle advanced problems'
        },
        {
          level: 4,
          difficulty: 'Interview',
          targetSolved: 20,
          topics: ['System Design', 'Company-specific questions'],
          timeEstimate: '1-2 weeks',
          description: 'Prepare for actual interviews'
        }
      ]
    };
  }

  /**
   * Get problem solution with complexity
   */
  async getProblemSolution(problemId) {
    try {
      return {
        success: true,
        solution: {
          problemId,
          approach: 'Two pointers / Hash map',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          keyInsight: 'Use a hash map to store values for O(1) lookup',
          steps: [
            'Create a hash map to store values and indices',
            'Iterate through array once',
            'For each element, check if complement exists',
            'Return indices when found'
          ],
          code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DSATrackerService();

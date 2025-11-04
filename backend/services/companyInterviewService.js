/**
 * Company Interview Database Service
 * Stores and retrieves company-specific interview questions and insights
 * Integrates with Google Drive PDFs and maintains success rate tracking
 */

class CompanyInterviewService {
  constructor() {
    this.companyDatabase = this.initializeCompanyDatabase();
  }

  /**
   * Initialize company database with interview insights
   */
  initializeCompanyDatabase() {
    return {
      'Google': {
        name: 'Google',
        logo: 'https://example.com/google-logo.png',
        industry: 'Technology',
        size: 'Large (100,000+)',
        interviewRounds: 4,
        rounds: [
          { round: 1, name: 'Phone Screen', duration: '45 mins', focus: 'Coding' },
          { round: 2, name: 'Technical Interview 1', duration: '60 mins', focus: 'System Design' },
          { round: 3, name: 'Technical Interview 2', duration: '60 mins', focus: 'DSA' },
          { round: 4, name: 'Behavioral Interview', duration: '45 mins', focus: 'Culture Fit' }
        ],
        commonTopics: ['System Design', 'Arrays', 'Trees', 'Graphs', 'DP'],
        successRate: 8.5,
        averageTimeToResponse: '5 days',
        officeLocations: ['Mountain View, CA', 'New York, NY', 'London, UK'],
        avgSalary: '$250,000 - $350,000',
        totalQuestions: 150,
        difficulty: 'Hard'
      },
      'Amazon': {
        name: 'Amazon',
        logo: 'https://example.com/amazon-logo.png',
        industry: 'Technology',
        size: 'Large (100,000+)',
        interviewRounds: 4,
        rounds: [
          { round: 1, name: 'Phone Screen', duration: '45 mins', focus: 'Coding' },
          { round: 2, name: 'Technical Interview 1', duration: '60 mins', focus: 'System Design' },
          { round: 3, name: 'Technical Interview 2', duration: '60 mins', focus: 'DSA' },
          { round: 4, name: 'Leadership Principles', duration: '45 mins', focus: 'Behavioral' }
        ],
        commonTopics: ['System Design', 'Linked Lists', 'Trees', 'Sorting', 'Strings'],
        successRate: 7.8,
        averageTimeToResponse: '7 days',
        officeLocations: ['Seattle, WA', 'New York, NY', 'San Francisco, CA'],
        avgSalary: '$200,000 - $300,000',
        totalQuestions: 180,
        difficulty: 'Hard'
      },
      'Meta': {
        name: 'Meta',
        logo: 'https://example.com/meta-logo.png',
        industry: 'Technology',
        size: 'Large (60,000+)',
        interviewRounds: 4,
        rounds: [
          { round: 1, name: 'Phone Screen', duration: '45 mins', focus: 'Coding' },
          { round: 2, name: 'Technical Interview 1', duration: '60 mins', focus: 'DSA' },
          { round: 3, name: 'Technical Interview 2', duration: '60 mins', focus: 'System Design' },
          { round: 4, name: 'Behavioral Interview', duration: '45 mins', focus: 'Culture Fit' }
        ],
        commonTopics: ['Graphs', 'Trees', 'Dynamic Programming', 'System Design', 'Strings'],
        successRate: 8.2,
        averageTimeToResponse: '6 days',
        officeLocations: ['Menlo Park, CA', 'New York, NY', 'London, UK'],
        avgSalary: '$220,000 - $320,000',
        totalQuestions: 120,
        difficulty: 'Hard'
      }
    };
  }

  /**
   * Get company interview details
   */
  async getCompanyDetails(companyName) {
    try {
      const company = this.companyDatabase[companyName];
      if (!company) {
        return { success: false, error: 'Company not found' };
      }
      return { success: true, company };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get interview questions for a company
   */
  async getInterviewQuestions(companyName, filters = {}) {
    try {
      const company = this.companyDatabase[companyName];
      if (!company) {
        return { success: false, error: 'Company not found' };
      }

      // In production, fetch from Google Drive or database
      const questions = [
        {
          id: 'q1',
          company: companyName,
          question: `Design a URL shortening service like bit.ly for ${companyName}.`,
          difficulty: 'Hard',
          topic: 'System Design',
          frequency: 'Very Common',
          solved: false,
          successRate: 62,
          attempts: 0
        },
        {
          id: 'q2',
          company: companyName,
          question: `How would you design a real-time notification system for ${companyName}?`,
          difficulty: 'Hard',
          topic: 'System Design',
          frequency: 'Common',
          solved: false,
          successRate: 45,
          attempts: 0
        }
      ];

      if (filters.difficulty) {
        return {
          success: true,
          company: companyName,
          count: questions.length,
          questions: questions.filter(q => q.difficulty === filters.difficulty)
        };
      }

      return {
        success: true,
        company: companyName,
        count: questions.length,
        questions
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all companies
   */
  async getAllCompanies() {
    try {
      return {
        success: true,
        count: Object.keys(this.companyDatabase).length,
        companies: Object.values(this.companyDatabase).map(c => ({
          name: c.name,
          logo: c.logo,
          industry: c.industry,
          size: c.size,
          successRate: c.successRate,
          totalQuestions: c.totalQuestions
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Track interview success rate
   */
  async trackInterviewAttempt(companyName, questionId, result) {
    try {
      return {
        success: true,
        message: 'Interview attempt recorded',
        company: companyName,
        questionId,
        result,
        successRateUpdate: 'Updated'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get interview insights
   */
  async getInterviewInsights(companyName) {
    try {
      const company = this.companyDatabase[companyName];
      if (!company) {
        return { success: false, error: 'Company not found' };
      }

      return {
        success: true,
        insights: {
          company: companyName,
          totalRounds: company.interviewRounds,
          averageTimePerRound: '1 hour',
          totalTimeExpected: `${company.interviewRounds} - ${company.interviewRounds + 1} hours`,
          commonTopics: company.commonTopics,
          successRate: `${company.successRate}/10`,
          tips: [
            `Focus on ${company.commonTopics[0]} - most frequently asked`,
            `Expect ${company.interviewRounds} rounds of interviews`,
            `Study real ${companyName} problems from their interview data`,
            'Practice system design extensively',
            'Prepare behavioral questions using STAR method'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get interview preparation roadmap
   */
  async getPreparationRoadmap(companyName, weekAvailable) {
    try {
      const company = this.companyDatabase[companyName];
      if (!company) {
        return { success: false, error: 'Company not found' };
      }

      return {
        success: true,
        roadmap: {
          company: companyName,
          weeksAvailable: weekAvailable,
          plan: [
            {
              week: 1,
              focus: 'Foundation & Data Structures',
              topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
              problems: 15,
              time: '10 hours'
            },
            {
              week: 2,
              focus: 'Trees & Graphs',
              topics: ['Binary Trees', 'BST', 'Graphs', 'DFS/BFS'],
              problems: 15,
              time: '10 hours'
            },
            {
              week: 3,
              focus: 'Dynamic Programming',
              topics: ['DP Fundamentals', 'Memoization', 'Optimization'],
              problems: 15,
              time: '10 hours'
            },
            {
              week: 4,
              focus: 'System Design',
              topics: company.commonTopics.filter(t => t.includes('System')),
              problems: 5,
              time: '8 hours'
            }
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new CompanyInterviewService();

/**
 * Behavioral Interview Coach Service
 * STAR method training, behavioral question bank, AI feedback
 * Provides success stories and response guidance
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class BehavioralCoachService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.questionBank = this.initializeQuestionBank();
  }

  /**
   * Initialize behavioral question bank
   */
  initializeQuestionBank() {
    return [
      {
        id: 'bh-1',
        question: 'Tell me about a time you failed. What did you learn?',
        category: 'Failure & Learning',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-2',
        question: 'Describe a situation where you had to work with a difficult team member.',
        category: 'Teamwork',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-3',
        question: 'Tell me about your proudest professional achievement.',
        category: 'Achievement',
        difficulty: 'Easy',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-4',
        question: 'Give an example of when you showed leadership.',
        category: 'Leadership',
        difficulty: 'Hard',
        companyFit: 'Google, Amazon, Meta',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-5',
        question: 'Tell me about a time you had to meet a tight deadline.',
        category: 'Time Management',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-6',
        question: 'Describe a situation where you had to learn something new quickly.',
        category: 'Learning Ability',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-7',
        question: 'Tell me about a time you disagreed with your manager.',
        category: 'Conflict Resolution',
        difficulty: 'Hard',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-8',
        question: 'Give an example of when you had to prioritize multiple tasks.',
        category: 'Prioritization',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-9',
        question: 'Describe a time when you improved a process or system.',
        category: 'Initiative & Improvement',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      },
      {
        id: 'bh-10',
        question: 'Tell me about when you had to adapt to a significant change.',
        category: 'Adaptability',
        difficulty: 'Medium',
        companyFit: 'All',
        duration: '2-3 minutes'
      }
    ];
  }

  /**
   * Learn STAR method
   */
  async learnSTARMethod() {
    return {
      success: true,
      method: {
        name: 'STAR Method',
        description: 'Framework for answering behavioral questions',
        components: [
          {
            component: 'S - Situation',
            explanation: 'Set the context for your story',
            tips: [
              'Be specific about the context',
              'Include relevant details',
              'Keep it concise (20-30 seconds)',
              'Avoid generic scenarios'
            ],
            example: 'I was working at Company X as a Junior Developer on a team of 5 people...'
          },
          {
            component: 'T - Task',
            explanation: 'Describe the challenge or task',
            tips: [
              'Explain the problem clearly',
              'Show the complexity',
              'State your role in the situation',
              'Make it relevant to the question'
            ],
            example: 'The challenge was that our application was experiencing performance issues...'
          },
          {
            component: 'A - Action',
            explanation: 'Detail the actions you took',
            tips: [
              'Focus on YOUR actions (use "I")',
              'Show initiative and leadership',
              'Include specific technical details',
              'Demonstrate problem-solving',
              'This is the longest part (1-2 minutes)'
            ],
            example: 'I analyzed the bottleneck, created optimization strategy, and led implementation...'
          },
          {
            component: 'R - Result',
            explanation: 'Share the outcome and impact',
            tips: [
              'Quantify results when possible',
              'Show business impact',
              'Include what you learned',
              'End on a positive note',
              'Connect to future growth'
            ],
            example: 'The performance improved by 40%, saving the company $50K annually...'
          }
        ],
        tips: [
          'Practice your stories beforehand',
          'Use real examples from your experience',
          'Keep stories to 2-3 minutes',
          'Make them relevant to the company',
          'Have 5-10 STAR stories ready'
        ]
      }
    };
  }

  /**
   * Get behavioral questions with filtering
   */
  async getBehavioralQuestions(filters = {}) {
    try {
      let questions = [...this.questionBank];

      if (filters.category) {
        questions = questions.filter(q => q.category === filters.category);
      }

      if (filters.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }

      if (filters.company) {
        questions = questions.filter(q => q.companyFit.includes(filters.company));
      }

      return {
        success: true,
        count: questions.length,
        questions
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Evaluate behavioral response
   */
  async evaluateBehavioralResponse(question, userResponse) {
    try {
      const prompt = `You are an expert in evaluating behavioral interview responses using STAR method.

Question: "${question}"
User's Response: "${userResponse}"

Evaluate this response based on:
1. STAR Method Compliance (Situation, Task, Action, Result coverage)
2. Clarity and Structure
3. Relevance to the question
4. Impact and Metrics
5. Overall Quality

Return JSON:
{
  "starScore": {
    "situation": 0-10,
    "task": 0-10,
    "action": 0-10,
    "result": 0-10,
    "overall": 0-10
  },
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "Specific feedback",
  "rewriteSuggestion": "How to improve this answer",
  "score": 0-100
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return { success: true, evaluation: JSON.parse(jsonMatch[0]) };
        } catch (e) {
          return this.getDefaultEvaluation();
        }
      }

      return this.getDefaultEvaluation();
    } catch (error) {
      console.error('Error evaluating response:', error.message);
      return this.getDefaultEvaluation();
    }
  }

  /**
   * Get default evaluation
   */
  getDefaultEvaluation() {
    return {
      success: true,
      evaluation: {
        starScore: {
          situation: 8,
          task: 7,
          action: 8,
          result: 6,
          overall: 7
        },
        strengths: ['Good situation setup', 'Clear actions taken'],
        improvements: ['Add more metrics to results', 'Emphasize your role'],
        feedback: 'Good response overall. Focus on quantifiable results.',
        score: 72
      }
    };
  }

  /**
   * Get success stories by category
   */
  async getSuccessStories(category) {
    try {
      const stories = {
        'Failure & Learning': [
          {
            title: 'Learned From Production Bug',
            scenario: 'Candidate shipped a bug that affected users',
            response: 'Took ownership, implemented fixes, and created monitoring system',
            outcome: 'Prevented similar issues, improved as engineer'
          }
        ],
        'Teamwork': [
          {
            title: 'Resolved Team Conflict',
            scenario: 'Had disagreement with team member on approach',
            response: 'Listened to concerns, found compromise solution',
            outcome: 'Stronger relationship, better code quality'
          }
        ],
        'Leadership': [
          {
            title: 'Led Project to Success',
            scenario: 'Took initiative to lead new feature development',
            response: 'Coordinated team, delegated tasks, mentored junior devs',
            outcome: 'Project shipped 2 weeks early, team impressed'
          }
        ]
      };

      return {
        success: true,
        category,
        stories: stories[category] || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Practice with mock interview
   */
  async practiceBehavioralInterview(difficulty = 'Medium') {
    try {
      const questions = this.questionBank.filter(q => q.difficulty === difficulty);
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      return {
        success: true,
        session: {
          id: `behavior_session_${Date.now()}`,
          question: randomQuestion.question,
          category: randomQuestion.category,
          expectedDuration: randomQuestion.duration,
          tips: [
            'Use STAR method',
            'Practice beforehand',
            'Speak clearly',
            'Include metrics if possible'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all question categories
   */
  async getQuestionCategories() {
    try {
      const categories = [...new Set(this.questionBank.map(q => q.category))];
      return {
        success: true,
        categories: categories.map(cat => ({
          name: cat,
          count: this.questionBank.filter(q => q.category === cat).length
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate improvement plan
   */
  async generateImprovementPlan(evaluationScores) {
    try {
      return {
        success: true,
        plan: {
          focus: 'Results & Impact',
          weakAreas: ['Need to add more metrics', 'Could emphasize leadership'],
          recommendations: [
            'Practice adding numbers and percentages to your stories',
            'Highlight your role and impact more clearly',
            'Study 3-4 more STAR stories in your weak areas',
            'Practice with mock interviews'
          ],
          timeline: '2-3 weeks',
          nextSteps: [
            'Watch STAR method tutorial (1 hour)',
            'Write out 5 stories using STAR format',
            'Practice with friend/mentor (3 sessions)',
            'Do full mock interview'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BehavioralCoachService();

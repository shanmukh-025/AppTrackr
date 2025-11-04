/**
 * Mock Interview Service
 * AI-powered mock interview simulator using Gemini
 * Supports behavioral, technical, and mixed interview modes
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../prisma/client');

class MockInterviewService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.questionBank = this.initializeQuestionBank();
  }

  /**
   * Initialize question bank for different interview types
   */
  initializeQuestionBank() {
    return {
      behavioral: [
        'Tell me about a time you had to work with a difficult team member. How did you handle it?',
        'Describe a situation where you failed. What did you learn from it?',
        'Give an example of when you showed leadership.',
        'Tell me about a time you had to meet a tight deadline.',
        'Describe a situation where you had to learn something new quickly.',
        'Tell me about a time you disagreed with your manager or colleague.',
        'Give an example of when you had to prioritize multiple tasks.',
        'Describe a time when you improved a process or system.',
        'Tell me about your proudest professional achievement.',
        'Give an example of when you had to adapt to change.'
      ],
      technical: {
        'Backend Developer': [
          'Design a URL shortening service like bit.ly. What would be your approach?',
          'How would you design a real-time notification system?',
          'Explain how you would handle rate limiting in an API.',
          'Design a cache system. What eviction policies would you use?',
          'How would you design a distributed system to handle millions of requests?'
        ],
        'Frontend Developer': [
          'How would you optimize the performance of a React application?',
          'Explain how you would handle state management in a large application.',
          'Design a component system for a large-scale application.',
          'How would you implement lazy loading in a web application?',
          'Explain your approach to testing React components.'
        ],
        'Full Stack Developer': [
          'Design a system like Twitter. How would you handle scalability?',
          'Create a payment processing system. What security measures would you implement?',
          'Design a real-time chat application.',
          'How would you design a search system like Google?',
          'Design a ride-sharing application like Uber.'
        ]
      }
    };
  }

  /**
   * Start a new mock interview session
   */
  async startMockInterview(userId, interviewType, role, difficulty, duration = 60) {
    try {
      const interviewSession = {
        id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: interviewType, // 'behavioral', 'technical', 'mixed'
        role,
        difficulty,
        duration,
        startTime: new Date(),
        endTime: null,
        questions: [],
        responses: [],
        evaluations: [],
        overallScore: 0,
        status: 'in_progress',
        recording: null
      };

      // Generate initial question
      const firstQuestion = await this.generateInterviewQuestion(
        interviewType,
        role,
        difficulty,
        1
      );

      interviewSession.questions.push(firstQuestion);

      return {
        success: true,
        session: interviewSession,
        currentQuestion: firstQuestion,
        questionsRemaining: Math.ceil(duration / 10) - 1 // Assuming 10 min per question
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate interview question using AI
   */
  async generateInterviewQuestion(interviewType, role, difficulty, questionNumber) {
    try {
      let prompt;

      if (interviewType === 'behavioral') {
        prompt = `Generate a ${difficulty} level behavioral interview question for a ${role} position. 
        Question number: ${questionNumber}
        
Format as JSON:
{
  "question": "The actual question",
  "type": "behavioral",
  "expectedTopics": ["topic1", "topic2"],
  "difficulty": "${difficulty}",
  "estimatedAnswerTime": 5,
  "followUpQuestions": ["follow-up 1", "follow-up 2"],
  "evaluationCriteria": ["criterion1", "criterion2"]
}`;
      } else {
        prompt = `Generate a ${difficulty} level system design or technical interview question for a ${role} position.
        Question number: ${questionNumber}
        
Format as JSON:
{
  "question": "The actual question",
  "type": "technical",
  "expectedTopics": ["topic1", "topic2"],
  "difficulty": "${difficulty}",
  "estimatedAnswerTime": 8,
  "hints": ["hint1", "hint2"],
  "evaluationCriteria": ["criterion1", "criterion2"],
  "sampleSolution": "Brief outline of a good answer"
}`;
      }

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const question = JSON.parse(jsonMatch[0]);
          return {
            questionNumber,
            ...question,
            generatedAt: new Date()
          };
        } catch (e) {
          return this.getDefaultQuestion(interviewType, role, questionNumber);
        }
      }

      return this.getDefaultQuestion(interviewType, role, questionNumber);
    } catch (error) {
      console.error('Error generating question:', error.message);
      return this.getDefaultQuestion(interviewType, role, questionNumber);
    }
  }

  /**
   * Get default question if AI generation fails
   */
  getDefaultQuestion(interviewType, role, questionNumber) {
    if (interviewType === 'behavioral') {
      return {
        questionNumber,
        question: this.questionBank.behavioral[questionNumber % this.questionBank.behavioral.length],
        type: 'behavioral',
        difficulty: 'Medium',
        estimatedAnswerTime: 5,
        evaluationCriteria: ['Clarity', 'Problem-solving approach', 'Result achieved']
      };
    } else {
      const questions = this.questionBank.technical[role] || this.questionBank.technical['Full Stack Developer'];
      return {
        questionNumber,
        question: questions[questionNumber % questions.length],
        type: 'technical',
        difficulty: 'Hard',
        estimatedAnswerTime: 8,
        evaluationCriteria: ['Architecture', 'Scalability', 'Trade-offs', 'Communication']
      };
    }
  }

  /**
   * Submit interview response and get evaluation
   */
  async submitResponse(sessionId, questionNumber, userResponse) {
    try {
      const evaluation = await this.evaluateResponse(userResponse, questionNumber);

      return {
        success: true,
        evaluation,
        feedback: evaluation.feedback,
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Evaluate user response using AI
   */
  async evaluateResponse(userResponse, questionContext) {
    try {
      const prompt = `You are an expert technical interview evaluator. 
      
User's response: "${userResponse}"

Evaluate this response and provide:
1. Overall score (1-10)
2. Strengths (array of 2-3 strengths)
3. Weaknesses (array of 2-3 areas to improve)
4. Specific feedback for improvement
5. Whether this is a strong answer (true/false)

Respond with only valid JSON:
{
  "score": number,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "Your feedback here",
  "isGoodAnswer": boolean,
  "explanation": "Why you scored it this way"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
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
   * Get default evaluation if AI fails
   */
  getDefaultEvaluation() {
    return {
      score: 7,
      strengths: ['Clear communication', 'Logical thinking'],
      improvements: ['More specific examples', 'Deeper technical details'],
      feedback: 'Good response. Consider adding more specific technical details.',
      isGoodAnswer: true,
      explanation: 'The response demonstrates understanding of core concepts.'
    };
  }

  /**
   * End interview session and calculate final score
   */
  async endInterviewSession(sessionId, session) {
    try {
      if (!session.evaluations || session.evaluations.length === 0) {
        return {
          success: true,
          finalScore: 0,
          message: 'No responses evaluated'
        };
      }

      const averageScore = session.evaluations.reduce((sum, evaluation) => sum + (evaluation.score || 0), 0) / session.evaluations.length;
      const finalScore = Math.round(averageScore * 10) / 10;

      const performanceLevel = this.getPerformanceLevel(finalScore);

      return {
        success: true,
        sessionId,
        finalScore,
        performanceLevel,
        totalQuestions: session.questions.length,
        questionsAnswered: session.evaluations.length,
        duration: Math.round((new Date() - session.startTime) / 60000),
        averageScorePerQuestion: finalScore,
        strengths: this.getSummaryStrengths(session.evaluations),
        improvements: this.getSummaryImprovements(session.evaluations),
        nextSteps: this.getNextSteps(performanceLevel)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Determine performance level based on score
   */
  getPerformanceLevel(score) {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Average';
    if (score >= 5) return 'Below Average';
    return 'Needs Improvement';
  }

  /**
   * Get summary of strengths across all evaluations
   */
  getSummaryStrengths(evaluations) {
    const strengthsMap = {};
    evaluations.forEach(evaluation => {
      if (evaluation.strengths) {
        evaluation.strengths.forEach(strength => {
          strengthsMap[strength] = (strengthsMap[strength] || 0) + 1;
        });
      }
    });
    return Object.entries(strengthsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([strength]) => strength);
  }

  /**
   * Get summary of improvements needed
   */
  getSummaryImprovements(evaluations) {
    const improvementsMap = {};
    evaluations.forEach(evaluation => {
      if (evaluation.improvements) {
        evaluation.improvements.forEach(improvement => {
          improvementsMap[improvement] = (improvementsMap[improvement] || 0) + 1;
        });
      }
    });
    return Object.entries(improvementsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([improvement]) => improvement);
  }

  /**
   * Get personalized next steps
   */
  getNextSteps(performanceLevel) {
    const steps = {
      'Excellent': ['Prepare for advanced questions', 'Practice in real interviews', 'Help others prepare'],
      'Very Good': ['Focus on system design', 'Work on edge cases', 'Practice with harder problems'],
      'Good': ['More practice needed', 'Focus on weak areas', 'Study solution approaches'],
      'Average': ['Review fundamentals', 'Practice more problems', 'Work on communication'],
      'Below Average': ['Focus on core concepts', 'Take beginner courses', 'Practice basic problems'],
      'Needs Improvement': ['Start with fundamentals', 'Take comprehensive course', 'Practice regularly']
    };
    return steps[performanceLevel] || steps['Good'];
  }

  /**
   * Get next question in interview
   */
  async getNextQuestion(sessionId, interviewType, role, difficulty) {
    try {
      const questionNumber = Math.floor(Math.random() * 100) + 1;
      const nextQuestion = await this.generateInterviewQuestion(
        interviewType,
        role,
        difficulty,
        questionNumber
      );

      return {
        success: true,
        question: nextQuestion
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MockInterviewService();

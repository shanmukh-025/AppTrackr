/**
 * System Design Master Service
 * Interactive system design learning with case studies and trade-off analysis
 * Provides design patterns, video explanations, and interactive diagrams
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class SystemDesignService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    this.caseStudies = this.initializeCaseStudies();
  }

  /**
   * Initialize system design case studies
   */
  initializeCaseStudies() {
    return {
      'url-shortener': {
        id: 'url-shortener',
        name: 'URL Shortening Service (bit.ly)',
        difficulty: 'Medium',
        interviewFrequency: 'Very Common',
        companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
        duration: '45-60 minutes',
        description: 'Design a service like bit.ly that shortens URLs',
        requirements: [
          'Convert long URLs to short URLs',
          'Redirect short URLs to original URLs',
          'Handle millions of URLs',
          'Support custom short URLs',
          'Track click statistics'
        ],
        keyComponents: [
          { name: 'API Gateway', description: 'Handles incoming requests' },
          { name: 'URL Encoder', description: 'Generates short codes' },
          { name: 'Database', description: 'Stores URL mappings' },
          { name: 'Cache Layer', description: 'Redis for frequently accessed URLs' },
          { name: 'Analytics Engine', description: 'Tracks click statistics' }
        ],
        estimatedQPS: 100000,
        dataStorage: '1-10TB',
        tradeoffs: [
          {
            option1: 'SQL Database',
            option2: 'NoSQL Database',
            tradeoff: 'SQL is consistent but slower; NoSQL is faster but eventual consistency'
          },
          {
            option1: 'In-memory Cache',
            option2: 'Database Cache',
            tradeoff: 'Memory is faster but limited; Database is slower but persistent'
          }
        ]
      },
      'real-time-chat': {
        id: 'real-time-chat',
        name: 'Real-time Chat Application',
        difficulty: 'Hard',
        interviewFrequency: 'Common',
        companies: ['Facebook', 'Google', 'Amazon', 'Microsoft'],
        duration: '60 minutes',
        description: 'Design a real-time chat system like WhatsApp or Slack',
        requirements: [
          'Send and receive messages in real-time',
          'Support 1-on-1 and group chats',
          'Handle offline users',
          'Maintain message history',
          'Support typing indicators',
          'Handle presence indicators'
        ],
        keyComponents: [
          { name: 'WebSocket Server', description: 'Real-time bidirectional communication' },
          { name: 'Message Queue', description: 'Kafka/RabbitMQ for async processing' },
          { name: 'Database', description: 'Store messages and user data' },
          { name: 'Cache', description: 'Redis for active users' },
          { name: 'Load Balancer', description: 'Distribute connections' }
        ],
        estimatedQPS: 1000000,
        dataStorage: '100TB+',
        tradeoffs: [
          {
            option1: 'WebSocket',
            option2: 'HTTP Long Polling',
            tradeoff: 'WebSocket is real-time but requires connection; Long polling is compatible but resource-intensive'
          },
          {
            option1: 'Message Queue',
            option2: 'Direct Database',
            tradeoff: 'Queue is scalable but complex; Direct DB is simple but limited throughput'
          }
        ]
      },
      'social-media-feed': {
        id: 'social-media-feed',
        name: 'Social Media Feed (Twitter/Facebook)',
        difficulty: 'Hard',
        interviewFrequency: 'Common',
        companies: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'],
        duration: '60 minutes',
        description: 'Design a feed generation system for social media',
        requirements: [
          'Show relevant posts from followed users',
          'Handle billions of posts',
          'Real-time feed updates',
          'Ranking and personalization',
          'Pagination support'
        ],
        keyComponents: [
          { name: 'Feed Generation Engine', description: 'Generates personalized feeds' },
          { name: 'Ranking Algorithm', description: 'Scores and ranks posts' },
          { name: 'Cache Layer', description: 'Caches hot feeds' },
          { name: 'Database', description: 'Stores posts and user relationships' },
          { name: 'Analytics', description: 'Tracks engagement metrics' }
        ],
        estimatedQPS: 10000000,
        dataStorage: '1000TB+',
        tradeoffs: [
          {
            option1: 'Push Model (pre-compute feeds)',
            option2: 'Pull Model (compute on request)',
            tradeoff: 'Push is fast but requires storage; Pull saves storage but slower'
          }
        ]
      }
    };
  }

  /**
   * Get system design case study
   */
  async getCaseStudy(caseId) {
    try {
      const caseStudy = this.caseStudies[caseId];
      if (!caseStudy) {
        return { success: false, error: 'Case study not found' };
      }
      return { success: true, caseStudy };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get design patterns for a system
   */
  async getDesignPatterns(systemType) {
    try {
      const patterns = {
        'url-shortener': [
          {
            pattern: 'Sharding',
            description: 'Distribute data across multiple databases',
            whenToUse: 'When single database cannot handle load',
            tradeoff: 'Adds complexity but enables horizontal scaling'
          },
          {
            pattern: 'Caching',
            description: 'Cache frequently accessed URLs',
            whenToUse: 'To reduce database load',
            tradeoff: 'Memory limited, need cache invalidation'
          }
        ],
        'real-time-chat': [
          {
            pattern: 'Pub/Sub',
            description: 'Publish-subscribe pattern for message distribution',
            whenToUse: 'For real-time message broadcasting',
            tradeoff: 'Adds infrastructure complexity'
          },
          {
            pattern: 'Message Queue',
            description: 'Queue messages for async processing',
            whenToUse: 'To handle message spikes',
            tradeoff: 'Adds latency but improves reliability'
          }
        ]
      };

      return {
        success: true,
        systemType,
        patterns: patterns[systemType] || []
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze trade-offs for design decision
   */
  async analyzeTradeoffs(component, option1, option2) {
    try {
      const prompt = `Compare these two system design options:
      
Component: ${component}
Option 1: ${option1}
Option 2: ${option2}

Provide a detailed analysis with:
1. Pros for each option
2. Cons for each option
3. Which is better when
4. Performance comparison
5. Cost comparison

Format as JSON:
{
  "component": "${component}",
  "option1": {
    "name": "${option1}",
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"],
    "performance": "description",
    "cost": "description"
  },
  "option2": {
    "name": "${option2}",
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"],
    "performance": "description",
    "cost": "description"
  },
  "recommendation": "Which is better and why",
  "decisionFactor": "What factor should drive your choice"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return { success: true, analysis: JSON.parse(jsonMatch[0]) };
        } catch (e) {
          return this.getDefaultTradeoffAnalysis(component, option1, option2);
        }
      }

      return this.getDefaultTradeoffAnalysis(component, option1, option2);
    } catch (error) {
      console.error('Error analyzing tradeoffs:', error.message);
      return this.getDefaultTradeoffAnalysis(component, option1, option2);
    }
  }

  /**
   * Get default tradeoff analysis
   */
  getDefaultTradeoffAnalysis(component, option1, option2) {
    return {
      success: true,
      analysis: {
        component,
        option1: {
          name: option1,
          pros: ['Advantage 1', 'Advantage 2'],
          cons: ['Disadvantage 1'],
          performance: 'Medium performance',
          cost: 'Lower cost'
        },
        option2: {
          name: option2,
          pros: ['Better performance', 'Scalability'],
          cons: ['Higher cost'],
          performance: 'High performance',
          cost: 'Higher cost'
        },
        recommendation: 'Choose based on your requirements',
        decisionFactor: 'Performance vs Cost'
      }
    };
  }

  /**
   * Get architecture diagram description
   */
  async getArchitectureDiagram(systemType) {
    try {
      const caseStudy = this.caseStudies[systemType];
      if (!caseStudy) {
        return { success: false, error: 'System type not found' };
      }

      return {
        success: true,
        diagram: {
          systemType,
          title: caseStudy.name,
          layers: [
            {
              layer: 'Client Layer',
              components: ['Mobile App', 'Web Browser']
            },
            {
              layer: 'API Gateway',
              components: ['Load Balancer', 'API Endpoints']
            },
            {
              layer: 'Service Layer',
              components: caseStudy.keyComponents.slice(0, 3).map(c => c.name)
            },
            {
              layer: 'Data Layer',
              components: ['Primary DB', 'Cache', 'Message Queue']
            }
          ],
          connections: [
            'Client → Load Balancer',
            'Load Balancer → API Gateway',
            'API Gateway → Services',
            'Services → Database',
            'Services → Cache'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get scalability strategies
   */
  async getScalabilityStrategies(systemType) {
    return {
      success: true,
      strategies: [
        {
          strategy: 'Horizontal Scaling',
          description: 'Add more servers to distribute load',
          impact: 'Increases capacity linearly',
          effort: 'High complexity',
          cost: 'Higher server costs'
        },
        {
          strategy: 'Vertical Scaling',
          description: 'Upgrade existing servers',
          impact: 'Limited by hardware',
          effort: 'Low complexity',
          cost: 'Moderate cost'
        },
        {
          strategy: 'Caching',
          description: 'Cache hot data in memory',
          impact: 'Reduces database load',
          effort: 'Medium complexity',
          cost: 'Memory costs'
        },
        {
          strategy: 'Database Sharding',
          description: 'Partition data across databases',
          impact: 'Enables massive scale',
          effort: 'Very high complexity',
          cost: 'Multiple databases'
        }
      ]
    };
  }

  /**
   * Get all case studies
   */
  async getAllCaseStudies() {
    try {
      return {
        success: true,
        count: Object.keys(this.caseStudies).length,
        caseStudies: Object.values(this.caseStudies).map(cs => ({
          id: cs.id,
          name: cs.name,
          difficulty: cs.difficulty,
          frequency: cs.interviewFrequency,
          companies: cs.companies.slice(0, 3)
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SystemDesignService();

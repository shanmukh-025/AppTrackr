/**
 * Learning Path Service
 * Personalized learning curriculum based on target role and current skills
 * Provides step-by-step guidance with time estimates and AI-driven recommendations
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../prisma/client');

class LearningPathService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  /**
   * Generate personalized learning path based on role and skills
   */
  async generateLearningPath(userId, targetRole, currentSkills, experienceLevel) {
    try {
      const pathTemplate = this.getLearningPathTemplate(targetRole, experienceLevel);
      
      // AI enhancement to personalize the path
      const aiEnhancedPath = await this.personalizePathWithAI(targetRole, currentSkills, experienceLevel, pathTemplate);

      return {
        success: true,
        path: aiEnhancedPath,
        totalDuration: aiEnhancedPath.totalDuration,
        totalEstimatedHours: aiEnhancedPath.totalEstimatedHours,
        phases: aiEnhancedPath.phases
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get learning path template for different roles AND experience levels
   */
  getLearningPathTemplate(targetRole, experienceLevel) {
    // First, get the base template for the role
    const baseTemplate = this.getBaseTemplateForRole(targetRole);
    
    // Then, adjust it based on experience level
    return this.adjustTemplateForExperience(baseTemplate, experienceLevel);
  }

  /**
   * Get base template for role (without experience adjustment)
   */
  getBaseTemplateForRole(targetRole) {
    const pathTemplates = {
      'Backend Developer': {
        phases: [
          {
            phase: 1,
            name: 'Foundation Building',
            duration: '2-3 weeks',
            topics: ['Data Structures', 'Algorithms Basics', 'OOP Principles', 'Database Fundamentals'],
            difficulty: 'Easy',
            estimatedHours: 30,
            topicDetails: [
              { topic: 'Arrays & Linked Lists', hours: 8, resources: 15 },
              { topic: 'Stacks & Queues', hours: 6, resources: 12 },
              { topic: 'Trees & Graphs Intro', hours: 10, resources: 18 },
              { topic: 'SQL Basics', hours: 6, resources: 10 }
            ]
          },
          {
            phase: 2,
            name: 'Core Backend Skills',
            duration: '3-4 weeks',
            topics: ['Advanced Algorithms', 'System Design Basics', 'RESTful APIs', 'Authentication'],
            difficulty: 'Medium',
            estimatedHours: 40,
            topicDetails: [
              { topic: 'Sorting & Searching', hours: 8, resources: 12 },
              { topic: 'Dynamic Programming', hours: 12, resources: 15 },
              { topic: 'API Design Patterns', hours: 10, resources: 14 },
              { topic: 'JWT & OAuth', hours: 10, resources: 13 }
            ]
          },
          {
            phase: 3,
            name: 'Advanced Backend',
            duration: '2-3 weeks',
            topics: ['Distributed Systems', 'Microservices', 'Caching', 'Message Queues'],
            difficulty: 'Hard',
            estimatedHours: 35,
            topicDetails: [
              { topic: 'Database Optimization', hours: 8, resources: 11 },
              { topic: 'Redis & Caching', hours: 8, resources: 10 },
              { topic: 'Microservices Architecture', hours: 12, resources: 14 },
              { topic: 'Load Balancing', hours: 7, resources: 9 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['Mock Interviews', 'Company-Specific Questions', 'System Design Deep Dives'],
            difficulty: 'Hard',
            estimatedHours: 25,
            topicDetails: [
              { topic: 'Technical Mock Interviews', hours: 10, resources: 20 },
              { topic: 'System Design Cases', hours: 10, resources: 15 },
              { topic: 'Behavioral Prep', hours: 5, resources: 8 }
            ]
          }
        ]
      },
      'Frontend Developer': {
        phases: [
          {
            phase: 1,
            name: 'Frontend Fundamentals',
            duration: '2 weeks',
            topics: ['HTML/CSS Mastery', 'JavaScript Fundamentals', 'DOM Manipulation'],
            difficulty: 'Easy',
            estimatedHours: 25,
            topicDetails: [
              { topic: 'HTML5 & Semantic Markup', hours: 6, resources: 10 },
              { topic: 'CSS3 & Flexbox/Grid', hours: 8, resources: 12 },
              { topic: 'JavaScript Basics', hours: 11, resources: 14 }
            ]
          },
          {
            phase: 2,
            name: 'React Mastery',
            duration: '3 weeks',
            topics: ['React Fundamentals', 'State Management', 'Hooks & Context API'],
            difficulty: 'Medium',
            estimatedHours: 40,
            topicDetails: [
              { topic: 'React Components & JSX', hours: 10, resources: 14 },
              { topic: 'State & Props', hours: 10, resources: 12 },
              { topic: 'Hooks Deep Dive', hours: 12, resources: 15 },
              { topic: 'Redux/Zustand', hours: 8, resources: 11 }
            ]
          },
          {
            phase: 3,
            name: 'Advanced Frontend',
            duration: '2-3 weeks',
            topics: ['Performance Optimization', 'Testing', 'Advanced Patterns'],
            difficulty: 'Hard',
            estimatedHours: 35,
            topicDetails: [
              { topic: 'Code Splitting & Lazy Loading', hours: 8, resources: 10 },
              { topic: 'Jest & React Testing Library', hours: 10, resources: 12 },
              { topic: 'Web Performance', hours: 10, resources: 11 },
              { topic: 'Accessibility (A11y)', hours: 7, resources: 9 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['Mock Interviews', 'Coding Challenges', 'System Design Light'],
            difficulty: 'Hard',
            estimatedHours: 20,
            topicDetails: [
              { topic: 'Frontend Coding Problems', hours: 10, resources: 15 },
              { topic: 'Mock Interviews', hours: 7, resources: 12 },
              { topic: 'Behavioral Questions', hours: 3, resources: 5 }
            ]
          }
        ]
      },
      'Full Stack Developer': {
        phases: [
          {
            phase: 1,
            name: 'Full Stack Foundations',
            duration: '2-3 weeks',
            topics: ['Web Basics', 'Frontend Essentials', 'Backend Basics'],
            difficulty: 'Easy',
            estimatedHours: 35,
            topicDetails: [
              { topic: 'HTML/CSS Fundamentals', hours: 8, resources: 12 },
              { topic: 'JavaScript Core', hours: 12, resources: 14 },
              { topic: 'HTTP & Networking', hours: 8, resources: 10 },
              { topic: 'Server Basics', hours: 7, resources: 9 }
            ]
          },
          {
            phase: 2,
            name: 'Frontend & Backend Skills',
            duration: '4 weeks',
            topics: ['React Framework', 'Node.js & Express', 'Database Design'],
            difficulty: 'Medium',
            estimatedHours: 50,
            topicDetails: [
              { topic: 'React Deep Dive', hours: 15, resources: 16 },
              { topic: 'Node.js & Express', hours: 15, resources: 15 },
              { topic: 'SQL & NoSQL', hours: 12, resources: 12 },
              { topic: 'API Development', hours: 8, resources: 11 }
            ]
          },
          {
            phase: 3,
            name: 'Advanced Full Stack',
            duration: '3 weeks',
            topics: ['Deployment', 'Authentication', 'Performance Optimization'],
            difficulty: 'Hard',
            estimatedHours: 40,
            topicDetails: [
              { topic: 'Docker & Containerization', hours: 10, resources: 11 },
              { topic: 'CI/CD Pipeline', hours: 8, resources: 10 },
              { topic: 'Security Best Practices', hours: 10, resources: 12 },
              { topic: 'Monitoring & Logging', hours: 12, resources: 11 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2-3 weeks',
            topics: ['System Design', 'Full Stack Problems', 'Mock Interviews'],
            difficulty: 'Hard',
            estimatedHours: 30,
            topicDetails: [
              { topic: 'System Design Mastery', hours: 12, resources: 16 },
              { topic: 'Mock Interviews', hours: 12, resources: 16 },
              { topic: 'Behavioral Prep', hours: 6, resources: 10 }
            ]
          }
        ]
      },
      'Data Scientist': {
        phases: [
          {
            phase: 1,
            name: 'Math & Statistics Foundation',
            duration: '3 weeks',
            topics: ['Linear Algebra', 'Probability & Statistics', 'Python Basics'],
            difficulty: 'Medium',
            estimatedHours: 40,
            topicDetails: [
              { topic: 'Linear Algebra for ML', hours: 12, resources: 14 },
              { topic: 'Probability & Statistics', hours: 12, resources: 15 },
              { topic: 'Python Programming', hours: 10, resources: 12 },
              { topic: 'NumPy & Pandas', hours: 6, resources: 10 }
            ]
          },
          {
            phase: 2,
            name: 'Machine Learning Fundamentals',
            duration: '4 weeks',
            topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
            difficulty: 'Medium',
            estimatedHours: 50,
            topicDetails: [
              { topic: 'Linear & Logistic Regression', hours: 12, resources: 16 },
              { topic: 'Decision Trees & Random Forests', hours: 10, resources: 14 },
              { topic: 'Clustering Algorithms', hours: 10, resources: 12 },
              { topic: 'Model Evaluation Metrics', hours: 8, resources: 10 },
              { topic: 'Feature Engineering', hours: 10, resources: 13 }
            ]
          },
          {
            phase: 3,
            name: 'Deep Learning & Advanced Topics',
            duration: '4 weeks',
            topics: ['Neural Networks', 'CNNs', 'NLP', 'Model Deployment'],
            difficulty: 'Hard',
            estimatedHours: 55,
            topicDetails: [
              { topic: 'Deep Learning Basics', hours: 15, resources: 18 },
              { topic: 'TensorFlow/PyTorch', hours: 15, resources: 20 },
              { topic: 'Computer Vision', hours: 12, resources: 14 },
              { topic: 'NLP & Transformers', hours: 13, resources: 16 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['Case Studies', 'ML System Design', 'Coding Challenges'],
            difficulty: 'Hard',
            estimatedHours: 30,
            topicDetails: [
              { topic: 'ML Case Studies', hours: 10, resources: 15 },
              { topic: 'ML System Design', hours: 10, resources: 14 },
              { topic: 'SQL & Python Coding', hours: 10, resources: 12 }
            ]
          }
        ]
      },
      'DevOps Engineer': {
        phases: [
          {
            phase: 1,
            name: 'Linux & Networking',
            duration: '2 weeks',
            topics: ['Linux Administration', 'Networking Basics', 'Shell Scripting'],
            difficulty: 'Medium',
            estimatedHours: 30,
            topicDetails: [
              { topic: 'Linux Commands & File System', hours: 10, resources: 12 },
              { topic: 'TCP/IP & DNS', hours: 8, resources: 10 },
              { topic: 'Bash Scripting', hours: 12, resources: 14 }
            ]
          },
          {
            phase: 2,
            name: 'CI/CD & Containers',
            duration: '3 weeks',
            topics: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Git'],
            difficulty: 'Medium',
            estimatedHours: 45,
            topicDetails: [
              { topic: 'Docker Containers', hours: 12, resources: 16 },
              { topic: 'Kubernetes Basics', hours: 15, resources: 18 },
              { topic: 'Jenkins/GitHub Actions', hours: 10, resources: 14 },
              { topic: 'Git Advanced', hours: 8, resources: 12 }
            ]
          },
          {
            phase: 3,
            name: 'Cloud & Infrastructure',
            duration: '3 weeks',
            topics: ['AWS/Azure/GCP', 'Terraform', 'Monitoring', 'Security'],
            difficulty: 'Hard',
            estimatedHours: 50,
            topicDetails: [
              { topic: 'AWS Services', hours: 15, resources: 20 },
              { topic: 'Infrastructure as Code', hours: 12, resources: 15 },
              { topic: 'Prometheus & Grafana', hours: 10, resources: 12 },
              { topic: 'Security Best Practices', hours: 13, resources: 14 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['System Design', 'Troubleshooting', 'Scenario Questions'],
            difficulty: 'Hard',
            estimatedHours: 25,
            topicDetails: [
              { topic: 'DevOps System Design', hours: 10, resources: 14 },
              { topic: 'Incident Management', hours: 8, resources: 10 },
              { topic: 'Mock Interviews', hours: 7, resources: 12 }
            ]
          }
        ]
      },
      'Mobile Developer': {
        phases: [
          {
            phase: 1,
            name: 'Mobile Development Basics',
            duration: '2 weeks',
            topics: ['Programming Fundamentals', 'UI/UX Basics', 'Platform Choice'],
            difficulty: 'Easy',
            estimatedHours: 30,
            topicDetails: [
              { topic: 'Swift/Kotlin Basics', hours: 12, resources: 14 },
              { topic: 'Mobile UI Patterns', hours: 10, resources: 12 },
              { topic: 'Android/iOS Basics', hours: 8, resources: 10 }
            ]
          },
          {
            phase: 2,
            name: 'Cross-Platform Development',
            duration: '4 weeks',
            topics: ['React Native', 'State Management', 'Navigation', 'APIs'],
            difficulty: 'Medium',
            estimatedHours: 50,
            topicDetails: [
              { topic: 'React Native Fundamentals', hours: 15, resources: 18 },
              { topic: 'Redux/Context API', hours: 10, resources: 14 },
              { topic: 'React Navigation', hours: 10, resources: 12 },
              { topic: 'REST API Integration', hours: 15, resources: 16 }
            ]
          },
          {
            phase: 3,
            name: 'Advanced Mobile Features',
            duration: '3 weeks',
            topics: ['Performance', 'Offline Storage', 'Push Notifications', 'Testing'],
            difficulty: 'Hard',
            estimatedHours: 45,
            topicDetails: [
              { topic: 'App Performance Optimization', hours: 12, resources: 14 },
              { topic: 'Async Storage & SQLite', hours: 10, resources: 12 },
              { topic: 'Firebase Integration', hours: 12, resources: 15 },
              { topic: 'Testing & Debugging', hours: 11, resources: 13 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['App Architecture', 'Coding Challenges', 'Portfolio Projects'],
            difficulty: 'Hard',
            estimatedHours: 28,
            topicDetails: [
              { topic: 'Mobile Design Patterns', hours: 10, resources: 14 },
              { topic: 'Coding Problems', hours: 10, resources: 12 },
              { topic: 'Mock Interviews', hours: 8, resources: 10 }
            ]
          }
        ]
      },
      'System Architect': {
        phases: [
          {
            phase: 1,
            name: 'Software Architecture Fundamentals',
            duration: '3 weeks',
            topics: ['Design Patterns', 'SOLID Principles', 'Architecture Patterns'],
            difficulty: 'Hard',
            estimatedHours: 45,
            topicDetails: [
              { topic: 'Design Patterns Mastery', hours: 15, resources: 18 },
              { topic: 'SOLID & Clean Code', hours: 12, resources: 14 },
              { topic: 'Architecture Styles', hours: 18, resources: 20 }
            ]
          },
          {
            phase: 2,
            name: 'Distributed Systems',
            duration: '4 weeks',
            topics: ['Microservices', 'Message Queues', 'Databases', 'Caching'],
            difficulty: 'Hard',
            estimatedHours: 55,
            topicDetails: [
              { topic: 'Microservices Architecture', hours: 15, resources: 20 },
              { topic: 'Event-Driven Architecture', hours: 12, resources: 16 },
              { topic: 'Database Design', hours: 15, resources: 18 },
              { topic: 'Caching Strategies', hours: 13, resources: 15 }
            ]
          },
          {
            phase: 3,
            name: 'System Design Mastery',
            duration: '4 weeks',
            topics: ['Scalability', 'Reliability', 'Security', 'Performance'],
            difficulty: 'Hard',
            estimatedHours: 60,
            topicDetails: [
              { topic: 'Scaling Strategies', hours: 15, resources: 20 },
              { topic: 'High Availability', hours: 15, resources: 18 },
              { topic: 'Security Architecture', hours: 15, resources: 17 },
              { topic: 'Performance Optimization', hours: 15, resources: 19 }
            ]
          },
          {
            phase: 4,
            name: 'Interview Preparation',
            duration: '2 weeks',
            topics: ['System Design Interviews', 'Trade-offs', 'Case Studies'],
            difficulty: 'Hard',
            estimatedHours: 35,
            topicDetails: [
              { topic: 'System Design Problems', hours: 15, resources: 20 },
              { topic: 'Architecture Reviews', hours: 12, resources: 16 },
              { topic: 'Mock Interviews', hours: 8, resources: 12 }
            ]
          }
        ]
      }
    };

    return pathTemplates[targetRole] || pathTemplates['Full Stack Developer'];
  }

  /**
   * Adjust template based on experience level - UNIQUE FOR EACH LEVEL
   */
  adjustTemplateForExperience(baseTemplate, experienceLevel) {
    const adjustedTemplate = JSON.parse(JSON.stringify(baseTemplate)); // Deep clone

    if (experienceLevel === 'beginner') {
      // BEGINNER: Start from absolute basics, more time, more resources
      adjustedTemplate.phases = adjustedTemplate.phases.map((phase, idx) => {
        if (idx === 0) {
          // Add fundamentals phase
          return {
            phase: phase.phase,
            name: 'Programming Fundamentals',
            duration: '3-4 weeks',
            difficulty: 'Easy',
            estimatedHours: 45,
            topics: ['Basic Programming', 'Problem Solving', 'Code Logic', 'Debugging'],
            topicDetails: [
              { topic: 'Variables & Data Types', hours: 8, resources: 20 },
              { topic: 'Control Flow (if/else, loops)', hours: 10, resources: 18 },
              { topic: 'Functions & Scope', hours: 12, resources: 22 },
              { topic: 'Basic Data Structures', hours: 15, resources: 25 }
            ]
          };
        } else if (idx === 1) {
          // Simplify second phase
          return {
            phase: phase.phase,
            name: phase.name + ' (Beginner)',
            duration: '4-5 weeks',
            difficulty: 'Easy-Medium',
            estimatedHours: phase.estimatedHours + 15,
            topics: phase.topics,
            topicDetails: phase.topicDetails.map(topic => ({
              ...topic,
              hours: topic.hours + 5, // More time per topic
              resources: topic.resources + 10 // More resources
            }))
          };
        } else if (idx === 2) {
          // Make third phase intermediate level
          return {
            phase: phase.phase,
            name: 'Intermediate ' + phase.name,
            duration: '3-4 weeks',
            difficulty: 'Medium',
            estimatedHours: phase.estimatedHours,
            topics: phase.topics.slice(0, 3), // Reduce topics
            topicDetails: phase.topicDetails.slice(0, 3).map(topic => ({
              ...topic,
              hours: topic.hours + 3
            }))
          };
        } else {
          // Skip advanced phase for beginners - focus on basics
          return {
            phase: phase.phase,
            name: 'Building Portfolio Projects',
            duration: '2-3 weeks',
            difficulty: 'Medium',
            estimatedHours: 30,
            topics: ['First Project', 'Code Review', 'Best Practices', 'Documentation'],
            topicDetails: [
              { topic: 'Build a Simple CRUD App', hours: 12, resources: 15 },
              { topic: 'Code Quality & Testing', hours: 8, resources: 12 },
              { topic: 'Git & Version Control', hours: 6, resources: 10 },
              { topic: 'Deploy Your Project', hours: 4, resources: 8 }
            ]
          };
        }
      });
    } else if (experienceLevel === 'intermediate') {
      // INTERMEDIATE: Skip basics, focus on advanced concepts
      adjustedTemplate.phases = adjustedTemplate.phases.map((phase, idx) => {
        if (idx === 0) {
          // Skip absolute basics, start with data structures
          return {
            phase: phase.phase,
            name: 'Advanced ' + phase.name,
            duration: '2 weeks',
            difficulty: 'Medium',
            estimatedHours: phase.estimatedHours - 10,
            topics: phase.topics,
            topicDetails: phase.topicDetails.map(topic => ({
              ...topic,
              hours: Math.max(4, topic.hours - 2), // Less time (they know basics)
              resources: topic.resources
            }))
          };
        } else if (idx === 1) {
          // Keep second phase as-is
          return phase;
        } else if (idx === 2) {
          // Expand third phase with more depth
          return {
            phase: phase.phase,
            name: phase.name + ' Deep Dive',
            duration: '3-4 weeks',
            difficulty: 'Hard',
            estimatedHours: phase.estimatedHours + 10,
            topics: [...phase.topics, 'Performance Optimization', 'Security'],
            topicDetails: [
              ...phase.topicDetails,
              { topic: 'Performance Tuning', hours: 8, resources: 12 },
              { topic: 'Security Best Practices', hours: 7, resources: 10 }
            ]
          };
        } else {
          // Interview prep remains similar
          return phase;
        }
      });
    } else if (experienceLevel === 'advanced') {
      // ADVANCED: Skip all basics, focus on expert-level topics
      adjustedTemplate.phases = adjustedTemplate.phases.map((phase, idx) => {
        if (idx === 0) {
          // Replace with architecture patterns
          return {
            phase: phase.phase,
            name: 'Architecture & Design Patterns',
            duration: '2 weeks',
            difficulty: 'Hard',
            estimatedHours: 30,
            topics: ['Design Patterns', 'SOLID Principles', 'Clean Architecture', 'DDD'],
            topicDetails: [
              { topic: 'Creational Patterns', hours: 6, resources: 12 },
              { topic: 'Structural Patterns', hours: 6, resources: 12 },
              { topic: 'Behavioral Patterns', hours: 8, resources: 14 },
              { topic: 'Domain-Driven Design', hours: 10, resources: 16 }
            ]
          };
        } else if (idx === 1) {
          // Replace with system design
          return {
            phase: phase.phase,
            name: 'System Design & Scalability',
            duration: '3 weeks',
            difficulty: 'Hard',
            estimatedHours: 45,
            topics: ['Distributed Systems', 'Scalability', 'High Availability', 'CAP Theorem'],
            topicDetails: [
              { topic: 'Microservices Architecture', hours: 12, resources: 18 },
              { topic: 'Event-Driven Systems', hours: 10, resources: 15 },
              { topic: 'Database Scaling', hours: 12, resources: 16 },
              { topic: 'Load Balancing & CDN', hours: 11, resources: 14 }
            ]
          };
        } else if (idx === 2) {
          // Advanced performance optimization
          return {
            phase: phase.phase,
            name: 'Performance & Optimization',
            duration: '2-3 weeks',
            difficulty: 'Expert',
            estimatedHours: 40,
            topics: ['Profiling', 'Caching Strategies', 'Query Optimization', 'Code Optimization'],
            topicDetails: [
              { topic: 'Application Profiling', hours: 10, resources: 12 },
              { topic: 'Advanced Caching (Redis, Memcached)', hours: 10, resources: 14 },
              { topic: 'Database Query Optimization', hours: 12, resources: 15 },
              { topic: 'Algorithm Optimization', hours: 8, resources: 11 }
            ]
          };
        } else {
          // Senior-level interview prep
          return {
            phase: phase.phase,
            name: 'Senior-Level Interview Mastery',
            duration: '2 weeks',
            difficulty: 'Expert',
            estimatedHours: 30,
            topics: ['System Design Interviews', 'Leadership Questions', 'Trade-off Analysis', 'Technical Leadership'],
            topicDetails: [
              { topic: 'Complex System Design', hours: 12, resources: 20 },
              { topic: 'Architectural Trade-offs', hours: 8, resources: 15 },
              { topic: 'Leadership & Mentoring', hours: 6, resources: 10 },
              { topic: 'Mock Senior Interviews', hours: 4, resources: 12 }
            ]
          };
        }
      });
    }

    return adjustedTemplate;
  }

  /**
   * Personalize learning path using AI - SIMPLIFIED & FOCUSED
   */
  async personalizePathWithAI(targetRole, currentSkills, experienceLevel, baseTemplate) {
    try {
      const experienceLevelContext = {
        'beginner': 'This is a BEGINNER with limited programming experience. Focus on fundamentals, explain concepts clearly, and provide more learning time.',
        'intermediate': 'This is an INTERMEDIATE developer who knows the basics. Skip fundamentals, focus on advanced concepts and best practices.',
        'advanced': 'This is an ADVANCED developer seeking expert-level knowledge. Focus on architecture, system design, and optimization. Skip all basics.'
      };

      const prompt = `You are an expert technical mentor. Create a focused learning roadmap for a ${targetRole}.

Experience Level: ${experienceLevel.toUpperCase()}
${experienceLevelContext[experienceLevel]}

Current skills: ${currentSkills.join(', ')}

Base learning path (already adjusted for ${experienceLevel} level):
${JSON.stringify(baseTemplate, null, 2)}

TASK: Further personalize based on their current skills:
1. If they already know a topic, SKIP IT or reduce time significantly
2. Add missing critical topics for a ${experienceLevel} ${targetRole}
3. Adjust difficulty and duration appropriately for ${experienceLevel} level
4. Keep it FOCUSED on the core learning journey

Return ONLY the phases array as JSON with this exact structure:
{
  "phases": [
    {
      "phase": 1,
      "name": "Phase Name",
      "duration": "2 weeks",
      "difficulty": "Easy/Medium/Hard/Expert",
      "estimatedHours": 30,
      "topics": ["Topic1", "Topic2"],
      "topicDetails": [
        {"topic": "Specific Topic", "hours": 10, "resources": 15}
      ]
    }
  ]
}

Focus on clarity and actionable learning steps. No extra fluff.`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      try {
        // Extract JSON from response
        let jsonText = text;
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonText = codeBlockMatch[1];
        } else {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
        }

        const aiResponse = JSON.parse(jsonText);
        
        // Return clean, focused path
        return {
          ...baseTemplate,
          phases: aiResponse.phases || baseTemplate.phases,
          aiOptimized: true,
          personalizedFor: currentSkills,
          totalDuration: this.calculateTotalDuration(aiResponse.phases || baseTemplate.phases),
          totalEstimatedHours: this.calculateTotalHours(aiResponse.phases || baseTemplate.phases)
        };
      } catch (parseError) {
        console.error('AI JSON parse error:', parseError.message);
        // Return base template if AI fails
        return {
          ...baseTemplate,
          aiOptimized: false,
          personalizedFor: currentSkills,
          totalDuration: this.calculateTotalDuration(baseTemplate.phases),
          totalEstimatedHours: this.calculateTotalHours(baseTemplate.phases)
        };
      }
    } catch (error) {
      console.error('AI personalization failed:', error.message);
      return {
        ...baseTemplate,
        aiOptimized: false,
        personalizedFor: currentSkills,
        totalDuration: this.calculateTotalDuration(baseTemplate.phases),
        totalEstimatedHours: this.calculateTotalHours(baseTemplate.phases)
      };
    }
  }

  /**
   * Create fallback personalized path if AI fails - REMOVED COMPLEXITY
   */
  createFallbackPersonalizedPath(baseTemplate, targetRole, currentSkills) {
    return {
      ...baseTemplate,
      aiOptimized: false,
      personalizedFor: currentSkills,
      totalDuration: this.calculateTotalDuration(baseTemplate.phases),
      totalEstimatedHours: this.calculateTotalHours(baseTemplate.phases)
    };
  }

  // REMOVED: getCriticalSkills, getDefaultProjects, getDefaultCertifications, 
  // getDefaultInterviewStrategy, getDefaultNetworkingPlan
  // These overcomplicated the feature - focus on LEARNING PATH ONLY

  /**
   * Calculate total duration from phases
   */
  calculateTotalDuration(phases) {
    if (!phases || phases.length === 0) return '0 weeks';
    const totalWeeks = phases.reduce((sum, phase) => {
      const weeks = phase.duration.match(/\d+/)[0];
      return sum + parseInt(weeks);
    }, 0);
    return `${totalWeeks} weeks`;
  }

  /**
   * Calculate total estimated hours
   */
  calculateTotalHours(phases) {
    if (!phases || phases.length === 0) return 0;
    return phases.reduce((sum, phase) => sum + (phase.estimatedHours || 0), 0);
  }

  /**
   * Get learning milestones for tracking progress
   */
  async getLearningMilestones(targetRole) {
    return {
      milestones: [
        { milestone: 1, name: 'Foundation Basics', description: 'Master data structures and algorithms fundamentals', weekCompleted: 2 },
        { milestone: 2, name: 'Intermediate Skills', description: 'Deep dive into core concepts', weekCompleted: 5 },
        { milestone: 3, name: 'Advanced Mastery', description: 'Learn advanced techniques and patterns', weekCompleted: 8 },
        { milestone: 4, name: 'Interview Ready', description: 'Complete mock interviews and system design', weekCompleted: 10 }
      ],
      nextMilestone: 1,
      progressPercentage: 0
    };
  }

  /**
   * Get resource recommendations for specific topic
   */
  async getResourcesForTopic(topic, difficulty) {
    return {
      topic,
      difficulty,
      resources: [
        { type: 'video', title: `${topic} - Complete Guide`, platform: 'YouTube', duration: '2-3 hours', url: '#' },
        { type: 'article', title: `Understanding ${topic}`, platform: 'Medium', duration: '30 mins', url: '#' },
        { type: 'interactive', title: `${topic} Practice`, platform: 'Interactive Coding', duration: '1-2 hours', url: '#' },
        { type: 'book', title: `${topic} Mastery`, platform: 'Book', duration: '5-10 hours', url: '#' }
      ]
    };
  }

  /**
   * Get AI-powered learning resources for a specific topic
   * Uses experience level and role to provide targeted recommendations
   */
  async getAILearningResources(topic, experienceLevel, targetRole) {
    try {
      const levelMapping = {
        'beginner': 'Beginner-friendly with step-by-step explanations',
        'intermediate': 'Intermediate level with practical applications',
        'advanced': 'Advanced with deep dives and best practices'
      };

      const prompt = `You are a learning resource curator with deep knowledge of programming tutorials, courses, and documentation. Provide 4-6 REAL, SPECIFIC learning resources for:

Topic: ${topic}
Experience Level: ${experienceLevel}
Target Role: ${targetRole}

CRITICAL REQUIREMENTS (YOU MUST FOLLOW THESE):
1. Resources must be ${levelMapping[experienceLevel] || 'appropriate for the level'}
2. ONLY provide WORKING URLs to real content
3. For YouTube: Use search format https://www.youtube.com/@CHANNEL/search?query=TOPIC
4. For articles: Use https://medium.com/search?q=TOPIC (more reliable than tags)
5. For docs: Use official documentation sites (react.dev, nodejs.org, developer.mozilla.org, etc.)
6. For courses: Use YouTube channels (FreeCodeCamp, Traversy Media, etc.) with search

VALID URL PATTERNS (GUARANTEED TO WORK):
✓ https://www.youtube.com/@freecodecamp/search?query=${encodeURIComponent(topic)}
✓ https://www.youtube.com/@TraversyMedia/search?query=${encodeURIComponent(topic)}
✓ https://medium.com/search?q=${encodeURIComponent(topic)}
✓ https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(topic)} (for web topics)
✓ https://react.dev or https://nodejs.org/docs/ (for official framework docs)

INVALID URL PATTERNS (NEVER USE THESE):
✗ https://www.youtube.com/results?search_query=...
✗ https://www.google.com/search?q=...
✗ https://dev.to/search?q=...
✗ https://medium.com/tag/... (tags often lead to 404)
✗ https://www.freecodecamp.org/news/tag/... (tags often lead to 404)
✗ https://developer.mozilla.org/en-US/docs/Web/... (direct paths often 404)
✗ Any URL with outdated or broken patterns

RECOMMENDED URLS FOR "${topic}":
- Video: https://www.youtube.com/@freecodecamp/search?query=${encodeURIComponent(topic)}
- Article: https://medium.com/search?q=${encodeURIComponent(topic)}
- Course: https://www.youtube.com/@freecodecamp/search?query=${encodeURIComponent(topic)}
- Docs: https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(topic)}

Return ONLY a JSON array in this exact format:
[
  {
    "type": "video|article|course|documentation",
    "title": "Exact title of the resource",
    "description": "Brief description (1 sentence)",
    "duration": "Time estimate (e.g., 45 mins, 2 hours, 1 week)",
    "level": "beginner|intermediate|advanced",
    "url": "WORKING URL using the valid patterns above"
  }
]

CRITICAL: Test your URLs mentally - they must be real working URLs, not search result pages.`;


      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('AI response for resources:', text);
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const resources = JSON.parse(jsonMatch[0]);
        
        // Validate URLs - filter out any search pages that slipped through
        const validResources = resources.filter(resource => {
          const url = resource.url.toLowerCase();
          // Block any URL that looks like a search page
          if (url.includes('search?q=') || 
              url.includes('results?search_query=') ||
              url.includes('google.com/search')) {
            console.warn('Filtered out search URL:', resource.url);
            return false;
          }
          return true;
        });

        // If AI gave us valid resources, use them
        if (validResources.length >= 3) {
          return {
            success: true,
            resources: validResources,
            topic: topic,
            experienceLevel: experienceLevel
          };
        }
      }

      // Fallback if AI fails to generate proper JSON or valid URLs
      console.log('Using fallback resources for:', topic);
      return this.getFallbackResources(topic, experienceLevel);
    } catch (error) {
      console.error('AI Resource generation error:', error);
      return this.getFallbackResources(topic, experienceLevel);
    }
  }

  /**
   * Fallback resources when AI fails - uses curated, high-quality resources
   */
  getFallbackResources(topic, experienceLevel) {
    const levelEmoji = {
      'beginner': '🌱',
      'intermediate': '🚀',
      'advanced': '🎯'
    };

    const emoji = levelEmoji[experienceLevel] || '📚';
    
    // Create more intelligent fallback URLs based on topic
    const getYouTubeChannel = (topic) => {
      // Map topics to known quality channels - use @channel format for channel pages
      const topicLower = topic.toLowerCase();
      const searchTerm = encodeURIComponent(topic);
      
      if (topicLower.includes('javascript') || topicLower.includes('js') || topicLower.includes('react') || topicLower.includes('node')) {
        return `https://www.youtube.com/@TraversyMedia/search?query=${searchTerm}`;
      } else if (topicLower.includes('python') || topicLower.includes('django')) {
        return `https://www.youtube.com/@coreyms/search?query=${searchTerm}`;
      } else if (topicLower.includes('system design') || topicLower.includes('architecture')) {
        return `https://www.youtube.com/@ByteByteGo/search?query=${searchTerm}`;
      } else if (topicLower.includes('css') || topicLower.includes('html') || topicLower.includes('frontend')) {
        return `https://www.youtube.com/@KevinPowell/search?query=${searchTerm}`;
      } else if (topicLower.includes('data') || topicLower.includes('machine learning') || topicLower.includes('ai')) {
        return `https://www.youtube.com/@3blue1brown/search?query=${searchTerm}`;
      }
      // Default to freeCodeCamp for comprehensive tutorials
      return `https://www.youtube.com/@freecodecamp/search?query=${searchTerm}`;
    };

    const getArticleUrl = (topic) => {
      const topicLower = topic.toLowerCase();
      const searchTerm = encodeURIComponent(topic);
      
      // Use search URLs instead of tags - more reliable
      if (topicLower.includes('javascript') || topicLower.includes('react') || topicLower.includes('node')) {
        return `https://medium.com/search?q=${searchTerm}`;
      } else if (topicLower.includes('python')) {
        return `https://medium.com/search?q=${searchTerm}`;
      } else if (topicLower.includes('system design')) {
        return `https://medium.com/search?q=system+design`;
      }
      // Use Medium search as it's more reliable than tags
      return `https://medium.com/search?q=${searchTerm}`;
    };

    const getDocumentationUrl = (topic) => {
      const topicLower = topic.toLowerCase();
      // Map to official documentation sites
      if (topicLower.includes('react')) return 'https://react.dev';
      if (topicLower.includes('vue')) return 'https://vuejs.org/guide/introduction.html';
      if (topicLower.includes('angular')) return 'https://angular.io/docs';
      if (topicLower.includes('node') || topicLower.includes('nodejs')) return 'https://nodejs.org/docs/latest/api/';
      if (topicLower.includes('express')) return 'https://expressjs.com/en/starter/installing.html';
      if (topicLower.includes('python')) return 'https://docs.python.org/3/';
      if (topicLower.includes('django')) return 'https://docs.djangoproject.com/';
      if (topicLower.includes('typescript')) return 'https://www.typescriptlang.org/docs/';
      if (topicLower.includes('next')) return 'https://nextjs.org/docs';
      if (topicLower.includes('mongodb')) return 'https://www.mongodb.com/docs/';
      if (topicLower.includes('postgresql') || topicLower.includes('postgres')) return 'https://www.postgresql.org/docs/';
      if (topicLower.includes('docker')) return 'https://docs.docker.com/';
      if (topicLower.includes('kubernetes') || topicLower.includes('k8s')) return 'https://kubernetes.io/docs/';
      if (topicLower.includes('git')) return 'https://git-scm.com/doc';
      if (topicLower.includes('graphql')) return 'https://graphql.org/learn/';
      if (topicLower.includes('redux')) return 'https://redux.js.org/introduction/getting-started';
      if (topicLower.includes('tailwind')) return 'https://tailwindcss.com/docs';
      if (topicLower.includes('bootstrap')) return 'https://getbootstrap.com/docs/';
      
      // Use MDN search instead of direct path (more reliable)
      const searchTerm = encodeURIComponent(topic);
      return `https://developer.mozilla.org/en-US/search?q=${searchTerm}`;
    };

    const getCourseUrl = (topic) => {
      // Use FreeCodeCamp YouTube for courses - most reliable and has comprehensive tutorials
      const searchTerm = encodeURIComponent(topic);
      return `https://www.youtube.com/@freecodecamp/search?query=${searchTerm}`;
    };
    
    return {
      success: true,
      resources: [
        {
          type: 'video',
          title: `${emoji} ${topic} - Complete Tutorial`,
          description: `Comprehensive ${experienceLevel} guide to ${topic} from trusted educators`,
          duration: experienceLevel === 'beginner' ? '2-3 hours' : experienceLevel === 'advanced' ? '4-6 hours' : '3-4 hours',
          level: experienceLevel,
          url: getYouTubeChannel(topic)
        },
        {
          type: 'article',
          title: `Understanding ${topic}`,
          description: `In-depth articles and tutorials covering ${topic} fundamentals and best practices`,
          duration: '30-45 mins',
          level: experienceLevel,
          url: getArticleUrl(topic)
        },
        {
          type: 'documentation',
          title: `${topic} - Official Documentation`,
          description: 'Official docs and reference guide',
          duration: '1-2 hours',
          level: experienceLevel,
          url: getDocumentationUrl(topic)
        },
        {
          type: 'course',
          title: `Master ${topic}`,
          description: `Free tutorials and guides on ${topic} with hands-on projects`,
          duration: experienceLevel === 'beginner' ? '1-2 weeks' : '3-7 days',
          level: experienceLevel,
          url: getCourseUrl(topic)
        }
      ],
      topic: topic,
      experienceLevel: experienceLevel,
      fallback: true
    };
  }
}

module.exports = new LearningPathService();

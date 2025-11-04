const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Learning resources database (mock data for now)
const learningResources = {
  // Frontend
  'React': [
    { title: 'React Official Documentation', platform: 'React.dev', url: 'https://react.dev', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'React - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', type: 'Course', duration: '48.5 hours', price: '$14.99', rating: 4.6 },
    { title: 'Full React Course 2024', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'Video', duration: '11 hours', rating: 4.8 }
  ],
  'JavaScript': [
    { title: 'JavaScript.info', platform: 'javascript.info', url: 'https://javascript.info', type: 'Documentation', duration: '20 hours', rating: 5.0 },
    { title: 'The Complete JavaScript Course', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-javascript-course/', type: 'Course', duration: '69 hours', price: '$14.99', rating: 4.7 },
    { title: 'JavaScript for Beginners', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'Interactive', duration: '30 hours', rating: 4.8 }
  ],
  'TypeScript': [
    { title: 'TypeScript Handbook', platform: 'TypeScript', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'Understanding TypeScript', platform: 'Udemy', url: 'https://www.udemy.com/course/understanding-typescript/', type: 'Course', duration: '15.5 hours', price: '$14.99', rating: 4.6 }
  ],
  'Vue': [
    { title: 'Vue.js Documentation', platform: 'Vue.js', url: 'https://vuejs.org/guide/', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'Vue - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/vuejs-2-the-complete-guide/', type: 'Course', duration: '32 hours', price: '$14.99', rating: 4.6 }
  ],
  'Angular': [
    { title: 'Angular Documentation', platform: 'Angular', url: 'https://angular.io/docs', type: 'Documentation', duration: '12 hours', rating: 5.0 },
    { title: 'Angular - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/', type: 'Course', duration: '34 hours', price: '$14.99', rating: 4.6 }
  ],
  
  // Backend
  'Node.js': [
    { title: 'Node.js Documentation', platform: 'Node.js', url: 'https://nodejs.org/docs/', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'The Complete Node.js Course', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', type: 'Course', duration: '35 hours', price: '$14.99', rating: 4.6 },
    { title: 'Node.js Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', type: 'Video', duration: '3 hours', rating: 4.8 }
  ],
  'Express': [
    { title: 'Express.js Documentation', platform: 'Express', url: 'https://expressjs.com', type: 'Documentation', duration: '5 hours', rating: 5.0 },
    { title: 'Node.js, Express & MongoDB', platform: 'Udemy', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', type: 'Course', duration: '42 hours', price: '$14.99', rating: 4.7 }
  ],
  'Python': [
    { title: 'Python Documentation', platform: 'Python.org', url: 'https://docs.python.org/3/', type: 'Documentation', duration: '15 hours', rating: 5.0 },
    { title: 'Complete Python Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/complete-python-bootcamp/', type: 'Course', duration: '22 hours', price: '$14.99', rating: 4.6 },
    { title: 'Python for Everybody', platform: 'Coursera', url: 'https://www.coursera.org/specializations/python', type: 'Course', duration: '32 hours', rating: 4.8 }
  ],
  'Django': [
    { title: 'Django Documentation', platform: 'Django', url: 'https://docs.djangoproject.com/', type: 'Documentation', duration: '12 hours', rating: 5.0 },
    { title: 'Python Django Web Framework', platform: 'Udemy', url: 'https://www.udemy.com/course/python-django-dev-to-deployment/', type: 'Course', duration: '11 hours', price: '$14.99', rating: 4.6 }
  ],
  'Flask': [
    { title: 'Flask Documentation', platform: 'Flask', url: 'https://flask.palletsprojects.com/', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'REST APIs with Flask', platform: 'Udemy', url: 'https://www.udemy.com/course/rest-api-flask-and-python/', type: 'Course', duration: '17 hours', price: '$14.99', rating: 4.6 }
  ],
  'Java': [
    { title: 'Java Documentation', platform: 'Oracle', url: 'https://docs.oracle.com/javase/', type: 'Documentation', duration: '20 hours', rating: 5.0 },
    { title: 'Java Programming Masterclass', platform: 'Udemy', url: 'https://www.udemy.com/course/java-the-complete-java-developer-course/', type: 'Course', duration: '80 hours', price: '$14.99', rating: 4.6 }
  ],
  'Spring': [
    { title: 'Spring Framework Documentation', platform: 'Spring', url: 'https://spring.io/guides', type: 'Documentation', duration: '15 hours', rating: 5.0 },
    { title: 'Spring & Hibernate for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/spring-hibernate-tutorial/', type: 'Course', duration: '41 hours', price: '$14.99', rating: 4.6 }
  ],
  
  // Databases
  'MongoDB': [
    { title: 'MongoDB Documentation', platform: 'MongoDB', url: 'https://docs.mongodb.com', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'MongoDB - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/', type: 'Course', duration: '16 hours', price: '$14.99', rating: 4.6 },
    { title: 'MongoDB University', platform: 'MongoDB', url: 'https://university.mongodb.com', type: 'Course', duration: '20 hours', rating: 4.8 }
  ],
  'PostgreSQL': [
    { title: 'PostgreSQL Documentation', platform: 'PostgreSQL', url: 'https://www.postgresql.org/docs/', type: 'Documentation', duration: '12 hours', rating: 5.0 },
    { title: 'The Complete SQL Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', type: 'Course', duration: '9 hours', price: '$14.99', rating: 4.6 }
  ],
  'MySQL': [
    { title: 'MySQL Documentation', platform: 'MySQL', url: 'https://dev.mysql.com/doc/', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'The Ultimate MySQL Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-ultimate-mysql-bootcamp-go-from-sql-beginner-to-expert/', type: 'Course', duration: '20 hours', price: '$14.99', rating: 4.6 }
  ],
  'SQL': [
    { title: 'SQL Tutorial', platform: 'W3Schools', url: 'https://www.w3schools.com/sql/', type: 'Tutorial', duration: '8 hours', rating: 4.5 },
    { title: 'Complete SQL Mastery', platform: 'Udemy', url: 'https://www.udemy.com/course/sql-mysql-for-data-analytics-and-business-intelligence/', type: 'Course', duration: '12 hours', price: '$14.99', rating: 4.6 }
  ],
  'Redis': [
    { title: 'Redis Documentation', platform: 'Redis', url: 'https://redis.io/documentation', type: 'Documentation', duration: '6 hours', rating: 5.0 },
    { title: 'Redis: The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/redis-the-complete-developers-guide/', type: 'Course', duration: '8 hours', price: '$14.99', rating: 4.5 }
  ],
  
  // DevOps
  'Docker': [
    { title: 'Docker Documentation', platform: 'Docker', url: 'https://docs.docker.com', type: 'Documentation', duration: '10 hours', rating: 5.0 },
    { title: 'Docker Mastery', platform: 'Udemy', url: 'https://www.udemy.com/course/docker-mastery/', type: 'Course', duration: '19 hours', price: '$14.99', rating: 4.7 },
    { title: 'Docker Tutorial for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'Video', duration: '3 hours', rating: 4.8 }
  ],
  'Kubernetes': [
    { title: 'Kubernetes Documentation', platform: 'Kubernetes', url: 'https://kubernetes.io/docs/', type: 'Documentation', duration: '15 hours', rating: 5.0 },
    { title: 'Kubernetes for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/learn-kubernetes/', type: 'Course', duration: '14 hours', price: '$14.99', rating: 4.6 }
  ],
  'AWS': [
    { title: 'AWS Documentation', platform: 'AWS', url: 'https://docs.aws.amazon.com', type: 'Documentation', duration: '30 hours', rating: 5.0 },
    { title: 'AWS Certified Solutions Architect', platform: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', type: 'Course', duration: '27 hours', price: '$14.99', rating: 4.7 },
    { title: 'AWS Free Tier', platform: 'AWS', url: 'https://aws.amazon.com/free/', type: 'Practice', duration: 'Unlimited', rating: 5.0 }
  ],
  'Azure': [
    { title: 'Azure Documentation', platform: 'Microsoft', url: 'https://docs.microsoft.com/azure/', type: 'Documentation', duration: '25 hours', rating: 5.0 },
    { title: 'AZ-900: Azure Fundamentals', platform: 'Microsoft Learn', url: 'https://docs.microsoft.com/learn/certifications/azure-fundamentals/', type: 'Course', duration: '12 hours', rating: 4.8 }
  ],
  'CI/CD': [
    { title: 'GitHub Actions Documentation', platform: 'GitHub', url: 'https://docs.github.com/actions', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'DevOps CI/CD Pipeline', platform: 'Udemy', url: 'https://www.udemy.com/course/devops-ci-cd-pipeline/', type: 'Course', duration: '10 hours', price: '$14.99', rating: 4.5 }
  ],
  
  // Mobile
  'React Native': [
    { title: 'React Native Documentation', platform: 'React Native', url: 'https://reactnative.dev/docs/', type: 'Documentation', duration: '12 hours', rating: 5.0 },
    { title: 'The Complete React Native Course', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-react-native-and-redux-course/', type: 'Course', duration: '30 hours', price: '$14.99', rating: 4.6 }
  ],
  'Flutter': [
    { title: 'Flutter Documentation', platform: 'Flutter', url: 'https://docs.flutter.dev', type: 'Documentation', duration: '15 hours', rating: 5.0 },
    { title: 'Flutter & Dart - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/', type: 'Course', duration: '42 hours', price: '$14.99', rating: 4.6 }
  ],
  'Swift': [
    { title: 'Swift Documentation', platform: 'Apple', url: 'https://developer.apple.com/documentation/swift', type: 'Documentation', duration: '20 hours', rating: 5.0 },
    { title: 'iOS & Swift Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/ios-13-app-development-bootcamp/', type: 'Course', duration: '60 hours', price: '$14.99', rating: 4.7 }
  ],
  
  // AI/ML
  'TensorFlow': [
    { title: 'TensorFlow Documentation', platform: 'TensorFlow', url: 'https://www.tensorflow.org/learn', type: 'Documentation', duration: '15 hours', rating: 5.0 },
    { title: 'TensorFlow Developer Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice', type: 'Course', duration: '40 hours', rating: 4.8 }
  ],
  'PyTorch': [
    { title: 'PyTorch Documentation', platform: 'PyTorch', url: 'https://pytorch.org/tutorials/', type: 'Documentation', duration: '12 hours', rating: 5.0 },
    { title: 'PyTorch for Deep Learning', platform: 'Udemy', url: 'https://www.udemy.com/course/pytorch-for-deep-learning-with-python-bootcamp/', type: 'Course', duration: '16 hours', price: '$14.99', rating: 4.6 }
  ],
  'Machine Learning': [
    { title: 'Machine Learning by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', type: 'Course', duration: '60 hours', rating: 5.0 },
    { title: 'Machine Learning A-Z', platform: 'Udemy', url: 'https://www.udemy.com/course/machinelearning/', type: 'Course', duration: '44 hours', price: '$14.99', rating: 4.5 }
  ],
  
  // Testing
  'Jest': [
    { title: 'Jest Documentation', platform: 'Jest', url: 'https://jestjs.io/docs/getting-started', type: 'Documentation', duration: '6 hours', rating: 5.0 },
    { title: 'JavaScript Testing with Jest', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7r4xVDI2vho', type: 'Video', duration: '2 hours', rating: 4.7 }
  ],
  'Cypress': [
    { title: 'Cypress Documentation', platform: 'Cypress', url: 'https://docs.cypress.io', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'Cypress End-to-End Testing', platform: 'Udemy', url: 'https://www.udemy.com/course/cypress-io-master-class/', type: 'Course', duration: '12 hours', price: '$14.99', rating: 4.6 }
  ],
  
  // Other
  'Git': [
    { title: 'Git Documentation', platform: 'Git', url: 'https://git-scm.com/doc', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'Git Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/git-complete/', type: 'Course', duration: '6 hours', price: '$14.99', rating: 4.6 },
    { title: 'Git & GitHub Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'Video', duration: '1 hour', rating: 4.8 }
  ],
  'GraphQL': [
    { title: 'GraphQL Documentation', platform: 'GraphQL', url: 'https://graphql.org/learn/', type: 'Documentation', duration: '8 hours', rating: 5.0 },
    { title: 'Modern GraphQL Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/graphql-bootcamp/', type: 'Course', duration: '23 hours', price: '$14.99', rating: 4.6 }
  ],
  'REST': [
    { title: 'RESTful API Design', platform: 'Udemy', url: 'https://www.udemy.com/course/restful-api-design/', type: 'Course', duration: '5 hours', price: '$14.99', rating: 4.5 },
    { title: 'REST API Best Practices', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=0oXYLzuucwE', type: 'Video', duration: '1 hour', rating: 4.7 }
  ]
};

/**
 * GET /api/learning/resources
 * Get learning resources for a skill
 */
router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ error: 'Skill parameter is required' });
    }

    // Find resources for the skill (case-insensitive)
    let resources = [];
    const skillLower = skill.toLowerCase().trim();
    
    // Try exact match first
    for (const [key, value] of Object.entries(learningResources)) {
      if (key.toLowerCase() === skillLower) {
        resources = value;
        break;
      }
    }
    
    // If no exact match, try partial match
    if (resources.length === 0) {
      for (const [key, value] of Object.entries(learningResources)) {
        if (key.toLowerCase().includes(skillLower) || skillLower.includes(key.toLowerCase())) {
          resources = value;
          break;
        }
      }
    }
    
    // If still no match, return generic resources
    if (resources.length === 0) {
      resources = [
        { 
          title: `${skill} Tutorial`, 
          platform: 'Google Search', 
          url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' tutorial')}`, 
          type: 'Search', 
          duration: 'Varies', 
          rating: 4.0 
        },
        { 
          title: `${skill} on YouTube`, 
          platform: 'YouTube', 
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`, 
          type: 'Video', 
          duration: 'Varies', 
          rating: 4.0 
        },
        { 
          title: `${skill} Courses`, 
          platform: 'Udemy', 
          url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`, 
          type: 'Course', 
          duration: 'Varies', 
          price: 'Varies', 
          rating: 4.0 
        }
      ];
    }

    res.json({ 
      success: true, 
      skill,
      resources 
    });
  } catch (error) {
    console.error('Get learning resources error:', error);
    res.status(500).json({ 
      error: error.message,
      resources: [] 
    });
  }
});

module.exports = router;

const { PrismaClient } = require('@prisma/client');

// Create Prisma client with connection pooling optimized
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pool middleware for limiting concurrent requests
class ConnectionPoolManager {
  constructor(maxConcurrent = 20) {
    this.maxConcurrent = maxConcurrent;
    this.active = 0;
    this.queue = [];
  }

  async execute(fn) {
    // Wait if at capacity
    while (this.active >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.active++;
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout (60s)')), 60000)
        )
      ]);
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

const poolManager = new ConnectionPoolManager(20);

// Wrap Prisma to use connection pool
const wrappedPrisma = new Proxy(prisma, {
  get(target, prop) {
    // For database operations, wrap in pool manager - include ALL models
    const dbModels = [
      'application', 'user', 'interviewSession', 'interviewResponse', 'resume',
      'resumeAnalysis', 'coverLetter', 'interviewPrep', 'savedSearch', 
      'applicationActivity', 'jobShare', 'referral', 'companyReview',
      'forumPost', 'forumComment', 'autofillData', 'premiumJob',
      'jobBookmark', 'note', 'userPreference', 'companyCareerPage',
      'savedLearningPath'  // Added missing model
    ];
    
    if (dbModels.includes(prop)) {
      return new Proxy(target[prop], {
        get(t, method) {
          if (typeof t[method] === 'function') {
            return function(...args) {
              return poolManager.execute(() => t[method](...args));
            };
          }
          return t[method];
        }
      });
    }
    return target[prop];
  }
});

// Handle connection errors gracefully
prisma.$on('error', (e) => {
  console.error('Database error:', e.message);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Shutdown error:', err);
  }
  process.exit(0);
};

module.exports = wrappedPrisma;
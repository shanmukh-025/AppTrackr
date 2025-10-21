const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
  // Increase connection pool size
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Modify the schema connection_limit via environment or directly configure
// For Supabase, we need to handle connections better
let connectionAttempts = 0;

// Handle connection errors
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

// Graceful shutdown with proper cleanup
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
  process.exit(0);
};

// Disable auto-shutdown on signals - let the server handle it
// process.on('SIGINT', gracefulShutdown);
// process.on('SIGTERM', gracefulShutdown);

// Limit concurrent Prisma queries with a simple queue
class PrismaQueryQueue {
  constructor(maxConcurrent = 10) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async run(fn) {
    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }
}

module.exports = prisma;
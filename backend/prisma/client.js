const { PrismaClient } = require('@prisma/client');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientDatabaseError = (error) => {
  if (!error) return false;

  const text = `${error.code || ''} ${error.message || ''}`.toLowerCase();
  const transientHints = [
    'p1001',
    'p1002',
    'p2024',
    'timeout',
    'timed out',
    'connection',
    'econnrefused',
    'pool'
  ];

  return transientHints.some((hint) => text.includes(hint));
};

const MODEL_METHOD_HINTS = ['findUnique', 'findMany', 'create', 'update', 'delete', 'upsert', 'count', 'aggregate', 'groupBy'];

const isModelDelegate = (value) => {
  if (!value || typeof value !== 'object') return false;
  return MODEL_METHOD_HINTS.some((method) => typeof value[method] === 'function');
};

// Create Prisma client with connection pooling optimized
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Increase connection pool timeout to 5 minutes for long-running operations
  __internal: {
    engine: {
      connectionTimeout: 300000, // 5 minutes
    }
  }
});

// Connection pool middleware for limiting concurrent requests
class ConnectionPoolManager {
  constructor(maxConcurrent = 100) {
    this.maxConcurrent = maxConcurrent;
    this.active = 0;
    this.queue = [];
    this.maxRetries = 2;
  }

  async execute(fn) {
    // Wait if at capacity
    while (this.active >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.active++;
    try {
      let lastError;

      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          return await Promise.race([
            fn(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Query timeout (180s)')), 180000)
            )
          ]);
        } catch (error) {
          lastError = error;

          if (!isTransientDatabaseError(error) || attempt === this.maxRetries) {
            throw error;
          }

          // Short backoff for transient pool/connection issues.
          await sleep(150 * (attempt + 1));
        }
      }

      throw lastError;
    } finally {
      this.active--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

const poolManager = new ConnectionPoolManager(100);

// Wrap Prisma to use connection pool
const wrappedPrisma = new Proxy(prisma, {
  get(target, prop) {
    const delegate = target[prop];

    if (isModelDelegate(delegate)) {
      return new Proxy(delegate, {
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

    return delegate;
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
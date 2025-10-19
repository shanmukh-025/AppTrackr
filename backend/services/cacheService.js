/**
 * In-Memory Cache Service
 * Caches API responses to minimize API calls
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = parseInt(process.env.MAX_CACHE_SIZE) || 100;
    this.ttl = parseInt(process.env.CACHE_TTL) || 1800; // 30 minutes default
  }

  /**
   * Generate cache key from parameters
   * @param {string} apiName - Name of the API
   * @param {Object} params - Query parameters
   * @returns {string} - Cache key
   */
  generateKey(apiName, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${apiName}:${sortedParams}`;
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return cached.data;
  }

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} customTTL - Custom TTL in seconds (optional)
   */
  set(key, data, customTTL = null) {
    // Enforce max cache size (LRU - remove oldest)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      console.log(`🗑️  Cache eviction: Removed ${firstKey}`);
    }

    const ttl = customTTL || this.ttl;
    const expiresAt = Date.now() + (ttl * 1000);

    this.cache.set(key, {
      data,
      expiresAt,
      cachedAt: Date.now()
    });

    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
  }

  /**
   * Clear cache for specific API or all
   * @param {string} apiName - API name (optional)
   */
  clear(apiName = null) {
    if (apiName) {
      // Clear specific API cache
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        if (key.startsWith(`${apiName}:`)) {
          this.cache.delete(key);
        }
      });
      console.log(`🧹 Cleared cache for: ${apiName}`);
    } else {
      // Clear all cache
      this.cache.clear();
      console.log('🧹 Cleared all cache');
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getStats() {
    const stats = {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: []
    };

    this.cache.forEach((value, key) => {
      stats.entries.push({
        key,
        cachedAt: new Date(value.cachedAt),
        expiresAt: new Date(value.expiresAt),
        timeRemaining: Math.max(0, Math.floor((value.expiresAt - Date.now()) / 1000))
      });
    });

    return stats;
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const keys = Array.from(this.cache.keys());
    let cleaned = 0;

    keys.forEach(key => {
      const cached = this.cache.get(key);
      if (cached && Date.now() > cached.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }
}

// Singleton instance
const cacheService = new CacheService();

// Clean expired entries every 5 minutes
setInterval(() => {
  cacheService.cleanExpired();
}, 5 * 60 * 1000);

module.exports = cacheService;

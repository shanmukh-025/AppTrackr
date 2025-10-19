/**
 * API Rate Limiter
 * Tracks API usage to stay within limits
 */

class RateLimiter {
  constructor() {
    this.limits = {
      jooble: {
        daily: parseInt(process.env.JOOBLE_DAILY_LIMIT) || 500,
        count: 0,
        resetAt: this.getEndOfDay()
      },
      apijobs: {
        monthly: parseInt(process.env.APIJOBS_MONTHLY_LIMIT) || 50,
        count: 0,
        resetAt: this.getEndOfMonth()
      }
    };

    // Reset counters at appropriate times
    this.startResetTimers();
  }

  /**
   * Get end of current day timestamp
   */
  getEndOfDay() {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime();
  }

  /**
   * Get end of current month timestamp
   */
  getEndOfMonth() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.getTime();
  }

  /**
   * Check if API call is allowed
   * @param {string} apiName - API name (jooble or apijobs)
   * @returns {boolean} - Whether call is allowed
   */
  canMakeCall(apiName) {
    const limit = this.limits[apiName];
    if (!limit) return true;

    // Check if needs reset
    if (Date.now() > limit.resetAt) {
      this.resetLimit(apiName);
    }

    if (apiName === 'jooble') {
      return limit.count < limit.daily;
    } else if (apiName === 'apijobs') {
      return limit.count < limit.monthly;
    }

    return true;
  }

  /**
   * Increment API call counter
   * @param {string} apiName - API name
   */
  incrementCount(apiName) {
    const limit = this.limits[apiName];
    if (limit) {
      limit.count++;
      console.log(`📊 ${apiName} API calls: ${limit.count}/${apiName === 'jooble' ? limit.daily : limit.monthly}`);
    }
  }

  /**
   * Reset limit counter
   * @param {string} apiName - API name
   */
  resetLimit(apiName) {
    const limit = this.limits[apiName];
    if (!limit) return;

    limit.count = 0;
    
    if (apiName === 'jooble') {
      limit.resetAt = this.getEndOfDay();
      console.log('🔄 Jooble daily limit reset');
    } else if (apiName === 'apijobs') {
      limit.resetAt = this.getEndOfMonth();
      console.log('🔄 APIJobs monthly limit reset');
    }
  }

  /**
   * Get remaining calls
   * @param {string} apiName - API name
   * @returns {number} - Remaining calls
   */
  getRemainingCalls(apiName) {
    const limit = this.limits[apiName];
    if (!limit) return Infinity;

    if (apiName === 'jooble') {
      return Math.max(0, limit.daily - limit.count);
    } else if (apiName === 'apijobs') {
      return Math.max(0, limit.monthly - limit.count);
    }

    return Infinity;
  }

  /**
   * Get statistics
   * @returns {Object} - Rate limit stats
   */
  getStats() {
    return {
      jooble: {
        used: this.limits.jooble.count,
        limit: this.limits.jooble.daily,
        remaining: this.getRemainingCalls('jooble'),
        resetAt: new Date(this.limits.jooble.resetAt),
        resetIn: Math.floor((this.limits.jooble.resetAt - Date.now()) / (1000 * 60 * 60)) + ' hours'
      },
      apijobs: {
        used: this.limits.apijobs.count,
        limit: this.limits.apijobs.monthly,
        remaining: this.getRemainingCalls('apijobs'),
        resetAt: new Date(this.limits.apijobs.resetAt),
        resetIn: Math.floor((this.limits.apijobs.resetAt - Date.now()) / (1000 * 60 * 60 * 24)) + ' days'
      }
    };
  }

  /**
   * Start timers to reset limits
   */
  startResetTimers() {
    // Check for resets every hour
    setInterval(() => {
      Object.keys(this.limits).forEach(apiName => {
        const limit = this.limits[apiName];
        if (Date.now() > limit.resetAt) {
          this.resetLimit(apiName);
        }
      });
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Manually reset all limits (for testing)
   */
  resetAll() {
    Object.keys(this.limits).forEach(apiName => {
      this.resetLimit(apiName);
    });
    console.log('🔄 All rate limits reset');
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

module.exports = rateLimiter;

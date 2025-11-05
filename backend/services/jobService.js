/**
 * Job Service - Multi-API Integration
 * Priority: Jooble (Primary) -> APIJobs.dev (Complex) -> Arbeitnow (Fallback)
 */

const axios = require('axios');
const cacheService = require('./cacheService');
const rateLimiter = require('./rateLimiter');
const { normalizeSkills, generateSearchQueries } = require('../utils/skillNormalizer');
const { findCompanyCareerPage } = require('../utils/companyCareerPages');

class JobService {
  constructor() {
    this.joobleKey = process.env.JOOBLE_API_KEY;
    this.apijobsKey = process.env.APIJOBS_API_KEY;
    this.joobleUrl = process.env.JOOBLE_API_URL;
    this.apijobsUrl = process.env.APIJOBS_API_URL;
    this.arbeitnowUrl = process.env.ARBEITNOW_API_URL;
    
    // NEW: APIs with DIRECT company URLs (no redirects!)
    this.remoteokUrl = 'https://remoteok.com/api';
    this.remotiveUrl = 'https://remotive.com/api/remote-jobs';
  }

  /**
   * Fetch jobs from Jooble API (PRIMARY)
   * @param {string} keywords - Search keywords
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Job listings
   */
  async fetchFromJooble(keywords, options = {}) {
    const cacheKey = cacheService.generateKey('jooble', { keywords, ...options });
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    // Check rate limit
    if (!rateLimiter.canMakeCall('jooble')) {
      console.log('⚠️  Jooble rate limit reached, skipping...');
      return [];
    }

    try {
      const payload = {
        keywords,
        location: options.location || '',
        radius: options.radius || '50',
        page: options.page || '1'
      };

      const response = await axios.post(
        `${this.joobleUrl}/${this.joobleKey}`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      rateLimiter.incrementCount('jooble');

      const jobs = await this.normalizeJoobleResponse(response.data.jobs || []);
      cacheService.set(cacheKey, jobs);
      
      console.log(`✅ Jooble: Found ${jobs.length} jobs for "${keywords}"`);
      return jobs;

    } catch (error) {
      console.error('❌ Jooble API Error:', error.message);
      return [];
    }
  }

  /**
   * Fetch jobs from APIJobs.dev (COMPLEX QUERIES)
   * @param {string} keywords - Search keywords
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Job listings
   */
  async fetchFromAPIJobs(keywords, options = {}) {
    const cacheKey = cacheService.generateKey('apijobs', { keywords, ...options });
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    // Check rate limit
    if (!rateLimiter.canMakeCall('apijobs')) {
      console.log('⚠️  APIJobs rate limit reached, skipping...');
      return [];
    }

    try {
      const params = {
        q: keywords,
        limit: options.limit || 10
      };

      if (options.location) params.location = options.location;
      if (options.remote) params.remote = true;

      const response = await axios.get(`${this.apijobsUrl}/jobs`, {
        headers: {
          'Authorization': `Bearer ${this.apijobsKey}`,
          'Content-Type': 'application/json'
        },
        params,
        timeout: 10000
      });

      rateLimiter.incrementCount('apijobs');

      const jobs = await this.normalizeAPIJobsResponse(response.data.data || []);
      cacheService.set(cacheKey, jobs);
      
      console.log(`✅ APIJobs: Found ${jobs.length} jobs for "${keywords}"`);
      return jobs;

    } catch (error) {
      console.error('❌ APIJobs API Error:', error.message);
      return [];
    }
  }

  /**
   * Fetch jobs from Arbeitnow API (FALLBACK)
   * @param {string} keywords - Search keywords
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Job listings
   */
  async fetchFromArbeitnow(keywords, options = {}) {
    const cacheKey = cacheService.generateKey('arbeitnow', { keywords, ...options });
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const params = {
        search: keywords,
        page: options.page || 1
      };

      const response = await axios.get(this.arbeitnowUrl, {
        params,
        timeout: 10000
      });

      const jobs = await this.normalizeArbeitnowResponse(response.data.data || []);
      cacheService.set(cacheKey, jobs, 3600); // Cache longer (1 hour)
      
      console.log(`✅ Arbeitnow: Found ${jobs.length} jobs for "${keywords}"`);
      return jobs;

    } catch (error) {
      console.error('❌ Arbeitnow API Error:', error.message);
      return [];
    }
  }

  /**
   * Fetch jobs from RemoteOK API (DIRECT COMPANY URLS!)
   * @param {string} keywords - Search keywords
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Job listings with DIRECT company URLs
   */
  async fetchFromRemoteOK(keywords, options = {}) {
    // RemoteOK is blocking automated requests with 403 errors
    // Disabling this API temporarily
    console.log('⚠️  RemoteOK: Skipped (API blocking automated requests)');
    return [];
    
    /* DISABLED DUE TO 403 ERRORS
    const cacheKey = cacheService.generateKey('remoteok', { keywords, ...options });
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.remoteokUrl, {
        headers: {
          'User-Agent': 'AppTrackr Job Search (your@email.com)'
        },
        timeout: 10000
      });

      // RemoteOK returns all jobs, we filter by keywords
      let jobs = response.data || [];
      
      // Skip first item (it's metadata)
      if (jobs.length > 0 && jobs[0].id === undefined) {
        jobs = jobs.slice(1);
      }

      // Filter by keywords
      const keywordLower = keywords.toLowerCase();
      jobs = jobs.filter(job => {
        const text = `${job.position || ''} ${job.description || ''} ${job.tags?.join(' ') || ''}`.toLowerCase();
        return text.includes(keywordLower);
      });

      const normalized = await this.normalizeRemoteOKResponse(jobs);
      cacheService.set(cacheKey, normalized, 3600);
      
      console.log(`✅ RemoteOK: Found ${normalized.length} jobs for "${keywords}" (DIRECT URLs)`);
      return normalized;

    } catch (error) {
      console.error('❌ RemoteOK API Error:', error.message);
      return [];
    }
    */
  }

  /**
   * Fetch jobs from Remotive.io API (DIRECT COMPANY URLS!)
   * FREE, no API key, direct company application links
   * @param {string} keywords - Search keywords
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Job listings with DIRECT company URLs
   */
  async fetchFromRemotive(keywords, options = {}) {
    const cacheKey = cacheService.generateKey('remotive', { keywords, ...options });
    
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const params = {
        limit: options.limit || 50,
        category: 'software-dev'
      };

      if (keywords) params.search = keywords;

      const response = await axios.get(this.remotiveUrl, {
        params,
        headers: {
          'User-Agent': 'JobTrackerApp/1.0',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      const jobs = await this.normalizeRemotiveResponse(response.data.jobs || []);
      cacheService.set(cacheKey, jobs, 3600);
      
      console.log(`✅ Remotive: Found ${jobs.length} jobs for "${keywords}" (DIRECT URLs)`);
      return jobs;

    } catch (error) {
      console.error('❌ Remotive API Error:', error.response?.status, error.message);
      return [];
    }
  }

  /**
   * Smart job search with priority fallback
   * NOW PRIORITIZES DIRECT COMPANY URLS!
   * @param {Array<string>} skills - User skills
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Deduplicated job listings
   */
  async searchJobs(skills, options = {}) {
    const normalized = normalizeSkills(skills);
    const queries = generateSearchQueries(normalized, 3);
    
    console.log(`\n🔍 Searching for jobs: ${queries.join(', ')}`);
    console.log(`📊 Rate limits: Jooble ${rateLimiter.getRemainingCalls('jooble')}/500, APIJobs ${rateLimiter.getRemainingCalls('apijobs')}/50\n`);

    let allJobs = [];
    const isComplexQuery = options.complex || normalized.length > 3;

    for (const query of queries) {
      try {
        let jobs = [];

        // PRIORITY 1: Jooble (PRIMARY - with API key)
        if (this.joobleKey && rateLimiter.getRemainingCalls('jooble') > 50) {
          const joobleResults = await this.fetchFromJooble(query, options);
          jobs = [...joobleResults];
        }

        // PRIORITY 2: Remotive.io (FREE + DIRECT COMPANY URLS!)
        const remotiveResults = await this.fetchFromRemotive(query, options);
        jobs = [...jobs, ...remotiveResults];

        // FALLBACK 3: Arbeitnow (free but redirects)
        if (jobs.length < 15) {
          const arbeitnowResults = await this.fetchFromArbeitnow(query, options);
          jobs = [...jobs, ...arbeitnowResults];
        }

        // FALLBACK 4: APIJobs for complex queries (with API key)
        if (jobs.length < 20 && isComplexQuery && this.apijobsKey && rateLimiter.getRemainingCalls('apijobs') > 10) {
          const apiJobsResults = await this.fetchFromAPIJobs(query, options);
          jobs = [...jobs, ...apiJobsResults];
        }

        allJobs = [...allJobs, ...jobs];

      } catch (error) {
        console.error(`Error searching for "${query}":`, error.message);
      }
    }

    // Deduplicate and rank
    const deduped = this.deduplicateJobs(allJobs);
    const ranked = this.rankJobs(deduped, normalized);

    console.log(`\n✅ Total unique jobs found: ${ranked.length}\n`);
    return ranked.slice(0, options.limit || 50);
  }

  /**
   * Normalize Jooble API response
   */
  async normalizeJoobleResponse(jobs) {
    const normalized = [];
    
    for (const job of jobs) {
      const careerPage = await findCompanyCareerPage(job.company);
      
      normalized.push({
        id: `jooble_${job.id || Date.now()}_${Math.random()}`,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.snippet || '',
        url: job.link, // Jooble link - will redirect to job
        directApplicationUrl: null, // Not available from Jooble
        companyCareerPage: careerPage, // Direct career page!
        salary: job.salary || null,
        type: job.type || 'Full-time',
        remote: job.location?.toLowerCase().includes('remote') || false,
        postedDate: job.updated || new Date().toISOString(),
        source: 'jooble',
        redirectWarning: !careerPage // Warn if no career page available
      });
    }
    
    return normalized;
  }

  /**
   * Normalize APIJobs.dev response
   */
  async normalizeAPIJobsResponse(jobs) {
    const normalized = [];
    
    for (const job of jobs) {
      const jobUrl = job.url || job.application_url || job.company_url;
      const companyName = job.company_name || job.company;
      const careerPage = await findCompanyCareerPage(companyName);
      
      normalized.push({
        id: `apijobs_${job.id || Date.now()}_${Math.random()}`,
        title: job.title || job.position,
        company: companyName,
        location: job.location || 'Remote',
        description: job.description || job.summary || '',
        url: jobUrl,
        directApplicationUrl: null,
        companyCareerPage: careerPage, // Direct career page!
        salary: job.salary_range || null,
        type: job.employment_type || 'Full-time',
        remote: job.remote || false,
        postedDate: job.published_at || job.created_at || new Date().toISOString(),
        source: 'apijobs',
        redirectWarning: !careerPage
      });
    }
    
    return normalized;
  }

  /**
   * Normalize Arbeitnow API response
   */
  async normalizeArbeitnowResponse(jobs) {
    const normalized = [];
    
    for (const job of jobs) {
      const careerPage = await findCompanyCareerPage(job.company_name);
      
      normalized.push({
        id: `arbeitnow_${job.slug || Date.now()}_${Math.random()}`,
        title: job.title,
        company: job.company_name,
        location: job.location,
        description: job.description || '',
        url: job.url,
        directApplicationUrl: null,
        companyCareerPage: careerPage, // Direct career page!
        salary: null,
        type: job.job_types?.join(', ') || 'Full-time',
        remote: job.remote || false,
        postedDate: job.created_at || new Date().toISOString(),
        source: 'arbeitnow',
        redirectWarning: !careerPage
      });
    }
    
    return normalized;
  }

  /**
   * Normalize RemoteOK API response (DIRECT COMPANY URLS!)
   */
  async normalizeRemoteOKResponse(jobs) {
    const normalized = [];
    
    for (const job of jobs) {
      let postedDate = new Date().toISOString();
      try {
        // RemoteOK uses Unix timestamp (in seconds)
        if (job.date) {
          const timestamp = parseInt(job.date);
          if (!isNaN(timestamp) && timestamp > 0) {
            // Convert to milliseconds
            postedDate = new Date(timestamp * 1000).toISOString();
          }
        }
      } catch (error) {
        // If date parsing fails, use current date
        console.warn(`⚠️ RemoteOK date parsing error for job ${job.id}:`, error.message);
      }

      const jobUrl = job.url || job.apply_url || '#';
      const careerPage = await findCompanyCareerPage(job.company);
      
      normalized.push({
        id: `remoteok_${job.id || Date.now()}_${Math.random()}`,
        title: job.position || job.title || 'Unknown',
        company: job.company || 'Unknown',
        location: job.location || 'Remote',
        description: job.description || '',
        url: jobUrl,
        directApplicationUrl: null,
        companyCareerPage: careerPage, // Direct career page!
        salary: job.salary_min && job.salary_max ? `$${job.salary_min}k-$${job.salary_max}k` : null,
        type: 'Full-time',
        remote: true,
        postedDate,
        source: 'remoteok',
        redirectWarning: !careerPage,
        tags: job.tags || []
      });
    }
    
    return normalized;
  }

  /**
   * Normalize Remotive.io API response
   */
  async normalizeRemotiveResponse(jobs) {
    const normalized = [];
    
    for (const job of jobs) {
      const careerPage = await findCompanyCareerPage(job.company_name);
      
      normalized.push({
        id: `remotive_${job.id || Date.now()}_${Math.random()}`,
        title: job.title,
        company: job.company_name || 'Unknown',
        location: 'Remote',
        description: job.description || '',
        url: job.url,
        directApplicationUrl: null,
        companyCareerPage: careerPage, // Direct career page!
        salary: job.salary || null,
        type: job.job_type || 'Full-time',
        remote: true,
        postedDate: job.publication_date || new Date().toISOString(),
        source: 'remotive',
        redirectWarning: !careerPage,
        category: job.category || 'Software Development',
        tags: job.tags || []
      });
    }
    
    return normalized;
  }

  /**
   * Deduplicate jobs by URL
   */
  deduplicateJobs(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = job.url || `${job.company}_${job.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Rank jobs by relevance
   */
  rankJobs(jobs, userSkills) {
    return jobs.map(job => {
      let score = 0;
      const text = `${job.title} ${job.description}`.toLowerCase();

      // Score based on skill matches
      userSkills.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          score += 10;
        }
      });

      // Boost recent jobs
      const daysOld = Math.floor((Date.now() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24));
      if (daysOld < 7) score += 5;
      else if (daysOld < 30) score += 2;

      // Boost remote jobs
      if (job.remote) score += 3;

      // HUGE BOOST for DIRECT company URLs!
      if (!job.redirectWarning) {
        score += 15; // RemoteOK and The Muse get major boost
      }

      job.relevanceScore = score;
      return job;
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get API statistics
   */
  getStats() {
    return {
      rateLimits: rateLimiter.getStats(),
      cache: cacheService.getStats()
    };
  }
}

module.exports = new JobService();

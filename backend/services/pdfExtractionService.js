/**
 * PDF Extraction Service
 * Extracts DSA questions from LeetCode-formatted PDFs
 * Handles company-specific question files (google-Leetcode.pdf, microsoft-Leetcode.pdf, etc.)
 * 
 * Features:
 * - Automatic company name detection from filename
 * - Robust question parsing with LeetCode links
 * - Difficulty level extraction (Easy/Medium/Hard)
 * - Topic categorization
 * - Frequency data integration
 * - Error handling and logging
 */

const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class PDFExtractionService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Extract company name from filename
   * Handles: google-Leetcode.pdf, microsoft-Leetcode.pdf, etc.
   */
  extractCompanyName(filename) {
    const match = filename.toLowerCase().match(/^([a-z]+)-/);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return null;
  }

  /**
   * Parse difficulty level from text
   * Handles: Easy, Medium, Hard with variations
   */
  parseDifficulty(text) {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    for (const diff of difficulties) {
      if (text.includes(diff)) {
        return diff.toLowerCase();
      }
    }
    return 'medium'; // default
  }

  /**
   * Extract frequency percentage from acceptance rate or frequency field
   * Converts acceptance rate to frequency score (0-100)
   */
  parseFrequency(acceptanceText) {
    const match = acceptanceText.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match) {
      let freq = parseFloat(match[1]);
      // Scale acceptance rate to frequency (higher acceptance = more companies ask)
      // 50% acceptance = 75% frequency (popular), 20% = 50% frequency (less asked)
      freq = Math.min(95, Math.max(50, freq + 25));
      return Math.round(freq);
    }
    return 70; // default frequency
  }

  /**
   * Extract LeetCode problem ID from URL/text
   * Handles multiple URL formats
   */
  extractProblemId(text) {
    // Try to extract from /problems/problem-name format
    const match = text.match(/\/problems\/([a-z0-9\-]+)/i);
    if (match) {
      return match[1];
    }
    // Otherwise generate from title
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Generate LeetCode URL from problem name or ID
   */
  generateLeetcodeUrl(problemId) {
    if (!problemId) return '';
    return `https://leetcode.com/problems/${problemId}/`;
  }

  /**
   * Extract topic from problem context
   * Uses common DSA topic keywords
   */
  extractTopics(fullText) {
    const topicKeywords = {
      'Array': ['array', 'subarray', 'matrix'],
      'String': ['string', 'substring', 'character'],
      'Hash Table': ['hash', 'map', 'dictionary', 'set'],
      'Linked List': ['linked list', 'node'],
      'Stack': ['stack', 'push', 'pop'],
      'Queue': ['queue', 'deque'],
      'Tree': ['tree', 'binary', 'bst', 'traversal'],
      'Graph': ['graph', 'dfs', 'bfs', 'adjacency'],
      'Heap': ['heap', 'priority', 'min-heap', 'max-heap'],
      'Dynamic Programming': ['dynamic programming', 'dp', 'memoization', 'recursion'],
      'Greedy': ['greedy', 'interval'],
      'Sorting': ['sort', 'merge sort', 'quick sort']
    };

    const foundTopics = [];
    const lowerText = fullText.toLowerCase();

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          foundTopics.push(topic);
          break;
        }
      }
    }

    return foundTopics.length > 0 ? foundTopics : ['General'];
  }

  /**
   * Parse PDF text content and extract questions
   * Handles LeetCode table format with title, acceptance, difficulty
   */
  parseQuestionsFromText(text, company) {
    const questions = [];
    
    // Split by potential question entries
    // Looking for pattern: number, title, acceptance%, difficulty
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentQuestion = null;
    let problemNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip headers and empty lines
      if (line.includes('Title') || line.includes('Acceptance') || line === '' || line.startsWith('Show')) {
        continue;
      }

      // Try to match problem line format: "N Title (link) Acceptance% Difficulty"
      // Can be split across multiple lines
      const numberMatch = line.match(/^(\d+)\s+(.+)/);
      
      if (numberMatch) {
        // Save previous question if exists
        if (currentQuestion && currentQuestion.title) {
          questions.push(currentQuestion);
        }

        problemNumber = parseInt(numberMatch[1]);
        const remainder = numberMatch[2];

        // Try to parse in current line
        const fullLineMatch = remainder.match(/^(.+?)\s*\(?\s*(?:\/problems\/)?\s*(.+?)\)?(?:\s*\d+\.?\d*\%?\s*(.+?))?$/);
        
        if (fullLineMatch) {
          const title = fullLineMatch[1].trim();
          const problemRef = fullLineMatch[2].trim();
          const difficulty = fullLineMatch[3] ? this.parseDifficulty(fullLineMatch[3]) : 'medium';
          
          currentQuestion = {
            id: this.extractProblemId(problemRef),
            title: this.cleanTitle(title),
            difficulty,
            frequency: 70,
            company,
            topics: this.extractTopics(title),
            url: this.generateLeetcodeUrl(this.extractProblemId(problemRef)),
            acceptance: 0,
            sheetsIncludedIn: []
          };
        } else {
          // Problem spans multiple lines, partial parse
          currentQuestion = {
            id: `problem-${problemNumber}`,
            title: remainder.trim(),
            difficulty: 'medium',
            frequency: 70,
            company,
            topics: ['General'],
            url: '',
            acceptance: 0,
            sheetsIncludedIn: []
          };
        }
      } else if (currentQuestion && line.includes('%')) {
        // This might be the acceptance/difficulty line for previous question
        const diffMatch = line.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)/);
        if (diffMatch) {
          currentQuestion.acceptance = parseFloat(diffMatch[1]);
          currentQuestion.frequency = this.parseFrequency(diffMatch[1] + '%');
          if (diffMatch[2]) {
            currentQuestion.difficulty = this.parseDifficulty(diffMatch[2]);
          }
        }
      } else if (currentQuestion && (line.includes('Easy') || line.includes('Medium') || line.includes('Hard'))) {
        // This might be just the difficulty
        currentQuestion.difficulty = this.parseDifficulty(line);
      }
    }

    // Don't forget the last question
    if (currentQuestion && currentQuestion.title) {
      questions.push(currentQuestion);
    }

    return questions.filter(q => q && q.title && q.title.length > 0);
  }

  /**
   * Clean and normalize question title
   */
  cleanTitle(title) {
    return title
      .replace(/^\d+[\.\s]+/, '') // Remove leading numbers and periods/spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Extract questions from PDF buffer
   */
  async extractFromPDFBuffer(buffer, filename) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;
      const company = this.extractCompanyName(filename) || 'Unknown';

      const questions = this.parseQuestionsFromText(text, company);

      return {
        success: true,
        company,
        questionCount: questions.length,
        questions,
        filename,
        extractedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error parsing PDF ${filename}:`, error.message);
      return {
        success: false,
        company: this.extractCompanyName(filename) || 'Unknown',
        filename,
        error: error.message,
        questions: []
      };
    }
  }

  /**
   * Process multiple PDF buffers
   * Used when downloading from Google Drive
   */
  async processPDFBuffers(pdfBuffers) {
    const results = [];

    for (const { buffer, filename } of pdfBuffers) {
      const result = await this.extractFromPDFBuffer(buffer, filename);
      results.push(result);
    }

    return results;
  }

  /**
   * Extract and cache questions from PDFs
   */
  async extractAndCache(pdfBuffers) {
    const cacheKey = 'pdf_extraction_cache';
    
    // Check if cached and not expired
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Process PDFs
    const results = await this.processPDFBuffers(pdfBuffers);

    // Aggregate results
    const allQuestions = [];
    const companyMap = {};
    let successCount = 0;
    let errorCount = 0;

    for (const result of results) {
      if (result.success) {
        allQuestions.push(...result.questions);
        companyMap[result.company] = result.questions.length;
        successCount++;
      } else {
        errorCount++;
        console.warn(`Failed to extract from ${result.filename}: ${result.error}`);
      }
    }

    const output = {
      success: true,
      totalQuestions: allQuestions.length,
      companiesProcessed: Object.keys(companyMap),
      companyQuestionCount: companyMap,
      successCount,
      errorCount,
      questions: allQuestions,
      timestamp: Date.now()
    };

    // Cache the results
    this.cache.set(cacheKey, {
      data: output,
      timestamp: Date.now()
    });

    return output;
  }

  /**
   * Get cached extraction results
   */
  getCachedResults() {
    const cached = this.cache.get('pdf_extraction_cache');
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return {
        success: true,
        cached: true,
        ...cached.data
      };
    }
    return { success: false, cached: false };
  }

  /**
   * Clear extraction cache
   */
  clearCache() {
    this.cache.delete('pdf_extraction_cache');
    return { success: true, message: 'Cache cleared' };
  }

  /**
   * Convert extracted questions to standard DSA question format
   */
  convertToStandardFormat(extractedQuestions) {
    return extractedQuestions.map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      frequency: q.frequency,
      sheetsIncludedIn: q.sheetsIncludedIn.length > 0 ? q.sheetsIncludedIn : ['Company-Specific'],
      companies: [q.company],
      topics: q.topics,
      timeComplexity: 'O(n)', // Default, could be parsed if available
      spaceComplexity: 'O(n)', // Default
      url: q.url,
      acceptance: q.acceptance,
      source: 'pdf-extraction'
    }));
  }

  /**
   * Deduplicate questions by title and company
   * Returns unique questions, merging company data
   */
  deduplicateQuestions(questions) {
    const questionMap = new Map();

    for (const q of questions) {
      if (!q || !q.title) continue; // Skip invalid entries
      
      const key = q.title.toLowerCase().replace(/\s+/g, '-');
      
      if (questionMap.has(key)) {
        // Merge company data
        const existing = questionMap.get(key);
        if (Array.isArray(existing.companies) && !existing.companies.includes(q.company)) {
          existing.companies.push(q.company);
        } else if (typeof existing.companies === 'string') {
          existing.companies = [existing.companies, q.company];
        }
        // Update frequency as average
        existing.frequency = Math.round((existing.frequency + q.frequency) / 2);
      } else {
        // Ensure companies is an array
        const normalizedQ = { ...q };
        if (typeof normalizedQ.companies === 'string') {
          normalizedQ.companies = [normalizedQ.companies];
        } else if (!Array.isArray(normalizedQ.companies)) {
          normalizedQ.companies = [q.company || 'Unknown'];
        }
        questionMap.set(key, normalizedQ);
      }
    }

    return Array.from(questionMap.values());
  }

  /**
   * Get extraction statistics
   */
  getStatistics(questions) {
    const stats = {
      totalQuestions: questions.length,
      byDifficulty: { easy: 0, medium: 0, hard: 0 },
      byCompany: {},
      averageFrequency: 0,
      topTopics: {}
    };

    let totalFrequency = 0;

    for (const q of questions) {
      if (!q) continue;
      
      // Difficulty count - normalize difficulty to lowercase
      const difficulty = (q.difficulty || 'medium').toLowerCase();
      if (stats.byDifficulty.hasOwnProperty(difficulty)) {
        stats.byDifficulty[difficulty]++;
      }

      // Company count
      const companies = Array.isArray(q.companies) ? q.companies : (q.company ? [q.company] : []);
      for (const company of companies) {
        if (company) {
          stats.byCompany[company] = (stats.byCompany[company] || 0) + 1;
        }
      }

      // Frequency sum
      totalFrequency += (q.frequency || 0);

      // Topic frequency
      const topics = Array.isArray(q.topics) ? q.topics : (q.topic ? [q.topic] : []);
      for (const topic of topics) {
        if (topic) {
          stats.topTopics[topic] = (stats.topTopics[topic] || 0) + 1;
        }
      }
    }

    stats.averageFrequency = questions.length > 0 ? Math.round(totalFrequency / questions.length) : 0;

    // Sort topics by frequency
    stats.topTopics = Object.fromEntries(
      Object.entries(stats.topTopics).sort((a, b) => b[1] - a[1])
    );

    return stats;
  }
}

module.exports = new PDFExtractionService();

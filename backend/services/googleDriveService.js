/**
 * Google Drive Integration Service
 * Fetches company-wise DSA questions from your Google Drive
 * 
 * Setup Instructions:
 * 1. Create a Google Service Account in Google Cloud Console
 * 2. Generate JSON key file
 * 3. Share your Google Drive folder with the service account email
 * 4. Set GOOGLE_DRIVE_FOLDER_ID and GOOGLE_SERVICE_ACCOUNT_JSON in .env
 * 
 * Alternative: Use Google Drive API directly with OAuth2
 * 
 * Supports:
 * - JSON files with DSA questions
 * - PDF files with LeetCode-formatted questions
 * - Automatic PDF extraction and parsing
 */

const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs').promises;
const pdfExtractionService = require('./pdfExtractionService');

class GoogleDriveService {
  static FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
  static SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  static CACHE_DIR = './cache/google-drive';
  static CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Initialize Google Drive API client
   */
  static async initializeClient() {
    if (!this.SERVICE_ACCOUNT_JSON) {
      console.warn('⚠️  Google Service Account JSON not configured. Using demo mode.');
      return null;
    }

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: this.SERVICE_ACCOUNT_JSON,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });

      return google.drive({ version: 'v3', auth });
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive client:', error.message);
      return null;
    }
  }

  /**
   * List all files in the shared Google Drive folder
   * Supports JSON files and PDF files
   */
  static async listCompanyFiles() {
    const client = await this.initializeClient();
    if (!client) {
      return this.getDemoCompanyFiles();
    }

    try {
      const response = await client.files.list({
        q: `'${this.FOLDER_ID}' in parents and trashed = false`,
        spaces: 'drive',
        pageSize: 100,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)',
      });

      const files = response.data.files || [];

      // Parse company names and return (both JSON and PDF)
      return files
        .filter(f => 
          f.mimeType === 'application/json' || 
          f.name.endsWith('.json') ||
          f.mimeType === 'application/pdf' ||
          f.name.endsWith('.pdf')
        )
        .map(f => ({
          id: f.id,
          name: f.name,
          company: this.extractCompanyName(f.name),
          type: f.name.endsWith('.pdf') ? 'pdf' : 'json',
          mimeType: f.mimeType,
          size: f.size,
          lastModified: f.modifiedTime,
        }));
    } catch (error) {
      console.error('❌ Error listing Google Drive files:', error.message);
      return this.getDemoCompanyFiles();
    }
  }

  /**
   * Download and parse company DSA questions from Google Drive file
   * Handles both JSON and PDF files
   */
  static async fetchCompanyQuestions(fileId, fileName) {
    const client = await this.initializeClient();
    if (!client) {
      return this.getDemoCompanyQuestions(fileName);
    }

    try {
      // Check cache first
      const cached = await this.getFromCache(fileId);
      if (cached) {
        console.log(`✅ Loaded from cache: ${fileName}`);
        return cached;
      }

      // Determine file type and handle accordingly
      if (fileName.toLowerCase().endsWith('.pdf')) {
        return await this.fetchAndParsePDF(fileId, fileName, client);
      } else {
        return await this.fetchAndParseJSON(fileId, fileName, client);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${fileName}:`, error.message);
      return this.getDemoCompanyQuestions(fileName);
    }
  }

  /**
   * Fetch and parse PDF file from Google Drive
   */
  static async fetchAndParsePDF(fileId, fileName, client) {
    try {
      console.log(`📄 Downloading PDF: ${fileName}...`);

      const response = await client.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      const pdfBuffer = Buffer.from(response.data);
      
      // Extract questions from PDF
      const extractionResult = await pdfExtractionService.extractFromPDFBuffer(pdfBuffer, fileName);

      if (!extractionResult.success) {
        console.warn(`⚠️  PDF extraction partial: ${fileName}`, extractionResult.error);
      }

      // Convert to standard format
      const standardQuestions = pdfExtractionService.convertToStandardFormat(extractionResult.questions);
      const deduped = pdfExtractionService.deduplicateQuestions(standardQuestions);
      const stats = pdfExtractionService.getStatistics(deduped);

      const formatted = {
        company: extractionResult.company,
        source: 'PDF (Google Drive)',
        totalQuestions: extractionResult.questionCount,
        dsa: deduped,
        extractionStats: stats,
        filename: fileName,
        extractedAt: new Date().toISOString(),
      };

      // Cache the result
      await this.saveToCache(fileId, formatted);

      return formatted;
    } catch (error) {
      console.error(`❌ Error parsing PDF ${fileName}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch and parse JSON file from Google Drive
   */
  static async fetchAndParseJSON(fileId, fileName, client) {
    try {
      console.log(`📋 Downloading JSON: ${fileName}...`);

      const response = await client.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      // Parse content
      let content = '';
      return new Promise((resolve, reject) => {
        response.data.on('data', chunk => {
          content += chunk;
        });

        response.data.on('end', async () => {
          try {
            const parsed = JSON.parse(content);
            const formatted = this.formatQuestionsData(parsed, fileName);

            // Cache the result
            await this.saveToCache(fileId, formatted);

            resolve(formatted);
          } catch (e) {
            reject(new Error(`Failed to parse JSON from ${fileName}: ${e.message}`));
          }
        });

        response.data.on('error', error => {
          reject(error);
        });
      });
    } catch (error) {
      console.error(`❌ Error parsing JSON ${fileName}:`, error.message);
      throw error;
    }
  }

  /**
   * Format questions data to standard format
   */
  static formatQuestionsData(data, fileName) {
    const company = this.extractCompanyName(fileName);

    // If data is already in correct format
    if (data.company && data.dsa && data.systemDesign) {
      return data;
    }

    // Try to detect format and convert
    if (Array.isArray(data)) {
      return {
        company,
        totalQuestions: data.length,
        dsa: data.filter(q => q.type === 'dsa' || q.category === 'DSA'),
        systemDesign: data.filter(q => q.type === 'system-design' || q.category === 'System Design'),
        behavioral: data.filter(q => q.type === 'behavioral' || q.category === 'Behavioral'),
      };
    }

    // If data has nested structure
    return {
      company,
      totalQuestions: (data.dsa?.length || 0) + (data.systemDesign?.length || 0) + (data.behavioral?.length || 0),
      dsa: data.dsa || [],
      systemDesign: data.systemDesign || [],
      behavioral: data.behavioral || [],
    };
  }

  /**
   * Extract company name from file name
   * Examples: "google-dsa-questions.json" -> "Google"
   */
  static extractCompanyName(fileName) {
    const name = fileName
      .replace('.json', '')
      .replace('.csv', '')
      .replace(/[-_]/g, ' ')
      .trim();

    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .slice(0, 2)
      .join(' ');
  }

  /**
   * Cache operations
   */
  static async getFromCache(fileId) {
    try {
      const cachePath = `${this.CACHE_DIR}/${fileId}.json`;
      const stat = await fs.stat(cachePath).catch(() => null);

      if (!stat) return null;

      // Check expiry
      if (Date.now() - stat.mtime.getTime() > this.CACHE_EXPIRY) {
        await fs.unlink(cachePath);
        return null;
      }

      const cached = await fs.readFile(cachePath, 'utf-8');
      return JSON.parse(cached);
    } catch (error) {
      return null;
    }
  }

  static async saveToCache(fileId, data) {
    try {
      await fs.mkdir(this.CACHE_DIR, { recursive: true });
      await fs.writeFile(`${this.CACHE_DIR}/${fileId}.json`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('⚠️  Cache save failed:', error.message);
    }
  }

  /**
   * Demo data when Google Drive is not configured
   */
  static getDemoCompanyFiles() {
    console.log('📁 Using demo Google Drive files...');
    return [
      { id: 'google-demo', name: 'google-dsa-questions.json', company: 'Google', type: 'file' },
      { id: 'amazon-demo', name: 'amazon-dsa-questions.json', company: 'Amazon', type: 'file' },
      { id: 'microsoft-demo', name: 'microsoft-dsa-questions.json', company: 'Microsoft', type: 'file' },
      { id: 'meta-demo', name: 'meta-dsa-questions.json', company: 'Meta', type: 'file' },
      { id: 'apple-demo', name: 'apple-dsa-questions.json', company: 'Apple', type: 'file' },
    ];
  }

  static getDemoCompanyQuestions(fileName) {
    const company = this.extractCompanyName(fileName);

    console.log(`📋 Using demo questions for ${company}...`);

    return {
      company,
      source: 'Demo Data',
      totalQuestions: 20,
      dsa: [
        {
          title: `${company} Top Problem 1`,
          difficulty: 'medium',
          frequency: 85,
          topic: 'Array',
        },
        {
          title: `${company} Top Problem 2`,
          difficulty: 'medium',
          frequency: 80,
          topic: 'Tree',
        },
        {
          title: `${company} Top Problem 3`,
          difficulty: 'hard',
          frequency: 75,
          topic: 'Dynamic Programming',
        },
      ],
      systemDesign: [
        {
          title: 'Design Scalable System',
          difficulty: 'hard',
          frequency: 90,
        },
      ],
      behavioral: [
        'Tell us about a challenging project',
        'How do you handle team conflicts?',
      ],
    };
  }

  /**
   * Merge Google Drive questions with built-in database
   */
  static async mergeWithBuiltinDatabase(companyName, builtinQuestions) {
    // Fetch from Google Drive if configured
    const files = await this.listCompanyFiles();
    const companyFile = files.find(f => f.company.toLowerCase() === companyName.toLowerCase());

    if (!companyFile) {
      return {
        source: 'Built-in Database',
        questions: builtinQuestions,
      };
    }

    try {
      const googleDriveQuestions = await this.fetchCompanyQuestions(companyFile.id, companyFile.name);

      // Merge and deduplicate
      return {
        source: 'Merged (Google Drive + Built-in)',
        builtInCount: builtinQuestions.length,
        googleDriveCount: googleDriveQuestions.dsa?.length || 0,
        questions: [
          ...builtinQuestions,
          ...(googleDriveQuestions.dsa || []).filter(
            q => !builtinQuestions.some(bq => bq.title.toLowerCase() === q.title.toLowerCase())
          ),
        ],
      };
    } catch (error) {
      console.error('❌ Error merging questions:', error.message);
      return {
        source: 'Built-in Database (Fallback)',
        questions: builtinQuestions,
      };
    }
  }

  /**
   * Get all companies from Google Drive
   */
  static async getAllCompaniesFromDrive() {
    const files = await this.listCompanyFiles();
    return files
      .map(f => ({
        name: f.company,
        source: 'Google Drive',
        fileId: f.id,
        lastUpdated: f.lastModified,
      }))
      .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i); // Deduplicate
  }

  /**
   * Clear cache for all or specific company
   */
  static async clearCache(fileId = null) {
    try {
      if (fileId) {
        await fs.unlink(`${this.CACHE_DIR}/${fileId}.json`);
        return { success: true, message: `Cache cleared for ${fileId}` };
      } else {
        await fs.rm(this.CACHE_DIR, { recursive: true });
        return { success: true, message: 'All cache cleared' };
      }
    } catch (error) {
      console.error('❌ Cache clear failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = GoogleDriveService;

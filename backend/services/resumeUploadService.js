const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');

class ResumeUploadService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.ensureUploadDir();
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Extract text from PDF file
   */
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      const fullText = data.text || '';
      
      console.log(`✅ PDF extracted: ${fullText.length} characters`);
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error.message);
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  /**
   * Extract text from DOCX file
   */
  async extractTextFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX: ' + error.message);
    }
  }

  /**
   * Extract text from JPG/PNG using OCR
   */
  async extractTextFromImage(filePath) {
    try {
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log('OCR Progress:', m.progress)
      });
      return result.data.text;
    } catch (error) {
      console.error('Image OCR error:', error);
      throw new Error('Failed to extract text from image: ' + error.message);
    }
  }

  /**
   * Parse resume text and extract structured data
   */
  parseResumeData(text) {
    const data = {
      fullName: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      summary: this.extractSummary(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      certifications: this.extractCertifications(text)
    };

    return data;
  }

  /**
   * Extract name from resume
   */
  extractName(text) {
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
      /^([A-Z][a-z]+\s[A-Z][a-z]+\s[A-Z][a-z]+)/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  /**
   * Extract email from resume
   */
  extractEmail(text) {
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = text.match(emailPattern);
    return match ? match[1] : '';
  }

  /**
   * Extract phone number from resume
   */
  extractPhone(text) {
    const phonePatterns = [
      /(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?)(\d{4})/,
      /(\+\d{1,3})?\s?\d{7,15}/
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) return match[0].trim();
    }
    return '';
  }

  /**
   * Extract professional summary
   */
  extractSummary(text) {
    const summaryPatterns = [
      /(?:summary|objective|professional profile)[\s\S]*?(?=\n\n|\nEXP|\nEDU|\nSKILL|$)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0]
          .replace(/^(summary|objective|professional profile)[\s\n]*/i, '')
          .trim()
          .substring(0, 300);
      }
    }
    return '';
  }

  /**
   * Extract experience section
   */
  extractExperience(text) {
    const experiences = [];
    const expPattern = /(.*?)\s+[-–]\s+(.*?)\s+\(([^)]+)\)[\s\n]*([\s\S]*?)(?=\n(?:[A-Z]|$))/gi;

    let match;
    while ((match = expPattern.exec(text)) !== null) {
      experiences.push({
        position: match[1]?.trim() || '',
        company: match[2]?.trim() || '',
        duration: match[3]?.trim() || '',
        description: match[4]?.trim().substring(0, 200) || ''
      });
    }

    return experiences.slice(0, 5); // Return last 5 jobs
  }

  /**
   * Extract education section
   */
  extractEducation(text) {
    const education = [];
    const eduPattern = /([A-Za-z\.]+)\s+(?:in\s+)?([^,\n]+)(?:\s+(?:from|at)\s+([^,\n]+))?/gi;

    const degreeText = text.match(/(?:education|degree)[\s\S]*?(?=\n\n|EXPERIENCE|SKILL|$)/i)?.[0] || '';

    let match;
    while ((match = eduPattern.exec(degreeText)) !== null) {
      if (match[1].length > 2) {
        education.push({
          degree: match[1]?.trim() || '',
          field: match[2]?.trim() || '',
          school: match[3]?.trim() || ''
        });
      }
    }

    return education.slice(0, 3);
  }

  /**
   * Extract skills from resume
   */
  extractSkills(text) {
    const commonSkills = [
      'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'react', 'node.js', 'express',
      'mongodb', 'postgresql', 'mysql', 'sql', 'html', 'css', 'git', 'docker', 'aws', 'azure',
      'machine learning', 'data science', 'nlp', 'deep learning', 'tensorflow', 'pytorch',
      'leadership', 'communication', 'project management', 'agile', 'scrum', 'rest api',
      'graphql', 'webpack', 'vite', 'sass', 'tailwind', 'bootstrap', 'next.js', 'vue.js',
      'angular', 'firebase', 'supabase', 'redis', 'elasticsearch', 'kafka', 'jenkins'
    ];

    const textLower = text.toLowerCase();
    const foundSkills = new Set();

    commonSkills.forEach(skill => {
      if (textLower.includes(skill)) {
        foundSkills.add(skill);
      }
    });

    // Extract custom skills section if present
    const skillsMatch = text.match(/(?:skills|technical skills|core competencies)[\s\n]*([\s\S]*?)(?=\n\n|EXPERIENCE|EDUCATION|$)/i);
    if (skillsMatch) {
      const skillsText = skillsMatch[1];
      skillsText.split(/[,\n•–]/).forEach(skill => {
        const cleaned = skill.trim().toLowerCase().replace(/^\d+\.\s*/, '');
        if (cleaned && cleaned.length > 2 && cleaned.length < 50) {
          foundSkills.add(cleaned);
        }
      });
    }

    return Array.from(foundSkills).slice(0, 20);
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certifications = [];
    const certPattern = /(?:cert|certification|licensed|certified)[\s\S]*?(?=\n\n|EXPERIENCE|SKILL|$)/i;
    const certMatch = text.match(certPattern);

    if (certMatch) {
      const certText = certMatch[0];
      certText.split(/\n/).forEach(line => {
        const cleaned = line.replace(/^[\s•–\d.]+/, '').trim();
        if (cleaned && cleaned.length > 5) {
          certifications.push(cleaned);
        }
      });
    }

    return certifications.slice(0, 5);
  }

  /**
   * Process uploaded resume file
   */
  async processResumeFile(file) {
    try {
      const fileExt = path.extname(file.filename).toLowerCase();
      let resumeText = '';

      console.log(`📝 Processing resume: ${file.filename} (${fileExt})`);

      if (fileExt === '.pdf') {
        resumeText = await this.extractTextFromPDF(file.path);
      } else if (fileExt === '.docx' || fileExt === '.doc') {
        resumeText = await this.extractTextFromDOCX(file.path);
      } else if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
        resumeText = await this.extractTextFromImage(file.path);
      } else {
        throw new Error('Unsupported file format. Use PDF, DOCX, or JPG.');
      }

      console.log(`📄 Extracted text length: ${resumeText.length} characters`);
      console.log(`📄 First 300 chars: ${resumeText.substring(0, 300)}`);

      // Parse extracted text
      const parsedData = this.parseResumeData(resumeText);

      console.log(`✅ Parsed data:`, {
        fullName: parsedData.fullName,
        email: parsedData.email,
        skills: parsedData.skills.slice(0, 5),
        experience: parsedData.experience.length + ' entries'
      });

      // Save file info
      parsedData.fileName = file.filename;
      parsedData.filePath = file.path;
      parsedData.fileSize = file.size;
      parsedData.uploadedAt = new Date();
      parsedData.rawText = resumeText;

      return parsedData;
    } catch (error) {
      console.error('❌ Resume processing error:', error.message);
      // Clean up file on error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * Delete resume file
   */
  deleteResumeFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

module.exports = new ResumeUploadService();

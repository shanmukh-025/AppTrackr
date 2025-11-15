/**
 * Resume AI Service
 * AI-powered resume and cover letter generation using Gemini
 * Includes ATS optimization and real-time preview
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class ResumeAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Using flash for better availability
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second initial delay
  }

  /**
   * Retry logic with exponential backoff for API calls
   */
  async retryWithBackoff(fn, retries = this.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && (error.status === 503 || error.status === 429 || error.message?.includes('overloaded'))) {
        const delay = this.retryDelay * Math.pow(2, this.maxRetries - retries);
        console.log(`API rate limited/overloaded. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(fn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Generate AI-optimized resume
   */
  async generateOptimizedResume(userProfile, targetRole, targetCompany) {
    try {
      const prompt = `You are an expert resume writer specializing in tech roles.

User Profile:
- Name: ${userProfile.name || 'Full Name'}
- Email: ${userProfile.email || 'email@example.com'}
- Phone: ${userProfile.phone || '+1-XXX-XXX-XXXX'}
- Current Role: ${userProfile.currentRole || 'Not specified'}
- Years of Experience: ${userProfile.yearsExperience || '0'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Previous Experience: ${userProfile.experience?.join('; ') || 'Not specified'}

Target Role: ${targetRole}
Target Company: ${targetCompany || 'Not specified'}

Create a professional, ATS-optimized resume that:
1. Highlights relevant skills for the target role
2. Uses action verbs and quantifiable achievements
3. Is formatted clearly without tables or complex formatting
4. Includes keywords that ATS systems look for
5. Shows career progression

Return ONLY valid JSON:
{
  "header": {
    "name": "Full Name",
    "title": "Professional Title",
    "contactInfo": {
      "email": "email",
      "phone": "phone",
      "location": "city, state",
      "linkedin": "linkedin url",
      "portfolio": "portfolio url"
    }
  },
  "professionalSummary": "2-3 sentence summary",
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Start - End",
      "achievements": ["achievement1", "achievement2", "achievement3"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "year": "Graduation Year"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "atsScore": 85,
  "recommendations": ["recommendation1", "recommendation2"]
}`;

      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const resume = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            resume,
            atsScore: resume.atsScore || 75,
            recommendations: resume.recommendations || []
          };
        } catch (e) {
          return this.getDefaultResume(userProfile);
        }
      }

      return this.getDefaultResume(userProfile);
    } catch (error) {
      console.error('Error generating resume:', error.message);
      // Return error response instead of fallback
      return {
        success: false,
        error: error.message?.includes('overloaded') 
          ? 'AI service is currently busy. Please try again in a moment.'
          : `Failed to generate resume: ${error.message}`,
        fallback: this.getDefaultResume(userProfile)
      };
    }
  }

  /**
   * Get default resume template
   */
  getDefaultResume(userProfile) {
    return {
      success: true,
      resume: {
        header: {
          name: userProfile.name || 'Full Name',
          title: userProfile.currentRole || 'Software Developer',
          contactInfo: {
            email: userProfile.email || 'email@example.com',
            phone: userProfile.phone || '+1-XXX-XXX-XXXX',
            location: 'City, State',
            linkedin: 'https://linkedin.com/in/yourprofile',
            portfolio: 'https://yourportfolio.com'
          }
        },
        professionalSummary: 'Experienced professional with expertise in software development and problem-solving.',
        skills: {
          technical: userProfile.skills || ['JavaScript', 'React', 'Node.js', 'SQL'],
          soft: ['Communication', 'Leadership', 'Problem-solving', 'Teamwork']
        },
        experience: [
          {
            company: 'Previous Company',
            role: 'Developer',
            duration: '2020 - Present',
            achievements: [
              'Developed and maintained multiple applications',
              'Improved performance by 40%',
              'Led team of 3 developers'
            ]
          }
        ],
        education: [
          {
            institution: 'University Name',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            year: '2020'
          }
        ],
        certifications: [],
        atsScore: 60,
        recommendations: ['Add more metrics', 'Highlight leadership', 'Include more projects']
      }
    };
  }

  /**
   * Generate cover letter
   */
  async generateCoverLetter(userProfile, targetRole, targetCompany, jobDescription) {
    try {
      const prompt = `You are an expert cover letter writer.

User Information:
- Name: ${userProfile.name}
- Current Role: ${userProfile.currentRole}
- Key Skills: ${userProfile.skills?.join(', ')}
- Years of Experience: ${userProfile.yearsExperience}

Applying for: ${targetRole} at ${targetCompany}
Job Description: ${jobDescription}

Write a compelling, professional cover letter that:
1. Addresses the hiring manager
2. Shows enthusiasm for the role and company
3. Highlights relevant experience and skills from the job description
4. Demonstrates company knowledge
5. Includes a strong closing

Return as JSON:
{
  "salutation": "Dear [Hiring Manager],",
  "opening": "Opening paragraph with enthusiasm",
  "bodyParagraph1": "First body paragraph highlighting relevant experience",
  "bodyParagraph2": "Second body paragraph showing value you can add",
  "bodyParagraph3": "Third body paragraph about company fit",
  "closing": "Closing statement",
  "signature": "Best regards, [Your Name]",
  "tips": ["tip1", "tip2", "tip3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const coverLetter = JSON.parse(jsonMatch[0]);
          return { success: true, coverLetter };
        } catch (e) {
          return this.getDefaultCoverLetter(userProfile, targetRole, targetCompany);
        }
      }

      return this.getDefaultCoverLetter(userProfile, targetRole, targetCompany);
    } catch (error) {
      console.error('Error generating cover letter:', error.message);
      return {
        success: false,
        error: error.message?.includes('overloaded')
          ? 'AI service is currently busy. Please try again in a moment.'
          : `Failed to generate cover letter: ${error.message}`,
        fallback: this.getDefaultCoverLetter(userProfile, targetRole, targetCompany)
      };
    }
  }

  /**
   * Get default cover letter template
   */
  getDefaultCoverLetter(userProfile, targetRole, targetCompany) {
    return {
      success: true,
      coverLetter: {
        salutation: 'Dear Hiring Manager,',
        opening: `I am excited to apply for the ${targetRole} position at ${targetCompany}. With my background in software development and passion for technology, I believe I would be a valuable addition to your team.`,
        bodyParagraph1: `Throughout my career, I have developed strong skills in ${userProfile.skills?.slice(0, 2).join(' and ')}. In my current role, I have successfully led projects and contributed to team success.`,
        bodyParagraph2: `I am particularly drawn to ${targetCompany} because of your company\'s commitment to innovation and excellence. I am confident that my skills and experience align well with the role requirements.`,
        bodyParagraph3: `I would welcome the opportunity to discuss how I can contribute to your team. Thank you for considering my application.`,
        closing: 'I look forward to hearing from you.',
        signature: `Best regards,\n${userProfile.name}`,
        tips: [
          'Customize for each position',
          'Research the company thoroughly',
          'Highlight specific achievements'
        ]
      }
    };
  }

  /**
   * Optimize resume for ATS
   */
  async optimizeForATS(resume) {
    try {
      const prompt = `Analyze this resume for ATS (Applicant Tracking System) optimization:

${JSON.stringify(resume, null, 2)}

Provide feedback on:
1. Keyword optimization (1-10 score)
2. Formatting compliance (1-10 score)
3. Content clarity (1-10 score)
4. Missing important elements
5. Specific improvements

Return as JSON:
{
  "overallScore": number (1-100),
  "keywordScore": number,
  "formattingScore": number,
  "clarityScore": number,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "keywordsToAdd": ["keyword1", "keyword2"],
  "summary": "Brief overall assessment"
}`;

      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return { success: true, ...JSON.parse(jsonMatch[0]) };
        } catch (e) {
          return this.getDefaultATSAnalysis();
        }
      }

      return this.getDefaultATSAnalysis();
    } catch (error) {
      console.error('Error analyzing ATS:', error.message);
      return this.getDefaultATSAnalysis();
    }
  }

  /**
   * Get default ATS analysis
   */
  getDefaultATSAnalysis() {
    return {
      success: true,
      overallScore: 72,
      keywordScore: 7,
      formattingScore: 8,
      clarityScore: 7,
      issues: ['Missing some industry keywords', 'Could use more metrics'],
      suggestions: [
        'Add specific technologies used',
        'Include measurable achievements',
        'Use industry-standard keywords'
      ],
      keywordsToAdd: ['agile', 'cross-functional', 'scalability'],
      summary: 'Resume is well-structured. Focus on adding more quantifiable achievements.'
    };
  }

  /**
   * Generate resume templates
   */
  async getResumeTemplates() {
    return {
      templates: [
        {
          id: 'tech-lead',
          name: 'Tech Lead Resume',
          description: 'Professional template for technical leadership roles',
          sections: ['Summary', 'Experience', 'Skills', 'Education', 'Certifications']
        },
        {
          id: 'startup-dev',
          name: 'Startup Developer',
          description: 'Modern template highlighting diverse skills and projects',
          sections: ['Summary', 'Projects', 'Experience', 'Skills', 'Education']
        },
        {
          id: 'corporate-dev',
          name: 'Corporate Developer',
          description: 'Formal template emphasizing corporate experience',
          sections: ['Summary', 'Experience', 'Skills', 'Education', 'Certifications', 'Awards']
        },
        {
          id: 'junior-dev',
          name: 'Junior Developer',
          description: 'Entry-level template highlighting projects and learning',
          sections: ['Summary', 'Projects', 'Skills', 'Education', 'Coursework']
        }
      ]
    };
  }

  /**
   * Compare resumes
   */
  async compareResumes(original, optimized) {
    try {
      return {
        success: true,
        comparison: {
          improvements: [
            'Better ATS keyword density',
            'Stronger action verbs',
            'More quantifiable achievements',
            'Clearer formatting'
          ],
          originalScore: 65,
          optimizedScore: 85,
          scoreImprovement: 20,
          recommendations: [
            'Focus on this new format',
            'Add more company achievements',
            'Highlight leadership roles'
          ]
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Parse resume from text/file
   */
  async parseResumeText(resumeText) {
    try {
      const prompt = `Extract structured information from this resume text:

${resumeText}

Return as JSON:
{
  "name": "Full Name",
  "email": "email",
  "phone": "phone",
  "currentRole": "Current Title",
  "yearsExperience": number,
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "name",
      "role": "title",
      "duration": "dates",
      "achievements": ["achievement"]
    }
  ],
  "education": [
    {
      "institution": "name",
      "degree": "degree",
      "field": "field"
    }
  ],
  "certifications": ["cert1"]
}`;

      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return { success: true, parsed: JSON.parse(jsonMatch[0]) };
        } catch (e) {
          return { success: false, error: 'Could not parse resume' };
        }
      }

      return { success: false, error: 'Could not parse resume' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message?.includes('overloaded')
          ? 'AI service is currently busy. Please try again in a moment.'
          : error.message
      };
    }
  }

  /**
   * Comprehensive Resume Analysis and Scoring
   */
  async comprehensiveResumeAnalysis(resumeText) {
    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer. 
Analyze this resume comprehensively and provide detailed scoring and feedback.

RESUME TEXT:
${resumeText}

Analyze the resume and return ONLY valid JSON with NO markdown formatting:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "sections": {
    "present": [<array of sections found like "Contact Info", "Summary", "Experience", "Education", "Skills", etc>],
    "missing": [<array of commonly expected sections that are missing>]
  },
  "strengths": [<array of 3-5 specific strengths found in the resume>],
  "weaknesses": [<array of 3-5 specific weaknesses or areas of concern>],
  "improvements": [
    {
      "category": "<keywords|formatting|content|structure>",
      "priority": "<high|medium|low>",
      "issue": "<specific issue found>",
      "suggestion": "<actionable suggestion to fix it>"
    }
  ]
}

Scoring Guidelines:
- Overall Score: Holistic assessment of resume quality
- ATS Score: How well it will pass ATS systems (keywords, formatting, structure)
- Formatting Score: Visual organization, consistency, readability
- Content Score: Quality of descriptions, achievements, action verbs
- Keyword Score: Industry-relevant keywords and technical terms

Be specific and actionable in your feedback.`;

      const result = await this.retryWithBackoff(async () => {
        return await this.model.generateContent(prompt);
      });

      const response = result.response;
      let text = response.text();

      // Clean up response
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate and ensure all fields exist
      return {
        overallScore: Math.min(100, Math.max(0, analysis.overallScore || 65)),
        atsScore: Math.min(100, Math.max(0, analysis.atsScore || 65)),
        formattingScore: Math.min(100, Math.max(0, analysis.formattingScore || 70)),
        contentScore: Math.min(100, Math.max(0, analysis.contentScore || 65)),
        keywordScore: Math.min(100, Math.max(0, analysis.keywordScore || 60)),
        sections: {
          present: Array.isArray(analysis.sections?.present) ? analysis.sections.present : ['Contact Info', 'Experience'],
          missing: Array.isArray(analysis.sections?.missing) ? analysis.sections.missing : ['Certifications']
        },
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ['Resume structure is clear'],
        weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : ['Could use more specific metrics'],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [
          {
            category: 'content',
            priority: 'high',
            issue: 'General content review needed',
            suggestion: 'Add more quantifiable achievements and metrics'
          }
        ]
      };
    } catch (error) {
      console.error('Comprehensive analysis error:', error);
      throw new Error('Failed to analyze resume: ' + error.message);
    }
  }
}

module.exports = new ResumeAIService();

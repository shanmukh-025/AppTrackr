const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API - MUST use environment variable ONLY
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file!');
  console.error('Add GEMINI_API_KEY to your .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  constructor() {
    if (genAI) {
      // Use gemini-2.5-flash which is the latest stable model
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } else {
      this.model = null;
    }
  }

  _checkAPIKey() {
    if (!genAI || !this.model) {
      throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY environment variable.');
    }
  }

  async analyzeResume(resumeText, jobDescription = null) {
    try {
      this._checkAPIKey();
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Resume text is empty');
      }

      const prompt = jobDescription
        ? `You are an expert resume reviewer. Analyze this resume against the job description.\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nReturn ONLY valid JSON (no markdown, no extra text) with these fields:\n{\n"overallScore": 0-100,\n"matchScore": 0-100,\n"skillsMatched": ["skill1", "skill2"],\n"skillsGaps": ["skill1", "skill2"],\n"strengths": ["strength1", "strength2"],\n"weaknesses": ["weakness1", "weakness2"],\n"suggestions": ["suggestion1", "suggestion2"]\n}`
        : `You are an expert resume reviewer. Analyze this resume.\n\nRESUME:\n${resumeText}\n\nReturn ONLY valid JSON (no markdown, no extra text) with these fields:\n{\n"overallScore": 0-100,\n"strengths": ["strength1", "strength2"],\n"weaknesses": ["weakness1", "weakness2"],\n"suggestions": ["suggestion1", "suggestion2"]\n}`;

      console.log('🤖 Sending to Gemini API...');
      
      // Add timeout of 30 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API request timeout (30s)')), 30000)
      );
      
      const apiPromise = this.model.generateContent(prompt);
      const result = await Promise.race([apiPromise, timeoutPromise]);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }

      let text = response.text();
      console.log('✅ Gemini response received (first 300 chars):', text.substring(0, 300));

      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('❌ No JSON found in response. Raw text:', text);
        throw new Error('Could not find JSON in AI response');
      }
      
      const jsonStr = jsonMatch[0];
      console.log('📋 Extracted JSON (first 300 chars):', jsonStr.substring(0, 300));
      
      // Try to parse and clean up if needed
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.warn('⚠️  JSON parse error, attempting to fix...');
        // Try to fix common JSON issues
        let fixedJson = jsonStr
          .replace(/,\s*}/g, '}')  // Remove trailing commas before }
          .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
          .replace(/'/g, '"');      // Replace single quotes with double quotes
        
        parsed = JSON.parse(fixedJson);
      }
      
      // Ensure all expected fields exist
      parsed = {
        overallScore: parsed.overallScore || 0,
        matchScore: parsed.matchScore || 0,
        skillsMatched: Array.isArray(parsed.skillsMatched) ? parsed.skillsMatched : [],
        skillsGaps: Array.isArray(parsed.skillsGaps) ? parsed.skillsGaps : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
      
      console.log('✅ Analysis complete:', { 
        overallScore: parsed.overallScore, 
        matchScore: parsed.matchScore,
        skillsMatched: parsed.skillsMatched.length,
        skillsGaps: parsed.skillsGaps.length
      });
      
      return parsed;
    } catch (error) {
      console.error('❌ Resume analysis error:', error.message || error);
      throw new Error('Failed to analyze resume: ' + (error.message || 'Unknown error'));
    }
  }

  async generateResume(userData) {
    try {
      this._checkAPIKey();
      
      const { fullName, email, phone, targetRole, experience, skills, education, university, graduationYear, currentRole, location } = userData;
      
      const prompt = `You are an expert resume writer. Generate a professional, ATS-friendly resume.

USER INFORMATION PROVIDED:
- Full Name: ${fullName}
- Email: ${email || 'Not provided'}
- Phone: ${phone || 'Not provided'}
- Location: ${location || 'Not provided'}
- Target Role: ${targetRole}
- Current Role: ${currentRole || 'Not provided'}
- Work Experience Details: ${experience || 'Not provided'}
- Skills: ${skills}

EDUCATION FROM USER PROFILE:
- Degree/Education: ${education || 'Not provided'}
- University: ${university || 'Not provided'}
- Graduation Year: ${graduationYear || 'Not provided'}

INSTRUCTIONS:
1. Create a complete, professional resume structure for a ${targetRole} position
2. For contact info: Use the EXACT name, email, phone, and location provided
3. For Professional Summary: Write 2-3 sentences based on the target role and skills provided
4. For Skills: Use the EXACT skills list provided: ${skills}
5. For Work Experience:
   ${experience ? 
     `- Use the experience details provided: ${experience}
      - Expand with relevant responsibilities and achievements typical for someone targeting ${targetRole}` :
     `- Create 2-3 example positions relevant to ${targetRole} with [COMPANY NAME], [DATES] placeholders
      - Include realistic job responsibilities and achievements for this role
      - Make it clear these need to be customized`
   }
6. For Education:
   ${education || university ? 
     `- MUST include the education from user profile:
      * Degree: ${education || '[Degree]'}
      * University: ${university || '[University Name]'}
      * Graduation Year: ${graduationYear || '[Year]'}
      - If any field is missing, use [PLACEHOLDER] format
      - DO NOT make up education if not provided` :
     `- Create 1 education entry with [UNIVERSITY NAME], [DEGREE], [GRADUATION YEAR] placeholders
      - Choose degree relevant to ${targetRole}
      - Make it clear this needs to be customized`
   }
7. For Projects (Optional):
   - Add 1-2 relevant project examples with [PROJECT NAME] placeholders if appropriate for ${targetRole}
8. Use professional formatting with clear section headers
9. Include action verbs and quantifiable achievements (use realistic percentages/numbers as examples)

IMPORTANT: 
- Use brackets [LIKE THIS] for any placeholder information that user needs to customize
- Always prioritize and include the education information from the user's profile if provided
- Make the resume complete enough to be useful, but clear about what needs customization
- Focus on creating a strong template structure with realistic examples

Return ONLY the resume text with clear formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Resume generation error:', error);
      throw new Error('Failed to generate resume: ' + error.message);
    }
  }

  async generateCoverLetter(userProfile, jobDescription, company, position, tone = 'professional') {
    try {
      this._checkAPIKey();
      
      const toneGuide = {
        professional: 'formal, polished, and corporate',
        casual: 'friendly, approachable, yet professional',
        enthusiastic: 'energetic, passionate, and excited'
      };

      const prompt = `You are an expert cover letter writer. Generate a compelling cover letter.\n\nUSER: ${userProfile.name || 'Candidate'}, ${userProfile.currentRole || 'N/A'}\nEXPERIENCE: ${userProfile.experience || 'N/A'}\nSKILLS: ${userProfile.skills || 'N/A'}\n\nCOMPANY: ${company}\nPOSITION: ${position}\nJOB: ${jobDescription}\n\nTONE: ${toneGuide[tone] || toneGuide.professional}\n\nReturn ONLY the cover letter text (250-350 words).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Cover letter generation error:', error);
      throw new Error('Failed to generate cover letter: ' + error.message);
    }
  }

  async generateInterviewPrep(company, position, jobDescription) {
    try {
      this._checkAPIKey();
      
      const prompt = `You are an interview coach. Generate 10 interview questions with answers.\n\nCOMPANY: ${company}\nPOSITION: ${position}\nJOB: ${jobDescription}\n\nReturn JSON with questions array and tips array. Each question should have: id, question, answer, category (behavioral/technical/situational), difficulty (easy/medium/hard)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse AI response');
    } catch (error) {
      console.error('Interview prep generation error:', error);
      throw new Error('Failed to generate interview prep: ' + error.message);
    }
  }

  async extractSkills(resumeText) {
    try {
      this._checkAPIKey();
      
      const prompt = `Extract all technical and professional skills from this resume. Return ONLY a JSON array of skills.\n\nRESUME:\n${resumeText}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Skill extraction error:', error);
      return [];
    }
  }

  async checkATSCompatibility(resumeText) {
    try {
      this._checkAPIKey();
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Resume text is empty');
      }

      const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility and provide a detailed score.

RESUME:
${resumeText}

Evaluate the resume based on:
1. Keyword optimization (industry-specific terms, skills)
2. Formatting (simple, ATS-friendly structure)
3. Contact information (clear and complete)
4. Section headers (standard naming conventions)
5. File readability (no images, tables, special characters)
6. Quantifiable achievements (metrics, numbers, percentages)
7. Action verbs and power words
8. Proper use of bullet points
9. Relevant skills section
10. Grammar and spelling

Return ONLY valid JSON (no markdown, no extra text) with this structure:
{
  "overallScore": 0-100,
  "categories": {
    "keywords": {"score": 0-100, "feedback": "string"},
    "formatting": {"score": 0-100, "feedback": "string"},
    "content": {"score": 0-100, "feedback": "string"},
    "sections": {"score": 0-100, "feedback": "string"}
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "warnings": ["warning1", "warning2"],
  "criticalIssues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "missingElements": ["element1", "element2"],
  "detectedKeywords": ["keyword1", "keyword2"],
  "recommendation": "Overall assessment and next steps"
}`;

      console.log('🤖 Analyzing ATS compatibility...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }

      let text = response.text();
      console.log('✅ ATS analysis received');

      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', text);
        throw new Error('Failed to parse ATS analysis response');
      }

      return parsedData;
    } catch (error) {
      console.error('❌ ATS check error:', error);
      throw new Error('Failed to analyze ATS compatibility: ' + error.message);
    }
  }

  /**
   * Generate domain-specific interview questions
   */
  async generateInterviewQuestions(domain, difficulty, count) {
    try {
      this._checkAPIKey();

      const domainDescriptions = {
        'software-engineering': 'Software Engineering, Programming, System Design, and Technical Leadership',
        'data-science': 'Data Science, Machine Learning, Analytics, and AI',
        'product-management': 'Product Management, Strategy, Roadmapping, and User Experience',
        'project-management': 'Project Management, Agile, Scrum, and Delivery',
        'business-analysis': 'Business Analysis, Requirements Gathering, and Process Improvement',
        'marketing': 'Marketing, Growth, Digital Marketing, and Brand Management',
        'sales': 'Sales, Business Development, and Client Relations',
        'design': 'UX/UI Design, Product Design, and User Research',
        'hr': 'Human Resources, Talent Acquisition, and People Management',
        'finance': 'Finance, Accounting, and Financial Analysis',
        'customer-success': 'Customer Success, Support, and Relationship Management',
        'general': 'General Behavioral and Leadership'
      };

      const domainName = domainDescriptions[domain] || domain;

      const prompt = `You are an expert interviewer specializing in ${domainName}.

Generate exactly ${count} unique, high-quality interview questions for a ${domain} role.

REQUIREMENTS:
1. Questions should be behavioral, situational, or role-specific
2. Difficulty levels: ${difficulty === 'Mixed' ? 'randomly distribute as Easy (30%), Medium (50%), Hard (20%)' : `All ${difficulty}`}
3. Questions MUST be specific and relevant to ${domainName}
4. Include mix of technical competency and soft skills questions
5. Make questions realistic and scenario-based
6. Questions should encourage STAR method responses

CRITICAL: Return ONLY valid JSON array (no markdown, no extra text, no code blocks).
Start with [ and end with ]. No explanation before or after.

[
  {
    "question": "The actual question text specific to ${domain}",
    "category": "Technical/Leadership/Communication/Problem-Solving/etc",
    "difficulty": "Easy|Medium|Hard",
    "expectedFocus": "What interviewer wants to learn",
    "starPrompt": "Hint about STAR method approach"
  }
]

Generate exactly ${count} diverse questions appropriate for ${domainName}.`;

      console.log(`🤖 Generating ${count} interview questions for ${domain}...`);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }

      let text = response.text().trim();
      console.log('Raw response (first 500 chars):', text.substring(0, 500));

      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Find JSON array
      let jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in response:', text);
        throw new Error('Could not find JSON array in AI response');
      }

      let jsonStr = jsonMatch[0];
      let parsedData = JSON.parse(jsonStr);
      
      // Ensure we got an array
      if (!Array.isArray(parsedData)) {
        console.error('Response is not an array:', parsedData);
        throw new Error('AI response is not an array of questions');
      }

      // Validate we have questions
      if (parsedData.length === 0) {
        throw new Error('No questions were generated');
      }

      // Add unique IDs and ensure all required fields
      const questionsWithIds = parsedData.map((q, idx) => ({
        id: idx + 1,
        question: q.question || '',
        category: q.category || 'General',
        difficulty: q.difficulty || 'Medium',
        expectedFocus: q.expectedFocus || '',
        starPrompt: q.starPrompt || ''
      }));

      console.log(`✅ Successfully generated ${questionsWithIds.length} questions for ${domain}`);
      return questionsWithIds;
    } catch (error) {
      console.error('❌ Generate questions error:', error.message);
      console.error('Full error:', error);
      throw new Error(`Failed to generate interview questions: ${error.message}`);
    }
  }

  /**
   * Analyze interview response with smart AI analysis
   */
  async analyzeInterviewResponse({ question, answer, transcript, duration, domain, category }) {
    try {
      this._checkAPIKey();

      const wordCount = (transcript || answer || '').split(/\s+/).length;
      const durationInSeconds = duration || 0;

      const prompt = `You are an expert interview coach with deep knowledge in behavioral interviewing, communication analysis, and professional assessment.

INTERVIEW QUESTION:
"${question}"

CANDIDATE'S RESPONSE:
${transcript || answer}

RESPONSE METADATA:
- Duration: ${durationInSeconds} seconds (${Math.floor(durationInSeconds / 60)}m ${durationInSeconds % 60}s)
- Word Count: ${wordCount} words
- Domain: ${domain || 'General'}
- Category: ${category || 'Behavioral'}

ANALYZE THE RESPONSE ACROSS MULTIPLE DIMENSIONS:

1. **Content Quality** (40% weight):
   - STAR method compliance (Situation, Task, Action, Result)
   - Specificity and concrete examples
   - Relevance to the question
   - Depth of insight and self-awareness
   - Quantifiable results mentioned

2. **Communication Skills** (30% weight):
   - Clarity and coherence
   - Structure and organization
   - Professional language
   - Confidence in delivery (based on word choice)
   - Conciseness vs verbosity

3. **Behavioral Indicators** (30% weight):
   - Problem-solving approach
   - Leadership qualities
   - Teamwork and collaboration
   - Adaptability and learning
   - Ownership and accountability

Return ONLY valid JSON (no markdown) with this structure:
{
  "overallScore": 0-100,
  "contentScore": 0-100,
  "communicationScore": 0-100,
  "behavioralScore": 0-100,
  "starCompliance": {
    "score": 0-100,
    "situation": "present/missing/weak",
    "task": "present/missing/weak",
    "action": "present/missing/weak",
    "result": "present/missing/weak",
    "feedback": "Specific feedback on STAR usage"
  },
  "strengths": ["3-5 specific strengths"],
  "improvements": ["3-5 specific areas to improve"],
  "detailedFeedback": "Comprehensive paragraph analyzing the response",
  "keyInsights": ["2-3 key insights about the candidate"],
  "redFlags": ["Any concerning patterns or gaps"],
  "suggestions": "Specific actionable advice for improvement",
  "estimatedFillerWords": 0-50,
  "responseAdequacy": "too-short/adequate/too-long",
  "professionalismScore": 0-100,
  "specificityScore": 0-100,
  "impactScore": 0-100
}`;

      console.log('🤖 Analyzing interview response...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }

      let text = response.text();
      console.log('✅ Response analysis complete');

      // Remove markdown code blocks
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in AI response');
      }

      let parsedData = JSON.parse(jsonMatch[0]);

      return parsedData;
    } catch (error) {
      console.error('❌ Analyze response error:', error);
      throw new Error('Failed to analyze interview response: ' + error.message);
    }
  }
}

module.exports = new AIService();

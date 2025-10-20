const { GoogleGenerativeAI } = require('@google/generative-ai');const { GoogleGenerativeAI } = require('@google/generative-ai');



// Initialize Gemini API - MUST use environment variable ONLY// Initialize Gemini API - MUST use environment variable

if (!process.env.GEMINI_API_KEY) {if (!process.env.GEMINI_API_KEY) {

  console.error('❌ GEMINI_API_KEY is not set in .env file!');  console.error('❌ GEMINI_API_KEY is not set in .env file!');

  console.error('Add GEMINI_API_KEY to your .env file');  console.error('Add GEMINI_API_KEY to your .env file');

  process.exit(1);}

}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {

class AIService {  constructor() {

  constructor() {    // Use gemini-2.0-flash (latest free model)

    // Use gemini-2.0-flash (latest free model)    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });  }

  }

  /**

  /**   * Analyze Resume and provide detailed feedback

   * Analyze Resume and provide detailed feedback   */

   */  async analyzeResume(resumeText, jobDescription = null) {

  async analyzeResume(resumeText, jobDescription = null) {    try {

    try {      const prompt = jobDescription

      const prompt = jobDescription        ? `You are an expert resume reviewer and career coach. Analyze this resume against the job description and provide detailed feedback.

        ? `You are an expert resume reviewer and career coach. Analyze this resume against the job description and provide detailed feedback.

RESUME:

RESUME:${resumeText}

${resumeText}

JOB DESCRIPTION:

JOB DESCRIPTION:${jobDescription}

${jobDescription}

Provide your analysis in the following JSON format:

Provide your analysis in the following JSON format:{

{  "overallScore": <number 0-100>,

  "overallScore": <number 0-100>,  "matchScore": <number 0-100>,

  "matchScore": <number 0-100>,  "skillsMatched": ["skill1", "skill2"],

  "skillsMatched": ["skill1", "skill2"],  "skillsGaps": ["missing_skill1", "missing_skill2"],

  "skillsGaps": ["missing_skill1", "missing_skill2"],  "strengths": ["strength1", "strength2"],

  "strengths": ["strength1", "strength2"],  "weaknesses": ["weakness1", "weakness2"],

  "weaknesses": ["weakness1", "weakness2"],  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]

  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]}

}

Be specific, actionable, and constructive.`

Be specific, actionable, and constructive.`        : `You are an expert resume reviewer and career coach. Analyze this resume and provide detailed feedback.

        : `You are an expert resume reviewer and career coach. Analyze this resume and provide detailed feedback.

RESUME:

RESUME:${resumeText}

${resumeText}

Provide your analysis in the following JSON format:

Provide your analysis in the following JSON format:{

{  "overallScore": <number 0-100>,

  "overallScore": <number 0-100>,  "strengths": ["strength1", "strength2"],

  "strengths": ["strength1", "strength2"],  "weaknesses": ["weakness1", "weakness2"],

  "weaknesses": ["weakness1", "weakness2"],  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]

  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]}

}

Be specific, actionable, and constructive.`;

Be specific, actionable, and constructive.`;

      const result = await this.model.generateContent(prompt);

      const result = await this.model.generateContent(prompt);      const response = await result.response;

      const response = await result.response;      const text = response.text();

      const text = response.text();

      // Extract JSON from response

      // Extract JSON from response      const jsonMatch = text.match(/\{[\s\S]*\}/);

      const jsonMatch = text.match(/\{[\s\S]*\}/);      if (jsonMatch) {

      if (jsonMatch) {        return JSON.parse(jsonMatch[0]);

        return JSON.parse(jsonMatch[0]);      }

      }

      throw new Error('Could not parse AI response');

      throw new Error('Could not parse AI response');    } catch (error) {

    } catch (error) {      console.error('Resume analysis error:', error);

      console.error('Resume analysis error:', error);      throw new Error('Failed to analyze resume: ' + error.message);

      throw new Error('Failed to analyze resume: ' + error.message);    }

    }  }

  }

  /**

  /**   * Generate Cover Letter

   * Generate Cover Letter   */

   */  async generateCoverLetter(userProfile, jobDescription, company, position, tone = 'professional') {

  async generateCoverLetter(userProfile, jobDescription, company, position, tone = 'professional') {    try {

    try {      const toneGuide = {

      const toneGuide = {        professional: 'formal, polished, and corporate',

        professional: 'formal, polished, and corporate',        casual: 'friendly, approachable, yet professional',

        casual: 'friendly, approachable, yet professional',        enthusiastic: 'energetic, passionate, and excited'

        enthusiastic: 'energetic, passionate, and excited'      };

      };

      const prompt = `You are an expert cover letter writer. Generate a compelling cover letter.

      const prompt = `You are an expert cover letter writer. Generate a compelling cover letter.

USER PROFILE:

USER PROFILE:Name: ${userProfile.name || 'Candidate'}

Name: ${userProfile.name || 'Candidate'}Current Role: ${userProfile.currentRole || 'N/A'}

Current Role: ${userProfile.currentRole || 'N/A'}Experience: ${userProfile.experience || 'N/A'}

Experience: ${userProfile.experience || 'N/A'}Skills: ${userProfile.skills || 'N/A'}

Skills: ${userProfile.skills || 'N/A'}Education: ${userProfile.education || 'N/A'}

Education: ${userProfile.education || 'N/A'}Bio: ${userProfile.bio || 'N/A'}

Bio: ${userProfile.bio || 'N/A'}

JOB DETAILS:

JOB DETAILS:Company: ${company}

Company: ${company}Position: ${position}

Position: ${position}Job Description: ${jobDescription}

Job Description: ${jobDescription}

TONE: ${toneGuide[tone] || toneGuide.professional}

TONE: ${toneGuide[tone] || toneGuide.professional}

Generate a cover letter that:

Generate a cover letter that:1. Opens with a strong hook

1. Opens with a strong hook2. Highlights relevant experience and skills

2. Highlights relevant experience and skills3. Shows genuine interest in the company

3. Shows genuine interest in the company4. Demonstrates value you'll bring

4. Demonstrates value you'll bring5. Ends with a clear call to action

5. Ends with a clear call to action

Keep it concise (250-350 words) and personalized. Return ONLY the cover letter text, no additional formatting.`;

Keep it concise (250-350 words) and personalized. Return ONLY the cover letter text, no additional formatting.`;

      const result = await this.model.generateContent(prompt);

      const result = await this.model.generateContent(prompt);      const response = await result.response;

      const response = await result.response;      return response.text().trim();

      return response.text().trim();    } catch (error) {

    } catch (error) {      console.error('Cover letter generation error:', error);

      console.error('Cover letter generation error:', error);      throw new Error('Failed to generate cover letter: ' + error.message);

      throw new Error('Failed to generate cover letter: ' + error.message);    }

    }  }

  }

  /**

  /**   * Generate Interview Questions and Answers

   * Generate Interview Questions and Answers   */

   */  async generateInterviewPrep(company, position, jobDescription) {

  async generateInterviewPrep(company, position, jobDescription) {    try {

    try {      const prompt = `You are an expert interview coach. Generate likely interview questions and sample answers for this role.

      const prompt = `You are an expert interview coach. Generate likely interview questions and sample answers for this role.

COMPANY: ${company}

COMPANY: ${company}POSITION: ${position}

POSITION: ${position}JOB DESCRIPTION: ${jobDescription}

JOB DESCRIPTION: ${jobDescription}

Generate 10 interview questions with sample answers in this JSON format:

Generate 10 interview questions with sample answers in this JSON format:{

{  "questions": [

  "questions": [    {

    {      "id": 1,

      "id": 1,      "question": "Question text",

      "question": "Question text",      "answer": "Sample answer (2-3 sentences)",

      "answer": "Sample answer (2-3 sentences)",      "category": "behavioral|technical|situational",

      "category": "behavioral|technical|situational",      "difficulty": "easy|medium|hard"

      "difficulty": "easy|medium|hard"    }

    }  ],

  ],  "tips": ["tip1", "tip2", "tip3"]

  "tips": ["tip1", "tip2", "tip3"]}

}

Include a mix of:

Include a mix of:- Technical questions (3-4)

- Technical questions (3-4)- Behavioral questions (3-4)

- Behavioral questions (3-4)- Company-specific questions (2-3)

- Company-specific questions (2-3)

Make answers concise but impressive.`;

Make answers concise but impressive.`;

      const result = await this.model.generateContent(prompt);

      const result = await this.model.generateContent(prompt);      const response = await result.response;

      const response = await result.response;      const text = response.text();

      const text = response.text();

      // Extract JSON from response

      // Extract JSON from response      const jsonMatch = text.match(/\{[\s\S]*\}/);

      const jsonMatch = text.match(/\{[\s\S]*\}/);      if (jsonMatch) {

      if (jsonMatch) {        return JSON.parse(jsonMatch[0]);

        return JSON.parse(jsonMatch[0]);      }

      }

      throw new Error('Could not parse AI response');

      throw new Error('Could not parse AI response');    } catch (error) {

    } catch (error) {      console.error('Interview prep generation error:', error);

      console.error('Interview prep generation error:', error);      throw new Error('Failed to generate interview prep: ' + error.message);

      throw new Error('Failed to generate interview prep: ' + error.message);    }

    }  }

  }

  /**

  /**   * Extract skills from resume text

   * Extract skills from resume text   */

   */  async extractSkills(resumeText) {

  async extractSkills(resumeText) {    try {

    try {      const prompt = `Extract all technical and professional skills from this resume. Return ONLY a JSON array of skills.

      const prompt = `Extract all technical and professional skills from this resume. Return as JSON array.

RESUME:

RESUME:${resumeText}

${resumeText}

Return format: ["skill1", "skill2", "skill3", ...]`;

Return ONLY a JSON array like: ["skill1", "skill2", "skill3"]`;

      const result = await this.model.generateContent(prompt);

      const result = await this.model.generateContent(prompt);      const response = await result.response;

      const response = await result.response;      const text = response.text();

      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);

      // Extract JSON array from response      if (jsonMatch) {

      const jsonMatch = text.match(/\[[\s\S]*\]/);        return JSON.parse(jsonMatch[0]);

      if (jsonMatch) {      }

        return JSON.parse(jsonMatch[0]);

      }      return [];

    } catch (error) {

      return [];      console.error('Skill extraction error:', error);

    } catch (error) {      return [];

      console.error('Skill extraction error:', error);    }

      return [];  }

    }}

  }

}module.exports = new AIService();


module.exports = new AIService();

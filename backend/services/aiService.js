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
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeResume(resumeText, jobDescription = null) {
    try {
      const prompt = jobDescription
        ? `You are an expert resume reviewer. Analyze this resume against the job description.\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nReturn JSON with: overallScore, matchScore, skillsMatched, skillsGaps, strengths, weaknesses, suggestions`
        : `You are an expert resume reviewer. Analyze this resume.\n\nRESUME:\n${resumeText}\n\nReturn JSON with: overallScore, strengths, weaknesses, suggestions`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse AI response');
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw new Error('Failed to analyze resume: ' + error.message);
    }
  }

  async generateCoverLetter(userProfile, jobDescription, company, position, tone = 'professional') {
    try {
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
}

module.exports = new AIService();

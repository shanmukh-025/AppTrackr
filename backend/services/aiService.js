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
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Resume text is empty');
      }

      const prompt = jobDescription
        ? `You are an expert resume reviewer. Analyze this resume against the job description.\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nReturn ONLY valid JSON (no markdown, no extra text) with these fields:\n{\n"overallScore": 0-100,\n"matchScore": 0-100,\n"skillsMatched": ["skill1", "skill2"],\n"skillsGaps": ["skill1", "skill2"],\n"strengths": ["strength1", "strength2"],\n"weaknesses": ["weakness1", "weakness2"],\n"suggestions": ["suggestion1", "suggestion2"]\n}`
        : `You are an expert resume reviewer. Analyze this resume.\n\nRESUME:\n${resumeText}\n\nReturn ONLY valid JSON (no markdown, no extra text) with these fields:\n{\n"overallScore": 0-100,\n"strengths": ["strength1", "strength2"],\n"weaknesses": ["weakness1", "weakness2"],\n"suggestions": ["suggestion1", "suggestion2"]\n}`;

      console.log('🤖 Sending to Gemini API...');
      const result = await this.model.generateContent(prompt);
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

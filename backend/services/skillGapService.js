const skillCategories = {
  frontend: ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'next.js', 'nuxt', 'svelte', 'webpack', 'vite', 'sass', 'tailwind', 'bootstrap'],
  backend: ['node.js', 'express', 'python', 'django', 'flask', 'java', 'spring', 'c#', 'asp.net', 'php', 'laravel', 'go', 'rust', 'graphql', 'rest api'],
  database: ['mongodb', 'postgresql', 'mysql', 'sql', 'firebase', 'redis', 'elasticsearch', 'cassandra', 'supabase', 'dynamodb'],
  devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'gitlab', 'github', 'ci/cd', 'terraform', 'ansible'],
  mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'expo'],
  ai: ['machine learning', 'tensorflow', 'pytorch', 'nlp', 'deep learning', 'scikit-learn', 'keras', 'opencv'],
  other: ['git', 'agile', 'scrum', 'jira', 'communication', 'leadership', 'problem solving']
};

class SkillGapService {
  /**
   * Extract skills from text
   */
  extractSkills(text) {
    if (!text) return [];
    
    const textLower = text.toLowerCase();
    const foundSkills = new Set();

    // Search all categories for skills
    Object.values(skillCategories).flat().forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    });

    return Array.from(foundSkills);
  }

  /**
   * Categorize skills by type
   */
  categorizeSkills(skills) {
    const categorized = {};

    Object.keys(skillCategories).forEach(category => {
      categorized[category] = skills.filter(skill =>
        skillCategories[category].some(cat => 
          skill.toLowerCase().includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });

    return categorized;
  }

  /**
   * Calculate skill gap between user resume and job description
   */
  calculateSkillGap(userSkills, jobRequiredSkills) {
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const jobSkillsLower = jobRequiredSkills.map(s => s.toLowerCase());

    // Find matched skills
    const matched = jobSkillsLower.filter(skill =>
      userSkillsLower.some(userSkill => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    );

    // Find missing skills
    const missing = jobSkillsLower.filter(skill =>
      !userSkillsLower.some(userSkill =>
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    );

    // Find extra skills (user has but job doesn't require)
    const extra = userSkillsLower.filter(skill =>
      !jobSkillsLower.some(jobSkill =>
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );

    const matchPercentage = jobSkillsLower.length > 0 
      ? Math.round((matched.length / jobSkillsLower.length) * 100)
      : 0;

    return {
      matched: matched.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      missing: missing.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      extra: extra.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      matchPercentage,
      totalRequired: jobSkillsLower.length,
      totalMatched: matched.length,
      totalMissing: missing.length
    };
  }

  /**
   * Get skill recommendations based on gaps
   */
  getRecommendations(skillGap, userSkills) {
    const recommendations = [];

    if (skillGap.matchPercentage < 50) {
      recommendations.push({
        priority: 'high',
        category: 'Core Skills',
        message: 'You\'re missing more than half the required skills. Consider prioritizing the most critical ones.',
        skills: skillGap.missing.slice(0, 3)
      });
    }

    // Find skill categories with gaps
    const userCategorized = this.categorizeSkills(userSkills);
    
    Object.entries(skillGap).forEach(([category, skills]) => {
      if (category === 'missing' && skills.length > 0) {
        recommendations.push({
          priority: skills.length > 3 ? 'high' : 'medium',
          category: `Learn ${category}`,
          message: `Focus on learning these ${category.toLowerCase()} skills to improve your match.`,
          skills: skills.slice(0, 5)
        });
      }
    });

    if (skillGap.extra.length > 3) {
      recommendations.push({
        priority: 'low',
        category: 'Your Strengths',
        message: 'You have additional skills beyond the job requirements. Leverage these as competitive advantages.',
        skills: skillGap.extra.slice(0, 5)
      });
    }

    return recommendations;
  }

  /**
   * Create skill gap visualization data for charts
   */
  generateChartData(skillGap) {
    return {
      // Pie chart data - match percentage
      matchChart: {
        labels: ['Matched', 'Missing'],
        data: [skillGap.totalMatched, skillGap.totalMissing],
        backgroundColor: ['#4CAF50', '#ff6b6b'],
        borderColor: ['#45a049', '#ff5252'],
        borderWidth: 2
      },

      // Bar chart - skills by category
      skillsByCategory: {
        labels: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Other'],
        matched: [
          skillGap.matched.filter(s => skillCategories.frontend.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.backend.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.database.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.devops.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.mobile.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.ai.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.matched.filter(s => skillCategories.other.some(c => c.toLowerCase().includes(s.toLowerCase()))).length
        ],
        missing: [
          skillGap.missing.filter(s => skillCategories.frontend.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.backend.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.database.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.devops.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.mobile.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.ai.some(c => c.toLowerCase().includes(s.toLowerCase()))).length,
          skillGap.missing.filter(s => skillCategories.other.some(c => c.toLowerCase().includes(s.toLowerCase()))).length
        ]
      }
    };
  }

  /**
   * Estimate learning time for skills
   */
  estimateLearningTime(skill) {
    const learningTimeMap = {
      'javascript': 6, 'typescript': 4, 'react': 4, 'vue': 4, 'angular': 6,
      'python': 6, 'java': 8, 'c#': 8, 'go': 6, 'rust': 12,
      'mongodb': 3, 'postgresql': 4, 'mysql': 3, 'redis': 2,
      'docker': 5, 'kubernetes': 8, 'aws': 6, 'ci/cd': 4,
      'machine learning': 12, 'tensorflow': 10, 'nlp': 10,
      'node.js': 4, 'express': 3, 'graphql': 4
    };

    return learningTimeMap[skill.toLowerCase()] || 4; // Default 4 weeks
  }

  /**
   * Get learning resources for skills
   */
  getLearningResources(skills) {
    const resources = {
      'javascript': ['Codecademy', 'freeCodeCamp', 'Udemy'],
      'react': ['React Docs', 'Scrimba', 'Udemy'],
      'python': ['Python.org', 'DataCamp', 'Codecademy'],
      'docker': ['Docker Docs', 'Udemy', 'A Cloud Guru'],
      'aws': ['AWS Free Tier', 'A Cloud Guru', 'LinuxAcademy'],
      'machine learning': ['Coursera', 'Kaggle', 'Fast.ai'],
      'default': ['Udemy', 'Coursera', 'Pluralsight']
    };

    return skills.map(skill => ({
      skill,
      resources: resources[skill.toLowerCase()] || resources.default,
      estimatedWeeks: this.estimateLearningTime(skill)
    }));
  }
}

module.exports = new SkillGapService();

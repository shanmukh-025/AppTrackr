/**
 * Skill Normalization Utility
 * Normalizes skill terms to ensure consistent API queries
 */

// Skill mapping for common abbreviations and variations
const skillMappings = {
  // JavaScript Ecosystem
  'js': 'javascript',
  'javascript': 'javascript',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'vue': 'vuejs',
  'vuejs': 'vuejs',
  'vue.js': 'vuejs',
  'angular': 'angular',
  'angularjs': 'angular',
  'next': 'nextjs',
  'nextjs': 'nextjs',
  'next.js': 'nextjs',
  'express': 'expressjs',
  'expressjs': 'expressjs',
  'express.js': 'expressjs',
  'ts': 'typescript',
  'typescript': 'typescript',

  // Python Ecosystem
  'python': 'python',
  'py': 'python',
  'django': 'django',
  'flask': 'flask',
  'fastapi': 'fastapi',
  'pandas': 'pandas',
  'numpy': 'numpy',

  // Java Ecosystem
  'java': 'java',
  'spring': 'spring boot',
  'springboot': 'spring boot',
  'spring boot': 'spring boot',

  // Databases
  'sql': 'sql',
  'mysql': 'mysql',
  'postgresql': 'postgresql',
  'postgres': 'postgresql',
  'mongodb': 'mongodb',
  'mongo': 'mongodb',
  'redis': 'redis',
  'firebase': 'firebase',

  // Cloud & DevOps
  'aws': 'aws',
  'amazon web services': 'aws',
  'azure': 'azure',
  'gcp': 'google cloud',
  'google cloud': 'google cloud',
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'ci/cd': 'cicd',
  'cicd': 'cicd',
  'jenkins': 'jenkins',
  'git': 'git',
  'github': 'github',

  // Mobile
  'react native': 'react native',
  'flutter': 'flutter',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'android': 'android',
  'ios': 'ios',

  // Other
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'data science': 'data science',
  'devops': 'devops',
  'fullstack': 'full stack',
  'full stack': 'full stack',
  'full-stack': 'full stack',
  'frontend': 'front end',
  'front end': 'front end',
  'front-end': 'front end',
  'backend': 'back end',
  'back end': 'back end',
  'back-end': 'back end',
};

/**
 * Normalize a single skill term
 * @param {string} skill - The skill to normalize
 * @returns {string} - Normalized skill
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  
  const normalized = skill.toLowerCase().trim();
  return skillMappings[normalized] || normalized;
}

/**
 * Normalize an array of skills
 * @param {Array<string>} skills - Array of skills to normalize
 * @returns {Array<string>} - Array of normalized unique skills
 */
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  
  const normalized = skills
    .map(skill => normalizeSkill(skill))
    .filter(skill => skill.length > 0);
  
  // Remove duplicates
  return [...new Set(normalized)];
}

/**
 * Extract skills from user profile
 * @param {Object} user - User object with profile data
 * @returns {Array<string>} - Array of normalized skills
 */
function extractSkillsFromProfile(user) {
  const skills = [];
  
  // Check if user object exists
  if (!user) {
    console.warn('⚠️  No user object provided to extractSkillsFromProfile');
    return [];
  }
  
  // Extract from skills field if exists
  if (user.skills) {
    if (Array.isArray(user.skills)) {
      // If already an array
      skills.push(...user.skills);
    } else if (typeof user.skills === 'string') {
      // If comma-separated string
      const skillArray = user.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      skills.push(...skillArray);
    }
  }
  
  // Extract from currentRole if no explicit skills
  if (skills.length === 0 && user.currentRole) {
    const role = user.currentRole.toLowerCase();
    Object.keys(skillMappings).forEach(key => {
      if (role.includes(key)) {
        skills.push(key);
      }
    });
  }
  
  // Extract from targetRole if still no skills
  if (skills.length === 0 && user.targetRole) {
    const role = user.targetRole.toLowerCase();
    Object.keys(skillMappings).forEach(key => {
      if (role.includes(key)) {
        skills.push(key);
      }
    });
  }
  
  // Extract from bio/description (basic keyword extraction)
  if (skills.length === 0 && (user.bio || user.description)) {
    const text = (user.bio || user.description).toLowerCase();
    Object.keys(skillMappings).forEach(key => {
      if (text.includes(key)) {
        skills.push(key);
      }
    });
  }
  
  // If still no skills found, return empty array (don't use defaults)
  if (skills.length === 0) {
    console.warn('⚠️  No skills found in user profile');
    return [];
  }
  
  return normalizeSkills(skills);
}

/**
 * Prioritize skills for API queries (most relevant first)
 * @param {Array<string>} skills - Array of skills
 * @returns {Array<string>} - Prioritized skills
 */
function prioritizeSkills(skills) {
  // Priority categories
  const highPriority = [
    'javascript', 'python', 'java', 'react', 'nodejs', 
    'typescript', 'aws', 'docker', 'kubernetes'
  ];
  
  const prioritized = [];
  const remaining = [];
  
  skills.forEach(skill => {
    if (highPriority.includes(skill)) {
      prioritized.push(skill);
    } else {
      remaining.push(skill);
    }
  });
  
  return [...prioritized, ...remaining];
}

/**
 * Generate search queries from skills
 * @param {Array<string>} skills - Array of normalized skills
 * @param {number} maxQueries - Maximum number of queries to generate
 * @returns {Array<string>} - Array of search queries
 */
function generateSearchQueries(skills, maxQueries = 5) {
  const prioritized = prioritizeSkills(skills);
  const queries = [];
  
  // Single skill queries (most specific)
  prioritized.slice(0, maxQueries).forEach(skill => {
    queries.push(skill);
  });
  
  // Combination queries for better matches
  if (prioritized.length >= 2 && queries.length < maxQueries) {
    queries.push(`${prioritized[0]} ${prioritized[1]}`);
  }
  
  return queries.slice(0, maxQueries);
}

module.exports = {
  normalizeSkill,
  normalizeSkills,
  extractSkillsFromProfile,
  prioritizeSkills,
  generateSearchQueries,
  skillMappings
};

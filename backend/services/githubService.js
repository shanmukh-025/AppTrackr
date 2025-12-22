const axios = require('axios');
const { Octokit } = require('@octokit/rest');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const smartAnalyzer = require('./smartAnalyzerService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GitHubService {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/github/callback';    
    if (!this.clientId || this.clientId === 'your_github_client_id_here') {
      console.warn('⚠️  WARNING: GITHUB_CLIENT_ID not configured in .env file');
      console.warn('📖 See GITHUB_SETUP_QUICK.md for setup instructions');
    }  }

  // Generate GitHub OAuth URL
  getAuthorizationUrl() {
    if (!this.clientId || this.clientId === 'your_github_client_id_here') {
      throw new Error('GitHub OAuth not configured. Please set GITHUB_CLIENT_ID in .env file. See GITHUB_SETUP_QUICK.md');
    }
    const scope = 'repo,user,read:org';
    return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scope}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri
        },
        {
          headers: { Accept: 'application/json' }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  // Get authenticated Octokit instance
  getOctokit(accessToken) {
    return new Octokit({ auth: accessToken });
  }

  // Get user's GitHub profile
  async getUserProfile(accessToken) {
    const octokit = this.getOctokit(accessToken);
    const { data } = await octokit.users.getAuthenticated();
    return data;
  }

  // Get all user repositories
  async getUserRepositories(accessToken, username) {
    const octokit = this.getOctokit(accessToken);
    
    try {
      const { data } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        languages_url: repo.languages_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        private: repo.private,
        created: repo.created_at,
        updated: repo.updated_at,
        defaultBranch: repo.default_branch,
        size: repo.size
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  // Get repository languages
  async getRepositoryLanguages(accessToken, owner, repo) {
    const octokit = this.getOctokit(accessToken);
    const { data } = await octokit.repos.listLanguages({ owner, repo });
    return data;
  }

  // Get repository contents
  async getRepositoryContents(accessToken, owner, repo, path = '') {
    const octokit = this.getOctokit(accessToken);
    
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path
      });

      return data;
    } catch (error) {
      console.error('Error fetching repository contents:', error);
      return null;
    }
  }

  // Get file content
  async getFileContent(accessToken, owner, repo, path) {
    const octokit = this.getOctokit(accessToken);
    
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path
      });

      if (data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error) {
      console.error('Error fetching file content:', error);
      return null;
    }
  }

  // Analyze repository structure
  async analyzeRepository(accessToken, owner, repo, userSkills = []) {
    try {
      const octokit = this.getOctokit(accessToken);

      // Get repository details
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      
      // Get languages
      const languages = await this.getRepositoryLanguages(accessToken, owner, repo);
      
      // Get README
      let readmeContent = '';
      try {
        readmeContent = await this.getFileContent(accessToken, owner, repo, 'README.md');
      } catch (e) {
        console.log('No README found');
      }

      // Get package.json or requirements.txt
      let dependencies = {};
      const packageJson = await this.getFileContent(accessToken, owner, repo, 'package.json');
      if (packageJson) {
        try {
          const parsed = JSON.parse(packageJson);
          dependencies = { ...parsed.dependencies, ...parsed.devDependencies };
        } catch (e) {
          console.log('Error parsing package.json');
        }
      }

      // Get repository structure
      const contents = await this.getRepositoryContents(accessToken, owner, repo);

      // Use Smart Analyzer (faster, no API quota issues, project-specific)
      const analysis = await smartAnalyzer.analyzeRepository(
        octokit,
        owner,
        repo,
        repoData,
        contents,
        dependencies
      );

      return analysis;
    } catch (error) {
      console.error('Error analyzing repository:', error);
      throw error;
    }
  }

  // AI-powered project analysis
  async analyzeProjectWithAI(repoData, languages, readme, dependencies, structure, userSkills) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert software architect and interviewer. Provide a DETAILED technical analysis of this project as valid JSON ONLY (no markdown, no explanation, just raw JSON):

Repository: ${repoData.name}
Description: ${repoData.description || 'No description'}
Languages: ${Object.keys(languages).join(', ')}
Main Dependencies: ${Object.keys(dependencies).slice(0, 15).join(', ')}
User Skills: ${userSkills.slice(0, 8).join(', ')}

Return ONLY this JSON structure (fill all fields with detailed insights):
{
  "overallScore": 85,
  "summary": "2-3 sentence executive summary of the project quality and potential",
  "codeQuality": {
    "score": 80,
    "issues": [
      "No TypeScript - reduces type safety and maintainability",
      "No ESLint/Prettier configuration found",
      "Magic numbers and hardcoded values scattered throughout",
      "Inconsistent naming conventions (camelCase vs snake_case)",
      "Long functions exceeding 50 lines - need refactoring"
    ],
    "strengths": [
      "Clean component structure with good separation of concerns",
      "Consistent use of async/await for promise handling",
      "Good error handling with try-catch blocks"
    ],
    "recommendations": [
      "Migrate to TypeScript for better type safety and IDE support",
      "Add ESLint with Airbnb style guide and Prettier for consistent formatting",
      "Extract magic numbers into constants file with clear naming",
      "Refactor long functions using Single Responsibility Principle",
      "Add JSDoc comments for complex functions"
    ]
  },
  "architecture": {
    "score": 85,
    "currentPatterns": ["MVC", "Component-based"],
    "issues": [
      "No clear separation between business logic and UI components",
      "Direct API calls in components instead of using service layer",
      "No state management solution (Redux/Zustand) for complex state"
    ],
    "suggestions": [
      "Implement service/repository pattern for API calls",
      "Add Redux Toolkit or Zustand for global state management",
      "Create custom hooks for reusable logic (useAuth, useApi, etc.)",
      "Implement dependency injection for better testability",
      "Add API client wrapper with interceptors for auth and error handling"
    ],
    "patterns": [
      "Repository Pattern: Centralize data access logic",
      "Factory Pattern: For creating complex objects",
      "Observer Pattern: For event-driven features",
      "Singleton Pattern: For global configuration/cache managers"
    ]
  },
  "bestPractices": {
    "score": 75,
    "present": [
      "Environment variables for configuration",
      "Gitignore file properly configured",
      "Package.json with proper scripts"
    ],
    "missing": [
      "CI/CD pipeline (GitHub Actions)",
      "Docker containerization",
      "API versioning",
      "Input validation and sanitization",
      "Rate limiting on API endpoints",
      "Logging and monitoring setup",
      "Error tracking (Sentry/Rollbar)",
      "Code coverage reports",
      "Husky pre-commit hooks"
    ],
    "recommendations": [
      "Add GitHub Actions for automated testing and deployment",
      "Create Dockerfile and docker-compose.yml for easy development setup",
      "Implement API versioning (v1, v2) for backward compatibility",
      "Add joi/yup for robust input validation",
      "Implement rate limiting with express-rate-limit",
      "Add winston/pino for structured logging",
      "Set up Sentry for error tracking in production",
      "Configure Jest with 80%+ code coverage requirement",
      "Add Husky + lint-staged for automated code quality checks"
    ]
  },
  "documentation": {
    "score": 70,
    "existing": ["Basic README"],
    "missing": [
      "API documentation (Swagger/OpenAPI)",
      "Architecture diagram",
      "Contributing guidelines",
      "Code of Conduct",
      "Inline code documentation",
      "Setup instructions for development",
      "Deployment guide",
      "Troubleshooting section"
    ],
    "improvements": [
      "Add comprehensive README with badges (build status, coverage, etc.)",
      "Create ARCHITECTURE.md explaining system design and data flow",
      "Add Swagger/OpenAPI spec for all API endpoints with examples",
      "Include CONTRIBUTING.md with PR process and coding standards",
      "Add inline JSDoc comments for all public functions and complex logic",
      "Create detailed SETUP.md for local development environment",
      "Document environment variables in .env.example with descriptions",
      "Add FAQ section addressing common issues"
    ]
  },
  "testing": {
    "score": 60,
    "coverage": "0%",
    "present": [],
    "missing": [
      "Unit tests for business logic",
      "Integration tests for API endpoints",
      "End-to-end tests for critical user flows",
      "Test coverage reporting",
      "Mocking utilities for external dependencies"
    ],
    "suggestions": [
      "Add Jest + React Testing Library for frontend tests",
      "Implement Supertest for API integration testing",
      "Add Cypress/Playwright for E2E testing critical flows",
      "Set up code coverage with Istanbul/NYC, aim for 80%+",
      "Create test utilities for common mocking scenarios",
      "Add snapshot testing for UI components",
      "Implement continuous testing in CI pipeline",
      "Add performance testing with k6 or Artillery"
    ],
    "testExamples": [
      "Unit test: User authentication logic",
      "Integration test: POST /api/users endpoint",
      "E2E test: Complete user registration flow",
      "Performance test: API response times under load"
    ]
  },
  "security": {
    "score": 80,
    "vulnerabilities": [
      "No CSRF protection implemented",
      "Missing security headers (helmet.js)",
      "No input sanitization against XSS",
      "Passwords may not be using bcrypt with sufficient rounds",
      "No rate limiting on authentication endpoints",
      "JWT tokens with no expiration or refresh mechanism",
      "Secrets possibly committed to repository"
    ],
    "fixes": [
      "Add CSRF tokens for state-changing requests",
      "Implement helmet.js for security headers (CSP, HSTS, etc.)",
      "Use DOMPurify/xss for sanitizing user inputs",
      "Ensure bcrypt with 12+ rounds for password hashing",
      "Add express-rate-limit on /login, /register (max 5 attempts/15min)",
      "Implement JWT refresh tokens with short-lived access tokens",
      "Scan repository with git-secrets, use proper secrets management",
      "Add dependency vulnerability scanning (npm audit, Snyk)",
      "Implement proper CORS configuration, not wildcard",
      "Add SQL injection protection with parameterized queries"
    ]
  },
  "performance": {
    "score": 85,
    "strengths": [
      "Async operations handled properly",
      "Basic caching implemented"
    ],
    "optimizations": [
      "Implement Redis for caching frequently accessed data",
      "Add database indexing on frequently queried columns",
      "Use pagination for large data sets (limit/offset or cursor-based)",
      "Implement lazy loading for images and heavy components",
      "Add response compression with gzip/brotli",
      "Use CDN for static assets",
      "Implement database connection pooling",
      "Add request debouncing on search inputs",
      "Optimize bundle size with code splitting and tree shaking",
      "Use React.memo/useMemo/useCallback to prevent unnecessary re-renders"
    ]
  },
  "improvements": [
    {
      "title": "Implement Comprehensive Unit Testing",
      "priority": "Critical",
      "category": "Testing",
      "impact": "High - Essential for production code and interviews",
      "description": "Add unit tests for all business logic, aiming for 80%+ code coverage. This demonstrates code quality awareness and makes the project maintainable.",
      "implementation": "1. Install Jest and React Testing Library\\n2. Create __tests__ directories alongside source files\\n3. Write tests for authentication logic, API utilities, data transformations\\n4. Add test scripts to package.json\\n5. Configure coverage thresholds\\n6. Set up GitHub Actions to run tests on every PR",
      "files": ["jest.config.js", "src/**/__tests__/*.test.js", ".github/workflows/test.yml"],
      "estimatedTime": "8-12 hours",
      "resources": [
        { "title": "Jest Documentation", "url": "https://jestjs.io/docs/getting-started" },
        { "title": "React Testing Library", "url": "https://testing-library.com/react" },
        { "title": "Testing Async Code", "url": "https://jestjs.io/docs/timer-mocks" },
        { "title": "Mock Functions", "url": "https://jestjs.io/docs/mock-functions" }
      ]
    },
    {
      "title": "Add CI/CD Pipeline with GitHub Actions",
      "priority": "High",
      "category": "DevOps",
      "impact": "High - Shows modern development practices",
      "description": "Automate testing, linting, and deployment using GitHub Actions. This is a must-have for production-ready projects and demonstrates DevOps knowledge.",
      "implementation": "1. Create .github/workflows directory\\n2. Add test.yml for running tests on push/PR\\n3. Add deploy.yml for automatic deployment to staging/production\\n4. Configure secrets in GitHub repository settings\\n5. Add status badges to README\\n6. Set up branch protection rules requiring passing tests",
      "files": [".github/workflows/test.yml", ".github/workflows/deploy.yml", ".github/dependabot.yml"],
      "estimatedTime": "4-6 hours",
      "resources": [
        { "title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions" },
        { "title": "GitHub Actions Workflows", "url": "https://docs.github.com/en/actions/workflows" },
        { "title": "CI/CD Best Practices", "url": "https://docs.github.com/en/actions/guides" },
        { "title": "Deploy to Production", "url": "https://docs.github.com/en/actions/deployment" }
      ]
    },
    {
      "title": "Migrate to TypeScript",
      "priority": "High",
      "category": "Code Quality",
      "impact": "Very High - Major credibility boost in interviews",
      "description": "Convert JavaScript codebase to TypeScript for type safety, better IDE support, and reduced runtime errors. TypeScript is highly valued by employers.",
      "implementation": "1. Install TypeScript and @types packages\\n2. Rename .js files to .tsx/.ts incrementally\\n3. Add tsconfig.json with strict mode enabled\\n4. Define interfaces for props, API responses, and state\\n5. Fix type errors gradually (start with any, then refine)\\n6. Add type checking to CI pipeline",
      "files": ["tsconfig.json", "src/**/*.tsx", "src/**/*.ts", "src/types/*.d.ts"],
      "estimatedTime": "16-24 hours",
      "resources": [
        { "title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/" },
        { "title": "React + TypeScript", "url": "https://react-typescript-cheatsheet.netlify.app/" },
        { "title": "TypeScript Configuration", "url": "https://www.typescriptlang.org/docs/handbook/tsconfig-json.html" },
        { "title": "Migrating to TypeScript", "url": "https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html" }
      ]
    },
    {
      "title": "Implement Redis Caching Layer",
      "priority": "Medium",
      "category": "Performance",
      "impact": "Medium - Shows scalability awareness",
      "description": "Add Redis for caching API responses and session data to dramatically improve performance. Great talking point for system design interviews.",
      "implementation": "1. Install redis and set up Docker container\\n2. Create cache service wrapper\\n3. Implement cache-aside pattern for API responses\\n4. Add cache invalidation strategies\\n5. Monitor cache hit rates\\n6. Document caching architecture",
      "files": ["docker-compose.yml", "src/services/cache.service.js", "src/middleware/cache.middleware.js"],
      "estimatedTime": "6-8 hours",
      "resources": [
        { "title": "Redis Official Documentation", "url": "https://redis.io/documentation" },
        { "title": "Redis Node.js Client", "url": "https://github.com/redis/node-redis" },
        { "title": "Cache Patterns", "url": "https://redis.io/docs/manual/client-side-caching/" },
        { "title": "Docker Redis", "url": "https://hub.docker.com/_/redis/" }
      ]
    },
    {
      "title": "Add Comprehensive API Documentation",
      "priority": "High",
      "category": "Documentation",
      "impact": "High - Critical for API-based projects",
      "description": "Create interactive API documentation using Swagger/OpenAPI. Makes the project immediately understandable and shows professional practices.",
      "implementation": "1. Install swagger-jsdoc and swagger-ui-express\\n2. Add JSDoc comments to all route handlers\\n3. Define schemas for request/response bodies\\n4. Configure Swagger UI at /api-docs endpoint\\n5. Add authentication documentation\\n6. Include example requests and responses",
      "files": ["swagger.config.js", "src/routes/*.js (with JSDoc)", "openapi.json"],
      "estimatedTime": "6-10 hours",
      "resources": [
        { "title": "OpenAPI Specification", "url": "https://spec.openapis.org/oas/v3.0.3" },
        { "title": "Swagger/OpenAPI UI", "url": "https://swagger.io/tools/swagger-ui/" },
        { "title": "Swagger JSDoc", "url": "https://github.com/Surnet/swagger-jsdoc" },
        { "title": "API Documentation Best Practices", "url": "https://swagger.io/blog/best-practices/" }
      ]
    },
    {
      "title": "Implement Advanced Error Handling",
      "priority": "Medium",
      "category": "Architecture",
      "impact": "Medium - Shows maturity in production code",
      "description": "Create centralized error handling with custom error classes, proper status codes, and error logging. Essential for production applications.",
      "implementation": "1. Create custom error classes (ValidationError, AuthError, etc.)\\n2. Add global error handler middleware\\n3. Implement structured logging with winston\\n4. Add error tracking with Sentry\\n5. Return consistent error responses\\n6. Add error boundaries in React",
      "files": ["src/utils/errors.js", "src/middleware/errorHandler.js", "src/config/logger.js"],
      "estimatedTime": "4-6 hours",
      "resources": [
        { "title": "Error Handling Best Practices", "url": "https://nodejs.org/en/docs/guides/nodejs-error-handling/" },
        { "title": "Sentry Documentation", "url": "https://docs.sentry.io/" },
        { "title": "Winston Logger", "url": "https://github.com/winstonjs/winston" },
        { "title": "Custom Error Classes", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" }
      ]
    }
  ],
  "skillAlignment": {
    "matchedSkills": ${JSON.stringify(userSkills.slice(0, 5))} || ["JavaScript", "Node.js", "React"],
    "skillsUsedInProject": ["List ALL skills demonstrated in this project"],
    "skillGaps": ["Skills commonly expected but not demonstrated here"],
    "suggestedSkills": [
      "TypeScript - 90% of companies prefer it",
      "Docker - Essential for modern deployment",
      "Testing (Jest/Cypress) - Required for senior positions",
      "CI/CD - Shows DevOps awareness",
      "AWS/Azure - Cloud experience is valuable"
    ],
    "learningPath": [
      "Week 1-2: Add comprehensive testing suite",
      "Week 3-4: Migrate to TypeScript",
      "Week 5: Set up CI/CD pipeline",
      "Week 6: Implement caching and performance optimizations",
      "Week 7-8: Add monitoring and observability"
    ]
  },
  "interviewReadiness": {
    "score": 75,
    "currentLevel": "Junior to Mid-level",
    "targetLevel": "Senior level after improvements",
    "strengths": [
      "Full-stack implementation shows breadth of knowledge",
      "Clean component structure demonstrates good practices",
      "Working authentication system shows security awareness",
      "API integration demonstrates real-world skills"
    ],
    "weaknesses": [
      "No testing - immediate red flag for most companies",
      "Missing CI/CD shows lack of DevOps awareness",
      "No TypeScript limits appeal to modern teams",
      "Insufficient documentation makes onboarding difficult",
      "No performance optimizations implemented"
    ],
    "interviewQuestions": [
      "Why did you choose this architecture?",
      "How would you scale this to 10M users?",
      "Walk me through your testing strategy",
      "How do you handle security in this application?",
      "What performance optimizations have you implemented?"
    ],
    "additions": [
      "Add 5-10 unit tests as proof of testing skills",
      "Implement one design pattern (Repository, Factory, etc.)",
      "Add performance monitoring (response times, error rates)",
      "Create architecture diagram showing system components",
      "Add at least one complex feature (real-time updates, file uploads, etc.)",
      "Document one technical decision in detail (ADR format)",
      "Add metrics dashboard showing project statistics"
    ],
    "demoTips": [
      "Prepare to explain architectural decisions",
      "Demo the live application with real data",
      "Walk through a code review of your best code",
      "Explain how you'd handle specific scenarios",
      "Discuss trade-offs you made and alternatives considered"
    ]
  },
  "nextSteps": {
    "immediate": [
      "Add README badges and improve documentation",
      "Implement basic unit tests for critical paths",
      "Fix any security vulnerabilities (run npm audit)"
    ],
    "shortTerm": [
      "Set up CI/CD pipeline",
      "Add API documentation",
      "Implement caching for performance"
    ],
    "longTerm": [
      "Migrate to TypeScript",
      "Achieve 80%+ test coverage",
      "Deploy to production with monitoring"
    ]
  }
}

IMPORTANT: 
1. Be EXTREMELY specific and detailed in every section
2. Provide actual code examples and file names where applicable
3. Include realistic time estimates for each improvement
4. Prioritize improvements that demonstrate production-readiness
5. Focus on what will make this project impressive to hiring managers and interviewers
6. Give actionable, step-by-step implementation guides
7. Include resources and documentation links
8. Consider the specific technologies in this project
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { error: 'Failed to parse AI response' };
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return {
        overallScore: 75,
        summary: "Project has solid foundation with areas for improvement",
        codeQuality: { score: 75, issues: ["Add TypeScript", "Implement linting", "Refactor long functions"], strengths: ["Clean structure", "Good async handling"], recommendations: ["Migrate to TypeScript", "Add ESLint", "Extract utilities"] },
        architecture: { score: 80, issues: ["Separate business logic"], suggestions: ["Use repository pattern", "Add service layer"], patterns: ["MVC", "Component-based"] },
        bestPractices: { score: 75, missing: ["CI/CD pipeline", "Docker"], recommendations: ["Add GitHub Actions", "Containerize app"] },
        documentation: { score: 70, improvements: ["Add API docs", "Create architecture diagram", "Write README"] },
        testing: { score: 50, suggestions: ["Add Jest tests", "Implement E2E tests", "Set up coverage"] },
        security: { score: 75, vulnerabilities: ["Add CSRF protection", "Implement rate limiting"], fixes: ["Use helmet.js", "Add input validation"] },
        performance: { score: 80, optimizations: ["Add caching", "Implement pagination", "Optimize bundle size"] },
        improvements: [
          { title: "Add Unit Testing", priority: "Critical", category: "Testing", description: "Add Jest tests for critical paths", implementation: "Install Jest, write tests for auth and utilities", estimatedTime: "20 hours", impact: "Essential for credibility", resources: [{ title: "Jest Documentation", url: "https://jestjs.io/docs/getting-started" }, { title: "React Testing Library", url: "https://testing-library.com/react" }, { title: "Testing Async Code", url: "https://jestjs.io/docs/asynchronous" }, { title: "Mock Functions", url: "https://jestjs.io/docs/mock-functions" }] },
          { title: "CI/CD Pipeline", priority: "High", category: "DevOps", description: "Set up GitHub Actions", implementation: "Create .github/workflows with test and deploy configs", estimatedTime: "8 hours", impact: "Shows modern practices", resources: [{ title: "GitHub Actions", url: "https://docs.github.com/actions" }, { title: "GitHub Actions Workflows", url: "https://docs.github.com/actions/using-workflows" }, { title: "Example: Node.js CI Workflow", url: "https://github.com/actions/setup-node" }, { title: "Deployment Strategies", url: "https://docs.github.com/actions/deployment/deploying-to-your-cloud-provider" }] },
          { title: "TypeScript Migration", priority: "High", category: "Code Quality", description: "Convert to TypeScript", implementation: "Add tsconfig, migrate files gradually, define types", estimatedTime: "40 hours", impact: "Major interview boost", resources: [{ title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" }, { title: "TypeScript in React", url: "https://react-typescript-cheatsheet.netlify.app/" }, { title: "tsconfig Options", url: "https://www.typescriptlang.org/tsconfig" }, { title: "Migration Guide", url: "https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html" }] },
          { title: "API Documentation", priority: "Medium", category: "Documentation", description: "Create Swagger docs", implementation: "Use swagger-jsdoc for endpoint documentation", estimatedTime: "12 hours", impact: "Improves clarity", resources: [{ title: "Swagger/OpenAPI", url: "https://swagger.io/specification/" }, { title: "swagger-jsdoc NPM", url: "https://www.npmjs.com/package/swagger-jsdoc" }, { title: "Swagger UI Express", url: "https://www.npmjs.com/package/swagger-ui-express" }, { title: "OpenAPI Examples", url: "https://github.com/OAI/OpenAPI-Specification/tree/main/examples" }] }
        ],
        skillAlignment: { matchedSkills: userSkills.slice(0, 5), suggestedSkills: ["TypeScript", "Docker", "Testing frameworks", "CI/CD"], learningPath: ["Week 1-2: Testing", "Week 3-4: TypeScript", "Week 5-6: DevOps"] },
        interviewReadiness: { score: 75, strengths: ["Full-stack implementation", "Real-world features", "Good architecture"], additions: ["Add tests", "Improve docs", "Implement monitoring"], interviewQuestions: ["Why this architecture?", "How to scale?", "Testing strategy?"] }
      };
    }
  }

  // Generate project code with AI
  async generateProjectCode(projectSpec) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `
Generate a complete project structure and code for:

**Project Name:** ${projectSpec.name}
**Tech Stack:** ${projectSpec.techStack.join(', ')}
**Description:** ${projectSpec.description}
**Features:** ${projectSpec.features.join(', ')}
**Skill Level:** ${projectSpec.skillLevel}

Provide a complete project structure in JSON format:
{
  "projectName": "project-name",
  "description": "Brief description",
  "structure": [
    {
      "path": "src/index.js",
      "content": "// Full file content here",
      "description": "Main entry point"
    }
  ],
  "setupSteps": [
    "npm init -y",
    "npm install express",
    "..."
  ],
  "readme": "Complete README.md content",
  "gitignore": ".gitignore content",
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {},
  "scripts": {
    "start": "node src/index.js"
  },
  "features": ["Feature 1", "Feature 2"],
  "nextSteps": ["What to build next"]
}

Generate production-ready, well-commented code with best practices. Include error handling, validation, and tests.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { error: 'Failed to generate project' };
    } catch (error) {
      console.error('Error generating project:', error);
      throw error;
    }
  }

  // Create repository and push code
  async createAndPushRepository(accessToken, projectData, username) {
    try {
      const octokit = this.getOctokit(accessToken);

      // 1. Create repository
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: projectData.projectName,
        description: projectData.description,
        private: false,
        auto_init: true
      });

      console.log('Repository created:', repo.html_url);

      // 2. Create files
      for (const file of projectData.structure) {
        try {
          await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: projectData.projectName,
            path: file.path,
            message: `Add ${file.path}`,
            content: Buffer.from(file.content).toString('base64')
          });
          console.log(`Created file: ${file.path}`);
        } catch (error) {
          console.error(`Error creating file ${file.path}:`, error.message);
        }
      }

      // 3. Create README
      await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: projectData.projectName,
        path: 'README.md',
        message: 'Add README',
        content: Buffer.from(projectData.readme).toString('base64')
      });

      // 4. Create .gitignore
      if (projectData.gitignore) {
        await octokit.repos.createOrUpdateFileContents({
          owner: username,
          repo: projectData.projectName,
          path: '.gitignore',
          message: 'Add .gitignore',
          content: Buffer.from(projectData.gitignore).toString('base64')
        });
      }

      // 5. Create package.json (if Node.js project)
      if (projectData.dependencies || projectData.devDependencies) {
        const packageJson = {
          name: projectData.projectName,
          version: '1.0.0',
          description: projectData.description,
          main: 'src/index.js',
          scripts: projectData.scripts || {},
          dependencies: projectData.dependencies || {},
          devDependencies: projectData.devDependencies || {}
        };

        await octokit.repos.createOrUpdateFileContents({
          owner: username,
          repo: projectData.projectName,
          path: 'package.json',
          message: 'Add package.json',
          content: Buffer.from(JSON.stringify(packageJson, null, 2)).toString('base64')
        });
      }

      return {
        success: true,
        repoUrl: repo.html_url,
        repoName: repo.full_name
      };
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  }

  // Update file in repository
  async updateFile(accessToken, owner, repo, path, content, message) {
    try {
      const octokit = this.getOctokit(accessToken);

      // Get current file SHA
      let sha;
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        sha = data.sha;
      } catch (e) {
        // File doesn't exist, will create new
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  // Generate improvement code
  async generateImprovementCode(improvement, existingCode) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `
Generate code to implement this improvement:

**Improvement:** ${improvement.title}
**Description:** ${improvement.description}
**Category:** ${improvement.category}
**Files to modify:** ${improvement.files.join(', ')}

**Existing Code:**
\`\`\`
${existingCode}
\`\`\`

Provide the complete updated code and step-by-step implementation guide in JSON:
{
  "files": [
    {
      "path": "src/example.js",
      "content": "Complete updated file content",
      "changes": "Summary of changes made"
    }
  ],
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do",
      "code": "Code snippet if needed",
      "explanation": "Why this step"
    }
  ],
  "testCode": "Test code to verify the improvement",
  "commitMessage": "feat: add unit tests for user service"
}

Provide production-ready code with error handling, comments, and best practices.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { error: 'Failed to generate code' };
    } catch (error) {
      console.error('Error generating improvement code:', error);
      throw error;
    }
  }

  // Commit and push improvement
  async commitImprovement(accessToken, owner, repo, files, commitMessage) {
    try {
      const octokit = this.getOctokit(accessToken);

      // Update each file
      for (const file of files) {
        await this.updateFile(
          accessToken,
          owner,
          repo,
          file.path,
          file.content,
          commitMessage
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Error committing improvement:', error);
      throw error;
    }
  }
}

module.exports = new GitHubService();

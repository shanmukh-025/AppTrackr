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
    console.log('📝 Generating project with spec:', projectSpec);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `
Generate a complete project structure and code for:

**Project Name:** ${projectSpec.name}
**Tech Stack:** ${projectSpec.techStack.join(', ')}
**Description:** ${projectSpec.description}
**Features:** ${projectSpec.features ? projectSpec.features.join(', ') : 'None specified'}
**Skill Level:** ${projectSpec.skillLevel || 'intermediate'}

Provide a complete project structure in JSON format with realistic files and code.
{
  "projectName": "${projectSpec.name}",
  "description": "${projectSpec.description}",
  "structure": [
    {
      "path": "README.md",
      "content": "# ${projectSpec.name}\\n\\n${projectSpec.description}",
      "description": "Project documentation"
    },
    {
      "path": "package.json",
      "content": "{}",
      "description": "Dependencies file"
    }
  ],
  "setupSteps": [
    "npm install",
    "npm start"
  ],
  "readme": "# ${projectSpec.name}\\n\\n${projectSpec.description}\\n\\n## Getting Started\\n\\n1. Install dependencies: npm install\\n2. Run the project: npm start",
  "gitignore": "node_modules/\\n.env\\n.DS_Store\\ndist/\\nbuild/",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "start": "node index.js"
  },
  "features": ${JSON.stringify(projectSpec.features || [])},
  "nextSteps": ["Set up database", "Add authentication", "Deploy to production"]
}

Respond ONLY with valid JSON object. No markdown code blocks, just the JSON.
`;

      console.log('🚀 Calling Gemini API...');
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('✅ Gemini response received:', text.substring(0, 200));
      
      // Try to find JSON object in response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('✅ JSON parsed successfully');
        return JSON.parse(jsonMatch[0]);
      }

      console.log('⚠️ No valid JSON found in response, using fallback');
      return this.generateDefaultProject(projectSpec);
    } catch (error) {
      console.error('❌ Error generating project:', error.message);
      console.log('⚠️ Using fallback project generation');
      return this.generateDefaultProject(projectSpec);
    }
  }

  async generateProjectCode(projectSpec) {
    console.log('📝 Generating project with spec:', projectSpec);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert full-stack developer. Generate a COMPLETE, production-ready project structure and code.

**Project Details:**
- Name: ${projectSpec.name}
- Tech Stack: ${projectSpec.techStack.join(', ')}
- Description: ${projectSpec.description}
- Features: ${projectSpec.features ? projectSpec.features.filter(f => f.trim()).join(', ') : 'Basic functionality'}
- Skill Level: ${projectSpec.skillLevel || 'intermediate'}

Generate a COMPLETE project with real, working code in JSON format:

{
  "projectName": "${projectSpec.name}",
  "description": "${projectSpec.description}",
  "structure": [
    {
      "path": "package.json",
      "content": "complete package.json with all dependencies"
    },
    {
      "path": "server.js",
      "content": "complete express server setup code"
    },
    {
      "path": ".env.example",
      "content": "environment variables template"
    },
    {
      "path": "routes/tasks.js",
      "content": "complete CRUD routes"
    },
    {
      "path": "models/Task.js",
      "content": "complete data model with validation"
    }
  ],
  "setupSteps": ["npm install", "npm start"],
  "readme": "complete README with usage examples",
  "gitignore": "node_modules/\\n.env\\n.DS_Store\\n...",
  "dependencies": {"express": "^4.18.0", ...},
  "devDependencies": {...},
  "scripts": {"start": "node server.js", "dev": "nodemon server.js"},
  "features": ${JSON.stringify(projectSpec.features || [])},
  "nextSteps": ["Add database", "Add authentication", "Add tests"]
}

REQUIREMENTS:
1. Generate ACTUAL, working code - not placeholders
2. Include all files needed (server, routes, models, middleware)
3. Use ${projectSpec.techStack.includes('Express') ? 'Express.js for API' : 'appropriate framework'}
4. Include proper error handling and validation
5. Add detailed comments in code
6. Make it ready to run with "npm install && npm start"
7. Respond ONLY with valid JSON - no markdown, no explanations

Example structure for ${projectSpec.name}:
- server.js: Main Express app with routes
- routes/: API endpoints for CRUD operations
- models/: Data schemas and validation
- middleware/: Error handling, logging, validation
- public/ or views/: Frontend files if applicable
- .env.example: Configuration template
- package.json: All dependencies and scripts
- README.md: Complete documentation
`;

      console.log('🚀 Calling Gemini API...');
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('✅ Gemini response received:', text.substring(0, 300));
      
      // Try to find JSON object in response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('✅ JSON parsed successfully');
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.structure && Array.isArray(parsed.structure) && parsed.structure.length > 2) {
          console.log(`✅ Generated ${parsed.structure.length} files`);
          return parsed;
        }
      }

      console.log('⚠️ Gemini response incomplete, using enhanced fallback');
      return this.generateComprehensiveProject(projectSpec);
    } catch (error) {
      console.error('❌ Error generating project:', error.message);
      console.log('⚠️ Using enhanced fallback project generation');
      return this.generateComprehensiveProject(projectSpec);
    }
  }

  // Comprehensive fallback project generation
  generateComprehensiveProject(projectSpec) {
    console.log('📦 Generating comprehensive project structure');
    const projectName = projectSpec.name || 'my-project';
    const techStack = projectSpec.techStack || ['JavaScript'];
    const features = projectSpec.features?.filter(f => f.trim()) || [];
    
    const isNodeProject = techStack.some(tech => 
      ['Node.js', 'Express', 'React', 'Next.js', 'TypeScript'].includes(tech)
    );

    const structure = [];

    // 1. package.json
    structure.push({
      path: 'package.json',
      content: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: projectSpec.description,
        main: 'server.js',
        scripts: {
          start: 'node server.js',
          dev: 'nodemon server.js',
          test: 'jest --coverage'
        },
        keywords: features.slice(0, 3),
        author: 'Your Name',
        license: 'MIT',
        dependencies: isNodeProject ? {
          'express': '^4.18.2',
          'cors': '^2.8.5',
          'dotenv': '^16.0.3',
          'uuid': '^9.0.0'
        } : {},
        devDependencies: {
          'nodemon': '^2.0.22',
          'jest': '^29.5.0'
        }
      }, null, 2),
      description: 'Project configuration and dependencies'
    });

    // 2. Main server file
    structure.push({
      path: 'server.js',
      content: `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.path}\`);
  next();
});

// In-memory data store (replace with database in production)
let data = [];

// API Routes

// GET all items
app.get('/api/items', (req, res) => {
  try {
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single item
app.get('/api/items/:id', (req, res) => {
  try {
    const item = data.find(d => d.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE new item
app.post('/api/items', (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const newItem = {
      id: uuidv4(),
      title,
      description: description || '',
      createdAt: new Date().toISOString(),
      completed: false
    };

    data.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE item
app.put('/api/items/:id', (req, res) => {
  try {
    const item = data.find(d => d.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const { title, description, completed } = req.body;
    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (completed !== undefined) item.completed = completed;
    item.updatedAt = new Date().toISOString();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  try {
    const index = data.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const deleted = data.splice(index, 1);
    res.json({ success: true, message: 'Item deleted', data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`✅ Server running on http://localhost:\${PORT}\`);
  console.log(\`📚 API Documentation: http://localhost:\${PORT}/api\`);
});`,
      description: 'Main Express server with API routes'
    });

    // 3. .env.example
    structure.push({
      path: '.env.example',
      content: `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/${projectName.toLowerCase()}
DB_HOST=localhost
DB_PORT=27017
DB_NAME=${projectName.toLowerCase()}

# API Configuration
API_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb

# Authentication (if needed)
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000`,
      description: 'Environment variables template'
    });

    // 4. Models file
    structure.push({
      path: 'models/Item.js',
      content: `/**
 * Item Model
 * Represents a data item with validation
 */

class Item {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.completed = data.completed || false;
    this.priority = data.priority || 'medium'; // low, medium, high
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (this.title && this.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    if (!['low', 'medium', 'high'].includes(this.priority)) {
      errors.push('Priority must be low, medium, or high');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateId() {
    return \`item_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Item;`,
      description: 'Item data model with validation'
    });

    // 5. Routes file
    structure.push({
      path: 'routes/items.js',
      content: `const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// In-memory store (replace with database)
let items = [];

/**
 * GET /api/items - Get all items
 * Query params: completed (boolean), priority (string), sort (created, priority)
 */
router.get('/', (req, res) => {
  try {
    let result = [...items];
    
    // Filter by completed status
    if (req.query.completed !== undefined) {
      result = result.filter(item => 
        item.completed === (req.query.completed === 'true')
      );
    }
    
    // Filter by priority
    if (req.query.priority) {
      result = result.filter(item => item.priority === req.query.priority);
    }
    
    // Sort
    if (req.query.sort === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/items/:id - Get single item
 */
router.get('/:id', (req, res) => {
  try {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/items - Create new item
 */
router.post('/', (req, res) => {
  try {
    const item = new Item(req.body);
    const validation = item.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        errors: validation.errors 
      });
    }
    
    items.push(item);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/items/:id - Update item
 */
router.put('/:id', (req, res) => {
  try {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    Object.assign(item, req.body);
    item.updatedAt = new Date().toISOString();
    
    const validation = item.validate();
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        errors: validation.errors 
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/items/:id - Delete item
 */
router.delete('/:id', (req, res) => {
  try {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const deleted = items.splice(index, 1);
    res.json({ success: true, message: 'Item deleted', data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/items/:id/toggle - Toggle completion status
 */
router.patch('/:id/toggle', (req, res) => {
  try {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    item.completed = !item.completed;
    item.updatedAt = new Date().toISOString();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;`,
      description: 'API routes with CRUD operations'
    });

    // 6. Comprehensive README
    structure.push({
      path: 'README.md',
      content: `# ${projectName}

${projectSpec.description}

## Features

${features.length > 0 ? features.map(f => `- ✅ ${f}`).join('\n') : `- ✅ Create, Read, Update, Delete operations
- ✅ Data validation
- ✅ Error handling
- ✅ RESTful API design
- ✅ CORS support
- ✅ Environment configuration`}

## Tech Stack

${techStack.map(t => `- **${t}**`).join('\n')}

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ${projectName.toLowerCase().replace(/\s+/g, '-')}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Start the server**
   \`\`\`bash
   npm start
   \`\`\`

5. **For development (with auto-reload)**
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation

### Base URL
\`http://localhost:5000\`

### Endpoints

#### Get All Items
\`\`\`
GET /api/items
\`\`\`

Query Parameters:
- \`completed\` (boolean) - Filter by completion status
- \`priority\` (string) - Filter by priority (low, medium, high)
- \`sort\` (string) - Sort by (created, priority)

Response:
\`\`\`json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "item_123456",
      "title": "Sample Item",
      "description": "Item description",
      "completed": false,
      "priority": "high",
      "tags": ["important"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### Get Single Item
\`\`\`
GET /api/items/:id
\`\`\`

#### Create Item
\`\`\`
POST /api/items

Body:
{
  "title": "New Item",
  "description": "Optional description",
  "priority": "medium",
  "tags": ["tag1"]
}
\`\`\`

#### Update Item
\`\`\`
PUT /api/items/:id

Body:
{
  "title": "Updated Title",
  "completed": true,
  "priority": "low"
}
\`\`\`

#### Delete Item
\`\`\`
DELETE /api/items/:id
\`\`\`

#### Toggle Completion
\`\`\`
PATCH /api/items/:id/toggle
\`\`\`

## Project Structure

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── models/
│   └── Item.js              # Data model with validation
├── routes/
│   └── items.js             # API routes and endpoints
├── middleware/
│   └── errorHandler.js      # Error handling middleware
└── tests/
    └── items.test.js        # Unit tests
\`\`\`

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Code Style
This project follows ESLint configuration. Run linter:
\`\`\`bash
npm run lint
\`\`\`

## Environment Variables

See \`.env.example\` for all available configuration options.

Key variables:
- \`PORT\` - Server port (default: 5000)
- \`NODE_ENV\` - Environment (development/production)
- \`DATABASE_URL\` - Database connection string
- \`API_TIMEOUT\` - API request timeout in milliseconds

## Deployment

### Using Docker
\`\`\`bash
docker build -t ${projectName.toLowerCase()} .
docker run -p 5000:5000 ${projectName.toLowerCase()}
\`\`\`

### Using Heroku
\`\`\`bash
heroku create ${projectName.toLowerCase()}
git push heroku main
\`\`\`

## Troubleshooting

### Port already in use
Change the PORT in .env or use:
\`\`\`bash
PORT=3001 npm start
\`\`\`

### Dependencies issue
Clear cache and reinstall:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API examples

## Next Steps

1. ✅ Set up database connection
2. ✅ Add user authentication
3. ✅ Implement unit tests
4. ✅ Add API documentation (Swagger)
5. ✅ Deploy to production

---

Made with ❤️ by Your Name`,
      description: 'Complete project documentation'
    });

    // 7. .gitignore
    structure.push({
      path: '.gitignore',
      content: `# Dependencies
node_modules/
npm-debug.log
yarn-error.log
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Testing
coverage/
.nyc_output/

# Build
dist/
build/
*.tgz

# OS
Thumbs.db
.DS_Store

# Logs
logs/
*.log
npm-debug.log*`,
      description: 'Git ignore rules'
    });

    return {
      projectName,
      description: projectSpec.description,
      structure,
      setupSteps: [
        'npm install',
        'cp .env.example .env',
        'npm run dev  # for development',
        'npm start    # for production'
      ],
      readme: structure.find(s => s.path === 'README.md').content,
      gitignore: structure.find(s => s.path === '.gitignore').content,
      dependencies: {
        'express': '^4.18.2',
        'cors': '^2.8.5',
        'dotenv': '^16.0.3',
        'uuid': '^9.0.0'
      },
      devDependencies: {
        'nodemon': '^2.0.22',
        'jest': '^29.5.0'
      },
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        test: 'jest --coverage'
      },
      features: features.length > 0 ? features : ['CRUD Operations', 'Data Validation', 'Error Handling'],
      nextSteps: [
        'Set up MongoDB or PostgreSQL database',
        'Add JWT authentication',
        'Implement API documentation (Swagger)',
        'Add comprehensive unit tests',
        'Deploy to production (Heroku/AWS)'
      ]
    };
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

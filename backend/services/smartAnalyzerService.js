class SmartAnalyzerService {
  constructor() {
    // All possible improvements with their resources
    this.improvementsDB = {
      unitTesting: {
        title: "Add Unit Testing",
        priority: "Critical",
        category: "Testing",
        impact: "High - Essential for production code",
        description: "Add comprehensive unit tests for business logic with 80%+ code coverage",
        implementation: "Install Jest/Mocha, write tests, set up coverage tracking, integrate with CI",
        estimatedTime: "20 hours",
        resources: [
          { title: "Jest Documentation", url: "https://jestjs.io/docs/getting-started" },
          { title: "React Testing Library", url: "https://testing-library.com/react" },
          { title: "Testing Async Code", url: "https://jestjs.io/docs/asynchronous" },
          { title: "Mock Functions", url: "https://jestjs.io/docs/mock-functions" }
        ]
      },
      cicdPipeline: {
        title: "Add CI/CD Pipeline",
        priority: "High",
        category: "DevOps",
        impact: "High - Shows modern practices",
        description: "Set up automated testing, building, and deployment with GitHub Actions",
        implementation: "Create .github/workflows, add test and deploy jobs, configure secrets",
        estimatedTime: "8 hours",
        resources: [
          { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" },
          { title: "GitHub Actions Workflows", url: "https://docs.github.com/en/actions/workflows" },
          { title: "CI/CD Best Practices", url: "https://docs.github.com/en/actions/guides" },
          { title: "Deploy to Production", url: "https://docs.github.com/en/actions/deployment" }
        ]
      },
      typescript: {
        title: "Migrate to TypeScript",
        priority: "High",
        category: "Code Quality",
        impact: "Very High - Major credibility boost",
        description: "Convert codebase to TypeScript for type safety and better IDE support",
        implementation: "Add tsconfig, migrate files gradually, define interfaces, enable strict mode",
        estimatedTime: "40 hours",
        resources: [
          { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" },
          { title: "TypeScript in React", url: "https://react-typescript-cheatsheet.netlify.app/" },
          { title: "tsconfig Options", url: "https://www.typescriptlang.org/tsconfig" },
          { title: "Migration Guide", url: "https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html" }
        ]
      },
      documentation: {
        title: "Add Comprehensive Documentation",
        priority: "High",
        category: "Documentation",
        impact: "High - Critical for usability",
        description: "Create API docs, architecture guides, setup instructions, and contributing guidelines",
        implementation: "Add README badges, create ARCHITECTURE.md, add JSDoc comments, use Swagger",
        estimatedTime: "16 hours",
        resources: [
          { title: "Documentation Best Practices", url: "https://docs.readthedocs.io/en/stable/intro/index.html" },
          { title: "Swagger/OpenAPI", url: "https://swagger.io/specification/" },
          { title: "JSDoc Reference", url: "https://jsdoc.app/" },
          { title: "Markdown Guide", url: "https://www.markdownguide.org/" }
        ]
      },
      docker: {
        title: "Add Docker Containerization",
        priority: "High",
        category: "DevOps",
        impact: "High - Improves deployment",
        description: "Create Dockerfile and docker-compose for easy local development and deployment",
        implementation: "Write Dockerfile, create docker-compose.yml, add build scripts",
        estimatedTime: "6 hours",
        resources: [
          { title: "Docker Documentation", url: "https://docs.docker.com/" },
          { title: "Dockerfile Best Practices", url: "https://docs.docker.com/develop/dev-best-practices/" },
          { title: "Docker Compose", url: "https://docs.docker.com/compose/" },
          { title: "Node.js in Docker", url: "https://nodejs.org/en/docs/guides/nodejs-docker-webapp/" }
        ]
      },
      linting: {
        title: "Add Code Linting & Formatting",
        priority: "Medium",
        category: "Code Quality",
        impact: "Medium - Improves consistency",
        description: "Set up ESLint and Prettier for consistent code style across the project",
        implementation: "Install ESLint/Prettier, create config files, add pre-commit hooks with Husky",
        estimatedTime: "4 hours",
        resources: [
          { title: "ESLint Documentation", url: "https://eslint.org/docs/" },
          { title: "Prettier Docs", url: "https://prettier.io/docs/" },
          { title: "Husky for Git Hooks", url: "https://typicode.github.io/husky/" },
          { title: "lint-staged", url: "https://github.com/okonet/lint-staged" }
        ]
      },
      apiDocs: {
        title: "Create API Documentation",
        priority: "Medium",
        category: "Documentation",
        impact: "Medium - Clarifies API usage",
        description: "Use Swagger/OpenAPI to generate interactive API documentation",
        implementation: "Add swagger-jsdoc, document endpoints with JSDoc, configure Swagger UI",
        estimatedTime: "12 hours",
        resources: [
          { title: "Swagger/OpenAPI Spec", url: "https://swagger.io/specification/" },
          { title: "swagger-jsdoc NPM", url: "https://www.npmjs.com/package/swagger-jsdoc" },
          { title: "Swagger UI Express", url: "https://www.npmjs.com/package/swagger-ui-express" },
          { title: "OpenAPI Examples", url: "https://github.com/OAI/OpenAPI-Specification/tree/main/examples" }
        ]
      },
      errorHandling: {
        title: "Implement Error Handling",
        priority: "Medium",
        category: "Architecture",
        impact: "Medium - Critical for production",
        description: "Create centralized error handling with custom error classes and logging",
        implementation: "Add error middleware, custom error classes, structured logging with Winston",
        estimatedTime: "6 hours",
        resources: [
          { title: "Error Handling Best Practices", url: "https://nodejs.org/en/docs/guides/nodejs-error-handling/" },
          { title: "Sentry Documentation", url: "https://docs.sentry.io/" },
          { title: "Winston Logger", url: "https://github.com/winstonjs/winston" },
          { title: "Custom Error Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" }
        ]
      },
      security: {
        title: "Enhance Security",
        priority: "Critical",
        category: "Security",
        impact: "Critical - Essential for production",
        description: "Add CSRF protection, security headers, input validation, and rate limiting",
        implementation: "Add helmet.js, implement CSRF tokens, use input validation, rate limiting",
        estimatedTime: "8 hours",
        resources: [
          { title: "OWASP Security Checklist", url: "https://owasp.org/www-project-web-security-testing-guide/" },
          { title: "Helmet.js Documentation", url: "https://helmetjs.github.io/" },
          { title: "Express Rate Limit", url: "https://www.npmjs.com/package/express-rate-limit" },
          { title: "Input Validation with Joi", url: "https://joi.dev/" }
        ]
      },
      database: {
        title: "Add Database Optimization",
        priority: "Medium",
        category: "Performance",
        impact: "Medium - Improves scalability",
        description: "Add database indexing, connection pooling, and query optimization",
        implementation: "Create indexes, implement connection pooling, optimize queries",
        estimatedTime: "8 hours",
        resources: [
          { title: "Database Indexing", url: "https://en.wikipedia.org/wiki/Database_index" },
          { title: "Query Optimization", url: "https://www.postgresql.org/docs/current/sql-explain.html" },
          { title: "Connection Pooling", url: "https://node-postgres.com/features/pooling" },
          { title: "Prisma Optimization", url: "https://www.prisma.io/docs/guides/performance-and-optimization" }
        ]
      },
      caching: {
        title: "Implement Caching Layer",
        priority: "Medium",
        category: "Performance",
        impact: "Medium - Improves performance",
        description: "Add Redis for caching frequently accessed data and session management",
        implementation: "Set up Redis, implement cache-aside pattern, add cache invalidation",
        estimatedTime: "6 hours",
        resources: [
          { title: "Redis Documentation", url: "https://redis.io/documentation" },
          { title: "Redis Node.js Client", url: "https://github.com/redis/node-redis" },
          { title: "Cache Patterns", url: "https://redis.io/docs/manual/client-side-caching/" },
          { title: "Docker Redis", url: "https://hub.docker.com/_/redis/" }
        ]
      }
    };
  }

  async analyzeRepository(octokit, owner, repo, repoData, contents, dependencies) {
    try {
      // Initialize detection results
      const detected = {
        hasTests: false,
        hasCICD: false,
        hasTypeScript: false,
        hasDocker: false,
        hasLinting: false,
        hasSecurity: false,
        hasAPIDocumentation: false,
        hasErrorHandling: false,
        hasDocumentation: false,
        languages: {}
      };

      // Detect features from contents
      if (contents && Array.isArray(contents)) {
        for (const item of contents) {
          if (!item.name) continue;

          // Test files
          if (item.name.includes('test') || item.name.includes('spec') || item.name === '__tests__') {
            detected.hasTests = true;
          }
          // CI/CD
          if (item.name === '.github') {
            detected.hasCICD = true;
          }
          // TypeScript
          if (item.name === 'tsconfig.json') {
            detected.hasTypeScript = true;
          }
          // Docker
          if (item.name === 'Dockerfile' || item.name === 'docker-compose.yml') {
            detected.hasDocker = true;
          }
          // Linting
          if (item.name === '.eslintrc.js' || item.name === '.eslintrc.json' || item.name === '.prettierrc') {
            detected.hasLinting = true;
          }
          // Security
          if (item.name === '.env.example' || item.name === '.env') {
            detected.hasSecurity = true;
          }
          // API Docs
          if (item.name === 'swagger.json' || item.name === 'openapi.json') {
            detected.hasAPIDocumentation = true;
          }
          // Error handling & docs
          if (item.name === 'README.md' || item.name === 'docs') {
            detected.hasDocumentation = true;
          }
        }
      }

      // Detect from dependencies
      if (dependencies) {
        detected.hasTests = detected.hasTests || !!dependencies.jest || !!dependencies.mocha;
        detected.hasTypeScript = detected.hasTypeScript || !!dependencies.typescript;
        detected.hasLinting = detected.hasLinting || !!dependencies.eslint || !!dependencies.prettier;
        detected.hasSecurity = detected.hasSecurity || !!dependencies['helmet'] || !!dependencies['express-rate-limit'];
        detected.hasAPIDocumentation = detected.hasAPIDocumentation || !!dependencies['swagger-jsdoc'] || !!dependencies['swagger-ui-express'];
        detected.hasErrorHandling = !!dependencies['winston'] || !!dependencies['pino'];
        detected.hasDocker = detected.hasDocker || !!dependencies['docker'];
      }

      // Generate improvements based on detection
      const improvements = this.generateImprovements(detected);

      // Calculate scores
      const scores = this.calculateScores(detected);

      return {
        overallScore: scores.overallScore,
        summary: `This ${repoData.language || 'JavaScript'} project shows ${
          scores.overallScore >= 70 ? 'good potential' : 'room for improvement'
        }. Key areas to focus: ${improvements.slice(0, 2).map(i => i.title).join(', ')}.`,
        codeQuality: {
          score: scores.codeQuality,
          issues: this.generateIssues(detected),
          strengths: this.generateStrengths(detected),
          recommendations: this.generateRecommendations(detected)
        },
        architecture: {
          score: scores.architecture,
          issues: detected.hasDocumentation ? [] : ['No clear architecture documentation'],
          suggestions: ['Document system design', 'Create architecture diagrams'],
          patterns: ['MVC', 'Layered architecture']
        },
        bestPractices: {
          score: scores.bestPractices,
          missing: Object.keys(detected)
            .filter(key => !detected[key] && key !== 'languages')
            .map(key => this.formatKey(key)),
          recommendations: improvements.map(i => i.title)
        },
        documentation: {
          score: detected.hasDocumentation ? 80 : 40,
          improvements: improvements.filter(i => i.category === 'Documentation')
        },
        testing: {
          score: detected.hasTests ? 70 : 30,
          suggestions: !detected.hasTests ? ['Add unit tests', 'Set up test coverage tracking'] : ['Improve test coverage', 'Add E2E tests']
        },
        security: {
          score: detected.hasSecurity ? 75 : 50,
          vulnerabilities: !detected.hasSecurity ? ['Missing security headers', 'No rate limiting'] : []
        },
        performance: {
          score: 65,
          optimizations: ['Add caching', 'Optimize database queries', 'Code splitting']
        },
        improvements: improvements,
        skillAlignment: {
          matchedSkills: Object.keys(repoData.language ? { [repoData.language]: true } : {}),
          suggestedSkills: this.suggestSkills(detected)
        },
        interviewReadiness: {
          score: scores.overallScore,
          currentLevel: scores.overallScore >= 75 ? 'Mid-level' : 'Junior',
          targetLevel: 'Senior',
          strengths: this.generateStrengths(detected),
          additions: improvements.map(i => i.title)
        }
      };
    } catch (error) {
      console.error('Error in smart analyzer:', error);
      throw error;
    }
  }

  generateImprovements(detected) {
    const needed = [];

    if (!detected.hasTests) needed.push(this.improvementsDB.unitTesting);
    if (!detected.hasCICD) needed.push(this.improvementsDB.cicdPipeline);
    if (!detected.hasTypeScript) needed.push(this.improvementsDB.typescript);
    if (!detected.hasDocumentation) needed.push(this.improvementsDB.documentation);
    if (!detected.hasDocker) needed.push(this.improvementsDB.docker);
    if (!detected.hasLinting) needed.push(this.improvementsDB.linting);
    if (!detected.hasAPIDocumentation) needed.push(this.improvementsDB.apiDocs);
    if (!detected.hasErrorHandling) needed.push(this.improvementsDB.errorHandling);
    if (!detected.hasSecurity) needed.push(this.improvementsDB.security);

    return needed.slice(0, 6); // Return top 6 improvements
  }

  calculateScores(detected) {
    let score = 50;
    score += detected.hasTests ? 15 : 0;
    score += detected.hasCICD ? 10 : 0;
    score += detected.hasTypeScript ? 10 : 0;
    score += detected.hasDocker ? 5 : 0;
    score += detected.hasDocumentation ? 8 : 0;
    score += detected.hasLinting ? 5 : 0;

    return {
      overallScore: Math.min(score, 100),
      codeQuality: detected.hasLinting && detected.hasTypeScript ? 80 : 60,
      architecture: detected.hasDocumentation ? 75 : 55,
      bestPractices: detected.hasCICD && detected.hasTests ? 80 : 50,
      testing: detected.hasTests ? 75 : 30
    };
  }

  generateIssues(detected) {
    const issues = [];
    if (!detected.hasTests) issues.push('No test framework detected');
    if (!detected.hasTypeScript) issues.push('Not using TypeScript');
    if (!detected.hasLinting) issues.push('No code linting configured');
    if (!detected.hasSecurity) issues.push('Limited security measures');
    return issues.slice(0, 4);
  }

  generateStrengths(detected) {
    const strengths = [];
    if (detected.hasDocumentation) strengths.push('Good documentation');
    if (detected.hasCICD) strengths.push('CI/CD pipeline in place');
    if (detected.hasTests) strengths.push('Testing infrastructure');
    if (detected.hasDocker) strengths.push('Docker support');
    return strengths;
  }

  generateRecommendations(detected) {
    const recommendations = [];
    if (!detected.hasTypeScript) recommendations.push('Migrate to TypeScript for type safety');
    if (!detected.hasLinting) recommendations.push('Add ESLint and Prettier');
    if (!detected.hasTests) recommendations.push('Implement comprehensive test suite');
    if (!detected.hasCICD) recommendations.push('Set up GitHub Actions');
    return recommendations.slice(0, 4);
  }

  suggestSkills(detected) {
    const skills = [];
    if (!detected.hasTypeScript) skills.push('TypeScript');
    if (!detected.hasCICD) skills.push('CI/CD');
    if (!detected.hasDocker) skills.push('Docker');
    if (!detected.hasTests) skills.push('Testing (Jest/Mocha)');
    skills.push('DevOps', 'Cloud Deployment');
    return skills.slice(0, 5);
  }

  formatKey(key) {
    return key
      .replace(/has/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }
}

module.exports = new SmartAnalyzerService();

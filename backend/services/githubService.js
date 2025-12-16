const axios = require('axios');
const { Octokit } = require('@octokit/rest');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

      // Analyze with AI
      const analysis = await this.analyzeProjectWithAI(
        repoData,
        languages,
        readmeContent,
        dependencies,
        contents,
        userSkills
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

      const prompt = `
Analyze this GitHub project and provide detailed improvement suggestions:

**Repository:** ${repoData.name}
**Description:** ${repoData.description || 'No description'}
**Languages:** ${JSON.stringify(languages)}
**Dependencies:** ${JSON.stringify(dependencies)}
**README Preview:** ${readme ? readme.substring(0, 1000) : 'No README'}
**User Skills:** ${userSkills.join(', ')}

Provide a comprehensive analysis in JSON format:
{
  "overallScore": 85,
  "codeQuality": {
    "score": 80,
    "issues": ["List of code quality issues"],
    "strengths": ["What's done well"]
  },
  "architecture": {
    "score": 85,
    "suggestions": ["Architecture improvements"],
    "patterns": ["Design patterns to consider"]
  },
  "bestPractices": {
    "score": 75,
    "missing": ["Missing best practices"],
    "recommendations": ["What to add"]
  },
  "documentation": {
    "score": 70,
    "improvements": ["Documentation improvements"]
  },
  "testing": {
    "score": 60,
    "suggestions": ["Testing improvements"]
  },
  "security": {
    "score": 80,
    "vulnerabilities": ["Potential security issues"],
    "fixes": ["Security improvements"]
  },
  "performance": {
    "score": 85,
    "optimizations": ["Performance optimizations"]
  },
  "improvements": [
    {
      "title": "Add unit tests",
      "priority": "High",
      "category": "Testing",
      "description": "Detailed description",
      "implementation": "Step-by-step guide",
      "files": ["files to create/modify"],
      "estimatedTime": "2 hours"
    }
  ],
  "skillAlignment": {
    "matchedSkills": ["Skills from user's profile used"],
    "suggestedSkills": ["Skills they could add"],
    "learningPath": ["Skills to learn next"]
  },
  "interviewReadiness": {
    "score": 75,
    "strengths": ["What makes this project good for interviews"],
    "additions": ["What to add before interviews"]
  }
}

Be specific and actionable. Focus on improvements that will impress interviewers.
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
        overallScore: 70,
        error: 'AI analysis failed',
        improvements: []
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

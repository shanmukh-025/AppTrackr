const { GoogleGenerativeAI } = require('@google/generative-ai');

class ProjectGenerationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateProjectFiles(projectName, description, techStack) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Generate a complete project scaffold for the following:
Project Name: ${projectName}
Description: ${description}
Tech Stack: ${techStack.join(', ')}

Provide ONLY valid JSON with this structure (no markdown, no extra text):
{
  "packageJson": {...},
  "readme": "...",
  "gitignore": "...",
  "files": {
    "fileName": "fileContent"
  },
  "setupSteps": ["step1", "step2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse project generation response');
      }

      const projectData = JSON.parse(jsonMatch[0]);
      return projectData;
    } catch (error) {
      console.error('Error generating project:', error);
      throw error;
    }
  }

  generateDefaultProject(projectName, description, techStack) {
    // Fallback: Generate basic project structure
    const isNode = techStack.some(t => t.includes('Node') || t.includes('Express'));
    const isPython = techStack.some(t => t.includes('Python') || t.includes('Django'));

    if (isNode) {
      return {
        packageJson: {
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description,
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
          },
          keywords: techStack,
          author: '',
          license: 'MIT',
          dependencies: {
            express: '^4.18.0'
          },
          devDependencies: {
            nodemon: '^2.0.0'
          }
        },
        readme: `# ${projectName}\n\n${description}\n\n## Tech Stack\n${techStack.map(t => `- ${t}`).join('\n')}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm start\n\`\`\``,
        gitignore: `node_modules/\n.env\n.DS_Store\ndist/\nbuild/\n*.log`,
        files: {
          'index.js': `const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.json({ message: '${projectName} API' });\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
          '.env.example': `PORT=3000\nNODE_ENV=development`
        },
        setupSteps: [
          'npm install',
          'Create .env file from .env.example',
          'npm start'
        ]
      };
    }

    // Default fallback
    return {
      packageJson: {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description
      },
      readme: `# ${projectName}\n\n${description}`,
      gitignore: `.DS_Store\n.env\nnode_modules/`,
      files: {
        'README.md': `# ${projectName}\n\n${description}`
      },
      setupSteps: ['git init', 'git add .', 'git commit -m "Initial commit"']
    };
  }
}

module.exports = new ProjectGenerationService();

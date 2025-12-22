const express = require('express');
const router = express.Router();
const projectGenerationService = require('../services/projectGenerationService');
const githubService = require('../services/githubService');
const fs = require('fs').promises;
const path = require('path');

// Generate and create new project
router.post('/api/projects/generate', async (req, res) => {
  const { projectName, description, techStack, token } = req.body;

  if (!projectName || !description || !techStack || !token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`🚀 Generating project: ${projectName}`);

    // Generate project files
    let projectData = await projectGenerationService.generateProjectFiles(
      projectName,
      description,
      techStack
    ).catch(() => {
      console.log('Falling back to default project generation...');
      return projectGenerationService.generateDefaultProject(projectName, description, techStack);
    });

    // Create GitHub repository
    const octokit = new (require('@octokit/rest').Octokit)({ auth: token });
    const user = await octokit.users.getAuthenticated();
    const username = user.data.login;

    const repoName = projectName.toLowerCase().replace(/\s+/g, '-');

    console.log(`📦 Creating GitHub repository: ${repoName}`);
    
    const repoResponse = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description,
      private: false,
      auto_init: true
    });

    const repoUrl = repoResponse.data.clone_url;

    // Prepare files for commit
    const files = {
      'package.json': JSON.stringify(projectData.packageJson || {}, null, 2),
      'README.md': projectData.readme || `# ${projectName}\n\n${description}`,
      '.gitignore': projectData.gitignore || 'node_modules/\n.DS_Store',
      ...projectData.files
    };

    // Create commits for each file
    console.log('📝 Committing files to repository...');

    // Get main branch ref
    const refsResponse = await octokit.git.getRef({
      owner: username,
      repo: repoName,
      ref: 'heads/main'
    }).catch(() => 
      octokit.git.getRef({
        owner: username,
        repo: repoName,
        ref: 'heads/master'
      })
    );

    const parentCommitSha = refsResponse.data.object.sha;

    // Get base tree
    const commitResponse = await octokit.git.getCommit({
      owner: username,
      repo: repoName,
      commit_sha: parentCommitSha
    });

    let treeItems = [];
    for (const [fileName, content] of Object.entries(files)) {
      const blobResponse = await octokit.git.createBlob({
        owner: username,
        repo: repoName,
        content: content,
        encoding: 'utf-8'
      });

      treeItems.push({
        path: fileName,
        mode: '100644',
        type: 'blob',
        sha: blobResponse.data.sha
      });
    }

    // Create tree
    const treeResponse = await octokit.git.createTree({
      owner: username,
      repo: repoName,
      tree: treeItems,
      base_tree: commitResponse.data.tree.sha
    });

    // Create commit
    const newCommitResponse = await octokit.git.createCommit({
      owner: username,
      repo: repoName,
      message: `🎉 Initial project setup: ${projectName}`,
      tree: treeResponse.data.sha,
      parents: [parentCommitSha]
    });

    // Update reference
    const mainBranch = refsResponse.data.ref.split('/').pop();
    await octokit.git.updateRef({
      owner: username,
      repo: repoName,
      ref: `heads/${mainBranch}`,
      sha: newCommitResponse.data.sha
    });

    console.log('✅ Project created successfully!');

    res.json({
      success: true,
      project: {
        name: projectName,
        repoName,
        repoUrl,
        owner: username,
        files: Object.keys(files),
        setupSteps: projectData.setupSteps || []
      }
    });
  } catch (error) {
    console.error('Error generating project:', error.message);
    res.status(500).json({
      error: 'Failed to generate project',
      details: error.message
    });
  }
});

module.exports = router;

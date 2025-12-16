const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const githubService = require('../services/githubService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get GitHub OAuth URL
router.get('/auth-url', authMiddleware, (req, res) => {
  try {
    const authUrl = githubService.getAuthorizationUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// Handle GitHub OAuth callback
router.post('/callback', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    // Exchange code for access token
    const accessToken = await githubService.getAccessToken(code);

    // Get user profile
    const profile = await githubService.getUserProfile(accessToken);

    // Save GitHub connection to database
    await prisma.user.update({
      where: { id: userId },
      data: {
        githubToken: accessToken,
        githubUsername: profile.login,
        githubProfileUrl: profile.html_url
      }
    });

    res.json({
      success: true,
      username: profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url
    });
  } catch (error) {
    console.error('GitHub callback error:', error);
    res.status(500).json({ error: 'Failed to connect GitHub account' });
  }
});

// Check GitHub connection status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        githubToken: true,
        githubUsername: true,
        githubProfileUrl: true
      }
    });

    res.json({
      connected: !!user.githubToken,
      username: user.githubUsername,
      profileUrl: user.githubProfileUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check GitHub status' });
  }
});

// Disconnect GitHub
router.post('/disconnect', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    await prisma.user.update({
      where: { id: userId },
      data: {
        githubToken: null,
        githubUsername: null,
        githubProfileUrl: null
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect GitHub' });
  }
});

// Get user repositories
router.get('/repositories', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true, githubUsername: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const repos = await githubService.getUserRepositories(
      user.githubToken,
      user.githubUsername
    );

    res.json({ repositories: repos });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Analyze repository
router.post('/analyze-repository', authMiddleware, async (req, res) => {
  try {
    const { owner, repo } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true, skills: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const userSkills = user.skills || [];
    const analysis = await githubService.analyzeRepository(
      user.githubToken,
      owner,
      repo,
      userSkills
    );

    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing repository:', error);
    res.status(500).json({ error: 'Failed to analyze repository' });
  }
});

// Generate improvement code
router.post('/generate-improvement', authMiddleware, async (req, res) => {
  try {
    const { owner, repo, improvement, filePath } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    // Get existing code
    const existingCode = await githubService.getFileContent(
      user.githubToken,
      owner,
      repo,
      filePath
    );

    // Generate improvement code
    const improvementCode = await githubService.generateImprovementCode(
      improvement,
      existingCode || ''
    );

    res.json({ improvementCode });
  } catch (error) {
    console.error('Error generating improvement:', error);
    res.status(500).json({ error: 'Failed to generate improvement code' });
  }
});

// Commit improvement
router.post('/commit-improvement', authMiddleware, async (req, res) => {
  try {
    const { owner, repo, files, commitMessage } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    await githubService.commitImprovement(
      user.githubToken,
      owner,
      repo,
      files,
      commitMessage
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error committing improvement:', error);
    res.status(500).json({ error: 'Failed to commit improvement' });
  }
});

// Generate new project
router.post('/generate-project', authMiddleware, async (req, res) => {
  try {
    const projectSpec = req.body;

    const projectData = await githubService.generateProjectCode(projectSpec);

    res.json({ project: projectData });
  } catch (error) {
    console.error('Error generating project:', error);
    res.status(500).json({ error: 'Failed to generate project' });
  }
});

// Create and push repository
router.post('/create-repository', authMiddleware, async (req, res) => {
  try {
    const { projectData } = req.body;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true, githubUsername: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const result = await githubService.createAndPushRepository(
      user.githubToken,
      projectData,
      user.githubUsername
    );

    res.json(result);
  } catch (error) {
    console.error('Error creating repository:', error);
    res.status(500).json({ error: 'Failed to create repository' });
  }
});

// Get repository languages
router.get('/repository/:owner/:repo/languages', authMiddleware, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const languages = await githubService.getRepositoryLanguages(
      user.githubToken,
      owner,
      repo
    );

    res.json({ languages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

// Get file content
router.get('/repository/:owner/:repo/file', authMiddleware, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path } = req.query;
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true }
    });

    if (!user.githubToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const content = await githubService.getFileContent(
      user.githubToken,
      owner,
      repo,
      path
    );

    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file content' });
  }
});

module.exports = router;

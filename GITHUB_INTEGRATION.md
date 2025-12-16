# GitHub Integration Setup Guide

## 🎯 Features
- Connect your GitHub account
- Analyze existing repositories with AI
- Get improvement suggestions based on your skills
- Generate step-by-step implementation guides
- Auto-commit improvements to GitHub
- Create new projects with AI and push to GitHub

## 📋 Prerequisites
- GitHub account
- Node.js installed
- PostgreSQL database running

## 🔐 GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `AppTracker Project Builder`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/github-callback.html`
4. Click "Register application"
5. Copy your **Client ID**
6. Generate a new **Client Secret** and copy it

### Step 2: Configure Environment Variables

Update your `backend/.env` file:

```env
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:3000/github-callback.html
```

### Step 3: Run Database Migration

```bash
cd backend
npx prisma migrate dev --name add_github_integration
```

This adds the following fields to the User model:
- `githubToken` - Stores OAuth access token
- `githubUsername` - Stores GitHub username
- `githubProfileUrl` - Stores GitHub profile URL

### Step 4: Install Dependencies

```bash
cd backend
npm install @octokit/rest
```

### Step 5: Start the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

## 🚀 Usage Guide

### 1. Connect GitHub Account

1. Navigate to **Project Builder** in the app
2. Click "Connect GitHub"
3. Authorize the app in the popup
4. You'll be redirected back automatically

### 2. Analyze Existing Repository

1. Your repositories will be listed automatically
2. Click "Analyze & Improve" on any repository
3. AI will analyze:
   - Code quality
   - Architecture
   - Best practices
   - Documentation
   - Testing coverage
   - Security vulnerabilities
   - Performance optimizations
   - Interview readiness

4. Review the improvement suggestions
5. Click "Generate Code & Implement" on any suggestion
6. Follow the step-by-step guide
7. Click "Commit to GitHub" to push changes

### 3. Create New Project

1. Click "Create New" tab
2. Fill in project details:
   - **Name**: e.g., `task-manager-app`
   - **Description**: What your project does
   - **Tech Stack**: Select all technologies
   - **Features**: List main features
   - **Skill Level**: Choose complexity level

3. Click "Generate Project"
4. Review generated code and structure
5. Click "Push to GitHub"
6. Repository will be created and code pushed automatically

## 📊 What Gets Analyzed

### Code Quality
- Code smells and anti-patterns
- Naming conventions
- Code duplication
- Complexity metrics

### Architecture
- Project structure
- Design patterns
- Separation of concerns
- Scalability considerations

### Best Practices
- Error handling
- Input validation
- Security measures
- Performance optimizations

### Documentation
- README completeness
- Code comments
- API documentation
- Setup instructions

### Testing
- Test coverage
- Test quality
- Missing test cases
- Integration tests

### Security
- Vulnerable dependencies
- Authentication/Authorization
- Data validation
- Secure configurations

### Interview Readiness
- Project complexity
- Tech stack diversity
- Real-world applicability
- Demonstration value

## 🎓 AI-Generated Improvements

For each improvement, AI generates:

1. **Detailed Description**: What needs to be improved and why
2. **Priority Level**: High, Medium, or Low
3. **Category**: Testing, Security, Performance, etc.
4. **Estimated Time**: How long it will take
5. **Step-by-Step Guide**: Detailed implementation steps
6. **Code Files**: Complete updated code
7. **Commit Message**: Professional commit message

## 🤖 AI Project Generation

AI generates complete projects with:

- **Project Structure**: All files and folders
- **Production Code**: Well-commented, best practices
- **README**: Complete documentation
- **package.json**: All dependencies
- **.gitignore**: Proper exclusions
- **Setup Instructions**: How to run the project
- **Tests**: Unit and integration tests
- **Error Handling**: Comprehensive error management

## 🔒 Security Notes

- GitHub tokens are stored encrypted in the database
- Tokens are never exposed in the frontend
- All API calls require authentication
- Tokens can be revoked anytime from GitHub settings

## 🐛 Troubleshooting

### "GitHub not connected" error
- Make sure you completed the OAuth flow
- Check if `githubToken` exists in database
- Try disconnecting and reconnecting

### OAuth popup blocked
- Allow popups for localhost
- Check browser popup settings
- Try using a different browser

### API rate limits
- GitHub has rate limits (5000 requests/hour for authenticated)
- If you hit limits, wait an hour
- Upgrade to GitHub Pro for higher limits

### Repository analysis fails
- Ensure repository is accessible
- Check if repository has a README
- Private repositories require proper OAuth scope

## 📝 Environment Variables Reference

```env
# Required
GITHUB_CLIENT_ID=<from GitHub OAuth app>
GITHUB_CLIENT_SECRET=<from GitHub OAuth app>
GITHUB_REDIRECT_URI=http://localhost:3000/github-callback.html

# Optional (for production)
GITHUB_REDIRECT_URI=https://yourdomain.com/github-callback.html
```

## 🌟 Tips for Best Results

1. **Keep repositories updated**: Regular commits show activity
2. **Write good README**: AI analyzes this for context
3. **Use package.json**: Helps AI understand dependencies
4. **Add tests**: Increases interview readiness score
5. **Document code**: Better analysis and suggestions

## 📚 Tech Stack

- **Backend**: Node.js, Express, Prisma
- **Frontend**: React, CSS3
- **APIs**: GitHub REST API (@octokit/rest)
- **AI**: Google Gemini 2.0 Flash
- **Database**: PostgreSQL

## 🎉 Next Steps

After setup:
1. Connect your GitHub account
2. Analyze 2-3 of your best projects
3. Implement AI suggestions
4. Create 1-2 new projects for interviews
5. Share GitHub profile with recruiters

---

**Need help?** Check the main README or create an issue on GitHub.

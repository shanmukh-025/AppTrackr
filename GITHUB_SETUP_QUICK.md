# Quick GitHub OAuth Setup

## Step 1: Create GitHub OAuth App (2 minutes)

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: AppTracker Project Builder
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/github-callback.html
4. Click "Register application"
5. You'll see your **Client ID** - copy it
6. Click "Generate a new client secret" - copy it immediately (you can't see it again!)

## Step 2: Update Backend .env File

Open: `backend/.env`

Replace these lines:
```
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

With your actual credentials:
```
GITHUB_CLIENT_ID=Ov23li1a2b3c4d5e6f7g8h9i
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

## Step 3: Restart Backend Server

```bash
cd backend
npm start
```

## Step 4: Test

1. Go to Project Builder in the app
2. Click "Connect GitHub"
3. Should now redirect to GitHub properly!

---

**Note**: Keep your Client Secret private! Never commit it to Git.

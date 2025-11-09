# 🚀 Deployment Guide - AppTrackr

## Current Deployment Status

### ✅ Frontend - Vercel
- **Status**: Auto-deploys from GitHub main branch
- **URL**: https://apptrackr-frontend.vercel.app (or your custom domain)
- **Auto-deploys on**: Every push to `main` branch
- **Build time**: ~2-3 minutes

### ⏳ Backend - Render
- **Status**: Manual deployment required
- **URL**: https://apptrackr-api.onrender.com (or your custom domain)
- **Issue**: Free tier spins down after 15 minutes of inactivity
- **Causes**: Deploy timeouts due to cold starts

---

## 🔧 How to Redeploy on Render

### Option 1: Manual Redeploy (Fastest)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your `apptrackr-api` service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 3-5 minutes for deployment

### Option 2: Enable Auto-Deploy
1. Go to Render Dashboard → Settings
2. Find **"GitHub Configuration"**
3. Enable **"Auto-Deploy on Push"**
4. Next push to `main` will auto-deploy

### Option 3: Webhook (GitHub Integration)
1. Get the Render deploy hook from: Settings → Deploy Hook
2. Add to GitHub repository as a webhook
3. Every push triggers auto-deployment

---

## 📋 Environment Variables on Render

Make sure these are set in Render Dashboard:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres?connection_limit=100&pool_timeout=60
JWT_SECRET=your-super-secret-key-change-this-in-production
GEMINI_API_KEY=your-new-google-api-key-here
JOOBLE_API_KEY=your-jooble-api-key
APIJOBS_API_KEY=your-apijobs-api-key
```

---

## ⚠️ Cold Start Issue (Free Tier)

**Problem**: Render free tier spins down after 15 minutes of inactivity
**Solution Options**:
1. **Upgrade to Paid Plan** ($7/month) - Always running
2. **Use a ping service** (free) - Keeps service awake
3. **Accept occasional cold starts** - Takes 30-60 seconds first request

### Ping Service (Free Solution)
Use services like:
- **Koyeb** (free tier with auto-wake)
- **Railway** (pay-as-you-go)
- **Heroku** (paid now)

---

## 🔍 Troubleshooting Deployments

### Deploy Timed Out
- Cold start issue - wait for Render to warm up
- Solution: Upgrade plan or use a ping service

### Build Failed
- Check logs: Render Dashboard → Logs tab
- Verify all environment variables are set
- Ensure Prisma schema is valid

### Database Connection Error
- Verify DATABASE_URL in environment variables
- Check Supabase is running
- Ensure connection pool settings are correct

### Port Already in Use
- Render automatically handles port 5000
- No action needed

---

## 📊 Deployment Checklist

Before deploying:
- ✅ All code committed to `main` branch
- ✅ Environment variables set on Render
- ✅ Database migrations applied (`prisma db push`)
- ✅ No console errors locally
- ✅ API endpoints responding

---

## 🚀 Local Testing Before Deploy

```bash
# Backend
cd backend
npm install
npm start
# Test on http://localhost:5000

# Frontend
cd frontend
npm install
npm start
# Test on http://localhost:3000
```

---

## 📞 Support

For deployment issues:
1. Check Render logs: Dashboard → Logs
2. Verify all env variables match between local and Render
3. Test database connection: `npx prisma db execute --stdin < query.sql`
4. Check API health: GET `https://your-api.onrender.com/api/health`

---

**Last Updated**: November 9, 2025
**Created for**: AppTrackr Career Assistant

# 🚀 Quick Start Guide - Enterprise Features

## Prerequisites
- Node.js 16+ installed
- PostgreSQL database running
- Git (optional)

## 📦 Installation

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in your values
cp .env.example .env

# Required environment variables:
# DATABASE_URL="postgresql://user:password@host:port/database"
# JWT_SECRET="your-secret-key"
# GEMINI_API_KEY="your-gemini-api-key"
# PORT=5000

# Run Prisma migrations (creates all tables)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start backend server
npm start
```

Backend will run on: **http://localhost:5000**

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env file if needed
# REACT_APP_API_URL=http://localhost:5000

# Start frontend development server
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 🧪 Testing the Features

### Option 1: Automated Testing
```bash
cd backend
node test-enterprise-features.js
```

This will test all 27 API endpoints automatically.

### Option 2: Manual Testing

1. **Register/Login**
   - Go to `http://localhost:3000`
   - Create an account or login
   - You'll be redirected to the dashboard

2. **Test AI Job Clone Detector**
   - Click "Job Clone Detector" in the sidebar
   - Click "Start Clone Detection"
   - Watch the scanning progress
   - View detected clones (if any bookmarks exist)
   - Try adding a company to blacklist

3. **Test Smart Notifications**
   - Click "Smart Notifications" in the sidebar
   - View smart alerts
   - Try creating an automation rule
   - Check AI Insights tab

4. **Test Network Intelligence**
   - Click "Network Intelligence" in the sidebar
   - Add a test connection
   - Try discovering referral paths
   - View insider insights

5. **Test Interview Intelligence**
   - Click "Interview Intelligence" in the sidebar
   - Enter a company (e.g., "Google") and role
   - Click "Gather Intelligence"
   - Browse question bank
   - Try mock interview

---

## 🎯 Feature Access

All features are accessible via the sidebar after logging in:

| Feature | Route | Icon |
|---------|-------|------|
| AI Job Clone Detector | `/job-clone-detector` | 🔬 |
| Smart Notifications | `/smart-notifications` | 🔔 |
| Network Intelligence | `/network-intelligence` | 🤝 |
| Interview Intelligence | `/interview-intelligence` | 🎯 |

---

## 📊 Database Schema

### Tables Created:
1. **User** - User accounts (existing)
2. **Application** - Job applications (existing)
3. **JobBookmark** - Saved jobs (existing)
4. **JobClone** - Duplicate job tracking ✨ NEW
5. **CompanyBlacklist** - Blocked companies ✨ NEW
6. **SmartNotification** - Predictive alerts ✨ NEW
7. **AutomationRule** - If-then rules ✨ NEW
8. **NetworkConnection** - LinkedIn connections ✨ NEW
9. **ReferralPath** - Referral chains ✨ NEW
10. **InterviewIntelligence** - Company data ✨ NEW
11. **InterviewQuestion** - Question bank ✨ NEW
12. **SuccessPattern** - Proven strategies ✨ NEW

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** `Cannot connect to database`
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Test connection:
npx prisma db push
```

**Problem:** `JWT_SECRET is not defined`
```bash
# Add to backend/.env:
JWT_SECRET="your-secret-key-here"
```

**Problem:** `Port 5000 already in use`
```bash
# Change PORT in backend/.env:
PORT=5001
# Update REACT_APP_API_URL in frontend/.env:
REACT_APP_API_URL=http://localhost:5001
```

### Frontend Issues

**Problem:** `Failed to fetch` errors
```bash
# Ensure backend is running
# Check console for CORS errors
# Verify API_URL matches backend port
```

**Problem:** `Cannot read property of undefined`
```bash
# Check if you're logged in
# Verify JWT token in localStorage
# Try logging out and back in
```

### Database Issues

**Problem:** `Migration failed`
```bash
# Reset database and reapply migrations:
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
```

**Problem:** `Prisma Client not generated`
```bash
cd backend
npx prisma generate
```

---

## 📁 Project Structure

```
AppTracker/
├── backend/
│   ├── routes/
│   │   ├── jobCloneDetector.js      ✨ NEW
│   │   ├── smartNotifications.js    ✨ NEW
│   │   ├── networkIntelligence.js   ✨ NEW
│   │   ├── interviewIntelligence.js ✨ NEW
│   │   └── ... (22 other routes)
│   ├── prisma/
│   │   ├── schema.prisma (updated with 9 new models)
│   │   └── migrations/
│   ├── server.js (updated with new routes)
│   └── test-enterprise-features.js   ✨ NEW
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AIJobCloneDetector.js      ✨ NEW
│       │   ├── AIJobCloneDetector.css     ✨ NEW
│       │   ├── SmartNotifications.js      ✨ NEW
│       │   ├── SmartNotifications.css     ✨ NEW
│       │   ├── NetworkIntelligence.js     ✨ NEW
│       │   ├── NetworkIntelligence.css    ✨ NEW
│       │   ├── InterviewIntelligence.js   ✨ NEW
│       │   ├── InterviewIntelligence.css  ✨ NEW
│       │   └── ... (other components)
│       └── App.js (updated with new routes)
│
└── ENTERPRISE_FEATURES_COMPLETE.md   ✨ NEW
```

---

## 🎨 UI Color Themes

Each feature has its own color scheme:

| Feature | Primary Color | Gradient |
|---------|--------------|----------|
| Job Clone Detector | Red | #dc2626 → #f87171 |
| Smart Notifications | Orange | #ea580c → #fb923c |
| Network Intelligence | Blue | #2563eb → #60a5fa |
| Interview Intelligence | Purple | #7c3aed → #a78bfa |

---

## 🔐 Authentication

All API endpoints require JWT authentication:

```javascript
// Request headers must include:
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

Token is automatically included by frontend when logged in.

---

## 📈 API Endpoint Summary

### Job Clone Detector (6 endpoints)
- `GET /api/job-clone-detector/scan`
- `POST /api/job-clone-detector/mark-duplicate`
- `POST /api/job-clone-detector/blacklist`
- `GET /api/job-clone-detector/blacklist`
- `DELETE /api/job-clone-detector/blacklist/:id`
- `GET /api/job-clone-detector/groups`

### Smart Notifications (10 endpoints)
- `GET /api/smart-notifications`
- `PATCH /api/smart-notifications/:id/read`
- `DELETE /api/smart-notifications/:id`
- `GET /api/smart-notifications/rules`
- `POST /api/smart-notifications/rules`
- `PATCH /api/smart-notifications/rules/:id`
- `PATCH /api/smart-notifications/rules/:id/toggle`
- `DELETE /api/smart-notifications/rules/:id`
- `GET /api/smart-notifications/ai-insights`
- `POST /api/smart-notifications/generate-predictions`

### Network Intelligence (8 endpoints)
- `GET /api/network-intelligence`
- `POST /api/network-intelligence/connections`
- `PATCH /api/network-intelligence/connections/:id`
- `DELETE /api/network-intelligence/connections/:id`
- `POST /api/network-intelligence/discover-paths`
- `POST /api/network-intelligence/request-intro`
- `GET /api/network-intelligence/insider-insights`
- `POST /api/network-intelligence/connections/:id/interaction`

### Interview Intelligence (11 endpoints)
- `POST /api/interview-intelligence/gather`
- `GET /api/interview-intelligence/intelligence`
- `POST /api/interview-intelligence/questions`
- `GET /api/interview-intelligence/questions`
- `POST /api/interview-intelligence/questions/:id/upvote`
- `POST /api/interview-intelligence/patterns`
- `GET /api/interview-intelligence/patterns`
- `POST /api/interview-intelligence/patterns/:id/upvote`
- `POST /api/interview-intelligence/mock-interview`
- `POST /api/interview-intelligence/mock-interview/:sessionId/answer`
- `GET /api/interview-intelligence/statistics`

**Total: 35 endpoints** (27 new + 8 existing enhanced)

---

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
```bash
# Set environment variables:
DATABASE_URL=<your-production-db>
JWT_SECRET=<your-production-secret>
GEMINI_API_KEY=<your-api-key>

# Build command:
npm install && npx prisma generate && npx prisma migrate deploy

# Start command:
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Set environment variables:
REACT_APP_API_URL=<your-backend-url>

# Build command:
npm run build

# Publish directory:
build/
```

---

## 📞 Support & Resources

### Documentation
- [Full Feature Guide](./ENTERPRISE_FEATURES_COMPLETE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./backend/prisma/schema.prisma)

### Common Commands
```bash
# Backend
npm start              # Start server
npm run dev            # Start with nodemon
npx prisma studio      # Open database GUI
npx prisma migrate dev # Run migrations

# Frontend  
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

---

## ✨ Features at a Glance

### AI Job Clone Detector 🔬
- Detects duplicate job postings with 70%+ similarity
- 4 clone types: exact repost, content clone, recruiter clone, scam
- Company blacklist with automatic filtering
- Clone groups and statistics

### Smart Notifications 🔔
- AI-powered predictive alerts
- If-then automation rules
- Application outcome predictions
- Market trend analysis
- Custom notification triggers

### Network Intelligence 🤝
- LinkedIn connection mapping
- Multi-hop referral path discovery
- Warm introduction requests
- Insider insights from employees
- Connection strength tracking

### Interview Intelligence 🎯
- Company-specific interview data
- Crowdsourced question bank (1000+ questions)
- Success pattern library
- Mock interview practice
- Salary negotiation insights
- AI-powered question generation

---

## 🎉 You're All Set!

Both frontend and backend are now running with all 4 enterprise features fully functional!

**Next Steps:**
1. ✅ Login to the application
2. ✅ Explore each feature
3. ✅ Add some test data
4. ✅ Try the mock interviews
5. ✅ Set up automation rules

**Happy Job Hunting! 🚀**

# Job Suggestion System - Setup Guide

## 🎯 Overview

This system integrates 3 job APIs with intelligent priority and caching:
- **Jooble API** (Primary - 500 calls/day)
- **APIJobs.dev** (Complex queries - 50 calls/month)
- **Arbeitnow API** (Fallback - Unlimited, Europe-focused)

## 🔧 Setup Instructions

### 1. Add API Keys to `.env`

Replace the placeholder keys in `backend/.env`:

```env
# Job APIs
JOOBLE_API_KEY=your_actual_jooble_api_key_here
APIJOBS_API_KEY=your_actual_apijobs_api_key_here
```

### 2. Restart Server

```bash
cd backend
npm run dev
```

## 📡 API Endpoints

### Get Job Suggestions (Personalized)
```
GET /api/jobs/suggestions
Authorization: Bearer <token>

Query Parameters:
- location (optional): "New York" or "Remote"
- limit (optional): number (default: 50)
- remote (optional): true/false
- complex (optional): true (uses APIJobs.dev for better results)
- skills (optional): "javascript,react,nodejs" (override profile skills)

Response:
{
  "success": true,
  "data": {
    "jobs": [...],
    "count": 45,
    "skills": ["javascript", "react", "nodejs"],
    "filters": {...}
  }
}
```

### Search Jobs (By Keywords)
```
GET /api/jobs/search?keywords=python,django&location=Remote
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "jobs": [...],
    "count": 30,
    "keywords": ["python", "django"]
  }
}
```

### Get API Statistics
```
GET /api/jobs/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "rateLimits": {
      "jooble": {
        "used": 45,
        "limit": 500,
        "remaining": 455,
        "resetIn": "18 hours"
      },
      "apijobs": {
        "used": 5,
        "limit": 50,
        "remaining": 45,
        "resetIn": "25 days"
      }
    },
    "cache": {
      "size": 12,
      "maxSize": 100,
      "entries": [...]
    }
  }
}
```

### Track Job Click
```
POST /api/jobs/track-click
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "jobId": "jooble_12345",
  "source": "jooble",
  "title": "Senior React Developer",
  "company": "TechCorp"
}
```

### Save Job
```
POST /api/jobs/save
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "job": {
    "id": "jooble_12345",
    "title": "Senior React Developer",
    "company": "TechCorp",
    "url": "https://..."
  }
}
```

## 🎯 Job Object Structure

```javascript
{
  "id": "jooble_12345_abc",
  "title": "Senior React Developer",
  "company": "TechCorp Inc.",
  "location": "New York, NY",
  "description": "We are looking for...",
  "url": "https://apply-here.com",
  "salary": "$120k - $150k",
  "type": "Full-time",
  "remote": true,
  "postedDate": "2025-10-15T10:00:00Z",
  "source": "jooble",
  "relevanceScore": 45
}
```

## 🧠 How It Works

### 1. Skill Extraction & Normalization
- Extracts skills from user profile
- Normalizes terms (e.g., "JS" → "javascript")
- Generates optimized search queries

### 2. API Priority Strategy (Updated for Direct URLs)
```
┌─────────────────────────────────────┐
│ Check Cache First (30 min TTL)     │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Primary: Arbeitnow API              │
│ - Always fetch first (free)         │
│ - ✓ Direct URLs to job postings    │
│ - Europe-focused tech jobs          │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Secondary: APIJobs.dev              │
│ - Use for complex/skill-heavy       │
│ - ✓ Direct URLs to company pages   │
│ - Only if remaining > 10            │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Supplementary: Jooble API           │
│ - Use if need more results          │
│ - 🔗 Redirects through Jooble       │
│ - Only if remaining calls > 50      │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Deduplicate & Rank by Relevance     │
│ - Direct URLs get +8 score boost    │
└─────────────────────────────────────┘
```

**Why This Order?**
- ✅ Prioritizes direct application links (better UX)
- ✅ Minimizes Jooble redirects
- ✅ Arbeitnow = unlimited + direct URLs
- ✅ APIJobs = high quality + direct URLs
- ⚠️  Jooble = backup for broader coverage

### 3. Caching System
- In-memory cache with 30-minute TTL
- Max 100 entries (LRU eviction)
- Automatic cleanup every 5 minutes
- Reduces API calls by ~70%

### 4. Rate Limiting
- **Jooble**: 500 calls/day (resets daily)
- **APIJobs**: 50 calls/month (resets monthly)
- **Arbeitnow**: Unlimited (free)
- Automatic tracking and reset

### 5. Ranking Algorithm
Jobs are ranked by:
- Skill match count (+10 per skill)
- Recency (+5 if < 7 days, +2 if < 30 days)
- Remote flag (+3)
- Higher scores appear first

## 🎨 Supported Skills

The system recognizes and normalizes 50+ common tech skills:
- **Frontend**: JavaScript, React, Vue, Angular, Next.js
- **Backend**: Node.js, Python, Django, Flask, Java, Spring Boot
- **Databases**: SQL, MySQL, PostgreSQL, MongoDB, Redis
- **Cloud**: AWS, Azure, Google Cloud
- **DevOps**: Docker, Kubernetes, CI/CD, Jenkins
- **Mobile**: React Native, Flutter, Swift, Kotlin

## 📊 Usage Tips

### For Best Results:
1. **Update Profile Skills**: Add skills to user profile for better suggestions
2. **Use Complex Flag**: Set `complex=true` for technical roles
3. **Specify Location**: Add location for geo-targeted results
4. **Monitor Rate Limits**: Check `/api/jobs/stats` regularly

### To Minimize API Calls:
1. Cache is automatic - repeated queries are instant
2. Use broader keywords instead of many specific ones
3. Leverage the fallback Arbeitnow API (free)
4. Set appropriate limits (default 50 is good)

## 🔍 Testing

### Test Job Suggestions:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:5000/api/jobs/suggestions?limit=10"
```

### Test Search:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:5000/api/jobs/search?keywords=react,nodejs&remote=true"
```

### Check Stats:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:5000/api/jobs/stats"
```

## 🚀 Next Steps

1. **Frontend Integration**: Display jobs in Dashboard
2. **Save Jobs Feature**: Store favorites in database
3. **Apply Tracking**: Link jobs to applications
4. **ML Feedback Loop**: Track clicks/applications for better suggestions
5. **Email Alerts**: Notify users of new matching jobs

## 📝 Notes

- Cache clears automatically every 30 minutes
- Rate limits reset daily (Jooble) and monthly (APIJobs)
- Arbeitnow has Europe-focused jobs but is free and unlimited
- All APIs called asynchronously for faster responses
- Deduplication happens automatically by job URL

## 🐛 Troubleshooting

### "No skills found" Error:
- Add skills to user profile OR
- Pass skills via query: `?skills=react,nodejs`

### Empty Results:
- Try broader keywords
- Check API rate limits via `/api/jobs/stats`
- Verify API keys in `.env`

### Slow Responses:
- Cache is working - subsequent calls are instant
- First call might take 3-5 seconds (multiple APIs)
- Background caching improves over time

## 📞 Support

Check logs for detailed API call information:
- ✅ Success messages
- ⚠️  Rate limit warnings
- ❌ Error messages
- 💾 Cache operations
- 📊 API usage stats

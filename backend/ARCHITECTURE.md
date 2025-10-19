# 🏗️ Job Suggestion System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │   Dashboard    │  │  Job Search    │  │   Saved Jobs   │       │
│  │   Component    │  │   Component    │  │   Component    │       │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘       │
│           │                    │                    │                │
│           └────────────────────┴────────────────────┘                │
│                                │                                     │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │ HTTP Request
                                 │ Authorization: Bearer <token>
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND API SERVER                             │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              API Routes (/api/jobs/)                           │ │
│  │  • GET /suggestions  - Personalized recommendations           │ │
│  │  • GET /search       - Keyword search                         │ │
│  │  • GET /stats        - Usage statistics                       │ │
│  │  • POST /track-click - Analytics tracking                     │ │
│  └─────────────────────────┬──────────────────────────────────────┘ │
│                             │                                         │
│  ┌─────────────────────────▼──────────────────────────────────────┐ │
│  │                  Skill Normalizer                              │ │
│  │  • Extract skills from profile                                │ │
│  │  • Normalize terms (JS → javascript)                          │ │
│  │  • Generate search queries                                    │ │
│  │  • Prioritize skills                                          │ │
│  └─────────────────────────┬──────────────────────────────────────┘ │
│                             │                                         │
│  ┌─────────────────────────▼──────────────────────────────────────┐ │
│  │                    Job Service                                 │ │
│  │                 (Smart API Orchestration)                      │ │
│  └─────────────────────────┬──────────────────────────────────────┘ │
│                             │                                         │
│              ┌──────────────┼──────────────┐                         │
│              │              │              │                         │
│  ┌───────────▼──────┐  ┌───▼──────┐  ┌───▼──────────┐             │
│  │  Cache Service   │  │   Rate    │  │  Deduplicator│             │
│  │                  │  │  Limiter  │  │  & Ranker    │             │
│  │ • In-Memory      │  │           │  │              │             │
│  │ • 30min TTL      │  │ • Jooble: │  │ • Remove     │             │
│  │ • LRU Eviction   │  │   500/day │  │   duplicates │             │
│  │ • Auto cleanup   │  │ • APIJobs:│  │ • Rank by    │             │
│  │                  │  │   50/mo   │  │   relevance  │             │
│  └───────────┬──────┘  └───┬──────┘  └───┬──────────┘             │
│              │              │              │                         │
│              └──────────────┴──────────────┘                         │
│                             │                                         │
└─────────────────────────────┼─────────────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            │                  │                  │
┌───────────▼──────┐  ┌────────▼───────┐  ┌──────▼──────────┐
│   Jooble API     │  │  APIJobs.dev   │  │ Arbeitnow API   │
│   (PRIMARY)      │  │   (COMPLEX)    │  │   (FALLBACK)    │
├──────────────────┤  ├────────────────┤  ├─────────────────┤
│ • 500/day        │  │ • 50/month     │  │ • Unlimited     │
│ • International  │  │ • Tech jobs    │  │ • No API key    │
│ • Broad coverage │  │ • Skill filter │  │ • Europe jobs   │
└──────────────────┘  └────────────────┘  └─────────────────┘
```

## Request Flow

### 1. User Request
```
User clicks "Get Job Suggestions" on Dashboard
  ↓
Frontend sends: GET /api/jobs/suggestions
  ↓
JWT token validated
  ↓
Continue to Job Service
```

### 2. Skill Processing
```
Job Service receives request
  ↓
Skill Normalizer extracts user skills
  ↓
Skills normalized: ["JS", "React"] → ["javascript", "react"]
  ↓
Generate search queries: ["javascript", "react", "javascript react"]
```

### 3. API Priority Chain
```
For each search query:

  ┌─────────────────────────────────┐
  │ 1. Check Cache                  │
  │    ├─ HIT → Return cached data  │
  │    └─ MISS → Continue           │
  └─────────┬───────────────────────┘
            │
  ┌─────────▼───────────────────────┐
  │ 2. Try Jooble API               │
  │    ├─ Rate limit OK → Call API  │
  │    ├─ Rate limit reached → Skip │
  │    └─ Error → Continue          │
  └─────────┬───────────────────────┘
            │
  ┌─────────▼───────────────────────┐
  │ 3. Try APIJobs (if complex)     │
  │    ├─ Complex query → Call API  │
  │    ├─ Rate limit reached → Skip │
  │    └─ Simple query → Skip       │
  └─────────┬───────────────────────┘
            │
  ┌─────────▼───────────────────────┐
  │ 4. Always Try Arbeitnow         │
  │    ├─ Free & unlimited          │
  │    └─ Always fetch              │
  └─────────┬───────────────────────┘
            │
  ┌─────────▼───────────────────────┐
  │ 5. Merge Results                │
  │    ├─ Deduplicate by URL        │
  │    ├─ Rank by relevance         │
  │    └─ Cache merged results      │
  └─────────────────────────────────┘
```

### 4. Response Processing
```
Merged job listings
  ↓
Deduplicate (remove URL duplicates)
  ↓
Rank by relevance score
  ↓
Cache results (30 min TTL)
  ↓
Return top N jobs to frontend
```

## Data Flow Example

### Input (User Profile):
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["JS", "React", "Node"],
  "bio": "Full stack developer with experience in Python"
}
```

### Step 1: Skill Extraction
```javascript
Extracted: ["JS", "React", "Node", "Python"]
Normalized: ["javascript", "react", "nodejs", "python"]
Prioritized: ["javascript", "react", "nodejs", "python"]
Queries: ["javascript", "react", "javascript react"]
```

### Step 2: API Calls (Parallel)
```
Query 1: "javascript"
├─ Jooble: 15 jobs
├─ APIJobs: 8 jobs (if complex)
└─ Arbeitnow: 12 jobs
  → Total: 35 jobs

Query 2: "react"
├─ Jooble: 12 jobs
├─ APIJobs: Skip (not complex)
└─ Arbeitnow: 10 jobs
  → Total: 22 jobs

Query 3: "javascript react"
├─ Jooble: 18 jobs
├─ APIJobs: 10 jobs (complex)
└─ Arbeitnow: 8 jobs
  → Total: 36 jobs
```

### Step 3: Deduplication
```
Before: 93 jobs total
After: 67 unique jobs (26 duplicates removed)
```

### Step 4: Ranking
```
Job scoring:
├─ Skill matches: +10 per skill
├─ Recent (<7 days): +5
├─ Remote: +3
└─ Sort by score descending
```

### Output (API Response):
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "jooble_12345_abc",
        "title": "Senior React Developer",
        "company": "TechCorp Inc.",
        "location": "Remote",
        "relevanceScore": 48,
        "source": "jooble"
      },
      // ... more jobs
    ],
    "count": 67,
    "skills": ["javascript", "react", "nodejs", "python"],
    "filters": { "limit": 50, "remote": false }
  }
}
```

## Caching Strategy

```
┌────────────────────────────────────────┐
│         Cache Memory (LRU)             │
├────────────────────────────────────────┤
│ Key: "jooble:javascript:remote:true"   │
│ Value: [...25 jobs...]                 │
│ Expires: 2025-10-19 15:30:00          │
│ Cached: 2025-10-19 15:00:00           │
├────────────────────────────────────────┤
│ Key: "apijobs:react:limit:10"         │
│ Value: [...10 jobs...]                │
│ Expires: 2025-10-19 15:35:00         │
│ Cached: 2025-10-19 15:05:00          │
├────────────────────────────────────────┤
│          ... 98 more entries           │
└────────────────────────────────────────┘

Cache Operations:
• GET → Check expiry → Return or null
• SET → Evict oldest if full → Store with TTL
• CLEAN → Remove expired every 5 minutes
```

## Rate Limiting

```
┌──────────────────────────────────────┐
│        Jooble Rate Limiter           │
├──────────────────────────────────────┤
│ Limit: 500 calls/day                 │
│ Used: 45 calls                       │
│ Remaining: 455 calls                 │
│ Reset: Tomorrow at midnight          │
│ Status: ✅ OK (90% available)        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      APIJobs Rate Limiter            │
├──────────────────────────────────────┤
│ Limit: 50 calls/month                │
│ Used: 8 calls                        │
│ Remaining: 42 calls                  │
│ Reset: Nov 1, 2025                   │
│ Status: ✅ OK (84% available)        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      Arbeitnow (No limits)           │
├──────────────────────────────────────┤
│ Limit: ∞ Unlimited                   │
│ Used: 120 calls                      │
│ Remaining: ∞                         │
│ Status: ✅ Always available          │
└──────────────────────────────────────┘
```

## Performance Metrics

```
First Request (Cache MISS):
├─ API calls: 3 (parallel)
├─ Time: 3-5 seconds
└─ Cache: MISS → SET

Subsequent Requests (Cache HIT):
├─ API calls: 0
├─ Time: <100ms
└─ Cache: HIT → Return instantly

API Call Distribution:
├─ Jooble: 70% (primary)
├─ APIJobs: 10% (complex only)
└─ Arbeitnow: 100% (always free)
```

## Error Handling

```
API Call Failures:
├─ Jooble fails → Try APIJobs
├─ APIJobs fails → Continue to Arbeitnow
├─ Arbeitnow fails → Return partial results
└─ All fail → Return cached or empty array

Rate Limit Reached:
├─ Jooble → Skip to APIJobs
├─ APIJobs → Skip to Arbeitnow
└─ Return what's available

Network Timeout:
├─ 10 second timeout per API
├─ Parallel calls don't block each other
└─ Return successful calls only
```

## Monitoring & Logging

```
Console Logs:
✅ API success messages
💾 Cache operations (HIT/SET)
📊 Rate limit updates
⚠️  Rate limit warnings
❌ Error messages
🧹 Cache cleanup events

Example Log Output:
🔍 Searching for jobs with skills: javascript, react
📊 Rate limits: Jooble 455/500, APIJobs 42/50
✅ Jooble: Found 15 jobs for "javascript"
💾 Cache SET: jooble:javascript (TTL: 1800s)
✅ APIJobs: Found 8 jobs for "javascript"
✅ Arbeitnow: Found 12 jobs for "javascript"
✅ Total unique jobs found: 67
```

# 🎯 AppTrackr - Intelligent Career Assistant

A comprehensive full-stack web application designed to help job seekers track applications, optimize resumes, prepare for interviews, and accelerate their career growth through AI-powered insights.

## ✨ Key Features

### 📋 **Application Tracking System (ATS)**
- Track job applications with custom pipelines
- Monitor application status and deadlines
- View application history and notes
- Export data for analytics

### 🤖 **AI-Powered Resume Tools**
- **Resume Generation**: Create professional resumes from profile data using Gemini AI
- **ATS Score Checker**: Analyze resume compatibility with job descriptions (10+ metrics)
- **Resume Editor**: Edit and refine generated resumes inline
- **Resume Versioning**: Save multiple versions, track which companies received each
- **PDF Download**: Export resumes in professional PDF format

### 💌 **Cover Letter Management**
- **Template System**: Pre-built templates by industry (Tech, Finance, Healthcare, etc.)
- **Customizable Sections**: 5-part structure (Opening, Body 1-3, Closing)
- **Auto-Generation**: Generate cover letters with company/position/skills replacements
- **One-Click Download**: Save as text or copy to clipboard

### 🧠 **Interview Preparation**
- AI-powered behavioral coaching
- System design interview questions
- DSA problem tracker (1,100+ problems)
- Mock interview sessions
- Interview feedback and analysis

### 📊 **Analytics & Insights**
- Dashboard with application trends
- Success rate by company/position
- Skill gap analysis
- Learning recommendations

### 💼 **Job Discovery**
- Multi-source job aggregation (Jooble, APIJobs, Arbeitnow)
- Advanced filtering by salary, location, skills
- Job bookmarking and favorites
- Saved searches with notifications

### 🎓 **Skill Development**
- Personalized learning paths
- DSA problem recommendations
- Resource library (tutorials, articles, courses)
- Progress tracking

## 🏗️ Technology Stack

### **Frontend**
- **Framework**: React 18.x
- **Deployment**: Vercel
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API
- **Key Libraries**: 
  - `pdfkit` - PDF generation
  - `axios` - HTTP requests
  - Standard React hooks (useState, useEffect, useContext)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Deployment**: Render
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: Google Generative AI SDK (Gemini 2.5)
- **Key Features**:
  - JWT authentication
  - Middleware (auth, upload, CORS)
  - RESTful API architecture
  - Connection pooling (100 concurrent)

### **Database Models**
- **User**: Profile, preferences, authentication
- **Application**: Job applications with pipeline stages
- **Resume**: Multiple versions with company tracking
- **CoverLetterTemplate**: Reusable templates by industry
- **Interview**: Sessions and feedback
- **Note**: Application-related notes
- **JobBookmark**: Saved jobs
- **SavedSearch**: Job search preferences

## 📦 Project Structure

```
AppTrackr/
├── backend/
│   ├── middleware/          # Auth, upload, CORS
│   ├── routes/              # API endpoints (20+ routes)
│   ├── services/            # Business logic (28+ services)
│   ├── prisma/              # Database schema & migrations
│   ├── utils/               # Helpers and utilities
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth, Theme contexts
│   │   ├── styles/          # CSS files
│   │   ├── data/            # Static data (DSA sheets)
│   │   └── App.js           # Main app
│   └── package.json
├── README.md
├── render.yaml              # Render deployment config
└── vercel.json              # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 16+ 
- **npm** or **yarn**
- **PostgreSQL**: Database (Supabase recommended)
- **API Keys**:
  - Gemini API key (Google Makersuite)
  - Jooble API key (optional, but recommended)
  - Job APIs keys (optional)

### Backend Setup

```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys and database URL

# Run database migrations
npx prisma migrate dev

# Start server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend API URL

# Start development server
npm start
# App runs on http://localhost:3000
```

## 🔑 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
JOOBLE_API_KEY=your_jooble_key
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_jwt_secret_32_chars_min
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

See `.env.example` files for complete configuration options.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout

### Resume Management
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Create resume from file
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes/:id/save-version` - Save new version
- `POST /api/resumes/:id/mark-sent` - Track company sent to

### AI Features
- `POST /api/ai/generate-resume` - Generate resume with AI
- `POST /api/ai/generate-resume-pdf` - Generate PDF resume
- `POST /api/ai/check-ats` - Check ATS compatibility

### Cover Letter Templates
- `POST /api/templates/cover-letter` - Create template
- `GET /api/templates/cover-letter` - Get all templates
- `POST /api/templates/cover-letter/:id/apply` - Generate letter

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - Get user's applications
- `PUT /api/applications/:id` - Update application status

### More endpoints...
See `backend/routes/` for complete API documentation

## 🛠️ Development

### Running Locally

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```

### Database Migrations

```bash
# Create migration
cd backend
npx prisma migrate dev --name descriptive_name

# Reset database (⚠️ loses all data)
npx prisma migrate reset
```

### Linting & Formatting

```bash
# Backend
cd backend
npm run lint  # if available

# Frontend
cd frontend
npm run lint
npm run format
```

## 📊 Performance & Optimization

- **Database**: Connection pooling (100 concurrent), 60s timeout
- **Caching**: Job results cached for 30 minutes (1800s)
- **Frontend**: React code splitting, lazy loading
- **Compression**: Gzip enabled on both frontend and backend

## 🔒 Security

- JWT-based authentication
- Password hashing (bcrypt)
- SQL injection prevention (Prisma ORM)
- CORS enabled with credentials
- Environment variable protection
- File upload validation
- Rate limiting ready (middleware exists)

## 📈 Deployment

### Frontend - Vercel
```bash
# Auto-deploys from main branch
git push origin main
# View at: https://apptrackr-frontend.vercel.app
```

### Backend - Render
```bash
# Manual deployment or git push with webhook
# Environment variables set in Render dashboard
# Updated API key needed in production
```

## 🐛 Troubleshooting

### Gemini API 404 Error
- Ensure using `gemini-2.5-flash` or `gemini-2.5-pro` models
- Older models (gemini-1.5-*) are deprecated
- Check API key validity

### Database Connection Errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check connection pool settings (100 concurrent)

### Resume Generation Issues
- Profile data must exist (education, location)
- Missing data filled with [PLACEHOLDER]
- Check Gemini API key and quota

### Port Already in Use
```bash
# Change port in .env or kill process
lsof -ti:5000 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process  # Windows
```

## 📝 License

This project is private and confidential.

## 👨‍💼 Support & Contact

For issues, feature requests, or questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Made with ❤️ for career acceleration**
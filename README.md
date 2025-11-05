# AppTracker - Job Application Tracker

A comprehensive job application tracking system with AI-powered features.

## 🚀 Features

- **Application Tracking**: Track job applications with status updates
- **AI Assistant**: Resume generator and cover letter generator
- **Learning Paths**: Personalized learning recommendations
- **Analytics**: Track application statistics and progress
- **Resources Hub**: Resume templates, cover letters, behavioral questions, DSA problems, system design
- **Skills Gap Analysis**: Identify and track skill gaps
- **Profile Management**: Manage your professional profile

## � API Keys Required

### Required APIs
- **PostgreSQL Database**: Supabase or any PostgreSQL provider
- **Google Gemini AI**: For resume generation and cover letter writing
  - Get your key: https://makersuite.google.com/app/apikey

### Optional APIs (for enhanced features)

#### Job Search APIs
- **Jooble** (Primary, 500 calls/day): https://jooble.org/api/about
- **APIJobs.dev** (Complex searches, 50 calls/month): https://apijobs.dev
- **Arbeitnow** (Fallback, unlimited): https://arbeitnow.com/api

#### AI Services
- **Claude AI** (Advanced question analysis): https://console.anthropic.com/

#### Email Service
- **Resend** (Email notifications): https://resend.com/api-keys

## 📝 Environment Variables

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🌐 Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file
4. Set the following environment variables in Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `GEMINI_API_KEY`: Your Google Gemini API key

### Option 2: Manual Deployment

#### Backend Service

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
4. Add environment variables (same as above)

#### Frontend Service

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🔧 Available Scripts

### Backend

- `npm start`: Start the production server
- `npm run dev`: Start development server with nodemon
- `npm run build`: Generate Prisma client

### Frontend

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests

## 📚 Tech Stack

**Frontend:**
- React 19
- React Router
- Axios
- Chart.js
- Material-UI

**Backend:**
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google Gemini AI

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration

## 📄 License

ISC

## 👨‍💻 Author

Shanmukh

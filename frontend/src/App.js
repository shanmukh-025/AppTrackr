import React, { useContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext } from './context/AuthContext';
import { getDesignTokens } from './theme/theme';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ResourcesSimplified from './pages/ResourcesSimplified';
import Jobs from './pages/Jobs';
import AIFeatures from './pages/AIFeatures';
import Resumes from './pages/Resumes';
import DSASheets from './pages/DSASheets';
import DSASheetDetail from './pages/DSASheetDetail';
import VideoInterviewHome from './pages/VideoInterviewHome';
import VideoInterviewSession from './pages/VideoInterviewSession';
import VideoInterviewFeedback from './pages/VideoInterviewFeedback';
import './App.css';

// Color mode context
export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const { user, loading } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  if (loading) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <div className="loading-screen">
              <h2>Loading...</h2>
            </div>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            {showLogin ? (
              <Login onSwitchToSignup={() => setShowLogin(false)} mode={mode} />
            ) : (
              <Signup onSwitchToLogin={() => setShowLogin(true)} mode={mode} />
            )}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  // Show app with sidebar navigation if authenticated
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App app-with-sidebar">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                {/* Redirect old resume-score route to unified resumes page */}
                <Route path="/resume-score" element={<Navigate to="/resumes" replace />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resources" element={<ResourcesSimplified />} />
                <Route path="/dsa-sheets" element={<DSASheets />} />
                <Route path="/dsa-sheets/:sheetId" element={<DSASheetDetail />} />
                <Route path="/behavioral" element={<VideoInterviewHome />} />
                <Route path="/video-interview/session" element={<VideoInterviewSession />} />
                <Route path="/video-interview/feedback/:sessionId" element={<VideoInterviewFeedback />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
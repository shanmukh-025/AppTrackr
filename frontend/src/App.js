import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Companies from './pages/Companies';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Jobs from './pages/Jobs';
import AIFeatures from './pages/AIFeatures';
import Resumes from './pages/Resumes';
import Skills from './pages/Skills';
import './App.css';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <div className="App">
        {showLogin ? (
          <Login onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  // Show app with sidebar navigation if authenticated
  return (
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
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
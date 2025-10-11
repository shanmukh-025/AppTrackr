import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const { user, loading, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
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

  // Show dashboard if authenticated
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '40px 20px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <div>
              <h1>🎯 AppTrackr</h1>
              <p>Welcome back, {user.name || user.email}!</p>
            </div>
            <button 
              onClick={logout}
              style={{
                padding: '10px 20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>

          <div style={{ 
            background: '#282c34', 
            padding: '30px', 
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <h2 style={{ marginTop: 0 }}>Dashboard Coming Soon!</h2>
            <p>Authentication is complete. Next we'll build:</p>
            <ul style={{ textAlign: 'left', lineHeight: '2' }}>
              <li>✅ Add job applications</li>
              <li>✅ View all applications</li>
              <li>✅ Edit & delete applications</li>
              <li>✅ Track status (Applied, Interview, Offer)</li>
              <li>✅ Analytics dashboard</li>
            </ul>
            
            <div style={{ marginTop: '30px', padding: '20px', background: '#1a1d23', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>Your Account</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.name || 'Not set'}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
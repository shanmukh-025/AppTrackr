import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    // Test API connection
    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(data => {
        setApiStatus('✅ Connected');
        setApiMessage(data.message);
      })
      .catch(err => {
        setApiStatus('❌ Not Connected');
        setApiMessage('Start the backend server');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 AppTrackr</h1>
        <p>Job Application Tracker</p>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#282c34', borderRadius: '8px' }}>
          <h3>API Status: {apiStatus}</h3>
          <p>{apiMessage}</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <p>✅ Frontend: Running</p>
          <p>✅ React: Loaded</p>
          <p>🚀 Ready to build!</p>
        </div>
      </header>
    </div>
  );
}

export default App;
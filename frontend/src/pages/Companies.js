import './Pages.css';

function Companies() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏢 Companies</h1>
      </div>

      <div className="coming-soon-page">
        <div className="coming-soon-icon">🚧</div>
        <h2>Companies Page Coming Soon!</h2>
        <p>This page will show:</p>
        <ul>
          <li>Companies you've applied to</li>
          <li>Application statistics per company</li>
          <li>Companies with open positions</li>
          <li>AI-powered company recommendations</li>
        </ul>
      </div>
    </div>
  );
}

export default Companies;
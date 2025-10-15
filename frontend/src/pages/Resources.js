import './Pages.css';

function Resources() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Resources</h1>
      </div>

      <div className="coming-soon-page">
        <div className="coming-soon-icon">🚧</div>
        <h2>Resources Hub Coming Soon!</h2>
        <p>This page will feature:</p>
        <ul>
          <li>📝 Resume Builder - Create professional resumes</li>
          <li>✉️ Cover Letter Guide - Templates and tips</li>
          <li>💼 Interview Prep - Common questions and answers</li>
          <li>💰 Salary Negotiation - Strategies and tools</li>
          <li>🎯 Job Search Strategy - Best practices and tips</li>
        </ul>
      </div>
    </div>
  );
}

export default Resources;
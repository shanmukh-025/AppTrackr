import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import ResumeScoreOptimizer from '../components/ResumeScoreOptimizer';
import './Resumes.css';

const Resumes = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="resumes-page">
      <div className="resumes-header">
        <h1>Resume Management</h1>
        <p>Upload, score, and optimize your resumes</p>
      </div>

      <div className="resumes-tabs">
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload & Manage
        </button>
        <button
          className={`tab-btn ${activeTab === 'score' ? 'active' : ''}`}
          onClick={() => setActiveTab('score')}
        >
          ✍️ Score & Optimize
        </button>
      </div>

      <div className="resumes-content">
        {activeTab === 'upload' && <ResumeUpload />}
        {activeTab === 'score' && <ResumeScoreOptimizer />}
      </div>
    </div>
  );
};

export default Resumes;

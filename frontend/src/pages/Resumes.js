import React from 'react';
import ResumeScoreOptimizer from '../components/ResumeScoreOptimizer';
import './Resumes.css';

const Resumes = () => {
  return (
    <div className="resumes-page">
      <div className="resumes-content">
        <ResumeScoreOptimizer />
      </div>
    </div>
  );
};

export default Resumes;

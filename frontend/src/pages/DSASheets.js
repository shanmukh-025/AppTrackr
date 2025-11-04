import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DSATrackerNew.css';

const DSASheets = () => {
  const navigate = useNavigate();
  const [overallProgress, setOverallProgress] = useState({});

  // DSA Sheets metadata
  const dsaSheets = {
    striver: {
      name: "Striver's SDE Sheet",
      icon: '🔥',
      description: 'Most popular SDE sheet with 191 problems',
      totalProblems: 191,
      color: '#FF6B6B'
    },
    neetcode: {
      name: 'NeetCode 150',
      icon: '💡',
      description: 'Curated list of 150 best LeetCode questions',
      totalProblems: 150,
      color: '#4ECDC4'
    },
    blind75: {
      name: 'Blind 75',
      icon: '👁️',
      description: 'Essential 75 questions for interviews',
      totalProblems: 75,
      color: '#95E1D3'
    },
    love: {
      name: "Love Babbar's 450",
      icon: '❤️',
      description: 'Comprehensive 450 DSA problems',
      totalProblems: 450,
      color: '#F38181'
    },
    fraz: {
      name: "Fraz's List",
      icon: '⚡',
      description: 'Company-wise important 250 problems',
      totalProblems: 250,
      color: '#AA96DA'
    }
  };

  // Load progress for all sheets
  useEffect(() => {
    const sheetKeys = Object.keys(dsaSheets);
    const progress = {};
    sheetKeys.forEach(sheetKey => {
      const saved = localStorage.getItem(`dsa-solved-${sheetKey}`);
      if (saved) {
        progress[sheetKey] = JSON.parse(saved).length;
      } else {
        progress[sheetKey] = 0;
      }
    });
    setOverallProgress(progress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to sheet detail page
  const handleSheetClick = (sheetKey) => {
    navigate(`/dsa-sheets/${sheetKey}`);
  };

  // Calculate total progress
  const totalProblems = Object.values(dsaSheets).reduce((sum, sheet) => sum + sheet.totalProblems, 0);
  const totalSolved = Object.values(overallProgress).reduce((sum, count) => sum + count, 0);
  const overallPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="dsa-tracker-container">
      <div className="dsa-tracker-header">
        <h1 className="tracker-title">
          <span className="title-icon">🎮</span>
          DSA Problem Tracker
        </h1>
        <p className="tracker-subtitle">
          Track your progress across popular DSA sheets
        </p>
      </div>

      {/* Overall Progress */}
      <div className="overall-progress-card">
        <h3>Overall Progress</h3>
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Total Solved</span>
            <span className="stat-value">{totalSolved}/{totalProblems}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion</span>
            <span className="stat-value">{overallPercentage}%</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${overallPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Sheet Cards */}
      <div className="sheets-section">
        <h2 className="section-title">📚 Select a DSA Sheet</h2>
        <div className="sheets-grid">
          {Object.entries(dsaSheets).map(([key, sheet]) => {
            const solved = overallProgress[key] || 0;
            const percentage = Math.round((solved / sheet.totalProblems) * 100);
            
            return (
              <div 
                key={key} 
                className="sheet-card"
                onClick={() => handleSheetClick(key)}
                style={{ borderColor: sheet.color }}
              >
                <div className="sheet-card-header">
                  <span className="sheet-icon">{sheet.icon}</span>
                  <h3 className="sheet-name">{sheet.name}</h3>
                </div>
                <p className="sheet-description">{sheet.description}</p>
                
                <div className="sheet-stats">
                  <div className="stat">
                    <span className="stat-label">Problems</span>
                    <span className="stat-value">{sheet.totalProblems}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Solved</span>
                    <span className="stat-value">{solved}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">{percentage}%</span>
                  </div>
                </div>

                <div className="sheet-progress">
                  <div 
                    className="sheet-progress-bar"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: sheet.color 
                    }}
                  ></div>
                </div>

                <button 
                  className="view-sheet-btn"
                  style={{ backgroundColor: sheet.color }}
                >
                  View Problems →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>{totalProblems}</h4>
            <p>Total Problems</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h4>{totalSolved}</h4>
            <p>Problems Solved</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h4>{totalProblems - totalSolved}</h4>
            <p>Remaining</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h4>{overallPercentage}%</h4>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSASheets;

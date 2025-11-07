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

  return (
    <div className="dsa-tracker-container">
      <div className="sheets-grid">
          {Object.entries(dsaSheets).map(([key, sheet]) => {
            const solved = overallProgress[key] || 0;
            const percentage = Math.round((solved / sheet.totalProblems) * 100);
            
            return (
              <div 
                key={key} 
                className="sheet-card-new"
                onClick={() => handleSheetClick(key)}
              >
                {/* Progress Bar at Top */}
                <div className="sheet-card-progress-top">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: sheet.color 
                      }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{percentage}%</span>
                </div>

                {/* Card Content */}
                <div className="sheet-card-content">
                  {/* Title and Description */}
                  <div className="sheet-header-section">
                    <h3 className="sheet-name-new">{sheet.name}</h3>
                    <p className="sheet-description-new">{sheet.description}</p>
                  </div>

                  {/* Followers and Stats */}
                  <div className="sheet-meta-info">
                    <span className="followers-badge">👥 1266 Followers</span>
                  </div>

                  {/* Questions and Solved Info */}
                  <div className="sheet-stats-row">
                    <div className="stat-item-new">
                      <span className="stat-label-new">❓ {sheet.totalProblems} questions</span>
                    </div>
                    <div className="stat-item-new">
                      <span className="stat-label-new">✅ {solved} solved</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default DSASheets;

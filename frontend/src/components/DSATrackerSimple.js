import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DSATrackerNew.css';

const DSATrackerSimple = () => {
  const navigate = useNavigate();

  // Popular DSA Sheets
  const dsaSheets = {
    striver: {
      name: "Striver's SDE Sheet",
      icon: '🔥',
      description: 'Most popular SDE sheet with 191 problems',
      totalProblems: 191,
      color: '#047857'
    },
    neetcode: {
      name: 'NeetCode 150',
      icon: '💡',
      description: 'Curated list of 150 best LeetCode questions',
      totalProblems: 150,
      color: '#059669'
    },
    blind75: {
      name: 'Blind 75',
      icon: '👁️',
      description: 'Essential 75 questions for interviews',
      totalProblems: 75,
      color: '#10B981'
    },
    love: {
      name: "Love Babbar's 450",
      icon: '❤️',
      description: 'Comprehensive 450 DSA problems',
      totalProblems: 450,
      color: '#065F46'
    },
    fraz: {
      name: "Fraz's List",
      icon: '⚡',
      description: 'Top questions asked in interviews',
      totalProblems: 250,
      color: '#047857'
    }
  };

  const handleSheetClick = (sheetKey) => {
    navigate(`/dsa-sheets/${sheetKey}`);
  };

  return (
    <div className="dsa-tracker-new">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-content">
          <h1>🎯 DSA Problem Tracker</h1>
          <p>Master Data Structures & Algorithms with popular curated sheets</p>
        </div>
      </div>

      {/* Sheet Selection */}
      <div className="sheet-selection">
        <h2>📚 Choose Your Learning Path</h2>
        <div className="sheets-grid">
          {Object.entries(dsaSheets).map(([key, sheet]) => (
            <div
              key={key}
              className="sheet-card clickable"
              onClick={() => handleSheetClick(key)}
              style={{ 
                borderColor: sheet.color,
                cursor: 'pointer'
              }}
            >
              <div className="sheet-icon" style={{ background: sheet.color }}>
                {sheet.icon}
              </div>
              <h3>{sheet.name}</h3>
              <p>{sheet.description}</p>
              <div className="sheet-meta">
                <span className="problem-count">{sheet.totalProblems} problems</span>
              </div>
              <div className="sheet-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DSATrackerSimple;

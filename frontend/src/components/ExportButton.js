import React, { useState } from 'react';
import axios from 'axios';
import './ExportButton.css';

const ExportButton = ({ exportType = 'applications' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const exportOptions = [
    { type: 'applications', label: '📋 Applications' },
    { type: 'bookmarks', label: '⭐ Bookmarks' },
    { type: 'resumes', label: '📄 Resumes' },
    { type: 'notes', label: '📝 Notes' },
    { type: 'all', label: '📊 All Data' },
  ];

  const handleExport = async (type) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in to export data');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/export/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowMenu(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="export-button-container">
      <button
        className="export-btn"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        title="Export data to CSV"
      >
        <span className="export-icon">📥</span>
        <span className="export-text">Export</span>
      </button>

      {showMenu && (
        <div className="export-menu">
          {exportOptions.map((option) => (
            <button
              key={option.type}
              className="export-option"
              onClick={() => handleExport(option.type)}
              disabled={isLoading}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;

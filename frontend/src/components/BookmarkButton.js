import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkButton.css';

const BookmarkButton = ({ jobData, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/bookmarks/check`,
          { jobUrl: jobData.jobUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [jobData.jobUrl]);

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in to bookmark jobs');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookmarks/toggle`,
        {
          company: jobData.company,
          position: jobData.position,
          jobUrl: jobData.jobUrl,
          logoUrl: jobData.logoUrl,
          salaryRange: jobData.salaryRange,
          location: jobData.location,
          jobDescription: jobData.jobDescription,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsBookmarked(!isBookmarked);
        if (onBookmarkChange) {
          onBookmarkChange(!isBookmarked);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
    >
      <span className="bookmark-icon">
        {isBookmarked ? '★' : '☆'}
      </span>
      <span className="bookmark-text">
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );
};

export default BookmarkButton;

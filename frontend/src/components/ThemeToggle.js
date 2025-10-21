import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get theme from localStorage first
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Fetch from server
    const fetchTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/preferences/theme`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTheme(response.data.theme);
          applyTheme(response.data.theme);
          localStorage.setItem('theme', response.data.theme);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, []);

  // Removed separate fetchTheme function

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;

    if (selectedTheme === 'dark') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }
  };

  const handleToggleTheme = async () => {
    try {
      setIsLoading(true);
      const newTheme = theme === 'light' ? 'dark' : 'light';
      const token = localStorage.getItem('token');

      if (token) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/preferences/theme`,
          { theme: newTheme },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTheme(newTheme);
          applyTheme(newTheme);
          localStorage.setItem('theme', newTheme);
        }
      } else {
        // Update locally without server
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggleTheme}
      disabled={isLoading}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ResourceLibrary.css';

// Mock resource data - constants outside component
const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    type: 'video',
    difficulty: 'Intermediate',
    duration: '2h 30m',
    source: 'YouTube',
    description: 'Master React Hooks with practical examples',
    link: 'https://youtube.com'
  },
  {
    id: '2',
    title: 'System Design Interview Prep',
    type: 'course',
    difficulty: 'Advanced',
    duration: '12h',
    source: 'Udemy',
    description: 'Complete guide to system design interviews',
    link: 'https://udemy.com'
  },
  {
    id: '3',
    title: 'LeetCode Array Problems',
    type: 'article',
    difficulty: 'Beginner',
    duration: '1h 15m',
    source: 'LeetCode',
    description: 'Comprehensive array problem solutions',
    link: 'https://leetcode.com'
  },
  {
    id: '4',
    title: 'JavaScript Design Patterns',
    type: 'book',
    difficulty: 'Intermediate',
    duration: '8h',
    source: 'Gumroad',
    description: 'Advanced JavaScript patterns explained',
    link: 'https://gumroad.com'
  },
  {
    id: '5',
    title: 'Tech Interview Podcast',
    type: 'podcast',
    difficulty: 'Intermediate',
    duration: '45m',
    source: 'Spotify',
    description: 'Weekly tech interview tips and tricks',
    link: 'https://spotify.com'
  }
];

const ResourceLibrary = ({ setNotification }) => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchResources = useCallback(() => {
    setLoading(true);
    try {
      // Filter mock data based on selected filters
      let filtered = MOCK_RESOURCES;

      if (selectedType !== 'all') {
        filtered = filtered.filter(r => r.type === selectedType);
      }

      if (selectedDifficulty !== 'all') {
        filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
      }

      if (searchQuery.trim()) {
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setResources(filtered);
    } catch (error) {
      console.error('Error filtering resources:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedDifficulty, searchQuery]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const types = [
    { id: 'all', label: 'All Resources' },
    { id: 'video', label: '🎥 Videos' },
    { id: 'article', label: '📰 Articles' },
    { id: 'book', label: '📚 Books' },
    { id: 'podcast', label: '🎙️ Podcasts' },
    { id: 'course', label: '🎓 Courses' }
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="resource-library">
      <h2>🎓 Resource Library</h2>
      <p className="subtitle">Curated learning resources from the best sources</p>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <h4>Type</h4>
          <div className="filter-buttons">
            {types.map(type => (
              <button
                key={type.id}
                className={`filter-btn ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Level</h4>
          <div className="filter-buttons">
            {difficulties.map(diff => (
              <button
                key={diff}
                className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff === 'all' ? 'All Levels' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="resources-section">
        <h3>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Learning Resources'}
          <span className="resource-count">({resources.length})</span>
        </h3>

        {loading ? (
          <div className="loading">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="no-resources">
            <p>No resources found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="resources-grid">
            {resources.map(resource => (
              <div key={resource.id} className="resource-card">
                {/* Header */}
                <div className="resource-header">
                  <div className="type-badge">{resource.type || 'Resource'}</div>
                  {resource.difficulty && (
                    <span className={`difficulty ${resource.difficulty.toLowerCase()}`}>
                      {resource.difficulty}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="resource-content">
                  <h4>{resource.title}</h4>
                  <p className="source">{resource.source || 'Unknown'}</p>
                  <p className="description">{resource.description}</p>
                </div>

                {/* Tags */}
                {resource.topics && Array.isArray(resource.topics) && (
                  <div className="topics">
                    {resource.topics.slice(0, 3).map(topic => (
                      <span key={topic} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="resource-footer">
                  <div className="meta">
                    {resource.duration && <span>{resource.duration}</span>}
                    {resource.rating && <span>⭐ {resource.rating}</span>}
                  </div>
                  <a href={resource.link || '#'} target="_blank" rel="noopener noreferrer" className="visit-btn">
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Learning Path */}
      <div className="learning-path-section">
        <h3>Recommended Learning Path for Backend Developer</h3>
        <div className="path-timeline">
          {[
            { phase: 'Fundamentals', topics: ['Databases', 'APIs', 'HTTP'] },
            { phase: 'Intermediate', topics: ['Caching', 'Message Queues', 'Auth'] },
            { phase: 'Advanced', topics: ['Microservices', 'DevOps', 'System Design'] }
          ].map((phase, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-marker">{idx + 1}</div>
              <div className="timeline-content">
                <h4>{phase.phase}</h4>
                <div className="topics">
                  {phase.topics.map(topic => (
                    <span key={topic} className="topic">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Sources */}
      <div className="sources-section">
        <h3>Popular Learning Sources</h3>
        <div className="sources-grid">
          <div className="source-card">
            <h4>📺 YouTube</h4>
            <p>Free video tutorials from experts</p>
            <button className="source-link">Explore →</button>
          </div>
          <div className="source-card">
            <h4>📖 Books</h4>
            <p>Deep dives into technical topics</p>
            <button className="source-link">Explore →</button>
          </div>
          <div className="source-card">
            <h4>🎓 Courses</h4>
            <p>Structured learning programs</p>
            <button className="source-link">Explore →</button>
          </div>
          <div className="source-card">
            <h4>🎙️ Podcasts</h4>
            <p>Learn while commuting</p>
            <button className="source-link">Explore →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SystemDesign.css';

// Hardcoded case studies
const CASE_STUDIES = [
  {
    id: 1,
    name: 'Design Instagram',
    icon: '📸',
    type: 'Social Media',
    description: 'Design a photo-sharing social media platform like Instagram',
    functionalRequirements: [
      'Users can upload and view photos',
      'Users can follow other users',
      'News feed generation',
      'Like and comment on photos',
      'Search functionality'
    ],
    nonFunctionalRequirements: [
      'High availability (99.99%)',
      'Low latency for feed generation',
      'Scalable to billions of users',
      'Eventually consistent'
    ],
    scalingConsiderations: [
      'CDN for image delivery',
      'Database sharding',
      'Caching layer for hot content',
      'Async processing for feed generation'
    ]
  },
  {
    id: 2,
    name: 'Design URL Shortener',
    icon: '🔗',
    type: 'Web Service',
    description: 'Design a URL shortening service like bit.ly or TinyURL',
    functionalRequirements: [
      'Generate short URL from long URL',
      'Redirect short URL to original URL',
      'Custom aliases',
      'Analytics and tracking',
      'URL expiration'
    ],
    nonFunctionalRequirements: [
      'High availability',
      'Low latency redirects',
      'Scalable',
      'URL should not be predictable'
    ],
    scalingConsiderations: [
      'Hash-based URL generation',
      'Database partitioning',
      'Caching popular URLs',
      'Rate limiting'
    ]
  },
  {
    id: 3,
    name: 'Design Uber',
    icon: '🚗',
    type: 'Real-time Service',
    description: 'Design a ride-sharing platform like Uber or Lyft',
    functionalRequirements: [
      'Riders can request rides',
      'Drivers can accept rides',
      'Real-time location tracking',
      'Fare calculation',
      'Payment processing',
      'Driver and rider matching'
    ],
    nonFunctionalRequirements: [
      'Low latency for matching',
      'High availability',
      'Real-time updates',
      'Accurate location data'
    ],
    scalingConsiderations: [
      'Geo-spatial indexing (QuadTree/S2)',
      'WebSocket for real-time communication',
      'Event-driven architecture',
      'Database partitioning by geography'
    ]
  },
  {
    id: 4,
    name: 'Design Netflix',
    icon: '🎬',
    type: 'Streaming Service',
    description: 'Design a video streaming platform like Netflix',
    functionalRequirements: [
      'Upload and encode videos',
      'Stream videos to users',
      'Search and recommendation',
      'User profiles and watch history',
      'Resume playback'
    ],
    nonFunctionalRequirements: [
      'High availability',
      'Low latency streaming',
      'Adaptive bitrate streaming',
      'Global CDN distribution'
    ],
    scalingConsiderations: [
      'CDN for content delivery',
      'Adaptive bitrate encoding',
      'Caching popular content',
      'Recommendation engine'
    ]
  },
  {
    id: 5,
    name: 'Design WhatsApp',
    icon: '💬',
    type: 'Messaging',
    description: 'Design a real-time messaging platform like WhatsApp',
    functionalRequirements: [
      'One-on-one messaging',
      'Group messaging',
      'Message delivery status',
      'Media sharing',
      'End-to-end encryption'
    ],
    nonFunctionalRequirements: [
      'Low latency message delivery',
      'High availability',
      'Message ordering',
      'Strong consistency for message delivery'
    ],
    scalingConsiderations: [
      'WebSocket connections',
      'Message queue architecture',
      'Database sharding by user',
      'Presence service'
    ]
  },
  {
    id: 6,
    name: 'Design Twitter',
    icon: '🐦',
    type: 'Social Media',
    description: 'Design a microblogging platform like Twitter',
    functionalRequirements: [
      'Post tweets',
      'Follow users',
      'Timeline generation',
      'Like and retweet',
      'Search tweets',
      'Trending topics'
    ],
    nonFunctionalRequirements: [
      'High availability',
      'Low latency for timeline',
      'Eventually consistent',
      'Handle traffic spikes'
    ],
    scalingConsiderations: [
      'Fan-out service for timeline',
      'Caching layer',
      'Database sharding',
      'Rate limiting'
    ]
  },
  {
    id: 7,
    name: 'Design YouTube',
    icon: '📺',
    type: 'Video Platform',
    description: 'Design a video sharing platform like YouTube',
    functionalRequirements: [
      'Upload videos',
      'Stream videos',
      'Search videos',
      'Comments and likes',
      'Subscriptions',
      'Recommendations'
    ],
    nonFunctionalRequirements: [
      'High availability',
      'Low latency streaming',
      'Scalable storage',
      'Efficient video encoding'
    ],
    scalingConsiderations: [
      'CDN for video delivery',
      'Video transcoding pipeline',
      'Thumbnail generation',
      'View count aggregation'
    ]
  },
  {
    id: 8,
    name: 'Design Amazon',
    icon: '🛒',
    type: 'E-commerce',
    description: 'Design an e-commerce platform like Amazon',
    functionalRequirements: [
      'Product catalog',
      'Shopping cart',
      'Order processing',
      'Payment system',
      'Inventory management',
      'Search and recommendations'
    ],
    nonFunctionalRequirements: [
      'High availability',
      'Strong consistency for orders',
      'Scalable',
      'Fast search'
    ],
    scalingConsiderations: [
      'Microservices architecture',
      'Database partitioning',
      'Elasticsearch for search',
      'Event-driven order processing'
    ]
  }
];

const SystemDesignMaster = ({ setNotification }) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseStudies = useCallback(async () => {
    setLoading(true);
    try {
      // Use hardcoded case studies
      setCaseStudies(CASE_STUDIES);
      if (CASE_STUDIES.length > 0) {
        selectCase(CASE_STUDIES[0]);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load case studies' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  const selectCase = (caseStudy) => {
    setSelectedCase(caseStudy);
    // Patterns can be added later if needed
    setPatterns([]);
  };

  return (
    <div className="system-design">
      <h2>🏗️ System Design Master</h2>
      <p className="subtitle">Learn and master system design with real-world case studies</p>

      {loading ? (
        <div className="loading">Loading case studies...</div>
      ) : (
        <div className="design-container">
          {/* Case Studies Sidebar */}
          <div className="cases-panel">
            <h3>Case Studies</h3>
            <div className="cases-list">
              {caseStudies.map(caseStudy => (
                <div
                  key={caseStudy.id}
                  className={`case-item ${selectedCase?.id === caseStudy.id ? 'active' : ''}`}
                  onClick={() => selectCase(caseStudy)}
                >
                  <div className="case-icon">{caseStudy.icon || '🎯'}</div>
                  <h4>{caseStudy.name}</h4>
                  <p className="case-type">{caseStudy.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {selectedCase ? (
            <div className="content-panel">
              {/* Header */}
              <div className="case-header">
                <h2>{selectedCase.name}</h2>
                <p className="case-description">{selectedCase.description}</p>
              </div>

              {/* Tabs */}
              <div className="design-tabs">
                <button className="tab-btn active">Overview</button>
                <button className="tab-btn">Architecture</button>
                <button className="tab-btn">Tradeoffs</button>
                <button className="tab-btn">Scaling</button>
              </div>

              {/* Requirements */}
              <div className="section">
                <h3>Requirements</h3>
                <div className="requirements-grid">
                  <div className="requirement-card">
                    <h4>Functional</h4>
                    <ul>
                      {(selectedCase.functionalRequirements || [
                        'User authentication',
                        'Content delivery',
                        'Real-time updates'
                      ]).map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="requirement-card">
                    <h4>Non-Functional</h4>
                    <ul>
                      {(selectedCase.nonFunctionalRequirements || [
                        'Scalability',
                        'High availability',
                        'Low latency'
                      ]).map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="section">
                <h3>System Architecture</h3>
                <div className="architecture">
                  <div className="arch-box client">
                    <h5>🖥️ Client Layer</h5>
                    <p>Web, Mobile, Desktop</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="arch-box api">
                    <h5>⚙️ API Layer</h5>
                    <p>REST, GraphQL</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="arch-box service">
                    <h5>🔧 Service Layer</h5>
                    <p>Microservices</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="arch-box data">
                    <h5>💾 Data Layer</h5>
                    <p>Databases, Cache</p>
                  </div>
                </div>
              </div>

              {/* Key Components */}
              <div className="section">
                <h3>Key Components</h3>
                <div className="components-grid">
                  {(selectedCase.components || [
                    { name: 'Load Balancer', description: 'Distribute traffic' },
                    { name: 'Cache', description: 'Improve performance' },
                    { name: 'Database', description: 'Data storage' },
                    { name: 'Message Queue', description: 'Async processing' }
                  ]).map((component, idx) => (
                    <div key={idx} className="component-card">
                      <h4>{component.name}</h4>
                      <p>{component.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Patterns */}
              {patterns.length > 0 && (
                <div className="section">
                  <h3>Design Patterns</h3>
                  <div className="patterns-grid">
                    {patterns.map((pattern, idx) => (
                      <div key={idx} className="pattern-card">
                        <h4>{pattern.name}</h4>
                        <p>{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Metrics */}
              <div className="section metrics">
                <h3>Estimated Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>Users</h4>
                    <p>{selectedCase.estimatedUsers || '1M+'}</p>
                  </div>
                  <div className="metric-card">
                    <h4>QPS</h4>
                    <p>{selectedCase.estimatedQPS || '100K'}</p>
                  </div>
                  <div className="metric-card">
                    <h4>Latency</h4>
                    <p>{selectedCase.estimatedLatency || '< 200ms'}</p>
                  </div>
                  <div className="metric-card">
                    <h4>Storage</h4>
                    <p>{selectedCase.estimatedStorage || '1TB'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn primary">💡 Study Deep Dive</button>
                <button className="btn secondary">🎨 Design Diagram</button>
                <button className="btn secondary">❓ Practice Questions</button>
              </div>
            </div>
          ) : (
            <div className="empty-content">
              <p>Select a case study to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemDesignMaster;

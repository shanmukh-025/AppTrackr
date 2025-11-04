import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/MentorNetwork.css';

const MentorNetwork = () => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [activeTab, setActiveTab] = useState('browse');
  const [mentors, setMentors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [filters, setFilters] = useState({
    expertise: '',
    availability: 'any',
    rating: 0,
    searchTerm: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [meetingForm, setMeetingForm] = useState({
    mentorId: '',
    date: '',
    time: '',
    topic: '',
    duration: '30'
  });

  // Expertise categories
  const expertiseCategories = [
    'Frontend Development',
    'Backend Development',
    'Full Stack',
    'Data Science',
    'DevOps',
    'Product Management',
    'UX/UI Design',
    'Machine Learning',
    'Cloud Architecture',
    'Interview Prep'
  ];

  // Fetch mentors
  const fetchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.expertise) params.append('expertise', filters.expertise);
      if (filters.availability !== 'any') params.append('availability', filters.availability);
      if (filters.rating > 0) params.append('minRating', filters.rating);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await axios.get(
        `${API_URL}/api/mentors/browse?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMentors(response.data.mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMessage({ type: 'error', text: 'Failed to load mentors' });
    } finally {
      setLoading(false);
    }
  }, [filters, token, API_URL]);

  const fetchConnections = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/mentors/connections`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConnections(response.data.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  }, [token, API_URL]);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/mentors/connection-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchMentors();
    if (activeTab === 'connections') fetchConnections();
    if (activeTab === 'requests') fetchRequests();
  }, [activeTab, fetchMentors, fetchConnections, fetchRequests]);

  const requestConnection = async (mentorId) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `${API_URL}/api/mentors/connection-request`,
        { mentorId, message: meetingForm.topic || 'I would like to connect with you' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Connection request sent!' });
      setShowProfile(false);
      setMeetingForm({ ...meetingForm, mentorId: '', topic: '' });
      setTimeout(() => fetchMentors(), 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send request' });
    }
  };

  const respondToRequest = async (requestId, accept) => {
    try {
      await axios.patch(
        `${API_URL}/api/mentors/connection-request/${requestId}`,
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ 
        type: 'success', 
        text: accept ? 'Connection accepted!' : 'Connection declined' 
      });
      fetchRequests();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to respond to request' });
    }
  };

  const scheduleMeeting = async (e) => {
    e.preventDefault();
    if (!meetingForm.mentorId || !meetingForm.date || !meetingForm.time) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/mentors/schedule-meeting`,
        {
          mentorId: meetingForm.mentorId,
          date: meetingForm.date,
          time: meetingForm.time,
          topic: meetingForm.topic,
          duration: parseInt(meetingForm.duration)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Meeting scheduled successfully!' });
      setMeetingForm({ mentorId: '', date: '', time: '', topic: '', duration: '30' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to schedule meeting' });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    fetchMentors();
  };

  const openMentorProfile = (mentor) => {
    setSelectedMentor(mentor);
    setShowProfile(true);
  };

  return (
    <div className="mentor-network">
      {message.text && (
        <div className={`mentor-message mentor-message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="mentor-header">
        <h1>🎓 Mentor Network</h1>
        <p>Connect with industry experts and grow your career</p>
      </div>

      <div className="mentor-tabs">
        <button 
          className={`mentor-tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Mentors
        </button>
        <button 
          className={`mentor-tab ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          My Connections ({connections.length})
        </button>
        <button 
          className={`mentor-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({requests.length})
        </button>
        <button 
          className={`mentor-tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
      </div>

      {/* Browse Mentors Tab */}
      {activeTab === 'browse' && (
        <div className="mentor-browse">
          <div className="mentor-filters">
            <div className="filter-group">
              <label>Expertise</label>
              <select 
                value={filters.expertise}
                onChange={(e) => handleFilterChange('expertise', e.target.value)}
              >
                <option value="">All Expertise</option>
                {expertiseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select 
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="any">Any Time</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Min Rating</label>
              <select 
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Search</label>
              <input 
                type="text"
                placeholder="Name, company..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>

            <button className="mentor-apply-btn" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>

          {loading ? (
            <div className="mentor-loading">Loading mentors...</div>
          ) : mentors.length === 0 ? (
            <div className="mentor-empty">
              <p>No mentors found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="mentor-grid">
              {mentors.map(mentor => (
                <div key={mentor.id} className="mentor-card">
                  <div className="mentor-avatar">
                    <img src={mentor.avatar || 'https://via.placeholder.com/100'} alt={mentor.name} />
                  </div>
                  
                  <div className="mentor-info">
                    <h3>{mentor.name}</h3>
                    <p className="mentor-title">{mentor.title}</p>
                    <p className="mentor-company">{mentor.company}</p>
                    
                    <div className="mentor-rating">
                      <span className="stars">{'⭐'.repeat(Math.round(mentor.rating))}</span>
                      <span className="rating-value">{mentor.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="review-count">({mentor.reviewCount || 0} reviews)</span>
                    </div>

                    <div className="mentor-expertise">
                      {mentor.expertise?.slice(0, 2).map((exp, idx) => (
                        <span key={idx} className="expertise-badge">{exp}</span>
                      ))}
                      {mentor.expertise?.length > 2 && (
                        <span className="expertise-badge">+{mentor.expertise.length - 2}</span>
                      )}
                    </div>

                    <p className="mentor-bio">{mentor.bio?.substring(0, 80)}...</p>

                    <div className="mentor-meta">
                      <span className="availability">🕐 {mentor.availability}</span>
                      <span className="mentees">👥 {mentor.menteeCount || 0} mentees</span>
                    </div>
                  </div>

                  <div className="mentor-actions">
                    <button 
                      className="mentor-view-btn"
                      onClick={() => openMentorProfile(mentor)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Connections Tab */}
      {activeTab === 'connections' && (
        <div className="mentor-connections">
          {connections.length === 0 ? (
            <div className="mentor-empty">
              <p>You haven't connected with any mentors yet.</p>
              <button 
                className="mentor-browse-link"
                onClick={() => setActiveTab('browse')}
              >
                Browse Mentors →
              </button>
            </div>
          ) : (
            <div className="connections-grid">
              {connections.map(conn => (
                <div key={conn.id} className="connection-card">
                  <div className="connection-header">
                    <img src={conn.mentor.avatar || 'https://via.placeholder.com/80'} alt={conn.mentor.name} />
                    <div className="connection-info">
                      <h3>{conn.mentor.name}</h3>
                      <p>{conn.mentor.title}</p>
                      <p className="connection-date">Connected {new Date(conn.connectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="connection-actions">
                    <button className="btn-message">💬 Message</button>
                    <button className="btn-schedule">📅 Schedule</button>
                    <button className="btn-disconnect">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="mentor-requests">
          {requests.length === 0 ? (
            <div className="mentor-empty">
              <p>No pending connection requests</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map(req => (
                <div key={req.id} className="request-item">
                  <div className="request-sender">
                    <img src={req.sender.avatar || 'https://via.placeholder.com/60'} alt={req.sender.name} />
                    <div className="sender-info">
                      <h4>{req.sender.name}</h4>
                      <p>{req.sender.title}</p>
                      <p className="request-message">{req.message}</p>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button 
                      className="btn-accept"
                      onClick={() => respondToRequest(req.id, true)}
                    >
                      ✓ Accept
                    </button>
                    <button 
                      className="btn-decline"
                      onClick={() => respondToRequest(req.id, false)}
                    >
                      ✕ Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="mentor-schedule">
          <h2>Schedule a Meeting</h2>
          
          {connections.length === 0 ? (
            <div className="mentor-empty">
              <p>You need to connect with a mentor first</p>
            </div>
          ) : (
            <form onSubmit={scheduleMeeting} className="schedule-form">
              <div className="form-group">
                <label>Select Mentor</label>
                <select 
                  value={meetingForm.mentorId}
                  onChange={(e) => setMeetingForm({ ...meetingForm, mentorId: e.target.value })}
                  required
                >
                  <option value="">Choose a mentor...</option>
                  {connections.map(conn => (
                    <option key={conn.id} value={conn.mentor.id}>
                      {conn.mentor.name} - {conn.mentor.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select 
                    value={meetingForm.duration}
                    onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Topic</label>
                <textarea 
                  placeholder="What would you like to discuss?"
                  value={meetingForm.topic}
                  onChange={(e) => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-schedule-submit">
                Schedule Meeting
              </button>
            </form>
          )}
        </div>
      )}

      {/* Mentor Profile Modal */}
      {showProfile && selectedMentor && (
        <div className="mentor-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="mentor-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfile(false)}>✕</button>

            <div className="profile-header">
              <img src={selectedMentor.avatar || 'https://via.placeholder.com/120'} alt={selectedMentor.name} />
              <div className="profile-info">
                <h2>{selectedMentor.name}</h2>
                <p className="profile-title">{selectedMentor.title}</p>
                <p className="profile-company">{selectedMentor.company}</p>
                <div className="profile-rating">
                  <span>{'⭐'.repeat(Math.round(selectedMentor.rating))}</span>
                  <span>{selectedMentor.rating?.toFixed(1) || 'N/A'} ({selectedMentor.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <section>
                <h3>About</h3>
                <p>{selectedMentor.bio}</p>
              </section>

              <section>
                <h3>Expertise</h3>
                <div className="expertise-list">
                  {selectedMentor.expertise?.map((exp, idx) => (
                    <span key={idx} className="expertise-tag">{exp}</span>
                  ))}
                </div>
              </section>

              <section>
                <h3>Experience</h3>
                <p>{selectedMentor.yearsExperience || 0}+ years in the industry</p>
                <p>{selectedMentor.menteeCount || 0} mentees coached</p>
              </section>

              <section>
                <h3>Availability</h3>
                <p>⏰ {selectedMentor.availability}</p>
                <p>📍 {selectedMentor.location}</p>
              </section>
            </div>

            <div className="profile-actions">
              <button 
                className="btn-primary"
                onClick={() => requestConnection(selectedMentor.id)}
              >
                Request Connection
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowProfile(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorNetwork;

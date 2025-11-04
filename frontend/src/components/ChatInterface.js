import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/ChatInterface.css';

const ChatInterface = ({ setNotification: externalSetNotification = null }) => {
  const { token, user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Create setNotification function with fallback
  const setNotification = useCallback((message) => {
    if (typeof externalSetNotification === 'function') {
      externalSetNotification(message);
    }
  }, [externalSetNotification]);
  
  const [activeTab, setActiveTab] = useState('conversations');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [onlineUsers, setOnlineUsers] = useState([]); // eslint-disable-line no-unused-vars
  const [showUserSearch, setShowUserSearch] = useState(false); // eslint-disable-line no-unused-vars
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showBuddyMatcher, setShowBuddyMatcher] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Mock buddy matching data
  const BUDDY_MATCHES = [
    {
      id: 'buddy_1',
      name: 'Alex Chen',
      role: 'Frontend Developer',
      experience: '3 years',
      expertise: ['React', 'TypeScript', 'Design Systems'],
      interests: ['DSA', 'Interview Prep'],
      matchPercentage: 95,
      avatar: '👨‍💻'
    },
    {
      id: 'buddy_2',
      name: 'Sarah Johnson',
      role: 'Full Stack Developer',
      experience: '5 years',
      expertise: ['Node.js', 'React', 'AWS'],
      interests: ['System Design', 'Mentoring'],
      matchPercentage: 87,
      avatar: '👩‍💻'
    },
    {
      id: 'buddy_3',
      name: 'James Wilson',
      role: 'Data Scientist',
      experience: '4 years',
      expertise: ['Python', 'Machine Learning', 'SQL'],
      interests: ['Career Growth', 'Algorithms'],
      matchPercentage: 78,
      avatar: '🧑‍🔬'
    }
  ];

  // Mock conversations
  const MOCK_CONVERSATIONS = [
    {
      id: 'conv_1',
      name: 'Interview Prep Group',
      type: 'group',
      avatar: '👥',
      lastMessage: 'Did you check the new DSA problems?',
      unread: 2,
      members: 4,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'conv_2',
      name: 'Alex Chen',
      type: 'direct',
      avatar: '👨‍💻',
      lastMessage: 'Sure, let\'s practice together!',
      unread: 0,
      online: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'conv_3',
      name: 'Salary Negotiation Tips',
      type: 'group',
      avatar: '💰',
      lastMessage: 'Always do your market research first',
      unread: 5,
      members: 12,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock messages
  const MOCK_MESSAGES = {
    conv_1: [
      { id: 1, sender: 'Alex', avatar: '👨‍💻', message: 'Hey everyone, how are the preparations going?', timestamp: new Date(Date.now() - 30 * 60 * 1000), isOwn: false },
      { id: 2, sender: 'You', avatar: '😊', message: 'Going well! Just finished dynamic programming problems.', timestamp: new Date(Date.now() - 25 * 60 * 1000), isOwn: true },
      { id: 3, sender: 'Sarah', avatar: '👩‍💻', message: 'Nice! Did you check the new system design case?', timestamp: new Date(Date.now() - 20 * 60 * 1000), isOwn: false },
      { id: 4, sender: 'You', avatar: '😊', message: 'Not yet, I\'ll check it out!', timestamp: new Date(Date.now() - 15 * 60 * 1000), isOwn: true },
      { id: 5, sender: 'Alex', avatar: '👨‍💻', message: 'Did you check the new DSA problems?', timestamp: new Date(Date.now() - 2 * 60 * 1000), isOwn: false }
    ],
    conv_2: [
      { id: 1, sender: 'Alex', avatar: '👨‍💻', message: 'Hey! How\'s your job search going?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isOwn: false },
      { id: 2, sender: 'You', avatar: '😊', message: 'Pretty good! Got 3 interviews lined up', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000), isOwn: true },
      { id: 3, sender: 'Alex', avatar: '👨‍💻', message: 'That\'s awesome! Congratulations!', timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), isOwn: false },
      { id: 4, sender: 'You', avatar: '😊', message: 'Thanks! Want to practice mock interviews?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isOwn: true },
      { id: 5, sender: 'Alex', avatar: '👨‍💻', message: 'Sure, let\'s practice together!', timestamp: new Date(Date.now() - 5 * 60 * 1000), isOwn: false }
    ]
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Use mock data as fallback
      setConversations(MOCK_CONVERSATIONS);
      setOnlineUsers(['Alex Chen', 'Sarah Johnson']);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations(MOCK_CONVERSATIONS);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Select conversation and fetch messages
  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(MOCK_MESSAGES[conversation.id] || []);
    setNewMessage('');
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageObj = {
        id: messages.length + 1,
        sender: user?.name || 'You',
        avatar: '😊',
        message: newMessage,
        timestamp: new Date(),
        isOwn: true
      };

      setMessages([...messages, messageObj]);
      setNewMessage('');

      // Simulate API call
      await axios.post(
        `${API_URL}/api/chat/${selectedConversation.id}/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification({ type: 'error', message: 'Failed to send message' });
    }
  };

  // Search users to start conversation
  const handleUserSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Mock search results
      const mockResults = [
        { id: 'user_1', name: 'Alex Chen', role: 'Frontend Developer', avatar: '👨‍💻', online: true },
        { id: 'user_2', name: 'Sarah Johnson', role: 'Full Stack Developer', avatar: '👩‍💻', online: true },
        { id: 'user_3', name: 'James Wilson', role: 'Data Scientist', avatar: '🧑‍🔬', online: false }
      ];
      setSearchResults(mockResults.filter(u => u.name.toLowerCase().includes(query.toLowerCase())));
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Start direct conversation
  const startConversation = (user) => {
    const newConv = {
      id: `conv_${Date.now()}`,
      name: user.name,
      type: 'direct',
      avatar: user.avatar,
      lastMessage: 'New conversation',
      unread: 0,
      online: user.online,
      createdAt: new Date()
    };
    setConversations([newConv, ...conversations]);
    selectConversation(newConv);
    setShowUserSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Request buddy match
  const requestBuddyMatch = async (buddy) => {
    try {
      await axios.post(
        `${API_URL}/api/chat/buddy-requests`,
        { buddyId: buddy.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({ type: 'success', message: `Request sent to ${buddy.name}!` });
      setShowBuddyMatcher(false);
    } catch (error) {
      console.error('Error requesting buddy:', error);
      setNotification({ type: 'error', message: 'Failed to send buddy request' });
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 Interview Buddy Chat</h2>
        <p>Connect with peers, share tips, and practice together</p>
      </div>

      <div className="chat-container">
        {/* Left Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="sidebar-tabs">
              <button
                className={`sidebar-tab ${activeTab === 'conversations' ? 'active' : ''}`}
                onClick={() => setActiveTab('conversations')}
              >
                💬 Chats ({conversations.length})
              </button>
              <button
                className={`sidebar-tab ${activeTab === 'buddies' ? 'active' : ''}`}
                onClick={() => setActiveTab('buddies')}
              >
                👥 Buddies
              </button>
            </div>
          </div>

          <div className="chat-sidebar-content">
            {activeTab === 'conversations' && (
              <>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="🔍 Search or start chat..."
                    value={searchQuery}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    onFocus={() => setShowUserSearch(true)}
                  />
                  {searchQuery && searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map(user => (
                        <div
                          key={user.id}
                          className="search-result-item"
                          onClick={() => startConversation(user)}
                        >
                          <span className="user-avatar">{user.avatar}</span>
                          <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-role">{user.role}</div>
                          </div>
                          {user.online && <span className="online-badge">●</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="conversations-list">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                      onClick={() => selectConversation(conv)}
                    >
                      <div className="conv-avatar-container">
                        <span className="conv-avatar">{conv.avatar}</span>
                        {conv.online && <span className="online-indicator">●</span>}
                      </div>
                      <div className="conv-info">
                        <div className="conv-name">{conv.name}</div>
                        <div className="conv-preview">{conv.lastMessage}</div>
                        {conv.type === 'group' && (
                          <div className="conv-members">{conv.members} members</div>
                        )}
                      </div>
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'buddies' && (
              <>
                <button
                  className="find-buddy-btn"
                  onClick={() => setShowBuddyMatcher(!showBuddyMatcher)}
                >
                  🎯 Find Study Buddies
                </button>

                {showBuddyMatcher && (
                  <div className="buddy-matcher-container">
                    <h3>Recommended Matches</h3>
                    <div className="buddy-list">
                      {BUDDY_MATCHES.map(buddy => (
                        <div key={buddy.id} className="buddy-card">
                          <div className="buddy-header">
                            <span className="buddy-avatar">{buddy.avatar}</span>
                            <div className="buddy-name-role">
                              <div className="buddy-name">{buddy.name}</div>
                              <div className="buddy-role">{buddy.role}</div>
                            </div>
                            <span className="match-score">{buddy.matchPercentage}%</span>
                          </div>
                          <div className="buddy-details">
                            <div className="buddy-exp">📅 {buddy.experience}</div>
                            <div className="buddy-expertise">
                              {buddy.expertise.map((exp, idx) => (
                                <span key={idx} className="expertise-tag">{exp}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            className="connect-buddy-btn"
                            onClick={() => requestBuddyMatch(buddy)}
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-message-header">
                <div className="chat-header-info">
                  <span className="chat-avatar">{selectedConversation.avatar}</span>
                  <div>
                    <h3>{selectedConversation.name}</h3>
                    {selectedConversation.type === 'group' && (
                      <p className="group-info">{selectedConversation.members} members</p>
                    )}
                    {selectedConversation.type === 'direct' && selectedConversation.online && (
                      <p className="online-status">🟢 Online now</p>
                    )}
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn" title="Video Call">📹</button>
                  <button className="action-btn" title="Voice Call">☎️</button>
                  <button className="action-btn" title="Info">ℹ️</button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.isOwn ? 'own' : 'other'}`}>
                    {!msg.isOwn && <span className="message-avatar">{msg.avatar}</span>}
                    <div className="message-content">
                      {!msg.isOwn && <span className="message-sender">{msg.sender}</span>}
                      <div className="message-text">{msg.message}</div>
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <div className="input-controls">
                  <button className="input-btn" title="Attach file">📎</button>
                  <button className="input-btn" title="Emoji">😊</button>
                </div>
                <input
                  type="text"
                  className="message-input"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  📤 Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <div className="no-conv-icon">💭</div>
              <h3>No Conversation Selected</h3>
              <p>Select a conversation to start chatting or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

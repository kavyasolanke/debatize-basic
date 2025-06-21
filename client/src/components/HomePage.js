import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import LanguageSelector from './LanguageSelector';
import './HomePage.css';
import './AnonymousLogin.css';

const HomePage = ({ currentUser, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [existingUsers, setExistingUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Generate random username suggestions
  const generateUsernameSuggestions = () => {
    const adjectives = [
      'Anonymous', 'Mysterious', 'Curious', 'Thoughtful', 'Wise', 'Creative', 
      'Bold', 'Quiet', 'Friendly', 'Serious', 'Clever', 'Brave', 'Calm', 
      'Eager', 'Gentle', 'Honest', 'Kind', 'Lively', 'Patient', 'Smart'
    ];
    const nouns = [
      'Debater', 'Thinker', 'Observer', 'Speaker', 'Listener', 'Analyst', 
      'Critic', 'Advocate', 'Scholar', 'Citizen', 'Philosopher', 'Sage', 
      'Mentor', 'Student', 'Teacher', 'Explorer', 'Visionary', 'Pioneer'
    ];
    
    const suggestions = [];
    for (let i = 0; i < 3; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const number = Math.floor(Math.random() * 999) + 1;
      suggestions.push(`${adjective}${noun}${number}`);
    }
    return suggestions;
  };

  const [suggestions] = useState(generateUsernameSuggestions());

  useEffect(() => {
    // Load existing users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('debatize_users') || '[]');
    setExistingUsers(savedUsers);
  }, []);

  const validateUsername = (username) => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return 'Username can only contain letters and numbers';
    }
    if (existingUsers.some(user => user.username === username)) {
      return 'Username already taken';
    }
    return null;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setError('');
    
    if (value && isNewUser) {
      const validationError = validateUsername(value);
      if (validationError) {
        setError(validationError);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUsername(suggestion);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (isNewUser) {
      const validationError = validateUsername(username);
      if (validationError) {
        setError(validationError);
        return;
      }
    } else {
      // Check if user exists
      const userExists = existingUsers.some(user => user.username === username);
      if (!userExists) {
        setError('User not found. Please check your username or create a new account.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let userData;
      
      if (isNewUser) {
        // Create new user
        userData = {
          username: username,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          stats: {
            totalMessages: 0,
            totalVotes: 0,
            upvotes: 0,
            downvotes: 0,
            receivedUpvotes: 0,
            receivedDownvotes: 0,
            reputationScore: 0,
            preferredSide: 'Neutral'
          },
          badges: [],
          profile: {
            displayName: username,
            bio: '',
            avatar: '',
            preferences: {
              notifications: true,
              publicProfile: true,
              showStats: true
            }
          }
        };

        // Save to localStorage
        const updatedUsers = [...existingUsers, userData];
        localStorage.setItem('debatize_users', JSON.stringify(updatedUsers));
      } else {
        // Load existing user
        userData = existingUsers.find(user => user.username === username);
      }

      // Save current user session
      localStorage.setItem('debatize_current_user', JSON.stringify(userData));
      
      onLogin(userData);
      setShowLogin(false);
      setUsername('');
      setError('');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsNewUser(!isNewUser);
    setUsername('');
    setError('');
  };

  const features = [
    {
      title: "Structured Debates",
      description: "Transform chaotic discussions into organized, evidence-based debates with clear arguments and counterpoints.",
      icon: "🎯",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Decision Intelligence",
      description: "Leverage AI-powered analysis to extract insights and identify the strongest arguments from every discussion.",
      icon: "🧠",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Verified Voices",
      description: "Connect with experts and verified contributors who bring credibility and depth to every debate topic.",
      icon: "✅",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: "Real Impact",
      description: "Drive awareness, clarity, and actionable insights that lead to better decisions and meaningful change.",
      icon: "🚀",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  const stats = [
    { number: '40%', label: 'Better Decisions' },
    { number: '10K+', label: 'Structured Debates' },
    { number: '95%', label: 'Evidence-Based' },
    { number: '24/7', label: 'AI-Powered Analysis' }
  ];

  return (
    <div className="home-page">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img 
              src="/logo1.png" 
              alt="Debatize Logo" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text if logo fails
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1 className="logo-text-fallback" style={{ display: 'none' }}>Debatize</h1>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <button 
              className="language-btn"
              onClick={() => setShowLanguageSelector(true)}
              title="Change Language"
            >
              🌐
            </button>
            {currentUser ? (
              <div className="user-nav">
                <span className="welcome-text">Welcome, {currentUser.username}!</span>
                <button 
                  className="cta-button"
                  onClick={() => navigate('/topics')}
                >
                  Start Debating
                </button>
                <button 
                  className="logout-button"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="cta-button"
                onClick={() => setShowLogin(true)}
              >
                Get Started
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Where Logic 
              <span className="highlight"> Meets Impact</span>
            </h1>
            <p className="hero-subtitle">
              Transform chaotic discussions into structured, evidence-based debates. 
              Drive awareness, clarity, and actionable insights through meaningful dialogue.
            </p>
            {currentUser ? (
              <div className="hero-buttons">
                <button 
                  className="primary-button"
                  onClick={() => navigate('/topics')}
                >
                  <span className="button-text">Explore Topics</span>
                  <span className="button-icon">→</span>
                </button>
                <button className="secondary-button">
                  <span className="button-text">Learn More</span>
                  <span className="button-icon">↓</span>
                </button>
              </div>
            ) : (
              <div className="hero-buttons">
                <button 
                  className="primary-button"
                  onClick={() => setShowLogin(true)}
                >
                  <span className="button-text">Join the Debate</span>
                  <span className="button-icon">→</span>
                </button>
                <button className="secondary-button">
                  <span className="button-text">Learn More</span>
                  <span className="button-icon">↓</span>
                </button>
              </div>
            )}
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <span className="user-avatar">👤</span>
                <span className="user-name">VerifiedAnalyst</span>
              </div>
              <div className="card-content">
                "Evidence shows that structured debates lead to 40% better decision outcomes..."
              </div>
              <div className="card-actions">
                <span className="vote-count">+23</span>
                <span className="vote-buttons">⬆️ ⬇️</span>
              </div>
            </div>
            <div className="floating-card delayed">
              <div className="card-header">
                <span className="user-avatar">👤</span>
                <span className="user-name">PolicyExpert</span>
              </div>
              <div className="card-content">
                "This platform enables data-driven policy discussions with real impact..."
              </div>
              <div className="card-actions">
                <span className="vote-count">+15</span>
                <span className="vote-buttons">⬆️ ⬇️</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-card">
              <div className="login-header">
                <button className="close-btn" onClick={() => setShowLogin(false)}>
                  ×
                </button>
                <h2>Welcome to Debatize</h2>
                <p>Choose your anonymous identity</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">
                    {isNewUser ? 'Choose Your Username' : 'Enter Your Username'}
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder={isNewUser ? "Enter username..." : "Enter existing username..."}
                    className={error ? 'error' : ''}
                    disabled={isLoading}
                    autoFocus
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>

                {isNewUser && (
                  <div className="suggestions-section">
                    <p>Or choose from suggestions:</p>
                    <div className="suggestions-grid">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={isLoading || !username.trim() || (isNewUser && error)}
                >
                  {isLoading ? (
                    <span className="loading">Loading...</span>
                  ) : (
                    <span>{isNewUser ? 'Create Account' : 'Login'}</span>
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p>
                  {isNewUser ? 'Already have an account?' : "Don't have an account?"}
                  <button 
                    type="button" 
                    className="switch-mode-btn"
                    onClick={handleSwitchMode}
                    disabled={isLoading}
                  >
                    {isNewUser ? 'Login' : 'Create New Account'}
                  </button>
                </p>
              </div>

              {existingUsers.length > 0 && (
                <div className="recent-users">
                  <h4>Recent Users</h4>
                  <div className="recent-users-list">
                    {existingUsers.slice(-5).map((user, index) => (
                      <div key={index} className="recent-user-item">
                        <span className="user-avatar">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                        <span className="user-info">
                          <span className="user-name">{user.username}</span>
                          <span className="user-stats">
                            {user.stats?.totalMessages || 0} messages • 
                            {user.stats?.reputationScore || 0} reputation
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why Choose Debatize?</h2>
          <p>Experience the future of online discussions</p>
        </div>
        
        <div className="features-showcase">
          <div className="feature-display">
            <div className="feature-visual">
              <div 
                className="feature-icon"
                style={{ background: features[currentFeature].gradient }}
              >
                {features[currentFeature].icon}
              </div>
            </div>
            <div className="feature-content">
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].description}</p>
            </div>
          </div>
          
          <div className="feature-dots">
            {features.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentFeature ? 'active' : ''}`}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Discussions?</h2>
          <p>Join thousands of users making better decisions through structured, evidence-based debates</p>
          <button 
            className="cta-button-large"
            onClick={() => navigate('/topics')}
          >
            Start Structured Debating
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="/logo1.png" 
                alt="Debatize Logo" 
                className="footer-logo-image"
                onError={(e) => {
                  // Fallback to text if logo fails
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="footer-logo-text-fallback" style={{ display: 'none' }}>Debatize</h3>
            </div>
            <p>Transforming discussions into structured, evidence-based debates that drive better decisions and real impact.</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Structured Debates</li>
              <li>Decision Intelligence</li>
              <li>Verified Voices</li>
              <li>AI-Powered Analysis</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Community Guidelines</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <button className="social-button">Twitter</button>
              <button className="social-button">LinkedIn</button>
              <button className="social-button">GitHub</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Debatize. All rights reserved.</p>
        </div>
      </footer>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <LanguageSelector 
          onClose={() => setShowLanguageSelector(false)}
        />
      )}
    </div>
  );
};

export default HomePage; 
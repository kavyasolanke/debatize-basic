import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../services/TranslationService';
import './HomePage.css';
import './AnonymousLogin.css';

const HomePage = ({ currentUser, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Generate random username suggestions
  const generateUsernameSuggestions = () => {
    const prefixes = ['Debate', 'Logic', 'Thinker', 'Analyst', 'Scholar', 'Expert', 'Voice', 'Mind'];
    const suffixes = ['Pro', 'Elite', 'Master', 'Guru', 'Wizard', 'Genius', 'Sage', 'Oracle'];
    const suggestions = [];
    
    for (let i = 0; i < 8; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const number = Math.floor(Math.random() * 999) + 1;
      suggestions.push(`${prefix}${suffix}${number}`);
    }
    
    return suggestions;
  };

  const suggestions = generateUsernameSuggestions();

  useEffect(() => {
    // Load existing users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('debatize_users') || '[]');
    setExistingUsers(savedUsers);
  }, []);

  const validateUsername = (username) => {
    if (username.length < 3) {
      return t('validation.usernameMinLength');
    }
    if (username.length > 20) {
      return t('validation.usernameMaxLength');
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return t('validation.usernameAlphanumeric');
    }
    if (existingUsers.some(user => user.username === username)) {
      return t('validation.usernameTaken');
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
      setError(t('validation.enterUsername'));
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
        setError(t('validation.userNotFound'));
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
      setError(t('validation.generalError'));
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
      title: t('features.structuredDebates.title'),
      description: t('features.structuredDebates.description'),
      icon: "🎯",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: t('features.decisionIntelligence.title'),
      description: t('features.decisionIntelligence.description'),
      icon: "🧠",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: t('features.verifiedVoices.title'),
      description: t('features.verifiedVoices.description'),
      icon: "✅",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: t('features.realImpact.title'),
      description: t('features.realImpact.description'),
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
    { number: '40%', label: t('stats.betterDecisions') },
    { number: '10K+', label: t('stats.structuredDebates') },
    { number: '95%', label: t('stats.evidenceBased') },
    { number: '24/7', label: t('stats.aiPoweredAnalysis') }
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
            <a href="#features" className="nav-link">{t('nav.features')}</a>
            <a href="#about" className="nav-link">{t('nav.about')}</a>
            <button 
              className="language-btn"
              onClick={() => setShowLanguageSelector(true)}
              title={t('nav.changeLanguage')}
            >
              🌐
            </button>
            {currentUser ? (
              <div className="user-nav">
                <span className="welcome-text">{t('nav.welcome', { username: currentUser.username })}</span>
                <button 
                  className="cta-button"
                  onClick={() => navigate('/topics')}
                >
                  {t('nav.startDebating')}
                </button>
                <button 
                  className="logout-button"
                  onClick={onLogout}
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <button 
                className="cta-button"
                onClick={() => setShowLogin(true)}
              >
                {t('nav.getStarted')}
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
              {t('hero.title.prefix')} 
              <span className="highlight">{t('hero.title.highlight')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            {currentUser ? (
              <div className="hero-buttons">
                <button 
                  className="primary-button"
                  onClick={() => navigate('/topics')}
                >
                  <span className="button-text">{t('hero.exploreTopics')}</span>
                  <span className="button-icon">→</span>
                </button>
                <button className="secondary-button">
                  <span className="button-text">{t('hero.learnMore')}</span>
                  <span className="button-icon">↓</span>
                </button>
              </div>
            ) : (
              <div className="hero-buttons">
                <button 
                  className="primary-button"
                  onClick={() => setShowLogin(true)}
                >
                  <span className="button-text">{t('hero.joinDebate')}</span>
                  <span className="button-icon">→</span>
                </button>
                <button className="secondary-button">
                  <span className="button-text">{t('hero.learnMore')}</span>
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
          <span>{t('hero.scrollToExplore')}</span>
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
                <h2>{t('login.welcome')}</h2>
                <p>{t('login.chooseIdentity')}</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">
                    {isNewUser ? t('login.chooseUsername') : t('login.enterUsername')}
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder={isNewUser ? t('login.usernamePlaceholder') : t('login.existingUsernamePlaceholder')}
                    className={error ? 'error' : ''}
                    disabled={isLoading}
                    autoFocus
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>

                {isNewUser && (
                  <div className="suggestions-section">
                    <p>{t('login.orChooseSuggestions')}</p>
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
                    <span className="loading">{t('login.loading')}</span>
                  ) : (
                    <span>{isNewUser ? t('login.createAccount') : t('login.login')}</span>
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p>
                  {isNewUser ? t('login.alreadyHaveAccount') : t('login.dontHaveAccount')}
                </p>
                <button 
                  type="button" 
                  className="switch-mode-btn"
                  onClick={handleSwitchMode}
                  disabled={isLoading}
                >
                  {isNewUser ? t('login.switchToLogin') : t('login.switchToSignup')}
                </button>
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
          <h2>{t('features.title')}</h2>
          <p>{t('features.subtitle')}</p>
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
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <button 
            className="cta-button-large"
            onClick={() => navigate('/topics')}
          >
            {t('cta.button')}
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
            <p>{t('footer.about.description')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.features')}</h4>
            <ul>
              <li>Structured Debates</li>
              <li>AI Moderation</li>
              <li>Real-time Analytics</li>
              <li>Anonymous Discussions</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.resources')}</h4>
            <ul>
              <li>Debate Guidelines</li>
              <li>Community Rules</li>
              <li>Help Center</li>
              <li>API Documentation</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.support')}</h4>
            <ul>
              <li>{t('footer.contact')}</li>
              <li>Report Issues</li>
              <li>Feature Requests</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
          <p>{t('footer.copyright')}</p>
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
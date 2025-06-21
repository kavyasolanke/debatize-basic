import React, { useState, useEffect } from 'react';
import './AnonymousLogin.css';

const AnonymousLogin = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [existingUsers, setExistingUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
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

  return (
    <div className="anonymous-login-container">
      <div className="login-card">
        <div className="login-header">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2>Welcome to Debatize</h2>
          <p>Choose your anonymous identity</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
  );
};

export default AnonymousLogin; 
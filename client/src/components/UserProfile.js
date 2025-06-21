import React, { useState, useEffect, useMemo } from 'react';
import './UserProfile.css';

const UserProfile = ({ 
  userId, 
  messages = [], 
  users = [], 
  currentUserId,
  onClose,
  onUpdateProfile 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    avatar: '',
    preferences: {
      notifications: true,
      publicProfile: true,
      showStats: true
    }
  });

  // Get user data
  const userData = useMemo(() => {
    const user = users.find(u => u.id === userId || u.username === userId);
    if (!user) return null;

    // Calculate user statistics
    const userMessages = messages.filter(msg => 
      (msg.user === userId || msg.username === userId)
    );

    const totalMessages = userMessages.length;
    const totalVotes = userMessages.reduce((sum, msg) => {
      return sum + (msg.votes ? Object.keys(msg.votes).length : 0);
    }, 0);

    let upvotes = 0;
    let downvotes = 0;
    let receivedUpvotes = 0;
    let receivedDownvotes = 0;

    userMessages.forEach(msg => {
      if (msg.votes) {
        Object.values(msg.votes).forEach(vote => {
          if (vote === 'upvote') {
            upvotes++;
            receivedUpvotes++;
          } else if (vote === 'downvote') {
            downvotes++;
            receivedDownvotes++;
          }
        });
      }
    });

    // Calculate reputation score
    const reputationScore = (receivedUpvotes * 10) - (receivedDownvotes * 5) + (totalMessages * 2);

    // Determine badges
    const badges = [];
    if (totalMessages >= 100) badges.push({ name: 'Prolific Debater', icon: '💬', color: '#667eea' });
    if (receivedUpvotes >= 50) badges.push({ name: 'Respected Voice', icon: '👑', color: '#fbbf24' });
    if (reputationScore >= 500) badges.push({ name: 'Debate Master', icon: '🏆', color: '#10b981' });
    if (userMessages.some(msg => msg.votes && Object.keys(msg.votes).length >= 10)) {
      badges.push({ name: 'Viral Commenter', icon: '🔥', color: '#ef4444' });
    }
    if (userMessages.length >= 10 && receivedUpvotes >= 20) {
      badges.push({ name: 'Quality Contributor', icon: '⭐', color: '#8b5cf6' });
    }

    // Activity timeline
    const activityTimeline = userMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(msg => ({
        type: 'message',
        content: msg.text,
        timestamp: msg.timestamp,
        votes: msg.votes ? Object.keys(msg.votes).length : 0,
        side: msg.side
      }));

    // Debate participation by topic
    const topicParticipation = {};
    userMessages.forEach(msg => {
      const topic = msg.room ? msg.room.split('/')[0] : 'Unknown';
      topicParticipation[topic] = (topicParticipation[topic] || 0) + 1;
    });

    // Side preference
    const sideCounts = {};
    userMessages.forEach(msg => {
      if (msg.side) {
        sideCounts[msg.side] = (sideCounts[msg.side] || 0) + 1;
      }
    });

    const preferredSide = Object.keys(sideCounts).length > 0 
      ? Object.entries(sideCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'Neutral';

    return {
      ...user,
      stats: {
        totalMessages,
        totalVotes,
        upvotes,
        downvotes,
        receivedUpvotes,
        receivedDownvotes,
        reputationScore,
        preferredSide
      },
      badges,
      activityTimeline,
      topicParticipation
    };
  }, [userId, messages, users]);

  useEffect(() => {
    if (userData) {
      setProfileData(prev => ({
        ...prev,
        displayName: userData.displayName || userData.username || userData.id,
        bio: userData.bio || '',
        avatar: userData.avatar || ''
      }));
    }
  }, [userData]);

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
    setIsEditing(false);
  };

  const getReputationLevel = (score) => {
    if (score >= 1000) return { level: 'Legendary', color: '#fbbf24', icon: '👑' };
    if (score >= 500) return { level: 'Master', color: '#10b981', icon: '🏆' };
    if (score >= 200) return { level: 'Expert', color: '#667eea', icon: '⭐' };
    if (score >= 100) return { level: 'Veteran', color: '#8b5cf6', icon: '🎯' };
    if (score >= 50) return { level: 'Regular', color: '#6b7280', icon: '💬' };
    return { level: 'Newcomer', color: '#9ca3af', icon: '🌱' };
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userData) {
    return (
      <div className="user-profile-overlay">
        <div className="user-profile-modal">
          <div className="profile-header">
            <h2>User Not Found</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="profile-content">
            <p>This user could not be found or has left the debate.</p>
          </div>
        </div>
      </div>
    );
  }

  const reputationLevel = getReputationLevel(userData.stats.reputationScore);
  const isOwnProfile = userId === currentUserId;

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-modal">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header-section">
            <div className="profile-avatar">
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name-section">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="profile-name-input"
                    maxLength={30}
                  />
                ) : (
                  <h3 className="profile-name">{profileData.displayName}</h3>
                )}
                {isOwnProfile && (
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              
              <div className="reputation-badge">
                <span className="reputation-icon">{reputationLevel.icon}</span>
                <span className="reputation-level" style={{ color: reputationLevel.color }}>
                  {reputationLevel.level}
                </span>
                <span className="reputation-score">({userData.stats.reputationScore} pts)</span>
              </div>

              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="profile-bio-input"
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                />
              ) : (
                <p className="profile-bio">{profileData.bio || 'No bio available.'}</p>
              )}

              {isEditing && (
                <button className="save-profile-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Badges Section */}
          {userData.badges.length > 0 && (
            <div className="badges-section">
              <h4>Achievements</h4>
              <div className="badges-grid">
                {userData.badges.map((badge, index) => (
                  <div key={index} className="badge-item" style={{ borderColor: badge.color }}>
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="stats-section">
            <h4>Debate Statistics</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-value">{userData.stats.totalMessages}</div>
                  <div className="stat-label">Messages</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👍</div>
                <div className="stat-content">
                  <div className="stat-value">{userData.stats.receivedUpvotes}</div>
                  <div className="stat-label">Upvotes Received</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👎</div>
                <div className="stat-content">
                  <div className="stat-value">{userData.stats.receivedDownvotes}</div>
                  <div className="stat-label">Downvotes Received</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚖️</div>
                <div className="stat-content">
                  <div className="stat-value">{userData.stats.preferredSide}</div>
                  <div className="stat-label">Preferred Side</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Participation */}
          {Object.keys(userData.topicParticipation).length > 0 && (
            <div className="topics-section">
              <h4>Topic Participation</h4>
              <div className="topics-list">
                {Object.entries(userData.topicParticipation)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, count]) => (
                    <div key={topic} className="topic-item">
                      <span className="topic-name">{topic}</span>
                      <span className="topic-count">{count} messages</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {userData.activityTimeline.length > 0 && (
            <div className="activity-section">
              <h4>Recent Activity</h4>
              <div className="activity-timeline">
                {userData.activityTimeline.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">💬</div>
                    <div className="activity-content">
                      <div className="activity-text">{activity.content}</div>
                      <div className="activity-meta">
                        {formatDate(activity.timestamp)} • {activity.votes} votes
                        {activity.side && <span className={`side-tag ${activity.side.toLowerCase()}`}>{activity.side}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
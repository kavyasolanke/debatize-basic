import React, { useState, useEffect } from 'react';
import './GamificationSystem.css';

const GamificationSystem = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  userStats, 
  onUpdateStats,
  messages,
  users 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState({
    username: currentUser?.username || 'Anonymous',
    level: 1,
    experience: 0,
    totalPoints: 0,
    badges: [],
    achievements: [],
    debateStats: {
      messagesSent: 0,
      upvotesReceived: 0,
      downvotesReceived: 0,
      debatesWon: 0,
      debatesParticipated: 0,
      consecutiveDays: 0,
      longestMessage: 0,
      mostUpvotedMessage: 0
    },
    reputation: 100,
    streak: 0,
    rank: 'Novice'
  });

  // Badge definitions
  const badges = {
    firstMessage: {
      id: 'firstMessage',
      name: 'First Steps',
      description: 'Sent your first message',
      icon: '💬',
      color: '#4CAF50',
      requirement: 1,
      type: 'messagesSent'
    },
    debateMaster: {
      id: 'debateMaster',
      name: 'Debate Master',
      description: 'Participated in 10 debates',
      icon: '🏆',
      color: '#FF9800',
      requirement: 10,
      type: 'debatesParticipated'
    },
    upvoteChampion: {
      id: 'upvoteChampion',
      name: 'Upvote Champion',
      description: 'Received 50 upvotes',
      icon: '⬆️',
      color: '#2196F3',
      requirement: 50,
      type: 'upvotesReceived'
    },
    streakMaster: {
      id: 'streakMaster',
      name: 'Streak Master',
      description: '7-day activity streak',
      icon: '🔥',
      color: '#F44336',
      requirement: 7,
      type: 'consecutiveDays'
    },
    eloquentSpeaker: {
      id: 'eloquentSpeaker',
      name: 'Eloquent Speaker',
      description: 'Sent a message with 200+ characters',
      icon: '📝',
      color: '#9C27B0',
      requirement: 200,
      type: 'longestMessage'
    },
    communityLeader: {
      id: 'communityLeader',
      name: 'Community Leader',
      description: 'Reached reputation score of 500',
      icon: '👑',
      color: '#FFD700',
      requirement: 500,
      type: 'reputation'
    },
    factChecker: {
      id: 'factChecker',
      name: 'Fact Checker',
      description: 'Used evidence in 5 debates',
      icon: '🔍',
      color: '#607D8B',
      requirement: 5,
      type: 'evidenceUsed'
    },
    peacemaker: {
      id: 'peacemaker',
      name: 'Peacemaker',
      description: 'Maintained positive sentiment in 10 messages',
      icon: '🕊️',
      color: '#4CAF50',
      requirement: 10,
      type: 'positiveMessages'
    }
  };

  // Achievement definitions
  const achievements = {
    debateExplorer: {
      id: 'debateExplorer',
      name: 'Debate Explorer',
      description: 'Participate in debates across 5 different topics',
      icon: '🗺️',
      points: 100,
      category: 'exploration'
    },
    speedDebater: {
      id: 'speedDebater',
      name: 'Speed Debater',
      description: 'Send 10 messages in a single debate session',
      icon: '⚡',
      points: 50,
      category: 'activity'
    },
    qualityContributor: {
      id: 'qualityContributor',
      name: 'Quality Contributor',
      description: 'Receive 10 upvotes on a single message',
      icon: '⭐',
      points: 200,
      category: 'quality'
    },
    weekendWarrior: {
      id: 'weekendWarrior',
      name: 'Weekend Warrior',
      description: 'Participate in debates on 3 consecutive weekends',
      icon: '📅',
      points: 150,
      category: 'consistency'
    },
    nightOwl: {
      id: 'nightOwl',
      name: 'Night Owl',
      description: 'Debate actively between 10 PM and 2 AM',
      icon: '🦉',
      points: 75,
      category: 'timing'
    },
    earlyBird: {
      id: 'earlyBird',
      name: 'Early Bird',
      description: 'Start debates before 8 AM',
      icon: '🌅',
      points: 75,
      category: 'timing'
    },
    topicMaster: {
      id: 'topicMaster',
      name: 'Topic Master',
      description: 'Win debates in 3 different categories',
      icon: '🎯',
      points: 300,
      category: 'expertise'
    },
    socialButterfly: {
      id: 'socialButterfly',
      name: 'Social Butterfly',
      description: 'Interact with 20 different users',
      icon: '🦋',
      points: 100,
      category: 'social'
    }
  };

  // Level progression system
  const getLevelInfo = (experience) => {
    const level = Math.floor(experience / 100) + 1;
    const expInCurrentLevel = experience % 100;
    const expNeededForNextLevel = 100 - expInCurrentLevel;
    const rank = getRank(level);
    
    return {
      level,
      experience: expInCurrentLevel,
      expNeeded: expNeededForNextLevel,
      rank,
      progress: (expInCurrentLevel / 100) * 100
    };
  };

  const getRank = (level) => {
    if (level >= 50) return 'Legend';
    if (level >= 40) return 'Master';
    if (level >= 30) return 'Expert';
    if (level >= 20) return 'Veteran';
    if (level >= 10) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    return 'Novice';
  };

  const getRankColor = (rank) => {
    const colors = {
      'Novice': '#6c757d',
      'Intermediate': '#17a2b8',
      'Advanced': '#28a745',
      'Veteran': '#ffc107',
      'Expert': '#fd7e14',
      'Master': '#dc3545',
      'Legend': '#6f42c1'
    };
    return colors[rank] || '#6c757d';
  };

  // Calculate user stats from messages
  const calculateUserStats = () => {
    const userMessages = messages.filter(msg => msg.user === currentUser?.username);
    const stats = {
      messagesSent: userMessages.length,
      upvotesReceived: userMessages.reduce((sum, msg) => sum + (msg.upvotes || 0), 0),
      downvotesReceived: userMessages.reduce((sum, msg) => sum + (msg.downvotes || 0), 0),
      longestMessage: Math.max(...userMessages.map(msg => msg.text?.length || 0), 0),
      debatesParticipated: new Set(userMessages.map(msg => msg.room)).size,
      consecutiveDays: calculateConsecutiveDays(userMessages),
      evidenceUsed: userMessages.filter(msg => 
        /because|since|evidence|study|research|data|statistics/i.test(msg.text)
      ).length,
      positiveMessages: userMessages.filter(msg => 
        !/stupid|idiot|dumb|hate|kill/i.test(msg.text?.toLowerCase() || '')
      ).length
    };

    return stats;
  };

  const calculateConsecutiveDays = (userMessages) => {
    const dates = [...new Set(userMessages.map(msg => 
      new Date(msg.timestamp).toDateString()
    ))].sort();
    
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    
    return maxStreak;
  };

  // Check for new badges and achievements
  const checkProgress = () => {
    const stats = calculateUserStats();
    const newBadges = [];
    const newAchievements = [];
    let totalPoints = userProfile.totalPoints;

    // Check badges
    Object.values(badges).forEach(badge => {
      if (!userProfile.badges.includes(badge.id)) {
        const statValue = stats[badge.type] || 0;
        if (statValue >= badge.requirement) {
          newBadges.push(badge);
          totalPoints += 25; // Badge points
        }
      }
    });

    // Check achievements
    Object.values(achievements).forEach(achievement => {
      if (!userProfile.achievements.includes(achievement.id)) {
        // Simple achievement checking logic
        if (achievement.id === 'debateExplorer' && stats.debatesParticipated >= 5) {
          newAchievements.push(achievement);
          totalPoints += achievement.points;
        }
        if (achievement.id === 'speedDebater' && stats.messagesSent >= 10) {
          newAchievements.push(achievement);
          totalPoints += achievement.points;
        }
        if (achievement.id === 'qualityContributor' && stats.upvotesReceived >= 10) {
          newAchievements.push(achievement);
          totalPoints += achievement.points;
        }
      }
    });

    return { newBadges, newAchievements, totalPoints };
  };

  // Update user profile
  useEffect(() => {
    if (currentUser && messages.length > 0) {
      const stats = calculateUserStats();
      const progress = checkProgress();
      
      const updatedProfile = {
        ...userProfile,
        debateStats: stats,
        totalPoints: progress.totalPoints,
        badges: [...userProfile.badges, ...progress.newBadges.map(b => b.id)],
        achievements: [...userProfile.achievements, ...progress.newAchievements.map(a => a.id)],
        experience: progress.totalPoints,
        reputation: Math.max(100, progress.totalPoints / 10)
      };

      setUserProfile(updatedProfile);
      
      // Notify parent component of updates
      if (onUpdateStats) {
        onUpdateStats(updatedProfile);
      }
    }
  }, [messages, currentUser]);

  const levelInfo = getLevelInfo(userProfile.experience);

  if (!isOpen) return null;

  return (
    <div className="gamification-overlay" onClick={onClose}>
      <div className="gamification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gamification-header">
          <button className="close-gamification-btn" onClick={onClose}>
            ×
          </button>
          <h2>🎮 Gamification Center</h2>
          <p>Track your progress and earn rewards</p>
        </div>

        <div className="gamification-content">
          {/* User Profile Overview */}
          <div className="user-profile-overview">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-icon">👤</span>
                <div className="level-badge" style={{ backgroundColor: getRankColor(levelInfo.rank) }}>
                  {levelInfo.level}
                </div>
              </div>
              <div className="profile-info">
                <h3>{userProfile.username}</h3>
                <div className="rank-info" style={{ color: getRankColor(levelInfo.rank) }}>
                  {levelInfo.rank}
                </div>
                <div className="experience-bar">
                  <div className="exp-progress" style={{ width: `${levelInfo.progress}%` }}></div>
                  <span className="exp-text">
                    {levelInfo.experience}/{levelInfo.experience + levelInfo.expNeeded} XP
                  </span>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{userProfile.totalPoints}</span>
                  <span className="stat-label">Total Points</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userProfile.badges.length}</span>
                  <span className="stat-label">Badges</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userProfile.achievements.length}</span>
                  <span className="stat-label">Achievements</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="gamification-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
              onClick={() => setActiveTab('badges')}
            >
              🏅 Badges
            </button>
            <button 
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              🏆 Achievements
            </button>
            <button 
              className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              📈 Leaderboard
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-details">
                      <span className="stat-number">{userProfile.debateStats.messagesSent}</span>
                      <span className="stat-label">Messages Sent</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⬆️</div>
                    <div className="stat-details">
                      <span className="stat-number">{userProfile.debateStats.upvotesReceived}</span>
                      <span className="stat-label">Upvotes Received</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-details">
                      <span className="stat-number">{userProfile.debateStats.debatesParticipated}</span>
                      <span className="stat-label">Debates Joined</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-details">
                      <span className="stat-number">{userProfile.debateStats.consecutiveDays}</span>
                      <span className="stat-label">Day Streak</span>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h4>Recent Activity</h4>
                  <div className="activity-list">
                    {userProfile.badges.slice(-3).map(badgeId => {
                      const badge = badges[badgeId];
                      return badge ? (
                        <div key={badgeId} className="activity-item">
                          <span className="activity-icon">{badge.icon}</span>
                          <span className="activity-text">Earned "{badge.name}" badge</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="badges-tab">
                <div className="badges-grid">
                  {Object.values(badges).map(badge => {
                    const isEarned = userProfile.badges.includes(badge.id);
                    const progress = userProfile.debateStats[badge.type] || 0;
                    const progressPercent = Math.min((progress / badge.requirement) * 100, 100);
                    
                    return (
                      <div key={badge.id} className={`badge-card ${isEarned ? 'earned' : ''}`}>
                        <div className="badge-icon" style={{ backgroundColor: badge.color }}>
                          {badge.icon}
                        </div>
                        <div className="badge-info">
                          <h4>{badge.name}</h4>
                          <p>{badge.description}</p>
                          <div className="badge-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${progressPercent}%`, backgroundColor: badge.color }}
                              ></div>
                            </div>
                            <span className="progress-text">
                              {progress}/{badge.requirement}
                            </span>
                          </div>
                        </div>
                        {isEarned && <div className="earned-check">✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="achievements-tab">
                <div className="achievements-grid">
                  {Object.values(achievements).map(achievement => {
                    const isEarned = userProfile.achievements.includes(achievement.id);
                    
                    return (
                      <div key={achievement.id} className={`achievement-card ${isEarned ? 'earned' : ''}`}>
                        <div className="achievement-icon">
                          {achievement.icon}
                        </div>
                        <div className="achievement-info">
                          <h4>{achievement.name}</h4>
                          <p>{achievement.description}</p>
                          <div className="achievement-points">
                            <span className="points-value">+{achievement.points} pts</span>
                            <span className="points-label">Points</span>
                          </div>
                        </div>
                        {isEarned && <div className="earned-check">✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="leaderboard-tab">
                <div className="leaderboard-filters">
                  <button className="filter-btn active">All Time</button>
                  <button className="filter-btn">This Week</button>
                  <button className="filter-btn">This Month</button>
                </div>
                
                <div className="leaderboard-list">
                  {users.slice(0, 10).map((user, index) => (
                    <div key={user.id} className={`leaderboard-item ${user.username === currentUser?.username ? 'current-user' : ''}`}>
                      <div className="rank-position">
                        {index + 1}
                      </div>
                      <div className="user-info">
                        <span className="username">{user.username}</span>
                        <span className="user-rank">{getRank(Math.floor((userProfile.totalPoints || 0) / 100) + 1)}</span>
                      </div>
                      <div className="user-score">
                        {userProfile.totalPoints || 0} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem; 
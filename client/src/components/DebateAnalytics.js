import React, { useState, useEffect, useMemo } from 'react';
import './DebateAnalytics.css';

const DebateAnalytics = ({ messages = [], users = [], currentUserId }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [showCharts, setShowCharts] = useState(true);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now.getTime() - (timeRanges[timeRange] || timeRanges['24h']);
    const filteredMessages = messages.filter(msg => 
      new Date(msg.timestamp).getTime() >= cutoff
    );

    // Basic stats
    const totalMessages = filteredMessages.length;
    const totalUsers = users.length;
    const totalVotes = filteredMessages.reduce((sum, msg) => {
      return sum + (msg.votes ? Object.keys(msg.votes).length : 0);
    }, 0);

    // User activity
    const userActivity = {};
    filteredMessages.forEach(msg => {
      const user = msg.user || msg.username;
      if (!userActivity[user]) {
        userActivity[user] = { messages: 0, upvotes: 0, downvotes: 0 };
      }
      userActivity[user].messages++;
      
      if (msg.votes) {
        Object.values(msg.votes).forEach(vote => {
          if (vote === 'upvote') userActivity[user].upvotes++;
          else if (vote === 'downvote') userActivity[user].downvotes++;
        });
      }
    });

    // Side distribution
    const sideDistribution = {};
    filteredMessages.forEach(msg => {
      const side = msg.side || 'Unknown';
      sideDistribution[side] = (sideDistribution[side] || 0) + 1;
    });

    // Vote distribution
    const voteDistribution = { upvotes: 0, downvotes: 0, neutral: 0 };
    filteredMessages.forEach(msg => {
      if (msg.votes) {
        Object.values(msg.votes).forEach(vote => {
          if (vote === 'upvote') voteDistribution.upvotes++;
          else if (vote === 'downvote') voteDistribution.downvotes++;
          else voteDistribution.neutral++;
        });
      }
    });

    // Message length analysis
    const messageLengths = filteredMessages.map(msg => (msg.text || '').length);
    const avgMessageLength = messageLengths.length > 0 
      ? Math.round(messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length)
      : 0;

    // Time-based activity
    const hourlyActivity = new Array(24).fill(0);
    filteredMessages.forEach(msg => {
      const hour = new Date(msg.timestamp).getHours();
      hourlyActivity[hour]++;
    });

    // Top messages by votes
    const topMessages = filteredMessages
      .filter(msg => msg.votes)
      .map(msg => ({
        ...msg,
        voteCount: Object.values(msg.votes).reduce((sum, vote) => {
          return sum + (vote === 'upvote' ? 1 : vote === 'downvote' ? -1 : 0);
        }, 0)
      }))
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 5);

    // Controversial messages (high upvotes and downvotes)
    const controversialMessages = filteredMessages
      .filter(msg => msg.votes)
      .map(msg => {
        const upvotes = Object.values(msg.votes).filter(v => v === 'upvote').length;
        const downvotes = Object.values(msg.votes).filter(v => v === 'downvote').length;
        return {
          ...msg,
          upvotes,
          downvotes,
          controversy: Math.min(upvotes, downvotes)
        };
      })
      .filter(msg => msg.controversy >= 2)
      .sort((a, b) => b.controversy - a.controversy)
      .slice(0, 5);

    return {
      totalMessages,
      totalUsers,
      totalVotes,
      userActivity,
      sideDistribution,
      voteDistribution,
      avgMessageLength,
      hourlyActivity,
      topMessages,
      controversialMessages,
      engagementRate: totalUsers > 0 ? Math.round((totalMessages / totalUsers) * 100) / 100 : 0
    };
  }, [messages, users, timeRange]);

  const formatTimeRange = (range) => {
    const labels = {
      '1h': 'Last Hour',
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days'
    };
    return labels[range] || range;
  };

  const getTopUsers = () => {
    return Object.entries(analytics.userActivity)
      .map(([user, data]) => ({ user, ...data }))
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 5);
  };

  const renderBarChart = (data, title, color = '#667eea') => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="chart-container">
        <h4>{title}</h4>
        <div className="bar-chart">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bar-item">
              <div className="bar-label">{key}</div>
              <div className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${(value / maxValue) * 100}%`,
                    backgroundColor: color
                  }}
                />
                <span className="bar-value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHourlyChart = () => {
    const maxValue = Math.max(...analytics.hourlyActivity);
    
    return (
      <div className="chart-container">
        <h4>Activity by Hour</h4>
        <div className="hourly-chart">
          {analytics.hourlyActivity.map((count, hour) => (
            <div key={hour} className="hourly-bar">
              <div 
                className="hourly-bar-fill"
                style={{ 
                  height: `${(count / maxValue) * 100}%`,
                  backgroundColor: count > 0 ? '#667eea' : '#e1e5e9'
                }}
              />
              <span className="hour-label">{hour}:00</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="debate-analytics">
      <div className="analytics-header">
        <h2>Debate Analytics</h2>
        <div className="analytics-controls">
          <select 
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            className="toggle-charts-btn"
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? '📊' : '📈'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.totalMessages}</div>
            <div className="metric-label">Total Messages</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.totalUsers}</div>
            <div className="metric-label">Active Users</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👍</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.totalVotes}</div>
            <div className="metric-label">Total Votes</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.engagementRate}</div>
            <div className="metric-label">Avg Messages/User</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.avgMessageLength}</div>
            <div className="metric-label">Avg Message Length</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⚖️</div>
          <div className="metric-content">
            <div className="metric-value">
              {analytics.voteDistribution.upvotes + analytics.voteDistribution.downvotes}
            </div>
            <div className="metric-label">Vote Participation</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="charts-section">
          <div className="charts-grid">
            {/* Side Distribution */}
            {renderBarChart(analytics.sideDistribution, 'Messages by Side', '#667eea')}
            
            {/* Vote Distribution */}
            {renderBarChart(analytics.voteDistribution, 'Vote Distribution', '#10b981')}
            
            {/* Hourly Activity */}
            {renderHourlyChart()}
          </div>
        </div>
      )}

      {/* Top Users */}
      <div className="top-users-section">
        <h3>Most Active Users</h3>
        <div className="top-users-list">
          {getTopUsers().map((user, index) => (
            <div key={user.user} className="top-user-item">
              <div className="user-rank">#{index + 1}</div>
              <div className="user-info">
                <div className="user-name">{user.user}</div>
                <div className="user-stats">
                  {user.messages} messages • {user.upvotes} upvotes • {user.downvotes} downvotes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Messages */}
      <div className="top-messages-section">
        <h3>Top Messages by Votes</h3>
        <div className="top-messages-list">
          {analytics.topMessages.map((msg, index) => (
            <div key={msg.id} className="top-message-item">
              <div className="message-rank">#{index + 1}</div>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <div className="message-meta">
                  by {msg.user} • {msg.voteCount} votes • {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controversial Messages */}
      {analytics.controversialMessages.length > 0 && (
        <div className="controversial-messages-section">
          <h3>Most Controversial Messages</h3>
          <div className="controversial-messages-list">
            {analytics.controversialMessages.map((msg, index) => (
              <div key={msg.id} className="controversial-message-item">
                <div className="message-rank">#{index + 1}</div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-meta">
                    by {msg.user} • {msg.upvotes} upvotes, {msg.downvotes} downvotes • {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateAnalytics; 
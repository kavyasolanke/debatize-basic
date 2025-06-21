class UserService {
  constructor() {
    this.storageKey = 'debatize_users';
    this.currentUserKey = 'debatize_current_user';
  }

  // Get all users from localStorage
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.currentUserKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Save current user to localStorage
  setCurrentUser(user) {
    try {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving current user:', error);
      return false;
    }
  }

  // Create new user
  createUser(username) {
    const users = this.getAllUsers();
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      throw new Error('Username already exists');
    }

    const newUser = {
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

    // Add to users list
    users.push(newUser);
    this.saveAllUsers(users);

    // Set as current user
    this.setCurrentUser(newUser);

    return newUser;
  }

  // Update user data
  updateUser(userId, updates) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId || user.username === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Deep merge updates
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      stats: {
        ...users[userIndex].stats,
        ...(updates.stats || {})
      },
      profile: {
        ...users[userIndex].profile,
        ...(updates.profile || {})
      }
    };

    this.saveAllUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && (currentUser.id === userId || currentUser.username === userId)) {
      this.setCurrentUser(users[userIndex]);
    }

    return users[userIndex];
  }

  // Update user statistics based on message activity
  updateUserStats(userId, messageData) {
    const user = this.getUserById(userId);
    if (!user) return;

    const updates = {
      stats: {
        ...user.stats,
        totalMessages: user.stats.totalMessages + 1
      }
    };

    // Update side preference if provided
    if (messageData.side) {
      const sideCounts = user.stats.sideCounts || {};
      sideCounts[messageData.side] = (sideCounts[messageData.side] || 0) + 1;
      updates.stats.sideCounts = sideCounts;
      
      // Update preferred side
      const preferredSide = Object.entries(sideCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      updates.stats.preferredSide = preferredSide;
    }

    this.updateUser(userId, updates);
  }

  // Update user reputation based on votes
  updateUserReputation(userId, voteData) {
    const user = this.getUserById(userId);
    if (!user) return;

    const updates = {
      stats: {
        ...user.stats,
        totalVotes: user.stats.totalVotes + 1
      }
    };

    // Update vote counts
    if (voteData.type === 'upvote') {
      updates.stats.upvotes = user.stats.upvotes + 1;
      updates.stats.receivedUpvotes = user.stats.receivedUpvotes + 1;
    } else if (voteData.type === 'downvote') {
      updates.stats.downvotes = user.stats.downvotes + 1;
      updates.stats.receivedDownvotes = user.stats.receivedDownvotes + 1;
    }

    // Recalculate reputation score
    const newReputationScore = 
      (updates.stats.receivedUpvotes * 10) - 
      (updates.stats.receivedDownvotes * 5) + 
      (updates.stats.totalMessages * 2);
    
    updates.stats.reputationScore = newReputationScore;

    // Check for new badges
    const newBadges = this.checkForNewBadges(updates.stats, user.badges);
    if (newBadges.length > 0) {
      updates.badges = [...user.badges, ...newBadges];
    }

    this.updateUser(userId, updates);
  }

  // Check for new badges based on updated stats
  checkForNewBadges(stats, currentBadges) {
    const newBadges = [];
    const badgeNames = currentBadges.map(badge => badge.name);

    if (stats.totalMessages >= 100 && !badgeNames.includes('Prolific Debater')) {
      newBadges.push({ name: 'Prolific Debater', icon: '💬', color: '#667eea' });
    }

    if (stats.receivedUpvotes >= 50 && !badgeNames.includes('Respected Voice')) {
      newBadges.push({ name: 'Respected Voice', icon: '👑', color: '#fbbf24' });
    }

    if (stats.reputationScore >= 500 && !badgeNames.includes('Debate Master')) {
      newBadges.push({ name: 'Debate Master', icon: '🏆', color: '#10b981' });
    }

    if (stats.reputationScore >= 1000 && !badgeNames.includes('Legendary Debater')) {
      newBadges.push({ name: 'Legendary Debater', icon: '🌟', color: '#f59e0b' });
    }

    return newBadges;
  }

  // Get user by ID or username
  getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId || user.username === userId);
  }

  // Save all users to localStorage
  saveAllUsers(users) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  // Clear current user session
  logout() {
    try {
      localStorage.removeItem(this.currentUserKey);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  // Get user statistics for analytics
  getUserStats(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    return {
      ...user.stats,
      badges: user.badges,
      profile: user.profile,
      createdAt: user.createdAt
    };
  }

  // Get leaderboard data
  getLeaderboard() {
    const users = this.getAllUsers();
    return users
      .sort((a, b) => b.stats.reputationScore - a.stats.reputationScore)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        reputationScore: user.stats.reputationScore,
        totalMessages: user.stats.totalMessages,
        badges: user.badges
      }));
  }

  // Export user data (for backup)
  exportUserData(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    return {
      ...user,
      exportDate: new Date().toISOString()
    };
  }

  // Import user data (for restore)
  importUserData(userData) {
    try {
      const users = this.getAllUsers();
      const existingIndex = users.findIndex(user => user.id === userData.id);
      
      if (existingIndex !== -1) {
        users[existingIndex] = userData;
      } else {
        users.push(userData);
      }

      this.saveAllUsers(users);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

export default new UserService(); 
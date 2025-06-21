import React, { useState, useEffect, useRef } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ 
  messages = [], 
  onFilterChange, 
  placeholder = "Search messages...",
  showFilters = true,
  showSort = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    side: 'all',
    timeRange: 'all',
    voteFilter: 'all',
    userFilter: 'all'
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const searchInputRef = useRef(null);

  // Get unique users from messages
  const uniqueUsers = [...new Set(messages.map(msg => msg.user || msg.username))].filter(Boolean);

  // Get unique sides from messages
  const uniqueSides = [...new Set(messages.map(msg => msg.side).filter(Boolean))];

  useEffect(() => {
    const filtered = filterMessages();
    setFilteredResults(filtered);
    onFilterChange(filtered);
  }, [searchTerm, selectedFilters, sortBy, sortOrder, messages]);

  const filterMessages = () => {
    let filtered = [...messages];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        (msg.text && msg.text.toLowerCase().includes(term)) ||
        (msg.user && msg.user.toLowerCase().includes(term)) ||
        (msg.username && msg.username.toLowerCase().includes(term))
      );
    }

    // Side filter
    if (selectedFilters.side !== 'all') {
      filtered = filtered.filter(msg => msg.side === selectedFilters.side);
    }

    // Time range filter
    if (selectedFilters.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      if (timeRanges[selectedFilters.timeRange]) {
        const cutoff = now.getTime() - timeRanges[selectedFilters.timeRange];
        filtered = filtered.filter(msg => {
          const msgTime = new Date(msg.timestamp).getTime();
          return msgTime >= cutoff;
        });
      }
    }

    // Vote filter
    if (selectedFilters.voteFilter !== 'all') {
      filtered = filtered.filter(msg => {
        if (!msg.votes) return false;
        const voteCounts = getVoteCounts(msg);
        
        switch (selectedFilters.voteFilter) {
          case 'highly-upvoted':
            return voteCounts.total >= 5;
          case 'controversial':
            return voteCounts.upvotes >= 3 && voteCounts.downvotes >= 3;
          case 'downvoted':
            return voteCounts.total <= -3;
          case 'no-votes':
            return voteCounts.total === 0;
          default:
            return true;
        }
      });
    }

    // User filter
    if (selectedFilters.userFilter !== 'all') {
      filtered = filtered.filter(msg => 
        (msg.user && msg.user === selectedFilters.userFilter) ||
        (msg.username && msg.username === selectedFilters.userFilter)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'votes':
          aValue = getVoteCounts(a).total;
          bValue = getVoteCounts(b).total;
          break;
        case 'user':
          aValue = (a.user || a.username || '').toLowerCase();
          bValue = (b.user || b.username || '').toLowerCase();
          break;
        case 'length':
          aValue = (a.text || '').length;
          bValue = (b.text || '').length;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getVoteCounts = (message) => {
    if (!message.votes) return { upvotes: 0, downvotes: 0, total: 0 };
    
    let upvotes = 0;
    let downvotes = 0;
    
    Object.values(message.votes).forEach(vote => {
      if (vote === 'upvote') upvotes++;
      else if (vote === 'downvote') downvotes++;
    });
    
    return {
      upvotes,
      downvotes,
      total: upvotes - downvotes
    };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilters({
      side: 'all',
      timeRange: 'all',
      voteFilter: 'all',
      userFilter: 'all'
    });
    setSortBy('timestamp');
    setSortOrder('desc');
    searchInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        {showFilters && (
          <button 
            className="advanced-filters-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title="Advanced filters"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">
          {filteredResults.length} of {messages.length} messages
        </span>
        {(searchTerm || Object.values(selectedFilters).some(v => v !== 'all')) && (
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            {/* Side Filter */}
            <div className="filter-group">
              <label className="filter-label">Side:</label>
              <select 
                className="filter-select"
                value={selectedFilters.side}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, side: e.target.value }))}
              >
                <option value="all">All Sides</option>
                {uniqueSides.map(side => (
                  <option key={side} value={side}>{side}</option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Time:</label>
              <select 
                className="filter-select"
                value={selectedFilters.timeRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* Vote Filter */}
            <div className="filter-group">
              <label className="filter-label">Votes:</label>
              <select 
                className="filter-select"
                value={selectedFilters.voteFilter}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, voteFilter: e.target.value }))}
              >
                <option value="all">All Votes</option>
                <option value="highly-upvoted">Highly Upvoted (+5)</option>
                <option value="controversial">Controversial</option>
                <option value="downvoted">Downvoted (-3)</option>
                <option value="no-votes">No Votes</option>
              </select>
            </div>

            {/* User Filter */}
            <div className="filter-group">
              <label className="filter-label">User:</label>
              <select 
                className="filter-select"
                value={selectedFilters.userFilter}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, userFilter: e.target.value }))}
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {showSort && (
        <div className="sort-options">
          <div className="sort-group">
            <label className="sort-label">Sort by:</label>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="timestamp">Time</option>
              <option value="votes">Votes</option>
              <option value="user">User</option>
              <option value="length">Length</option>
            </select>
          </div>
          
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 
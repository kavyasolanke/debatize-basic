import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DebateTopics.css';

const DebateTopics = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced topic categories with metadata
  const categories = [
    { id: 'all', name: 'All Topics', icon: '🌐', color: '#667eea' },
    { id: 'politics', name: 'Politics', icon: '🏛️', color: '#e74c3c', description: 'Government, policies, and political discourse' },
    { id: 'technology', name: 'Technology', icon: '💻', color: '#3498db', description: 'Tech trends, AI, and digital innovation' },
    { id: 'environment', name: 'Environment', icon: '🌱', color: '#27ae60', description: 'Climate change and sustainability' },
    { id: 'education', name: 'Education', icon: '📚', color: '#f39c12', description: 'Learning systems and academic policies' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#e67e22', description: 'Medical systems and public health' },
    { id: 'economy', name: 'Economy', icon: '💰', color: '#2ecc71', description: 'Economic policies and financial systems' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#9b59b6', description: 'Scientific discoveries and research' },
    { id: 'culture', name: 'Culture', icon: '🎭', color: '#e91e63', description: 'Arts, traditions, and societal norms' },
    { id: 'social', name: 'Social Issues', icon: '🤝', color: '#00bcd4', description: 'Social justice and community matters' }
  ];

  // Difficulty levels
  const difficultyLevels = [
    { id: 'all', name: 'All Levels', icon: '📊' },
    { id: 'beginner', name: 'Beginner', icon: '🌱', color: '#27ae60' },
    { id: 'intermediate', name: 'Intermediate', icon: '🌿', color: '#f39c12' },
    { id: 'advanced', name: 'Advanced', icon: '🌳', color: '#e74c3c' },
    { id: 'expert', name: 'Expert', icon: '🏆', color: '#9b59b6' }
  ];

  // Popular tags
  const popularTags = [
    'AI & Machine Learning', 'Climate Action', 'Digital Privacy', 'Mental Health',
    'Renewable Energy', 'Social Media', 'Vaccination', 'Universal Basic Income',
    'Space Exploration', 'Genetic Engineering', 'Cryptocurrency', 'Remote Work',
    'Electric Vehicles', 'Nuclear Energy', 'Gun Control', 'Immigration',
    'Minimum Wage', 'Free Speech', 'Data Protection', 'Sustainable Living'
  ];

  // Enhanced topics with categories, difficulty, tags, and engagement metrics
  const topics = [
    {
      id: 'politics',
      title: 'Politics',
      description: 'Current political events, policies, and governance discussions',
      category: 'politics',
      difficulty: 'intermediate',
      tags: ['Government', 'Policy', 'Democracy', 'Elections'],
      participants: 156,
      messages: 1247,
      trending: true,
      lastActivity: '2 hours ago',
      subtopics: [
        { id: 'elections', name: 'Election Systems', participants: 89, messages: 456 },
        { id: 'policy', name: 'Policy Making', participants: 67, messages: 234 },
        { id: 'governance', name: 'Governance Models', participants: 45, messages: 189 },
        { id: 'international', name: 'International Relations', participants: 78, messages: 368 }
      ]
    },
    {
      id: 'technology',
      title: 'Technology',
      description: 'Latest tech trends, innovations, and their societal impact',
      category: 'technology',
      difficulty: 'intermediate',
      tags: ['Innovation', 'AI', 'Digital Transformation', 'Cybersecurity'],
      participants: 234,
      messages: 1892,
      trending: true,
      lastActivity: '1 hour ago',
      subtopics: [
        { id: 'ai', name: 'Artificial Intelligence', participants: 145, messages: 892 },
        { id: 'privacy', name: 'Digital Privacy', participants: 98, messages: 567 },
        { id: 'automation', name: 'Automation & Jobs', participants: 76, messages: 234 },
        { id: 'social-media', name: 'Social Media Impact', participants: 112, messages: 445 }
      ]
    },
    {
      id: 'environment',
      title: 'Environment',
      description: 'Climate change, conservation, and sustainable practices',
      category: 'environment',
      difficulty: 'beginner',
      tags: ['Climate Change', 'Sustainability', 'Conservation', 'Renewable Energy'],
      participants: 189,
      messages: 1456,
      trending: true,
      lastActivity: '3 hours ago',
      subtopics: [
        { id: 'climate', name: 'Climate Action', participants: 134, messages: 678 },
        { id: 'renewable', name: 'Renewable Energy', participants: 87, messages: 345 },
        { id: 'conservation', name: 'Wildlife Conservation', participants: 56, messages: 234 },
        { id: 'sustainable', name: 'Sustainable Living', participants: 92, messages: 199 }
      ]
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Educational policies, teaching methods, and learning systems',
      category: 'education',
      difficulty: 'intermediate',
      tags: ['Learning', 'Teaching', 'Policy', 'Technology'],
      participants: 123,
      messages: 987,
      trending: false,
      lastActivity: '5 hours ago',
      subtopics: [
        { id: 'online', name: 'Online Learning', participants: 89, messages: 456 },
        { id: 'curriculum', name: 'Curriculum Design', participants: 45, messages: 234 },
        { id: 'assessment', name: 'Assessment Methods', participants: 67, messages: 189 },
        { id: 'accessibility', name: 'Educational Access', participants: 78, messages: 108 }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Healthcare systems, medical advancements, and public health',
      category: 'healthcare',
      difficulty: 'advanced',
      tags: ['Public Health', 'Medical Ethics', 'Healthcare Policy', 'Mental Health'],
      participants: 167,
      messages: 1234,
      trending: false,
      lastActivity: '4 hours ago',
      subtopics: [
        { id: 'public-health', name: 'Public Health Policy', participants: 98, messages: 567 },
        { id: 'mental-health', name: 'Mental Health Awareness', participants: 134, messages: 789 },
        { id: 'medical-ethics', name: 'Medical Ethics', participants: 67, messages: 234 },
        { id: 'healthcare-access', name: 'Healthcare Access', participants: 89, messages: 345 }
      ]
    },
    {
      id: 'economy',
      title: 'Economy',
      description: 'Economic policies, market trends, and financial systems',
      category: 'economy',
      difficulty: 'advanced',
      tags: ['Economics', 'Markets', 'Policy', 'Global Trade'],
      participants: 145,
      messages: 1123,
      trending: false,
      lastActivity: '6 hours ago',
      subtopics: [
        { id: 'monetary', name: 'Monetary Policy', participants: 76, messages: 345 },
        { id: 'trade', name: 'Global Trade', participants: 89, messages: 456 },
        { id: 'inequality', name: 'Economic Inequality', participants: 112, messages: 567 },
        { id: 'cryptocurrency', name: 'Cryptocurrency Impact', participants: 134, messages: 789 }
      ]
    },
    {
      id: 'science',
      title: 'Science',
      description: 'Scientific discoveries, research, and their implications',
      category: 'science',
      difficulty: 'expert',
      tags: ['Research', 'Discovery', 'Innovation', 'Ethics'],
      participants: 98,
      messages: 756,
      trending: false,
      lastActivity: '8 hours ago',
      subtopics: [
        { id: 'genetics', name: 'Genetic Research', participants: 67, messages: 234 },
        { id: 'space', name: 'Space Exploration', participants: 89, messages: 456 },
        { id: 'climate-science', name: 'Climate Science', participants: 76, messages: 345 },
        { id: 'medical-research', name: 'Medical Research', participants: 98, messages: 567 }
      ]
    },
    {
      id: 'culture',
      title: 'Culture',
      description: 'Art, traditions, and societal norms across cultures',
      category: 'culture',
      difficulty: 'beginner',
      tags: ['Art', 'Traditions', 'Society', 'Diversity'],
      participants: 134,
      messages: 892,
      trending: false,
      lastActivity: '7 hours ago',
      subtopics: [
        { id: 'art', name: 'Art & Expression', participants: 78, messages: 234 },
        { id: 'traditions', name: 'Cultural Traditions', participants: 67, messages: 189 },
        { id: 'media', name: 'Media & Culture', participants: 89, messages: 345 },
        { id: 'diversity', name: 'Cultural Diversity', participants: 92, messages: 124 }
      ]
    }
  ];

  // Filter and sort topics
  const filteredTopics = topics
    .filter(topic => {
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => topic.tags.some(topicTag => 
          topicTag.toLowerCase().includes(tag.toLowerCase())
        ));
      const matchesSearch = searchQuery === '' || 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesDifficulty && matchesTags && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.trending - a.trending || b.participants - a.participants;
        case 'participants':
          return b.participants - a.participants;
        case 'messages':
          return b.messages - a.messages;
        case 'recent':
          return new Date(b.lastActivity) - new Date(a.lastActivity);
        default:
          return 0;
      }
    });

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedTags([]);
    setSearchQuery('');
    setSortBy('trending');
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#667eea';
  };

  const getDifficultyColor = (difficulty) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level ? level.color : '#6c757d';
  };

  return (
    <div className="debate-topics">
      {/* Header */}
      <div className="topics-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <div className="header-info">
            <h1>Debate Topics</h1>
            <p>Choose a topic and join the discussion</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filters
          </button>
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`filters-section ${showFilters ? 'expanded' : ''}`}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search topics, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filters-content">
          {/* Categories */}
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ '--category-color': category.color }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Levels */}
          <div className="filter-group">
            <h3>Difficulty Level</h3>
            <div className="difficulty-buttons">
              {difficultyLevels.map(level => (
                <button
                  key={level.id}
                  className={`difficulty-btn ${selectedDifficulty === level.id ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(level.id)}
                  style={{ '--difficulty-color': level.color }}
                >
                  <span className="difficulty-icon">{level.icon}</span>
                  <span className="difficulty-name">{level.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="filter-group">
            <h3>Popular Tags</h3>
            <div className="tags-container">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="trending">Trending</option>
              <option value="participants">Most Participants</option>
              <option value="messages">Most Messages</option>
              <option value="recent">Recently Active</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedTags.length > 0 || searchQuery) && (
        <div className="active-filters">
          <span className="active-filters-label">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="filter-tag">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}>×</button>
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="filter-tag">
              Difficulty: {difficultyLevels.find(d => d.id === selectedDifficulty)?.name}
              <button onClick={() => setSelectedDifficulty('all')}>×</button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="filter-tag">
              {tag}
              <button onClick={() => handleTagToggle(tag)}>×</button>
            </span>
          ))}
          {searchQuery && (
            <span className="filter-tag">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>×</button>
            </span>
          )}
        </div>
      )}

      {/* Topics Grid */}
      <div className="topics-grid">
        {filteredTopics.length === 0 ? (
          <div className="no-topics">
            <h3>No topics found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredTopics.map(topic => (
            <div key={topic.id} className="topic-card">
              <div className="topic-header">
                <div className="topic-meta">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(topic.category) }}
                  >
                    {categories.find(c => c.id === topic.category)?.icon}
                    {categories.find(c => c.id === topic.category)?.name}
                  </span>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(topic.difficulty) }}
                  >
                    {difficultyLevels.find(d => d.id === topic.difficulty)?.icon}
                    {difficultyLevels.find(d => d.id === topic.difficulty)?.name}
                  </span>
                  {topic.trending && (
                    <span className="trending-badge">
                      🔥 Trending
                    </span>
                  )}
                </div>
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-description">{topic.description}</p>
              </div>

              <div className="topic-tags">
                {topic.tags.map(tag => (
                  <span key={tag} className="topic-tag">{tag}</span>
                ))}
              </div>

              <div className="topic-stats">
                <div className="stat">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">{topic.participants}</span>
                  <span className="stat-label">participants</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💬</span>
                  <span className="stat-value">{topic.messages}</span>
                  <span className="stat-label">messages</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">⏰</span>
                  <span className="stat-value">{topic.lastActivity}</span>
                  <span className="stat-label">last active</span>
                </div>
              </div>

              <div className="topic-subtopics">
                <h4>Subtopics:</h4>
                <div className="subtopics-grid">
                  {topic.subtopics.map(subtopic => (
                    <button
                      key={subtopic.id}
                      className="subtopic-btn"
                      onClick={() => navigate(`/chat/${topic.id}/${subtopic.id}`)}
                    >
                      <span className="subtopic-name">{subtopic.name}</span>
                      <span className="subtopic-stats">
                        {subtopic.participants} • {subtopic.messages}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebateTopics; 
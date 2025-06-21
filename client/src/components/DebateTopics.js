import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DebateTopics.css';
import SearchFilter from './SearchFilter';

const DebateTopics = () => {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const debateRooms = [
    {
      id: 'politics',
      title: 'Politics & Governance',
      description: 'Engage in discussions about current political events, policies, and governance systems.',
      icon: '🏛️',
      subtopics: [
        { id: 'elections', title: 'Elections & Voting' },
        { id: 'policy', title: 'Public Policy' },
        { id: 'international', title: 'International Relations' },
        { id: 'democracy', title: 'Democracy & Rights' }
      ]
    },
    {
      id: 'technology',
      title: 'Technology & Innovation',
      description: 'Explore the latest technological advancements and their impact on society.',
      icon: '💻',
      subtopics: [
        { id: 'ai', title: 'Artificial Intelligence' },
        { id: 'privacy', title: 'Digital Privacy' },
        { id: 'future', title: 'Future Tech' },
        { id: 'ethics', title: 'Tech Ethics' }
      ]
    },
    {
      id: 'environment',
      title: 'Environment & Sustainability',
      description: 'Discuss environmental challenges and sustainable solutions for our planet.',
      icon: '🌍',
      subtopics: [
        { id: 'climate', title: 'Climate Change' },
        { id: 'conservation', title: 'Conservation' },
        { id: 'renewable', title: 'Renewable Energy' },
        { id: 'sustainability', title: 'Sustainable Living' }
      ]
    },
    {
      id: 'education',
      title: 'Education & Learning',
      description: 'Debate about educational systems, reforms, and the future of learning.',
      icon: '📚',
      subtopics: [
        { id: 'reform', title: 'Education Reform' },
        { id: 'online', title: 'Online Learning' },
        { id: 'skills', title: 'Future Skills' },
        { id: 'access', title: 'Education Access' }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Medicine',
      description: 'Discuss healthcare systems, medical advancements, and public health.',
      icon: '🏥',
      subtopics: [
        { id: 'systems', title: 'Healthcare Systems' },
        { id: 'research', title: 'Medical Research' },
        { id: 'mental', title: 'Mental Health' },
        { id: 'access', title: 'Healthcare Access' }
      ]
    },
    {
      id: 'economy',
      title: 'Economy & Business',
      description: 'Debate economic policies, business trends, and financial systems.',
      icon: '💰',
      subtopics: [
        { id: 'markets', title: 'Global Markets' },
        { id: 'startups', title: 'Startups & Innovation' },
        { id: 'policy', title: 'Economic Policy' },
        { id: 'future', title: 'Future of Work' }
      ]
    }
  ];

  // Convert debate rooms to a format suitable for SearchFilter
  const allTopics = debateRooms.flatMap(room => 
    room.subtopics.map(subtopic => ({
      id: `${room.id}-${subtopic.id}`,
      title: subtopic.title,
      description: room.description,
      category: room.title,
      icon: room.icon,
      roomId: room.id,
      subtopicId: subtopic.id
    }))
  );

  useEffect(() => {
    setFilteredTopics(allTopics);
  }, [allTopics]);

  const handleFilterChange = (filtered) => {
    setFilteredTopics(filtered);
  };

  const handleSubtopicSelect = (roomId, subtopicId) => {
    navigate(`/chat/${roomId}/${subtopicId}`);
  };

  return (
    <div className="debate-topics">
      <div className="topics-header">
        <h1>Explore Debate Topics</h1>
        <p>Choose a topic and subtopic to join the discussion</p>
      </div>
      
      <SearchFilter 
        messages={allTopics}
        onFilterChange={handleFilterChange}
        placeholder="Search debate topics..."
        showFilters={false}
        showSort={true}
      />
      
      <div className="topics-grid">
        {debateRooms.map((room, index) => {
          // Filter subtopics based on search results
          const visibleSubtopics = room.subtopics.filter(subtopic => 
            filteredTopics.some(topic => 
              topic.roomId === room.id && topic.subtopicId === subtopic.id
            )
          );

          // Don't show room if no subtopics are visible
          if (visibleSubtopics.length === 0) return null;

          return (
            <div 
              key={room.id}
              className={`topic-card ${isVisible ? 'fade-in' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setActiveTopic(room.id)}
              onMouseLeave={() => setActiveTopic(null)}
            >
              <div className="topic-icon">{room.icon}</div>
              <h2>{room.title}</h2>
              <p>{room.description}</p>
              
              <div className="subtopics-container">
                {visibleSubtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    className={`subtopic-button ${activeTopic === room.id ? 'active' : ''}`}
                    onClick={() => handleSubtopicSelect(room.id, subtopic.id)}
                  >
                    {subtopic.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DebateTopics; 
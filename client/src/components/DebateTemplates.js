import React, { useState } from 'react';
import { useTranslation } from '../services/TranslationService';
import './DebateTemplates.css';

const DebateTemplates = ({ onClose, onSelectTemplate }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const debateTemplates = [
    {
      id: 1,
      name: 'Lincoln-Douglas Debate',
      category: 'formal',
      description: 'A structured one-on-one debate format with specific time limits and cross-examination.',
      duration: '45-60 minutes',
      participants: '2',
      difficulty: 'Advanced',
      structure: [
        { phase: 'Affirmative Constructive', time: '6 minutes', description: 'Opening argument for the proposition' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Negative questions the affirmative' },
        { phase: 'Negative Constructive', time: '7 minutes', description: 'Opening argument against the proposition' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Affirmative questions the negative' },
        { phase: 'Affirmative Rebuttal', time: '4 minutes', description: 'Response to negative arguments' },
        { phase: 'Negative Rebuttal', time: '6 minutes', description: 'Response to affirmative arguments' },
        { phase: 'Affirmative Rebuttal', time: '3 minutes', description: 'Final response' }
      ],
      rules: [
        'No new arguments in rebuttals',
        'Respect time limits strictly',
        'Maintain professional decorum',
        'Focus on logical reasoning and evidence'
      ],
      icon: '⚖️',
      color: '#4a90e2'
    },
    {
      id: 2,
      name: 'Parliamentary Debate',
      category: 'formal',
      description: 'British parliamentary style debate with multiple speakers and dynamic arguments.',
      duration: '30-45 minutes',
      participants: '4-8',
      difficulty: 'Intermediate',
      structure: [
        { phase: 'Prime Minister', time: '7 minutes', description: 'Government opening speech' },
        { phase: 'Leader of Opposition', time: '7 minutes', description: 'Opposition opening speech' },
        { phase: 'Deputy Prime Minister', time: '7 minutes', description: 'Government second speech' },
        { phase: 'Deputy Leader of Opposition', time: '7 minutes', description: 'Opposition second speech' },
        { phase: 'Member of Government', time: '5 minutes', description: 'Government extension' },
        { phase: 'Member of Opposition', time: '5 minutes', description: 'Opposition extension' },
        { phase: 'Government Whip', time: '3 minutes', description: 'Government summary' },
        { phase: 'Opposition Whip', time: '3 minutes', description: 'Opposition summary' }
      ],
      rules: [
        'Points of information allowed',
        'Dynamic argumentation encouraged',
        'Respect for parliamentary procedure',
        'Focus on policy implications'
      ],
      icon: '🏛️',
      color: '#8b5cf6'
    },
    {
      id: 3,
      name: 'Public Forum Debate',
      category: 'informal',
      description: 'Accessible debate format designed for public audiences with clear language.',
      duration: '30-40 minutes',
      participants: '4',
      difficulty: 'Beginner',
      structure: [
        { phase: 'Team A Speaker 1', time: '4 minutes', description: 'First constructive speech' },
        { phase: 'Team B Speaker 1', time: '4 minutes', description: 'First constructive speech' },
        { phase: 'Crossfire', time: '3 minutes', description: 'Direct exchange between speakers' },
        { phase: 'Team A Speaker 2', time: '4 minutes', description: 'Second constructive speech' },
        { phase: 'Team B Speaker 2', time: '4 minutes', description: 'Second constructive speech' },
        { phase: 'Crossfire', time: '3 minutes', description: 'Direct exchange between speakers' },
        { phase: 'Team A Summary', time: '2 minutes', description: 'Summary of key arguments' },
        { phase: 'Team B Summary', time: '2 minutes', description: 'Summary of key arguments' },
        { phase: 'Grand Crossfire', time: '3 minutes', description: 'All speakers participate' },
        { phase: 'Team A Final Focus', time: '2 minutes', description: 'Final persuasive appeal' },
        { phase: 'Team B Final Focus', time: '2 minutes', description: 'Final persuasive appeal' }
      ],
      rules: [
        'Use accessible language',
        'Focus on real-world impacts',
        'Encourage audience engagement',
        'Maintain respectful dialogue'
      ],
      icon: '🎭',
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'Policy Debate',
      category: 'formal',
      description: 'Comprehensive debate format focusing on policy analysis and implementation.',
      duration: '60-90 minutes',
      participants: '4',
      difficulty: 'Advanced',
      structure: [
        { phase: '1AC (Affirmative Constructive)', time: '8 minutes', description: 'Plan presentation and advantages' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Negative questions the 1AC' },
        { phase: '1NC (Negative Constructive)', time: '8 minutes', description: 'Disadvantages and case attacks' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Affirmative questions the 1NC' },
        { phase: '2AC (Second Affirmative)', time: '8 minutes', description: 'Rebuttal and case extension' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Negative questions the 2AC' },
        { phase: '2NC (Second Negative)', time: '8 minutes', description: 'Rebuttal and disadvantage extension' },
        { phase: 'Cross-Examination', time: '3 minutes', description: 'Affirmative questions the 2NC' },
        { phase: '1NR (First Negative Rebuttal)', time: '5 minutes', description: 'Negative summary' },
        { phase: '1AR (First Affirmative Rebuttal)', time: '5 minutes', description: 'Affirmative summary' },
        { phase: '2NR (Second Negative Rebuttal)', time: '5 minutes', description: 'Final negative argument' },
        { phase: '2AR (Second Affirmative Rebuttal)', time: '5 minutes', description: 'Final affirmative argument' }
      ],
      rules: [
        'Evidence-based arguments required',
        'Speed reading allowed',
        'Complex policy analysis expected',
        'Strict adherence to time limits'
      ],
      icon: '📋',
      color: '#10b981'
    },
    {
      id: 5,
      name: 'Socratic Seminar',
      category: 'discussion',
      description: 'Philosophical discussion format based on questioning and collaborative inquiry.',
      duration: '45-60 minutes',
      participants: '6-15',
      difficulty: 'Intermediate',
      structure: [
        { phase: 'Opening Question', time: '5 minutes', description: 'Presenter poses central question' },
        { phase: 'Initial Responses', time: '15 minutes', description: 'Participants share initial thoughts' },
        { phase: 'Deep Discussion', time: '25 minutes', description: 'Collaborative exploration of ideas' },
        { phase: 'Closing Reflection', time: '10 minutes', description: 'Personal insights and takeaways' }
      ],
      rules: [
        'Ask questions to understand',
        'Build on others\' ideas',
        'Support claims with evidence',
        'Respect diverse perspectives'
      ],
      icon: '🤔',
      color: '#ef4444'
    },
    {
      id: 6,
      name: 'Fishbowl Discussion',
      category: 'discussion',
      description: 'Interactive discussion format with rotating participation and audience observation.',
      duration: '30-45 minutes',
      participants: '8-20',
      difficulty: 'Beginner',
      structure: [
        { phase: 'Setup', time: '5 minutes', description: 'Arrange seating and explain format' },
        { phase: 'Inner Circle Discussion', time: '15 minutes', description: 'Core participants discuss topic' },
        { phase: 'Audience Questions', time: '10 minutes', description: 'Outer circle asks questions' },
        { phase: 'Rotation', time: '10 minutes', description: 'Switch participants and continue' },
        { phase: 'Full Group Reflection', time: '5 minutes', description: 'Everyone shares insights' }
      ],
      rules: [
        'Only inner circle speaks',
        'Outer circle observes actively',
        'Rotate participants regularly',
        'Maintain respectful dialogue'
      ],
      icon: '🐟',
      color: '#06b6d4'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Formats', icon: '📚' },
    { id: 'formal', name: 'Formal Debates', icon: '⚖️' },
    { id: 'informal', name: 'Informal Debates', icon: '🎭' },
    { id: 'discussion', name: 'Discussions', icon: '💭' }
  ];

  const filteredTemplates = debateTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#22c55e';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="debate-templates-overlay" onClick={onClose}>
      <div className="debate-templates-modal" onClick={(e) => e.stopPropagation()}>
        <div className="debate-templates-header">
          <button className="close-templates-btn" onClick={onClose}>×</button>
          <h2>📋 Debate Templates</h2>
          <p>Choose from structured debate formats and discussion templates</p>
        </div>

        <div className="debate-templates-content">
          {/* Search and Filter */}
          <div className="templates-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-icon" style={{ backgroundColor: template.color }}>
                    {template.icon}
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-meta">
                      <span className="template-duration">⏱️ {template.duration}</span>
                      <span className="template-participants">👥 {template.participants}</span>
                      <span 
                        className="template-difficulty"
                        style={{ color: getDifficultyColor(template.difficulty) }}
                      >
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="template-structure">
                  <h4>Structure:</h4>
                  <div className="structure-list">
                    {template.structure.slice(0, 3).map((phase, index) => (
                      <div key={index} className="structure-item">
                        <span className="phase-name">{phase.phase}</span>
                        <span className="phase-time">{phase.time}</span>
                      </div>
                    ))}
                    {template.structure.length > 3 && (
                      <div className="more-phases">
                        +{template.structure.length - 3} more phases
                      </div>
                    )}
                  </div>
                </div>

                <div className="template-rules">
                  <h4>Key Rules:</h4>
                  <ul>
                    {template.rules.slice(0, 2).map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                    {template.rules.length > 2 && (
                      <li className="more-rules">+{template.rules.length - 2} more rules</li>
                    )}
                  </ul>
                </div>

                <button 
                  className="select-template-btn"
                  onClick={() => handleSelectTemplate(template)}
                >
                  Use This Template
                </button>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="no-templates">
              <div className="no-templates-icon">🔍</div>
              <h3>No templates found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateTemplates; 
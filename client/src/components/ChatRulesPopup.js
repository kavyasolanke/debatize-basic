import React, { useState, useEffect } from 'react';
import './ChatRulesPopup.css';

const ChatRulesPopup = ({ isOpen, onClose, currentUser, onAcceptRules }) => {
  const [currentRule, setCurrentRule] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showDetailedRules, setShowDetailedRules] = useState(false);

  const debateRules = [
    {
      id: 1,
      title: "Evidence-Based Arguments",
      description: "Support your claims with facts, data, or credible sources",
      icon: "📊",
      details: [
        "Cite specific sources when making factual claims",
        "Use data and statistics to support arguments",
        "Distinguish between opinions and facts",
        "Provide context for your evidence"
      ],
      timeLimit: "2-3 minutes per argument"
    },
    {
      id: 2,
      title: "Respectful Dialogue",
      description: "Attack ideas, not people. Maintain civil discourse",
      icon: "🤝",
      details: [
        "No personal attacks or ad hominem arguments",
        "Address the argument, not the person",
        "Use respectful language even when disagreeing",
        "Acknowledge valid points from opponents"
      ],
      timeLimit: "1 minute for responses"
    },
    {
      id: 3,
      title: "Structured Responses",
      description: "Organize your thoughts clearly and logically",
      icon: "📝",
      details: [
        "State your main point clearly",
        "Provide supporting evidence",
        "Address counterarguments",
        "Conclude with a summary"
      ],
      timeLimit: "3-5 minutes per main argument"
    },
    {
      id: 4,
      title: "Active Listening",
      description: "Engage with others' arguments before responding",
      icon: "👂",
      details: [
        "Read and understand others' points",
        "Ask clarifying questions when needed",
        "Build on previous arguments",
        "Avoid repeating what's already been said"
      ],
      timeLimit: "30 seconds for questions"
    },
    {
      id: 5,
      title: "Fact-Checking",
      description: "Verify information before sharing it",
      icon: "✅",
      details: [
        "Double-check statistics and quotes",
        "Use reliable, up-to-date sources",
        "Correct misinformation when you see it",
        "Be transparent about uncertainty"
      ],
      timeLimit: "Take time to verify"
    }
  ];

  const moderationGuidelines = [
    {
      category: "Content Standards",
      rules: [
        "No hate speech or discriminatory language",
        "No spam or off-topic content",
        "No personal information sharing",
        "No threats or violent language"
      ]
    },
    {
      category: "Debate Etiquette",
      rules: [
        "Wait your turn to speak",
        "Don't interrupt others",
        "Stay on topic",
        "Respect time limits"
      ]
    },
    {
      category: "Quality Standards",
      rules: [
        "Provide evidence for claims",
        "Use clear, logical arguments",
        "Address the topic directly",
        "Contribute meaningfully to discussion"
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Check if user has already accepted rules
      const acceptedRules = localStorage.getItem('debatize_rules_accepted');
      if (acceptedRules) {
        setHasAccepted(true);
      }
    }
  }, [isOpen]);

  const handleAcceptRules = () => {
    localStorage.setItem('debatize_rules_accepted', 'true');
    setHasAccepted(true);
    onAcceptRules && onAcceptRules();
    onClose();
  };

  const handleSkipRules = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rules-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rules-header">
          <button className="close-rules-btn" onClick={onClose}>
            ×
          </button>
          <h2>Debate Rules & Guidelines</h2>
          <p>Follow these principles for quality discussions</p>
        </div>

        <div className="rules-content">
          {!showDetailedRules ? (
            <>
              {/* Rules Overview */}
              <div className="rules-overview">
                <div className="current-rule">
                  <div className="rule-icon">{debateRules[currentRule].icon}</div>
                  <div className="rule-content">
                    <h3>{debateRules[currentRule].title}</h3>
                    <p>{debateRules[currentRule].description}</p>
                    <div className="time-limit">
                      <span className="time-icon">⏱️</span>
                      {debateRules[currentRule].timeLimit}
                    </div>
                  </div>
                </div>

                <div className="rule-navigation">
                  <button 
                    className="nav-btn"
                    onClick={() => setCurrentRule(prev => prev > 0 ? prev - 1 : debateRules.length - 1)}
                  >
                    ← Previous
                  </button>
                  <div className="rule-dots">
                    {debateRules.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentRule ? 'active' : ''}`}
                        onClick={() => setCurrentRule(index)}
                      />
                    ))}
                  </div>
                  <button 
                    className="nav-btn"
                    onClick={() => setCurrentRule(prev => (prev + 1) % debateRules.length)}
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="rules-actions">
                <button 
                  className="view-detailed-btn"
                  onClick={() => setShowDetailedRules(true)}
                >
                  View Detailed Guidelines
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Detailed Rules */}
              <div className="detailed-rules">
                <div className="rules-section">
                  <h3>Core Debate Principles</h3>
                  <div className="rules-grid">
                    {debateRules.map((rule) => (
                      <div key={rule.id} className="detailed-rule-card">
                        <div className="rule-header">
                          <span className="rule-icon">{rule.icon}</span>
                          <h4>{rule.title}</h4>
                        </div>
                        <p className="rule-description">{rule.description}</p>
                        <div className="rule-details">
                          <h5>Guidelines:</h5>
                          <ul>
                            {rule.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="time-limit-badge">
                          ⏱️ {rule.timeLimit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="moderation-section">
                  <h3>Moderation Guidelines</h3>
                  <div className="moderation-grid">
                    {moderationGuidelines.map((category, index) => (
                      <div key={index} className="moderation-category">
                        <h4>{category.category}</h4>
                        <ul>
                          {category.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="consequences-section">
                  <h3>Community Standards</h3>
                  <div className="consequences-grid">
                    <div className="consequence-card warning">
                      <h4>⚠️ Warning</h4>
                      <p>First violation: Warning and temporary mute</p>
                    </div>
                    <div className="consequence-card suspension">
                      <h4>🚫 Suspension</h4>
                      <p>Repeated violations: 24-48 hour suspension</p>
                    </div>
                    <div className="consequence-card ban">
                      <h4>🔒 Ban</h4>
                      <p>Severe violations: Permanent account ban</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rules-actions">
                <button 
                  className="back-to-overview-btn"
                  onClick={() => setShowDetailedRules(false)}
                >
                  ← Back to Overview
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rules-footer">
          {!hasAccepted && (
            <div className="acceptance-section">
              <div className="acceptance-checkbox">
                <input 
                  type="checkbox" 
                  id="accept-rules"
                  onChange={(e) => setHasAccepted(e.target.checked)}
                />
                <label htmlFor="accept-rules">
                  I understand and agree to follow these debate rules
                </label>
              </div>
              <div className="acceptance-buttons">
                <button 
                  className="accept-rules-btn"
                  disabled={!hasAccepted}
                  onClick={handleAcceptRules}
                >
                  Accept & Continue
                </button>
                <button 
                  className="skip-rules-btn"
                  onClick={handleSkipRules}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRulesPopup; 
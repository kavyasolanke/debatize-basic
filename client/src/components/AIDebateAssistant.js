import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../services/TranslationService';
import './AIDebateAssistant.css';

const AIDebateAssistant = ({ 
  currentMessage, 
  debateContext, 
  userSide, 
  onClose, 
  onSendEnhancedMessage,
  debateHistory = [] 
}) => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [enhancedMessage, setEnhancedMessage] = useState(currentMessage || '');
  const [activeTab, setActiveTab] = useState('analysis');
  const [debateInsights, setDebateInsights] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (currentMessage) {
      setEnhancedMessage(currentMessage);
      analyzeMessage(currentMessage);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (debateHistory.length > 0) {
      generateDebateInsights();
    }
  }, [debateHistory]);

  const analyzeMessage = async (message) => {
    if (!message.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = {
        clarity: Math.floor(Math.random() * 40) + 60, // 60-100
        persuasiveness: Math.floor(Math.random() * 40) + 60,
        evidence: Math.floor(Math.random() * 40) + 60,
        logic: Math.floor(Math.random() * 40) + 60,
        overall: Math.floor(Math.random() * 40) + 60,
        feedback: [
          "Your argument is well-structured and clear.",
          "Consider adding more specific examples to strengthen your point.",
          "The logical flow is good, but you could improve the conclusion.",
          "Try to address potential counterarguments more directly."
        ],
        improvements: [
          "Add statistical evidence to support your claims",
          "Include a real-world example",
          "Address the opposing viewpoint",
          "Strengthen your conclusion"
        ]
      };
      
      setAnalysis(analysis);
      generateSuggestions(message, analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateSuggestions = (message, analysis) => {
    const suggestions = [
      {
        type: 'enhancement',
        text: 'Add supporting evidence: "Research shows that..."',
        confidence: 85
      },
      {
        type: 'counterargument',
        text: 'Address opposing view: "While some may argue..."',
        confidence: 78
      },
      {
        type: 'example',
        text: 'Include example: "For instance, consider..."',
        confidence: 92
      },
      {
        type: 'conclusion',
        text: 'Strengthen conclusion: "Therefore, it is clear that..."',
        confidence: 76
      }
    ];
    
    setSuggestions(suggestions);
  };

  const generateDebateInsights = () => {
    const insights = {
      totalMessages: debateHistory.length,
      averageLength: Math.floor(debateHistory.reduce((acc, msg) => acc + msg.text.length, 0) / debateHistory.length),
      mostActiveUser: debateHistory.reduce((acc, msg) => {
        acc[msg.user] = (acc[msg.user] || 0) + 1;
        return acc;
      }, {}),
      sentimentTrend: 'positive',
      keyTopics: ['evidence', 'logic', 'examples', 'counterarguments'],
      debateQuality: Math.floor(Math.random() * 30) + 70
    };
    
    setDebateInsights(insights);
  };

  const applySuggestion = (suggestion) => {
    setEnhancedMessage(prev => prev + ' ' + suggestion.text);
  };

  const handleSendEnhanced = () => {
    if (enhancedMessage.trim() && onSendEnhancedMessage) {
      onSendEnhancedMessage(enhancedMessage);
      onClose();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="ai-debate-assistant-overlay" onClick={onClose}>
      <div className="ai-debate-assistant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-debate-assistant-header">
          <button className="close-ai-btn" onClick={onClose}>×</button>
          <h2>🤖 AI Debate Assistant</h2>
          <p>Get real-time feedback and suggestions to improve your arguments</p>
        </div>

        <div className="ai-debate-assistant-content">
          {/* Tab Navigation */}
          <div className="ai-tabs">
            <button 
              className={`ai-tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              📊 Analysis
            </button>
            <button 
              className={`ai-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              💡 Suggestions
            </button>
            <button 
              className={`ai-tab ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              🎯 Insights
            </button>
            <button 
              className={`ai-tab ${activeTab === 'enhance' ? 'active' : ''}`}
              onClick={() => setActiveTab('enhance')}
            >
              ✨ Enhance
            </button>
          </div>

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="analysis-content">
              {isAnalyzing ? (
                <div className="analyzing">
                  <div className="analyzing-spinner"></div>
                  <p>Analyzing your argument...</p>
                </div>
              ) : analysis ? (
                <div className="analysis-results">
                  <div className="score-grid">
                    <div className="score-item">
                      <div className="score-circle" style={{ borderColor: getScoreColor(analysis.clarity) }}>
                        <span className="score-value">{analysis.clarity}</span>
                      </div>
                      <span className="score-label">Clarity</span>
                      <span className="score-status">{getScoreLabel(analysis.clarity)}</span>
                    </div>
                    <div className="score-item">
                      <div className="score-circle" style={{ borderColor: getScoreColor(analysis.persuasiveness) }}>
                        <span className="score-value">{analysis.persuasiveness}</span>
                      </div>
                      <span className="score-label">Persuasiveness</span>
                      <span className="score-status">{getScoreLabel(analysis.persuasiveness)}</span>
                    </div>
                    <div className="score-item">
                      <div className="score-circle" style={{ borderColor: getScoreColor(analysis.evidence) }}>
                        <span className="score-value">{analysis.evidence}</span>
                      </div>
                      <span className="score-label">Evidence</span>
                      <span className="score-status">{getScoreLabel(analysis.evidence)}</span>
                    </div>
                    <div className="score-item">
                      <div className="score-circle" style={{ borderColor: getScoreColor(analysis.logic) }}>
                        <span className="score-value">{analysis.logic}</span>
                      </div>
                      <span className="score-label">Logic</span>
                      <span className="score-status">{getScoreLabel(analysis.logic)}</span>
                    </div>
                  </div>
                  
                  <div className="overall-score">
                    <h3>Overall Score: {analysis.overall}/100</h3>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ 
                          width: `${analysis.overall}%`, 
                          backgroundColor: getScoreColor(analysis.overall) 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="feedback-section">
                    <h4>Feedback</h4>
                    <ul className="feedback-list">
                      {analysis.feedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="no-analysis">
                  <p>Enter your argument to get AI analysis</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="suggestions-content">
              <h3>AI Suggestions</h3>
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <div className="suggestion-header">
                      <span className="suggestion-type">{suggestion.type}</span>
                      <span className="suggestion-confidence">{suggestion.confidence}% confidence</span>
                    </div>
                    <p className="suggestion-text">{suggestion.text}</p>
                    <button 
                      className="apply-suggestion-btn"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="insights-content">
              <h3>Debate Insights</h3>
              {debateInsights ? (
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>Total Messages</h4>
                    <span className="insight-value">{debateInsights.totalMessages}</span>
                  </div>
                  <div className="insight-card">
                    <h4>Avg. Message Length</h4>
                    <span className="insight-value">{debateInsights.averageLength} chars</span>
                  </div>
                  <div className="insight-card">
                    <h4>Debate Quality</h4>
                    <span className="insight-value">{debateInsights.debateQuality}%</span>
                  </div>
                  <div className="insight-card">
                    <h4>Sentiment</h4>
                    <span className="insight-value">{debateInsights.sentimentTrend}</span>
                  </div>
                </div>
              ) : (
                <p>No debate data available</p>
              )}
            </div>
          )}

          {/* Enhance Tab */}
          {activeTab === 'enhance' && (
            <div className="enhance-content">
              <h3>Enhance Your Message</h3>
              <div className="enhance-textarea">
                <textarea
                  ref={textareaRef}
                  value={enhancedMessage}
                  onChange={(e) => setEnhancedMessage(e.target.value)}
                  placeholder="Enter or modify your argument here..."
                  rows={6}
                />
                <div className="enhance-actions">
                  <button 
                    className="analyze-btn"
                    onClick={() => analyzeMessage(enhancedMessage)}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button 
                    className="send-enhanced-btn"
                    onClick={handleSendEnhanced}
                    disabled={!enhancedMessage.trim()}
                  >
                    Send Enhanced Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDebateAssistant; 
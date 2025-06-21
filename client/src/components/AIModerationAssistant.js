import React, { useState, useEffect } from 'react';
import './AIModerationAssistant.css';

const AIModerationAssistant = ({ 
  isOpen, 
  onClose, 
  currentMessage, 
  onModerate, 
  currentUser,
  roomContext 
}) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moderationHistory, setModerationHistory] = useState([]);
  const [settings, setSettings] = useState({
    toxicityThreshold: 0.7,
    qualityThreshold: 0.6,
    autoModerate: true,
    notifyUser: true,
    logActions: true
  });

  // Simulated AI analysis functions
  const analyzeToxicity = (text) => {
    const toxicWords = [
      'hate', 'stupid', 'idiot', 'dumb', 'kill', 'die', 'attack', 'hateful',
      'racist', 'sexist', 'homophobic', 'violent', 'threat', 'abuse'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const toxicCount = words.filter(word => 
      toxicWords.some(toxic => word.includes(toxic))
    ).length;
    
    return Math.min(toxicCount / words.length * 10, 1);
  };

  const analyzeQuality = (text) => {
    const qualityFactors = {
      length: Math.min(text.length / 100, 1),
      hasEvidence: /because|since|evidence|study|research|data|statistics/i.test(text),
      hasLogic: /therefore|thus|consequently|as a result|because of this/i.test(text),
      respectful: !/stupid|idiot|dumb|hate|kill/i.test(text.toLowerCase()),
      onTopic: true, // Simplified for demo
      constructive: /suggest|propose|recommend|solution|alternative|improve/i.test(text)
    };
    
    const score = Object.values(qualityFactors).reduce((sum, factor) => sum + factor, 0) / Object.keys(qualityFactors).length;
    return score;
  };

  const analyzeSentiment = (text) => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive', 'benefit', 'improve', 'help'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'harm', 'damage', 'hurt', 'problem'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount === 0 && negativeCount === 0) return 'neutral';
    return positiveCount > negativeCount ? 'positive' : 'negative';
  };

  const detectSpam = (text) => {
    const spamIndicators = [
      text.length > 500, // Very long message
      /buy now|click here|free money|make money fast/i.test(text),
      /[A-Z]{5,}/.test(text), // Excessive caps
      /!{3,}/.test(text), // Excessive exclamation marks
      /(.)\1{4,}/.test(text) // Repeated characters
    ];
    
    return spamIndicators.filter(Boolean).length >= 2;
  };

  const analyzeMessage = async (message) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis = {
      toxicity: analyzeToxicity(message),
      quality: analyzeQuality(message),
      sentiment: analyzeSentiment(message),
      spam: detectSpam(message),
      suggestions: [],
      warnings: [],
      score: 0
    };
    
    // Generate suggestions and warnings
    if (analysis.toxicity > settings.toxicityThreshold) {
      analysis.warnings.push('High toxicity detected');
      analysis.suggestions.push('Consider rephrasing to be more respectful');
    }
    
    if (analysis.quality < settings.qualityThreshold) {
      analysis.warnings.push('Low debate quality');
      analysis.suggestions.push('Add evidence or logical reasoning to strengthen your argument');
    }
    
    if (analysis.spam) {
      analysis.warnings.push('Potential spam detected');
      analysis.suggestions.push('Ensure your message contributes meaningfully to the discussion');
    }
    
    if (analysis.sentiment === 'negative' && analysis.toxicity > 0.5) {
      analysis.suggestions.push('Try to maintain a constructive tone even when disagreeing');
    }
    
    // Calculate overall score
    analysis.score = Math.round((analysis.quality - analysis.toxicity) * 100);
    
    setAnalysisResult(analysis);
    setIsAnalyzing(false);
    
    return analysis;
  };

  const handleModerate = (action) => {
    const moderationAction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser?.username || 'Unknown',
      message: currentMessage,
      action,
      analysis: analysisResult,
      roomContext
    };
    
    setModerationHistory(prev => [moderationAction, ...prev.slice(0, 9)]);
    onModerate && onModerate(moderationAction);
    
    if (settings.logActions) {
      console.log('Moderation action:', moderationAction);
    }
    
    onClose();
  };

  const getToxicityColor = (toxicity) => {
    if (toxicity < 0.3) return '#27ae60';
    if (toxicity < 0.7) return '#f39c12';
    return '#e74c3c';
  };

  const getQualityColor = (quality) => {
    if (quality > 0.8) return '#27ae60';
    if (quality > 0.6) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreColor = (score) => {
    if (score > 70) return '#27ae60';
    if (score > 40) return '#f39c12';
    return '#e74c3c';
  };

  useEffect(() => {
    if (isOpen && currentMessage) {
      analyzeMessage(currentMessage);
    }
  }, [isOpen, currentMessage]);

  if (!isOpen) return null;

  return (
    <div className="ai-moderation-overlay" onClick={onClose}>
      <div className="ai-moderation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="moderation-header">
          <button className="close-moderation-btn" onClick={onClose}>
            ×
          </button>
          <h2>🤖 AI Moderation Assistant</h2>
          <p>Analyzing message for quality and safety</p>
        </div>

        <div className="moderation-content">
          {isAnalyzing ? (
            <div className="analyzing-state">
              <div className="ai-loading">
                <div className="ai-brain">🧠</div>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h3>AI is analyzing your message...</h3>
              <p>Checking for toxicity, quality, and debate standards</p>
            </div>
          ) : analysisResult ? (
            <>
              {/* Analysis Results */}
              <div className="analysis-results">
                <div className="analysis-metrics">
                  <div className="metric">
                    <div className="metric-label">Toxicity Level</div>
                    <div className="metric-value" style={{ color: getToxicityColor(analysisResult.toxicity) }}>
                      {Math.round(analysisResult.toxicity * 100)}%
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${analysisResult.toxicity * 100}%`,
                          backgroundColor: getToxicityColor(analysisResult.toxicity)
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="metric">
                    <div className="metric-label">Debate Quality</div>
                    <div className="metric-value" style={{ color: getQualityColor(analysisResult.quality) }}>
                      {Math.round(analysisResult.quality * 100)}%
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${analysisResult.quality * 100}%`,
                          backgroundColor: getQualityColor(analysisResult.quality)
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="metric">
                    <div className="metric-label">Overall Score</div>
                    <div className="metric-value" style={{ color: getScoreColor(analysisResult.score) }}>
                      {analysisResult.score}/100
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${Math.max(0, analysisResult.score)}%`,
                          backgroundColor: getScoreColor(analysisResult.score)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="analysis-details">
                  <div className="detail-item">
                    <span className="detail-label">Sentiment:</span>
                    <span className={`detail-value sentiment-${analysisResult.sentiment}`}>
                      {analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Spam Detection:</span>
                    <span className={`detail-value ${analysisResult.spam ? 'spam-detected' : 'no-spam'}`}>
                      {analysisResult.spam ? '⚠️ Potential Spam' : '✅ Clean'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings and Suggestions */}
              {analysisResult.warnings.length > 0 && (
                <div className="warnings-section">
                  <h4>⚠️ Warnings</h4>
                  <ul className="warnings-list">
                    {analysisResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.suggestions.length > 0 && (
                <div className="suggestions-section">
                  <h4>💡 Suggestions</h4>
                  <ul className="suggestions-list">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Moderation Actions */}
              <div className="moderation-actions">
                <h4>Moderation Actions</h4>
                <div className="action-buttons">
                  {analysisResult.toxicity > settings.toxicityThreshold ? (
                    <button 
                      className="action-btn warning"
                      onClick={() => handleModerate('warn')}
                    >
                      ⚠️ Issue Warning
                    </button>
                  ) : null}
                  
                  {analysisResult.spam ? (
                    <button 
                      className="action-btn danger"
                      onClick={() => handleModerate('flag')}
                    >
                      🚩 Flag as Spam
                    </button>
                  ) : null}
                  
                  {analysisResult.toxicity > 0.8 ? (
                    <button 
                      className="action-btn danger"
                      onClick={() => handleModerate('mute')}
                    >
                      🔇 Temporary Mute
                    </button>
                  ) : null}
                  
                  <button 
                    className="action-btn success"
                    onClick={() => handleModerate('approve')}
                  >
                    ✅ Approve Message
                  </button>
                  
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleModerate('edit')}
                  >
                    ✏️ Suggest Edit
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Moderation History */}
        {moderationHistory.length > 0 && (
          <div className="moderation-history">
            <h4>Recent Moderation Actions</h4>
            <div className="history-list">
              {moderationHistory.map(action => (
                <div key={action.id} className="history-item">
                  <div className="history-header">
                    <span className="history-action">{action.action}</span>
                    <span className="history-time">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="history-message">
                    {action.message.substring(0, 50)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="moderation-settings">
          <h4>⚙️ Moderation Settings</h4>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Toxicity Threshold</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={settings.toxicityThreshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  toxicityThreshold: parseFloat(e.target.value)
                }))}
              />
              <span>{Math.round(settings.toxicityThreshold * 100)}%</span>
            </div>
            
            <div className="setting-item">
              <label>Quality Threshold</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={settings.qualityThreshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  qualityThreshold: parseFloat(e.target.value)
                }))}
              />
              <span>{Math.round(settings.qualityThreshold * 100)}%</span>
            </div>
            
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox"
                  checked={settings.autoModerate}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    autoModerate: e.target.checked
                  }))}
                />
                Auto-moderate messages
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModerationAssistant; 
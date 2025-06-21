import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../services/TranslationService';
import './VoiceToText.css';

const VoiceToText = ({ onTextReceived, onClose, isOpen }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(getErrorMessage(event.error));
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const getErrorMessage = (error) => {
    switch (error) {
      case 'no-speech':
        return 'No speech detected. Please try again.';
      case 'audio-capture':
        return 'Audio capture failed. Please check your microphone.';
      case 'not-allowed':
        return 'Microphone access denied. Please allow microphone access.';
      case 'network':
        return 'Network error. Please check your connection.';
      default:
        return `Speech recognition error: ${error}`;
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setInterimTranscript('');
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const sendTranscript = () => {
    const finalText = transcript.trim();
    if (finalText && onTextReceived) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        onTextReceived(finalText);
        setIsProcessing(false);
        onClose();
      }, 1000);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (recognitionRef.current && isListening) {
      stopListening();
      setTimeout(() => {
        recognitionRef.current.lang = newLanguage;
        startListening();
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="voice-to-text-overlay" onClick={onClose}>
      <div className="voice-to-text-modal" onClick={(e) => e.stopPropagation()}>
        <div className="voice-to-text-header">
          <button className="close-voice-btn" onClick={onClose}>×</button>
          <h2>🎤 Voice to Text</h2>
          <p>Speak your argument and let AI convert it to text</p>
        </div>

        <div className="voice-to-text-content">
          {/* Language Selection */}
          <div className="language-selection">
            <label>Select Language:</label>
            <div className="language-dropdown">
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={isListening}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="voice-error">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
            </div>
          )}

          {/* Voice Controls */}
          <div className="voice-controls">
            <button
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={!recognitionRef.current}
            >
              <div className="voice-icon">
                {isListening ? '🔴' : '🎤'}
              </div>
              <span className="voice-label">
                {isListening ? 'Stop Recording' : 'Start Recording'}
              </span>
            </button>

            {transcript && (
              <button className="clear-btn" onClick={clearTranscript}>
                🗑️ Clear
              </button>
            )}
          </div>

          {/* Status Indicator */}
          {isListening && (
            <div className="listening-status">
              <div className="pulse-animation"></div>
              <span>Listening... Speak now!</span>
            </div>
          )}

          {/* Transcript Display */}
          <div className="transcript-container">
            <label>Your Speech:</label>
            <div className="transcript-display">
              {transcript && (
                <div className="final-transcript">
                  {transcript}
                </div>
              )}
              {interimTranscript && (
                <div className="interim-transcript">
                  {interimTranscript}
                </div>
              )}
              {!transcript && !interimTranscript && (
                <div className="transcript-placeholder">
                  Your speech will appear here...
                </div>
              )}
            </div>
          </div>

          {/* Word Count and Stats */}
          {(transcript || interimTranscript) && (
            <div className="transcript-stats">
              <div className="stat-item">
                <span className="stat-label">Words:</span>
                <span className="stat-value">
                  {(transcript + interimTranscript).split(/\s+/).filter(word => word.length > 0).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Characters:</span>
                <span className="stat-value">
                  {(transcript + interimTranscript).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Confidence:</span>
                <span className="stat-value">
                  {isListening ? 'Processing...' : 'High'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="voice-actions">
            <button 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="send-btn"
              onClick={sendTranscript}
              disabled={!transcript.trim() || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Send Text'}
            </button>
          </div>

          {/* Tips */}
          <div className="voice-tips">
            <h4>💡 Tips for better recognition:</h4>
            <ul>
              <li>Speak clearly and at a moderate pace</li>
              <li>Use a quiet environment with minimal background noise</li>
              <li>Position yourself close to the microphone</li>
              <li>Take short pauses between sentences</li>
              <li>Use punctuation commands like "period" or "comma"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceToText; 
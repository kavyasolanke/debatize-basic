import React from 'react';
import './ChatRulesPopup.css';

const ChatRulesPopup = ({ onAccept }) => {
  return (
    <div className="rules-popup-overlay">
      <div className="rules-popup">
        <h2>Chat Room Rules</h2>
        <div className="rules-content">
          <p>To maintain the integrity of our chat community, please follow these rules:</p>
          <ul>
            <li>No hate speech or discriminatory language</li>
            <li>No spreading false information or misinformation</li>
            <li>No abusive behavior or harassment</li>
            <li>No hate propaganda or extremist content</li>
          </ul>
          <p className="warning-text">
            <strong>Warning:</strong> Three reports of rule violations will result in an account ban.
          </p>
        </div>
        <button className="accept-button" onClick={onAccept}>
          I Accept and Will Follow These Rules
        </button>
      </div>
    </div>
  );
};

export default ChatRulesPopup; 
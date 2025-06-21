import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatRoom.css';
import ChatRulesPopup from './ChatRulesPopup';

const VOTE_SYMBOLS = {
  upvote: '⬆️',
  downvote: '⬇️',
  neutral: '➡️'
};

const OPENING_STATEMENTS = {
  politics: "Welcome to the Politics debate room! Here we discuss current political events, policies, and governance. Remember to maintain civil discourse and respect different viewpoints.",
  technology: "Welcome to the Technology debate room! Let's discuss the latest tech trends, innovations, and their impact on society. Share your insights and engage in meaningful discussions.",
  environment: "Welcome to the Environment debate room! Here we discuss climate change, conservation, and sustainable practices. Let's work together to find solutions for a better future.",
  education: "Welcome to the Education debate room! Discuss educational policies, teaching methods, and the future of learning. Share your experiences and ideas for improving education.",
  healthcare: "Welcome to the Healthcare debate room! Let's discuss healthcare systems, medical advancements, and public health policies. Your insights can help shape better healthcare solutions.",
  economy: "Welcome to the Economy debate room! Discuss economic policies, market trends, and financial systems. Share your analysis and perspectives on economic matters.",
  science: "Welcome to the Science debate room! Explore scientific discoveries, research, and their implications. Let's discuss the wonders of science and its impact on our world.",
  culture: "Welcome to the Culture debate room! Discuss art, traditions, and societal norms. Share your cultural experiences and perspectives in this diverse space."
};

// Generate anonymous user ID
const generateAnonymousId = () => {
  const adjectives = ['Anonymous', 'Mysterious', 'Curious', 'Thoughtful', 'Wise', 'Creative', 'Bold', 'Quiet', 'Friendly', 'Serious'];
  const nouns = ['Debater', 'Thinker', 'Observer', 'Speaker', 'Listener', 'Analyst', 'Critic', 'Advocate', 'Scholar', 'Citizen'];
  const randomNum = Math.floor(Math.random() * 1000);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}${randomNum}`;
};

const ChatRoom = () => {
  const { roomId, subtopicId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [anonymousId, setAnonymousId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Generate anonymous ID when component mounts
    setAnonymousId(generateAnonymousId());
  }, []);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Message event handlers
    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('roomHistory', (history) => {
      console.log('Received room history:', history);
      setMessages(history);
    });

    newSocket.on('typing', ({ user, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return [...new Set([...prev, user])];
        }
        return prev.filter(u => u !== user);
      });
    });

    newSocket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    newSocket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('updateVotes', (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    newSocket.on('updateReplies', (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    newSocket.on('userJoined', (userList) => {
      setUsers(userList);
    });

    newSocket.on('userLeft', (userList) => {
      setUsers(userList);
    });

    // Moderator event handlers
    newSocket.on('moderator_warning', (warning) => {
      console.log('Moderator warning:', warning.text);
      const warningMessage = {
        user: 'Moderator',
        text: warning.text,
        timestamp: new Date().toISOString(),
        isWarning: true // Add a flag for styling
      };
      setMessages(prev => [...prev, warningMessage]);
    });

    newSocket.on('banned', (data) => {
      console.error('Banned by moderator:', data.text);
      alert(`You have been banned: ${data.text}`);
      navigate('/'); // Redirect to homepage
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when joined
  useEffect(() => {
    if (isJoined && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isJoined]);

  const handleJoin = (chosenSide) => {
    if (socket && anonymousId) {
      const room = `${roomId}/${subtopicId}`;
      socket.emit('join', {
        room,
        user: anonymousId,
        side: chosenSide
      });
      setIsJoined(true);
    }
  };

  const handleAcceptRules = () => {
    setShowRules(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !isJoined) return;

    const messageData = {
      text: message,
      user: anonymousId,
      room: `${roomId}/${subtopicId}`,
      timestamp: new Date().toISOString()
    };

    console.log('Sending message:', messageData);
    socket.emit('message', messageData);
    setMessage('');
    
    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleVote = (messageId, voteType) => {
    socket.emit('addVote', { messageId, voteType, user: anonymousId });
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    // Focus input when replying
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleTyping = () => {
    if (!socket || !isJoined) return;

    socket.emit('typing', {
      room: `${roomId}/${subtopicId}`,
      user: anonymousId,
      isTyping: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        room: `${roomId}/${subtopicId}`,
        user: anonymousId,
        isTyping: false
      });
    }, 1000);
  };

  // Swipe functionality
  const handleTouchStart = (e, message) => {
    setSwipeStart(e.touches[0].clientX);
    setSwipeDistance(0);
  };

  const handleTouchMove = (e) => {
    if (swipeStart === null) return;
    const currentX = e.touches[0].clientX;
    const distance = currentX - swipeStart;
    setSwipeDistance(distance);
  };

  const handleTouchEnd = (e, message) => {
    if (swipeStart === null) return;
    
    const distance = e.changedTouches[0].clientX - swipeStart;
    const threshold = 100; // Minimum swipe distance
    
    if (distance > threshold) {
      // Swipe right - reply to message
      handleReply(message);
    }
    
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  const getVoteStatus = (message) => {
    if (!message.votes || !message.votes[anonymousId]) return 'neutral';
    return message.votes[anonymousId];
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

  if (showRules) {
    return (
      <div className="chat-container">
        <ChatRulesPopup onAccept={handleAcceptRules} />
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="side-selection-container">
        <h2>Choose Your Side</h2>
        <p>Select your stance for this debate topic.</p>
        <div className="side-buttons">
          <button className="pro-button" onClick={() => handleJoin('Pro')}>
            <span className="side-icon">👍</span>
            <span>I'm For (Pro)</span>
          </button>
          <button className="con-button" onClick={() => handleJoin('Con')}>
            <span className="side-icon">👎</span>
            <span>I'm Against (Con)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-container ${isJoined ? 'joined' : ''}`}>
      <div className="chat-header">
        <h2>{roomId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
        <h3>{subtopicId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
        <div className="header-actions">
          <div className="connection-status">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          <div className="anonymous-status">
            You are: <strong>{anonymousId}</strong>
          </div>
          <button className="back-button" onClick={() => navigate('/topics')}>← Back to Topics</button>
        </div>
      </div>

      <div className="chat-main">
        <div className="users-list">
          <h3>Online Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id} className={user.username === anonymousId ? 'current-user' : ''}>
                {user.username} {user.username === anonymousId ? '(You)' : ''}
              </li>
            ))}
          </ul>
        </div>

        <div className="messages-container">
          <div className="opening-statement">
            <h3>Welcome to the Anonymous Debate</h3>
            <p>{OPENING_STATEMENTS[roomId] || "Welcome to the anonymous debate room! Please maintain civil discourse and respect different viewpoints."}</p>
            <p className="anonymous-notice">All participants are anonymous. Focus on ideas, not identities.</p>
          </div>
          <div className="swipe-notice-container">
            <p className="swipe-notice">💡 <strong>Swipe right on any message to reply!</strong></p>
          </div>
          {messages.map((msg, index) => {
            const voteCounts = getVoteCounts(msg);
            return (
              <div 
                key={msg.id || index} 
                className={`message ${msg.user === anonymousId ? 'own-message' : ''} ${msg.isWarning ? 'moderator-warning' : ''}`}
                onTouchStart={(e) => handleTouchStart(e, msg)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, msg)}
                style={{ transform: `translateX(${swipeDistance}px)` }}
              >
                <div className="message-header">
                  <div className="message-user-info">
                    <span className="username">
                      {msg.user || msg.username}
                    </span>
                    {msg.side && (
                      <span className={`side-tag ${msg.side.toLowerCase()}`}>
                        {msg.side}
                      </span>
                    )}
                  </div>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">
                  {replyingTo && replyingTo.id === msg.id && (
                    <div className="reply-preview">
                      Replying to <strong>{replyingTo.user}</strong>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
                <div className="message-actions">
                  <button 
                    className={`vote-button upvote ${getVoteStatus(msg) === 'upvote' ? 'active' : ''}`}
                    onClick={() => handleVote(msg.id, 'upvote')}
                    title="Upvote this argument"
                  >
                    <span className="vote-icon">{VOTE_SYMBOLS.upvote}</span>
                    <span className="vote-count">{voteCounts.upvotes}</span>
                  </button>
                  <div className="vote-total">
                    <span className={`total-score ${voteCounts.total > 0 ? 'positive' : voteCounts.total < 0 ? 'negative' : 'neutral'}`}>
                      {voteCounts.total > 0 ? '+' : ''}{voteCounts.total}
                    </span>
                  </div>
                  <button 
                    className={`vote-button downvote ${getVoteStatus(msg) === 'downvote' ? 'active' : ''}`}
                    onClick={() => handleVote(msg.id, 'downvote')}
                    title="Downvote this argument"
                  >
                    <span className="vote-icon">{VOTE_SYMBOLS.downvote}</span>
                    <span className="vote-count">{voteCounts.downvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.filter(user => user !== anonymousId).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="message-input-form">
          {replyingTo && (
            <div className="replying-to-banner">
              <span>Replying to <strong>{replyingTo.user}</strong>: "{replyingTo.text.substring(0, 50)}{replyingTo.text.length > 50 ? '...' : ''}"</span>
              <button type="button" onClick={cancelReply} className="cancel-reply-btn">&times;</button>
            </div>
          )}
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type your argument..."
              disabled={!isJoined}
              maxLength={500}
            />
            <div className="input-actions">
              <span className="char-count">{message.length}/500</span>
              <button type="submit" className="send-button" disabled={!isJoined || !message.trim()}>
                <span className="send-icon">📤</span>
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom; 
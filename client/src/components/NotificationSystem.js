import React, { useState, useEffect, useRef } from 'react';
import './NotificationSystem.css';

const NotificationSystem = ({ socket, currentUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [permission, setPermission] = useState('default');
  const notificationRef = useRef(null);

  useEffect(() => {
    // Request notification permission on component mount
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPermission(permission);
        });
      }
    }

    // Listen for new messages
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.userId !== currentUserId) {
          addNotification({
            id: Date.now(),
            type: 'message',
            title: 'New Message',
            message: `${message.username}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
            timestamp: new Date(),
            read: false,
            data: message
          });
        }
      });

      socket.on('messageVoted', (data) => {
        if (data.messageUserId === currentUserId && data.voterId !== currentUserId) {
          const voteType = data.voteType === 'upvote' ? 'upvoted' : 'downvoted';
          addNotification({
            id: Date.now(),
            type: 'vote',
            title: 'Message Voted',
            message: `Someone ${voteType} your message`,
            timestamp: new Date(),
            read: false,
            data: data
          });
        }
      });

      socket.on('userJoined', (user) => {
        addNotification({
          id: Date.now(),
          type: 'user',
          title: 'User Joined',
          message: `${user.username} joined the debate`,
          timestamp: new Date(),
          read: false,
          data: user
        });
      });

      socket.on('userLeft', (user) => {
        addNotification({
          id: Date.now(),
          type: 'user',
          title: 'User Left',
          message: `${user.username} left the debate`,
          timestamp: new Date(),
          read: false,
          data: user
        });
      });
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (socket) {
        socket.off('newMessage');
        socket.off('messageVoted');
        socket.off('userJoined');
        socket.off('userLeft');
      }
    };
  }, [socket, currentUserId]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only last 10
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permission granted
    if (permission === 'granted' && document.hidden) {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo1.png',
        badge: '/logo1.png',
        tag: 'debatize-notification'
      });
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'vote':
        return '👍';
      case 'user':
        return '👤';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="notification-system" ref={notificationRef}>
      <button 
        className="notification-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button 
                className="action-btn"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                ✓
              </button>
              <button 
                className="action-btn"
                onClick={clearAllNotifications}
                title="Clear all"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notifications-icon">🔕</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                  {!notification.read && <div className="unread-indicator" />}
                </div>
              ))
            )}
          </div>

          {permission === 'default' && (
            <div className="notification-permission">
              <p>Enable notifications for better experience</p>
              <button 
                className="permission-btn"
                onClick={() => {
                  Notification.requestPermission().then(permission => {
                    setPermission(permission);
                  });
                }}
              >
                Enable Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem; 
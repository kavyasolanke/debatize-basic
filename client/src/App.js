import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import DebateTopics from './components/DebateTopics';
import ChatRoom from './components/ChatRoom';
import UserService from './services/UserService';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import pwaService from './components/PWAService';
import { TranslationProvider } from './services/TranslationService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Register service worker for PWA functionality
    pwaService.registerServiceWorker();

    // Listen for online/offline status
    const handleOnline = () => {
      console.log('App is online');
      // You could show a toast notification here
    };

    const handleOffline = () => {
      console.log('App is offline');
      // You could show an offline indicator here
    };

    pwaService.addOnlineListener(handleOnline);
    pwaService.addOfflineListener(handleOffline);

    // Check for existing user session on app load
    const savedUser = UserService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsLoading(false);

    return () => {
      pwaService.removeOnlineListener(handleOnline);
      pwaService.removeOfflineListener(handleOffline);
    };
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    UserService.logout();
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Debatize...</p>
      </div>
    );
  }

  return (
    <TranslationProvider>
      <Router>
        <div className="App">
          <OfflineIndicator />
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  currentUser={currentUser}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/topics" 
              element={
                currentUser ? (
                  <DebateTopics 
                    currentUser={currentUser}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/chat/:roomId/:subtopicId" 
              element={
                currentUser ? (
                  <ChatRoom 
                    currentUser={currentUser}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PWAInstallPrompt />
        </div>
      </Router>
    </TranslationProvider>
  );
}

export default App; 
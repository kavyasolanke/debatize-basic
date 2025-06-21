import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import DebateTopics from './components/DebateTopics';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import pwaService from './components/PWAService';
import './App.css';

function App() {
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

    return () => {
      pwaService.removeOnlineListener(handleOnline);
      pwaService.removeOfflineListener(handleOffline);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <OfflineIndicator />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics" element={<DebateTopics />} />
          <Route path="/chat/:roomId/:subtopicId" element={<ChatRoom />} />
        </Routes>
        <PWAInstallPrompt />
      </div>
    </Router>
  );
}

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import DebateTopics from './components/DebateTopics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics" element={<DebateTopics />} />
          <Route path="/chat/:roomId/:subtopicId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
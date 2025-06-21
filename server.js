const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const rooms = new Map();
const userWarnings = new Map();
const userSides = new Map();

const moderator = {
  flaggedKeywords: ['hate', 'abuse', 'stupid', 'idiot', 'kill'],
  validate: function(text) {
    const lowerCaseText = text.toLowerCase();
    return this.flaggedKeywords.some(keyword => lowerCaseText.includes(keyword));
  }
};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ room, user, side }) => {
    if (!room || !user || !side) {
      return;
    }

    if ((userWarnings.get(user) || 0) >= 3) {
      socket.emit('banned', { text: 'You are banned from this server.' });
      return socket.disconnect(true);
    }
    
    socket.join(room);
    userSides.set(user, side);

    if (!rooms.has(room)) {
      rooms.set(room, { messages: [], users: new Set() });
    }
    
    rooms.get(room).users.add(user);
    
    socket.emit('message', { text: `Welcome to the anonymous debate room!`, user: 'System', timestamp: new Date().toISOString() });
    socket.emit('roomHistory', rooms.get(room).messages);
    socket.to(room).emit('message', { text: `An anonymous participant has joined the debate`, user: 'System', timestamp: new Date().toISOString() });
  });

  socket.on('message', (message) => {
    const { room, text, user, timestamp } = message;
    if (!room || !text || !user) return;

    if (moderator.validate(text)) {
      const warnings = (userWarnings.get(user) || 0) + 1;
      userWarnings.set(user, warnings);
      
      const MAX_WARNINGS = 3;
      if (warnings >= MAX_WARNINGS) {
        socket.emit('banned', { text: 'You have been banned for repeated violations.' });
        return socket.disconnect(true);
      } else {
        socket.emit('moderator_warning', { text: `Warning ${warnings}/${MAX_WARNINGS}: Your message was flagged.` });
      }
      return;
    }

    const messageData = {
      id: Date.now() + Math.random(),
      text,
      user,
      room,
      side: userSides.get(user),
      timestamp: timestamp || new Date().toISOString(),
      votes: {},
      replies: []
    };

    if (rooms.has(room)) {
      rooms.get(room).messages.push(messageData);
    }
    io.to(room).emit('message', messageData);
  });

  socket.on('addVote', ({ messageId, voteType, user }) => {
    if (!messageId || !voteType || !user) return;
    
    for (const [roomName, roomData] of rooms.entries()) {
      const message = roomData.messages.find(msg => msg.id === messageId);
      if (message) {
        if (!message.votes) message.votes = {};
        
        const currentVote = message.votes[user];
        if (currentVote === voteType) {
          delete message.votes[user];
        } else {
          message.votes[user] = voteType;
        }
        
        io.to(roomName).emit('updateVotes', message);
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
  room: { type: String, required: true, index: true },
  side: { type: String, enum: ['Pro', 'Con'] },
  timestamp: { type: Date, default: Date.now },
  votes: { type: Map, of: String, default: {} },
  replies: [{
    text: String,
    user: String,
    timestamp: Date
  }]
});

module.exports = mongoose.model('Message', messageSchema); 
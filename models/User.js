const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: { type: String, required: true, unique: true, index: true },
  warnings: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  side: { type: String, enum: ['Pro', 'Con', null], default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 
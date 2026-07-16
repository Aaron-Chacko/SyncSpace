const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  data: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
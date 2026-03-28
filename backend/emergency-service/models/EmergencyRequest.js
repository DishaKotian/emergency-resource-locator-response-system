const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);

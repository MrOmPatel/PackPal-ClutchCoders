const mongoose = require('mongoose');

const tripMemberSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only have one role per trip
tripMemberSchema.index({ tripId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TripMember', tripMemberSchema); 